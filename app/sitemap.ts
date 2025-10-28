import { getAllPostList, getAllTags } from '@/lib/staticFileApi';
import { MetadataRoute } from 'next';

const siteUrl = process.env.HOST_URL;

// google search console에서 요구하는 기준을 충족하는 인코딩 함수
const encodeExtendedRFC3986 = (string: string) =>
  encodeURIComponent(string).replace(
    /[!'()*]/g,
    char =>
      // 각 문자를 퍼센트 인코딩된 값으로 변환
      '%' + char.charCodeAt(0).toString(16).toUpperCase(),
  );

const buildUrl = ({
  path,
  params,
}: {
  path?: string | string[];
  params?: Record<string, string>;
}) => {
  let url = siteUrl;
  const pathSegment = Array.isArray(path)
    ? path.map(encodeExtendedRFC3986).join('/')
    : typeof path === 'string'
    ? encodeExtendedRFC3986(path)
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
