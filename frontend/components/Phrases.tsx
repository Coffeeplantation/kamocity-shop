// 日本語の見出しを「、」「。」などの後ろで区切り、文節の途中で改行されないようにする。
export default function Phrases({ text }: { text: string }) {
  const parts: string[] = [];
  let cur = '';
  for (const ch of text) {
    cur += ch;
    if ('、。？！'.includes(ch)) {
      parts.push(cur);
      cur = '';
    }
  }
  if (cur) parts.push(cur);
  return (
    <>
      {parts.map((p, i) => (
        <span key={i} className="inline-block">
          {p}
        </span>
      ))}
    </>
  );
}
