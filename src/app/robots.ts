import { siteConfig } from '@/lib/constants/site';

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/_next/', '/private/'],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
