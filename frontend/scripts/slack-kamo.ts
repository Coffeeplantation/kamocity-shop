// 「今日の加茂」を Slack に送る（サーバーを起動しなくても実行できる）。
//   npm run slack:kamo           … 送る内容を表示するだけ（送信しない）
//   npm run slack:kamo -- --send … .env.local の設定で Slack に送る（設定がなければ送信しない）

import { buildKamoDaily } from '../lib/slack/kamoDaily';
import { sendToSlack, slackMode } from '../lib/slack/send';

async function main() {
  const send = process.argv.includes('--send');
  const msg = await buildKamoDaily(undefined, process.env.SITE_URL);

  console.log('----- 送る内容 -----');
  console.log(msg.text);
  console.log('--------------------');

  if (!send) {
    console.log(`お試し表示のみ（送信していません）。設定：${slackMode()}`);
    return;
  }
  const r = await sendToSlack(msg);
  if (r.mode === 'dry-run') console.log('Slack の設定（SLACK_WEBHOOK_URL など）がないため、送信していません。');
  else if (r.ok) console.log(`Slack に送信しました（${r.mode}）。`);
  else {
    console.error(`送信に失敗しました（${r.mode}）：${r.error}`);
    process.exitCode = 1;
  }
}

main();
