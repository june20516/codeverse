import { Metadata } from 'next';

import { PostMeta } from '@/interfaces/PostType';

// og:image·twitter:image의 상대 경로를 절대 URL로 바꾸는 기준 주소.
// 지정하지 않으면 Next.js가 빌드 시 http://localhost:3000을 붙여 공유 미리보기 이미지가 깨진다.
const SITE_URL = process.env.HOST_URL || 'https://june20516.github.io';
export const metadataBase = new URL(SITE_URL);

// google search console에서 요구하는 기준을 충족하는 인코딩 함수
const encodeExtendedRFC3986 = (string: string) =>
  encodeURIComponent(string).replace(
    /[!'()*]/g,
    char =>
      // 각 문자를 퍼센트 인코딩된 값으로 변환
      '%' + char.charCodeAt(0).toString(16).toUpperCase(),
  );

// sitemap의 <loc>과 페이지의 canonical이 한 글자도 다르지 않도록 둘 다 이 함수로 주소를 만든다
export const buildSiteUrl = (pathSegments: string[] = []) =>
  [SITE_URL, ...pathSegments.map(encodeExtendedRFC3986)].join('/');

export const getMetaTitle = (title?: string) => {
  return title ? `${title} - Bran's codeverse` : "Bran's codeverse";
};

export const getMetaThumbnail = (file?: string) => {
  if (!file) return '/assets/images/default-thumbnail.jpg';

  // 이미 절대 경로면 그대로 반환
  if (file.startsWith('/')) return file;

  // assets/로 시작하면 앞에 /만 추가
  if (file.startsWith('assets/')) return `/${file}`;

  // 파일명만 있으면 기본 경로 추가
  return `/assets/images/${file}`;
};

export const generatePostMetadata = (meta: PostMeta, isDraft = false): Metadata => {
  const titlePrefix = isDraft ? '[Draft] ' : '';
  const signedTitle = `${titlePrefix}${meta.title} - Bran's codeverse`;
  const thumbnail = meta.thumbnail || getMetaThumbnail();

  return {
    metadataBase,
    title: signedTitle,
    description: meta.description,
    openGraph: {
      title: signedTitle,
      description: meta.description,
      images: [{ url: thumbnail }],
      siteName: "Bran's codeverse",
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: signedTitle,
      description: meta.description,
      images: [thumbnail],
      site: '@codeverse',
    },
  };
};
