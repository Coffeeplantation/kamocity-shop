// 会員登録・サインイン（サーバー側で実行する）。Rails API がなくても動くよう、Next.js の中で完結させている。
//   会員     … Vercel Blob に「非公開」で保存（メールアドレスのハッシュをファイル名に）。パスワードは scrypt でハッシュ化して保存し、元の文字は残さない
//   セッション … 署名付きの Cookie（httpOnly・SameSite=Lax・本番は Secure）。中身を書き換えると署名が合わず無効になる
//   管理者   … 会員のうち、メールアドレスが ADMIN_EMAILS（カンマ区切り）に入っている人
// 必要な設定：
//   AUTH_SECRET                    … セッションの署名に使う長いランダムな文字列（例：openssl rand -base64 32）
//   BLOB_PRIVATE_READ_WRITE_TOKEN  … 会員を保存する非公開の Blob ストアのトークン（なければ BLOB_READ_WRITE_TOKEN を使う）
//   ADMIN_EMAILS                   … 管理者のメールアドレス

import { createHash, createHmac, randomBytes, scrypt as scryptCb, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { cookies } from 'next/headers';
import { get, put } from '@vercel/blob';

const scrypt = promisify(scryptCb) as (pw: string, salt: Buffer, len: number) => Promise<Buffer>;

export const SESSION_COOKIE = 'session';
const SESSION_DAYS = 14;

export type Member = { id: number; email: string; nickname: string };
type StoredMember = Member & { hash: string; salt: string; createdAt: string };

const blobToken = () => process.env.BLOB_PRIVATE_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN;
export const authEnabled = () => Boolean(process.env.AUTH_SECRET && blobToken());

const normEmail = (s: string) => s.trim().toLowerCase();
const memberPath = (email: string) => `members/${createHash('sha256').update(normEmail(email)).digest('hex')}.json`;

export const isAdminEmail = (email: string) =>
  (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map(normEmail)
    .filter(Boolean)
    .includes(normEmail(email));

async function readMember(email: string): Promise<StoredMember | null> {
  const r = await get(memberPath(email), { access: 'private', token: blobToken(), useCache: false }).catch(() => null);
  if (!r || r.statusCode !== 200) return null;
  return JSON.parse(await new Response(r.stream).text()) as StoredMember;
}

const hashPassword = async (password: string, salt: Buffer) => (await scrypt(password, salt, 64)).toString('hex');

// 入力のチェック。問題があればその理由（日本語）を返す
export function signupProblem(email: string, password: string, nickname: string): string | null {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return 'メールアドレスの形が正しくありません。';
  if (password.length < 8 || password.length > 128) return 'パスワードは 8 文字以上にしてください。';
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) return 'パスワードには英字と数字の両方を入れてください。';
  if (!nickname.trim() || nickname.length > 30) return 'ニックネームは 30 文字までで入れてください。';
  return null;
}

export async function createMember(email: string, password: string, nickname: string): Promise<Member> {
  if (await readMember(email)) throw new Error('このメールアドレスはすでに登録されています。');
  const salt = randomBytes(16);
  const member: StoredMember = {
    id: Date.now(),
    email: normEmail(email),
    nickname: nickname.trim(),
    salt: salt.toString('hex'),
    hash: await hashPassword(password, salt),
    createdAt: new Date().toISOString(),
  };
  await put(memberPath(email), JSON.stringify(member), { access: 'private', token: blobToken(), contentType: 'application/json', addRandomSuffix: false });
  return { id: member.id, email: member.email, nickname: member.nickname };
}

// メールアドレスとパスワードが合えば会員を返す。合わないときは、どちらが違うかは教えない
export async function verifyMember(email: string, password: string): Promise<Member | null> {
  const m = await readMember(email);
  // 会員がいないときも同じだけ時間をかけ、登録の有無を応答時間から推測されにくくする
  const hash = await hashPassword(password, m ? Buffer.from(m.salt, 'hex') : randomBytes(16));
  if (!m) return null;
  const a = Buffer.from(hash, 'hex');
  const b = Buffer.from(m.hash, 'hex');
  return a.length === b.length && timingSafeEqual(a, b) ? { id: m.id, email: m.email, nickname: m.nickname } : null;
}

// ---- セッション ----

const sign = (body: string) => createHmac('sha256', process.env.AUTH_SECRET!).update(body).digest('base64url');

export function sessionCookie(member: Member) {
  const body = Buffer.from(JSON.stringify({ ...member, exp: Date.now() + SESSION_DAYS * 86_400_000 })).toString('base64url');
  return {
    name: SESSION_COOKIE,
    value: `${body}.${sign(body)}`,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: SESSION_DAYS * 86_400,
  };
}

export function currentMember(): Member | null {
  if (!process.env.AUTH_SECRET) return null;
  const raw = cookies().get(SESSION_COOKIE)?.value;
  const [body, sig] = raw?.split('.') ?? [];
  if (!body || !sig) return null;
  const a = Buffer.from(sign(body));
  const b = Buffer.from(sig);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  const s = JSON.parse(Buffer.from(body, 'base64url').toString()) as Member & { exp: number };
  return s.exp > Date.now() ? { id: s.id, email: s.email, nickname: s.nickname } : null;
}

// ---- 不正なリクエストを防ぐ ----

// 別のサイトから送られた POST（CSRF）を断る：Origin がこのサイトと同じときだけ受け付ける
export function sameOrigin(req: Request): boolean {
  const origin = req.headers.get('origin');
  const host = req.headers.get('x-forwarded-host') ?? req.headers.get('host');
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

// サインインの総当たりを遅らせる（同じ IP から 10 分に 10 回まで）。サーバーのインスタンスごとの簡易的な制限
const tries = new Map<string, { n: number; until: number }>();
export function tooManyTries(req: Request): boolean {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
  const now = Date.now();
  const t = tries.get(ip);
  if (!t || t.until < now) {
    tries.set(ip, { n: 1, until: now + 10 * 60_000 });
    return false;
  }
  t.n += 1;
  return t.n > 10;
}
