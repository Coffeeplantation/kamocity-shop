import PlayScene from '@/components/PlayScene';
import Phone3DLazy from '@/components/Phone3DLazy';

// このセクションまでスクロールすると自動で再生される演出（--progress は PlayScene が時間で進める）。
// 文章が一行ずつ明るくなり、3D の製品が背面から前面へ回転し、最後に数値が現れる。

const LINES = [
  'Lumina Phone 17 Pro。',
  '航空宇宙グレードのチタニウムで、',
  'かつてなく軽く、強く。',
  'L19 Proチップが、',
  'すべてを一段と速くする。',
  '3つの48MPカメラで、',
  '光を、そのまま閉じ込める。',
];

const STATS = [
  { value: '199g', label: '軽量チタニウム' },
  { value: '48MP', label: 'トリプルカメラ' },
  { value: '29時間', label: 'ビデオ再生²' },
];

const statsIn = 'clamp(0, calc((var(--progress, 0) - 0.8) * 6), 1)';

export default function PhoneHighlights() {
  const n = LINES.length;
  return (
    <PlayScene
      as="section"
      duration={5200}
      threshold={0.55}
      delay={250}
      className="relative mb-3 flex min-h-[calc(100svh-44px)] items-center overflow-hidden bg-studio-dark py-12"
      aria-label="Lumina Phone 17 Pro の特長"
    >
      {/* 背景の光 */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: 'calc(var(--progress, 0) * 0.9)',
          background:
            'radial-gradient(60% 50% at 70% 55%, rgba(191,90,242,0.35), transparent 70%), radial-gradient(40% 40% at 60% 70%, rgba(255,138,61,0.25), transparent 70%)',
        }}
      />

      <div className="relative mx-auto grid w-full max-w-content items-center gap-6 px-4 md:px-10 lg:grid-cols-[1.25fr_1fr] lg:gap-12 xl:px-16">
        <div>
          <p className="text-[clamp(18px,min(5.6vw,3.6svh),30px)] font-semibold leading-[1.25] tracking-[-0.01em] text-[#f5f5f7] md:text-[clamp(24px,min(4.6vw,4.4svh),44px)] lg:text-[clamp(26px,min(3.2vw,5svh),68px)]">
            {LINES.map((line, i) => (
              <span
                key={line}
                className="block"
                style={{
                  opacity: `clamp(0.14, calc(var(--progress, 0) * ${n * 1.3} - ${i}), 1)`,
                  transform: `translate3d(0, calc((1 - clamp(0, calc(var(--progress, 0) * ${n * 1.3} - ${i}), 1)) * 10px), 0)`,
                }}
              >
                {line}
              </span>
            ))}
          </p>

          <dl
            className="mt-[3svh] grid max-w-[560px] grid-cols-3 gap-4 border-t border-white/15 pt-[2.5svh]"
            style={{ opacity: statsIn, transform: `translate3d(0, calc((1 - ${statsIn}) * 24px), 0)` }}
          >
            {STATS.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <span className="block whitespace-nowrap bg-gradient-to-r from-[#ff8a3d] to-[#c43dff] bg-clip-text text-[clamp(20px,min(6.4vw,4svh),40px)] font-semibold text-transparent">
                    {s.value}
                  </span>
                  <span className="text-[12px] text-[#86868b] md:text-[14px]">{s.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <Phone3DLazy
          mode="scrub"
          shadow={false}
          className="mx-auto aspect-[4/5] h-[clamp(300px,min(50svh,110vw),780px)] lg:h-[clamp(420px,72svh,820px)]"
        />
      </div>
    </PlayScene>
  );
}
