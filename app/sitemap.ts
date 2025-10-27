import { getAllPostList, getAllTags } from '@/lib/staticFileApi';
import { MetadataRoute } from 'next';

const siteUrl = process.env.HOST_URL;

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: encodeURI(`${siteUrl}/`),
      lastModified: new Date(),
    },
    {
      url: encodeURI(`${siteUrl}/about`),
      lastModified: new Date(),
    },
    {
      url: encodeURI(`${siteUrl}/posts`),
      lastModified: new Date(),
    },
    {
      url: encodeURI(`${siteUrl}/tags`),
      lastModified: new Date(),
    },
    {
      url: encodeURI(`${siteUrl}/lab`),
      lastModified: new Date(),
    },
    {
      url: encodeURI(`${siteUrl}/lab/space-today`),
      lastModified: new Date(),
    },
  ];

  const posts = getAllPostList();
  const postRoutes: MetadataRoute.Sitemap = posts.map(post => ({
    url: encodeURI(`${siteUrl}/posts/${post.slug}`),
    lastModified: new Date(post.meta.date),
  }));

  const tags = getAllTags();
  const tagRoutes: MetadataRoute.Sitemap = tags.map(tag => ({
    url: encodeURI(`${siteUrl}/tags/${tag}`),
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...postRoutes, ...tagRoutes];
}
