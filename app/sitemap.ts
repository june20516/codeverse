import { getAllPostList, getAllTags } from '@/lib/staticFileApi';
import { MetadataRoute } from 'next';

const siteUrl = process.env.HOST_URL;
const encodeRFC3986 = (str: string) => new URLSearchParams({ k: str }).toString().split('=')[1];

const buildUrl = ({
  path,
  params,
}: {
  path?: string | string[];
  params?: Record<string, string>;
}) => {
  let url = siteUrl;
  const pathSegment = Array.isArray(path)
    ? path.map(encodeRFC3986).join('/')
    : typeof path === 'string'
    ? encodeRFC3986(path)
    : '';
  const paramSegment = new URLSearchParams(params).toString();

  return [siteUrl, pathSegment, paramSegment].filter(Boolean).join('/');
};

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: buildUrl({ path: '' }),
      lastModified: new Date(),
    },
    {
      url: buildUrl({ path: 'about' }),
      lastModified: new Date(),
    },
    {
      url: buildUrl({ path: 'posts' }),
      lastModified: new Date(),
    },
    {
      url: buildUrl({ path: 'tags' }),
      lastModified: new Date(),
    },
    {
      url: buildUrl({ path: 'lab' }),
      lastModified: new Date(),
    },
    {
      url: buildUrl({ path: ['lab', 'space-today'] }),
      lastModified: new Date(),
    },
  ];

  const posts = getAllPostList();
  const postRoutes: MetadataRoute.Sitemap = posts.map(post => ({
    url: buildUrl({ path: ['posts', post.slug] }),
    lastModified: new Date(post.meta.date),
  }));

  const tags = getAllTags();
  const tagRoutes: MetadataRoute.Sitemap = tags.map(tag => ({
    url: buildUrl({ path: ['tags', tag] }),
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...postRoutes, ...tagRoutes];
}
