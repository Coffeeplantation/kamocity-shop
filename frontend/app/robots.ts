import type { MetadataRoute } from 'next';

// 検索エンジンへの案内（/robots.txt）。管理画面・API・アカウントのページは載せない
export default function robots(): MetadataRoute.Robots {
  const site = process.env.SITE_URL || 'http://localhost:3000';
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/api', '/auth', '/users'] },
    sitemap: `${site}/sitemap.xml`,
  };
}
