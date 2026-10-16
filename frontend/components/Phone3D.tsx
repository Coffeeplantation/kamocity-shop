'use client';

// 架空製品「Lumina Phone」のリアルタイム 3D モデル。
// ジオメトリはすべてコードで生成（外部モデル・画像なし）。
// ライティングは Lightformer による擬似スタジオ照明で、外部の HDR ファイルにも依存しない。

import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Environment, Lightformer, RoundedBox } from '@react-three/drei';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { FINISHES, type Finish } from '@/components/finishes';

// 寸法（ワールド単位）
const W = 3.5;
const H = 7.2;
const D = 0.34;
const R = 0.56;

const LOGO_PATH =
  'M12 1.5c.9 5.6 3.9 8.6 9.5 9.5v2c-5.6.9-8.6 3.9-9.5 9.5h-2C9.6 16.9 6.6 13.9 1 13v-2c5.6-.9 8.6-3.9 9.5-9.5h1.5Z';

// ---------- ジオメトリ / テクスチャ生成 ----------

function roundedRectShape(w: number, h: number, r: number) {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

function roundedPlane(w: number, h: number, r: number) {
  const g = new THREE.ShapeGeometry(roundedRectShape(w, h, r), 32);
  const pos = g.attributes.position;
  const uv = g.attributes.uv;
  for (let i = 0; i < pos.count; i++) {
    uv.setXY(i, (pos.getX(i) + w / 2) / w, (pos.getY(i) + h / 2) / h);
  }
  uv.needsUpdate = true;
  return g;
}

function roundedSlab(w: number, h: number, r: number, depth: number, bevel: number) {
  const g = new THREE.ExtrudeGeometry(roundedRectShape(w - bevel * 2, h - bevel * 2, Math.max(r - bevel, 0.01)), {
    depth,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 10,
    curveSegments: 48,
  });
  g.translate(0, 0, -depth / 2);
  g.computeVertexNormals();
  return g;
}

function makeScreenTexture(wp: Finish['wallpaper']) {
  const c = document.createElement('canvas');
  c.width = 1024;
  c.height = 2112;
  const ctx = c.getContext('2d')!;
  const g = ctx.createLinearGradient(0, 0, 420, c.height);
  g.addColorStop(0, wp[0]);
  g.addColorStop(1, wp[1]);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, c.width, c.height);

  const blob = (x: number, y: number, rx: number, ry: number, color: string, a = 0.95) => {
    ctx.globalAlpha = a;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
  };
  ctx.filter = 'blur(150px)';
  blob(250, 1500, 580, 430, wp[2]);
  blob(880, 760, 470, 360, wp[3], 0.9);
  blob(520, 2160, 640, 260, wp[0], 0.8);
  ctx.filter = 'none';
  ctx.globalAlpha = 1;

  // 微細なノイズでバンディングを抑える
  const img = ctx.getImageData(0, 0, c.width, c.height);
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (Math.random() - 0.5) * 6;
    img.data[i] += n;
    img.data[i + 1] += n;
    img.data[i + 2] += n;
  }
  ctx.putImageData(img, 0, 0);

  const font = '-apple-system, "SF Pro Display", "Hiragino Sans", "Segoe UI", "Yu Gothic UI", sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.textAlign = 'center';
  ctx.font = `600 50px ${font}`;
  ctx.fillText('10月16日 金曜日', 512, 330);
  ctx.fillStyle = 'rgba(255,255,255,0.97)';
  ctx.font = `600 310px ${font}`;
  ctx.fillText('9:41', 512, 620);

  ctx.fillStyle = 'rgba(255,255,255,0.18)';
  for (const x of [210, 814]) {
    ctx.beginPath();
    ctx.arc(x, 1880, 84, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.beginPath();
  ctx.roundRect(362, 2034, 300, 14, 7);
  ctx.fill();

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function makeLogoAlpha() {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, 256, 256);
  ctx.translate(14, 14);
  ctx.scale(228 / 24, 228 / 24);
  ctx.fillStyle = '#fff';
  ctx.fill(new Path2D(LOGO_PATH));
  return new THREE.CanvasTexture(c);
}

// ---------- モデル ----------

function Lens({ x, y, z, frame }: { x: number; y: number; z: number; frame: string }) {
  return (
    <group position={[x, y, z]} rotation={[Math.PI / 2, 0, 0]}>
      {/* 金属リング */}
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[0.36, 0.37, 0.11, 64]} />
        <meshStandardMaterial color={frame} metalness={1} roughness={0.22} />
      </mesh>
      {/* 黒い鏡筒 */}
      <mesh position={[0, -0.056, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.11, 64]} />
        <meshStandardMaterial color="#0b0b0d" roughness={0.35} />
      </mesh>
      {/* レンズ（コーティングの干渉色） */}
      <mesh position={[0, -0.1, 0]} rotation={[Math.PI, 0, 0]}>
        <sphereGeometry args={[0.25, 64, 32, 0, Math.PI * 2, 0, Math.PI / 5]} />
        <meshPhysicalMaterial
          color="#070a14"
          metalness={0.2}
          roughness={0.04}
          clearcoat={1}
          clearcoatRoughness={0.02}
          iridescence={1}
          iridescenceIOR={1.7}
          iridescenceThicknessRange={[250, 650]}
        />
      </mesh>
      <mesh position={[0, -0.112, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.09, 0.115, 48]} />
        <meshStandardMaterial color="#2a2d36" metalness={0.6} roughness={0.3} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

type View = 'front' | 'back';
type Mode = 'hero' | 'scrub';

// マウス位置（-1〜1）をページ全体で共有
const pointer = { x: 0, y: 0 };
if (typeof window !== 'undefined') {
  window.addEventListener(
    'pointermove',
    (e) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    },
    { passive: true },
  );
}

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function PhoneModel({
  finish,
  view,
  mode,
  sceneEl,
}: {
  finish: Finish;
  view: View;
  mode: Mode;
  sceneEl: HTMLElement | null;
}) {
  const group = useRef<THREE.Group>(null);
  const screen = useMemo(() => makeScreenTexture(finish.wallpaper), [finish]);
  const logo = useMemo(() => makeLogoAlpha(), []);
  const body = useMemo(() => roundedSlab(W, H, R, D - 0.16, 0.08), []);
  const glass = useMemo(() => roundedPlane(W - 0.1, H - 0.1, R - 0.05), []);
  const display = useMemo(() => roundedPlane(W - 0.3, H - 0.3, R - 0.16), []);
  const island = useMemo(() => roundedPlane(0.98, 0.29, 0.145), []);
  const plateau = useMemo(() => roundedSlab(1.66, 1.74, 0.46, 0.03, 0.03), []);

  useEffect(
    () => () => {
      screen.dispose();
      logo.dispose();
    },
    [screen, logo],
  );

  const baseY = view === 'back' ? Math.PI + 0.55 : -0.42;

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    let ty: number;
    let tx: number;
    let tz: number;
    const p = sceneEl ? parseFloat(sceneEl.style.getPropertyValue('--progress') || '0') || 0 : 1;
    if (mode === 'scrub') {
      const e = ease(Math.min(Math.max(p * 1.15, 0), 1));
      ty = THREE.MathUtils.lerp(Math.PI + 0.7, -0.38, e) + pointer.x * 0.08;
      tx = THREE.MathUtils.lerp(0.32, 0.06, e) + pointer.y * 0.05;
      tz = THREE.MathUtils.lerp(-0.22, 0.02, e);
    } else {
      const t = state.clock.elapsedTime;
      // 表示されたときに半回転しながら定位置へ収まる
      const intro = 1 - ease(Math.min(p, 1));
      ty = baseY - intro * Math.PI + Math.sin(t * 0.35) * 0.16 + pointer.x * 0.32;
      tx = 0.07 + Math.sin(t * 0.5) * 0.03 + pointer.y * 0.12;
      tz = view === 'back' ? 0.04 : -0.03;
      g.position.y = Math.sin(t * 0.8) * 0.06;
    }
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, ty, 5, delta);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, tx, 5, delta);
    g.rotation.z = THREE.MathUtils.damp(g.rotation.z, tz, 5, delta);
  });

  const zf = D / 2;
  const plateauX = W / 2 - 0.22 - 0.83; // 背面から見て左上
  const plateauY = H / 2 - 0.22 - 0.87;
  const pz = -zf - 0.045;
  const lensZ = pz - 0.06;

  return (
    <group ref={group} rotation={[0.07, baseY, 0]}>
      {/* チタニウムのフレーム */}
      <mesh geometry={body}>
        <meshStandardMaterial color={finish.frame} metalness={1} roughness={0.26} envMapIntensity={1.15} />
      </mesh>

      {/* 前面: ガラス → ディスプレイ → 表面反射 */}
      <mesh geometry={glass} position={[0, 0, zf + 0.002]}>
        <meshPhysicalMaterial color="#030304" roughness={0.1} clearcoat={1} clearcoatRoughness={0.04} />
      </mesh>
      <mesh geometry={display} position={[0, 0, zf + 0.004]}>
        <meshBasicMaterial map={screen} toneMapped={false} />
      </mesh>
      <mesh geometry={island} position={[0, H / 2 - 0.47, zf + 0.006]}>
        <meshBasicMaterial color="#000" />
      </mesh>
      <mesh geometry={glass} position={[0, 0, zf + 0.008]}>
        <meshPhysicalMaterial
          color="#000"
          transparent
          opacity={0.14}
          roughness={0.03}
          clearcoat={1}
          clearcoatRoughness={0}
          depthWrite={false}
        />
      </mesh>

      {/* 背面: すりガラス */}
      <mesh geometry={glass} position={[0, 0, -zf - 0.002]} rotation={[0, Math.PI, 0]}>
        <meshPhysicalMaterial
          color={finish.back}
          roughness={0.5}
          metalness={0.05}
          clearcoat={0.5}
          clearcoatRoughness={0.45}
          sheen={0.4}
          sheenColor="#ffffff"
        />
      </mesh>
      <mesh geometry={glass} position={[0, 0.15, -zf - 0.004]} rotation={[0, Math.PI, 0]} scale={[0.2, 0.097, 1]}>
        <meshStandardMaterial color={finish.frame} metalness={0.55} roughness={0.22} transparent alphaMap={logo} />
      </mesh>

      {/* カメラ部 */}
      <group position={[plateauX, plateauY, 0]}>
        <mesh geometry={plateau} position={[0, 0, pz]}>
          <meshPhysicalMaterial color={finish.plateau} roughness={0.12} metalness={0.1} clearcoat={1} clearcoatRoughness={0.05} />
        </mesh>
        <Lens x={0.38} y={0.42} z={lensZ} frame={finish.frame} />
        <Lens x={0.38} y={-0.42} z={lensZ} frame={finish.frame} />
        <Lens x={-0.36} y={0} z={lensZ} frame={finish.frame} />
        <mesh position={[-0.38, 0.55, lensZ - 0.002]} rotation={[0, Math.PI, 0]}>
          <circleGeometry args={[0.11, 40]} />
          <meshStandardMaterial color="#f4efe3" roughness={0.35} emissive="#fff6e0" emissiveIntensity={0.05} />
        </mesh>
        <mesh position={[-0.38, -0.55, lensZ - 0.002]} rotation={[0, Math.PI, 0]}>
          <circleGeometry args={[0.08, 40]} />
          <meshPhysicalMaterial color="#0c0c10" roughness={0.05} clearcoat={1} />
        </mesh>
      </group>

      {/* サイドボタン */}
      {[
        { x: W / 2, y: 0.95, h: 1.0 },
        { x: -W / 2, y: 2.05, h: 0.34 },
        { x: -W / 2, y: 1.35, h: 0.62 },
        { x: -W / 2, y: 0.55, h: 0.62 },
      ].map((b) => (
        <RoundedBox key={`${b.x}-${b.y}`} args={[0.08, b.h, 0.13]} radius={0.035} smoothness={4} position={[b.x, b.y, 0]}>
          <meshStandardMaterial color={finish.frame} metalness={1} roughness={0.3} />
        </RoundedBox>
      ))}
    </group>
  );
}

