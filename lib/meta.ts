import { Metadata } from 'next';
import { PostMeta } from '@/interfaces/PostType';

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
