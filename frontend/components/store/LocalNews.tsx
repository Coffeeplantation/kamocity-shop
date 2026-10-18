import { fetchNews, newsTime } from '@/lib/news';

// 加茂市・新潟のニュース（サーバー側で取得）。1日3回の cron で取り直し、間に合わなくても最大 8 時間で更新される。
// 掲載するのはサイト掲載が認められている配信元だけ（lib/news.ts の use: 'site'）。見出しとリンクのみで本文は載せない。
export default async function LocalNews() {
  const results = await fetchNews('site', 6);
  const fetchedAt = newsTime(new Date().toISOString());

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {results.map(({ feed, items, ok }) => (
          <section key={feed.id} className="flex flex-col rounded-tile bg-surface p-6">
            <h3 className="text-[19px] font-semibold text-ink">{feed.label}</h3>
            {ok && items.length > 0 ? (
              <ul className="mt-3 flex-1 divide-y divide-line/[0.06]">
                {items.map((i) => (
                  <li key={i.link}>
                    <a href={i.link} target="_blank" rel="noopener noreferrer" className="group block py-3">
                      <span className="line-clamp-2 text-[15px] leading-[1.45] text-ink group-hover:underline">{i.title}</span>
                      <span className="mt-1 block text-[12px] text-ink-secondary">
                        {i.publisher}
                        {i.date && `・${newsTime(i.date)}`}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 flex-1 text-[14px] text-ink-secondary">{ok ? '新しい記事はありません。' : 'ただいま取得できません。時間をおいてご覧ください。'}</p>
            )}
            <a href={feed.home} target="_blank" rel="noopener noreferrer" className="link-chevron mt-4 text-[13px]">
              出典：{feed.credit} ›
            </a>
          </section>
        ))}
      </div>
      <p className="mt-4 text-[12px] leading-[1.6] text-ink-secondary">
        1日3回（7時・12時・18時ごろ）更新。{fetchedAt} 時点。見出しは各配信元のもので、記事は配信元のサイトでお読みください。Google ニュースの見出しは、Google
        ニュースが各社の記事から自動で集めたものです。
      </p>
    </div>
  );
}
