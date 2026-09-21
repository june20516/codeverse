import { MetadataRoute } from 'next';

import { Post } from '@/interfaces/PostType';
import { getLabItems } from '@/lib/labData';
import { buildSiteUrl } from '@/lib/meta';
import { getAllPostList, getAllTags } from '@/lib/staticFileApi';

// 글 목록은 최신순으로 정렬되어 있어 첫 글의 발행일이 가장 최근 날짜다
const getNewestPostDate = (posts: Post[]) => (posts[0] ? new Date(posts[0].meta.date) : undefined);

// lastmod에는 내용이 실제로 바뀐 날만 적는다.
// 빌드 시각을 넣으면 배포할 때마다 바뀌어 Google이 lastmod를 믿지 않으므로, 근거가 없는 페이지는 비워 둔다.
export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPostList();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: buildSiteUrl() },
    { url: buildSiteUrl(['about']) },
    { url: buildSiteUrl(['posts']), lastModified: getNewestPostDate(posts) },
    { url: buildSiteUrl(['tags']), lastModified: getNewestPostDate(posts) },
    { url: buildSiteUrl(['lab']) },
  ];

  const labRoutes: MetadataRoute.Sitemap = getLabItems().map(item => ({
    url: buildSiteUrl(item.path.split('/').filter(Boolean)),
  }));

  const postRoutes: MetadataRoute.Sitemap = posts.map(post => ({
    url: buildSiteUrl(['posts', post.slug]),
    lastModified: new Date(post.meta.date),
  }));

  // 태그 페이지는 소문자 주소로 생성된다(app/tags/[tag]/page.tsx). 대소문자만 다른 태그는 한 페이지다.
  const tags = Array.from(new Set(getAllTags().map(tag => tag.toLowerCase())));
  const tagRoutes: MetadataRoute.Sitemap = tags.map(tag => ({
    url: buildSiteUrl(['tags', tag]),
    lastModified: getNewestPostDate(
      posts.filter(post => post.meta.tags?.some(postTag => postTag.toLowerCase() === tag)),
    ),
  }));

  return [...staticRoutes, ...labRoutes, ...postRoutes, ...tagRoutes];
}