function Studio() {
  return (
    <Environment resolution={256} frames={1}>
      <group rotation={[-Math.PI / 3, 0, 1]}>
        <Lightformer form="circle" intensity={4} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={2} />
        <Lightformer form="circle" intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={2} />
        <Lightformer form="circle" intensity={2} rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={2} />
        <Lightformer form="circle" intensity={2} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={8} />
      </group>
      <Lightformer form="rect" intensity={1.5} position={[0, 0, 10]} scale={[10, 4, 1]} />
      <Lightformer form="rect" intensity={3} position={[-6, 4, 4]} rotation-y={Math.PI / 4} scale={[2, 10, 1]} />
      <Lightformer form="rect" intensity={1} position={[6, -2, 4]} rotation-y={-Math.PI / 4} scale={[2, 10, 1]} />
    </Environment>
  );
}

function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

export default function Phone3D({
  finish = FINISHES.natural,
  view = 'back',
  mode = 'hero',
  shadow = true,
  className = '',
  fallback = null,
}: {
  finish?: Finish;
  view?: View;
  mode?: Mode;
  shadow?: boolean;
  className?: string;
  fallback?: React.ReactNode;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const [supported, setSupported] = useState<boolean | null>(null);
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);
  const [sceneEl, setSceneEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setSupported(hasWebGL());
    const el = wrap.current;
    if (!el) return;
    setSceneEl(el.closest<HTMLElement>('[data-play-scene]'));
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: '200px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} className={`absolute inset-0 ${className}`} aria-hidden>
      {supported === false && fallback}
      {supported && (
        <Canvas
          className={`!absolute inset-0 transition-opacity duration-1000 ${ready ? 'opacity-100' : 'opacity-0'}`}
          dpr={[1, 2]}
          frameloop={visible ? 'always' : 'never'}
          camera={{ position: [0, 0, 15.5], fov: 30 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          onCreated={() => setReady(true)}
        >
          <ambientLight intensity={0.25} />
          <directionalLight position={[4, 6, 8]} intensity={1.1} />
          <PhoneModel finish={finish} view={view} mode={mode} sceneEl={sceneEl} />
          {shadow && <ContactShadows position={[0, -H / 2 - 0.5, 0]} opacity={0.42} scale={14} blur={2.6} far={5} resolution={512} />}
          <Studio />
        </Canvas>
      )}
    </div>
  );
}
