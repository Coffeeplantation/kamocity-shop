import type { MetadataRoute } from 'next';

// 検索エンジンに知らせるページの一覧（/sitemap.xml）
export default function sitemap(): MetadataRoute.Sitemap {
  const site = process.env.SITE_URL || 'http://localhost:3000';
  const now = new Date();
  return [
    { url: `${site}/stores`, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${site}/kamo`, lastModified: now, changeFrequency: 'daily', priority: 0.7 },
    { url: `${site}/store`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
  ];
}
