// 言葉が横に流れ続ける帯。同じ並びを2回つなげて、半分ずらしたところで最初に戻る。
// ホバーで一時停止し、動きを減らす設定では止まったまま表示する。
export default function Marquee({ items, className = '' }: { items: string[]; className?: string }) {
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center gap-10 pr-10 md:gap-16 md:pr-16" aria-hidden={hidden || undefined}>
      {items.map((t) => (
        <li key={t} className="flex shrink-0 items-center gap-10 md:gap-16">
          <span>{t}</span>
          <span className="h-2 w-2 rounded-full bg-current opacity-30" aria-hidden />
        </li>
      ))}
    </ul>
  );
  return (
    <div className={`marquee-pause overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)] ${className}`}>
      <div className="animate-marquee flex w-max">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
