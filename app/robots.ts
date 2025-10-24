import { MetadataRoute } from 'next';

const siteUrl = process.env.HOST_URL;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/drafts/'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
