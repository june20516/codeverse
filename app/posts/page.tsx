import { NextPage } from 'next';
import { Metadata } from 'next';

import { PostSummary } from '@/interfaces/PostType';
import { buildSiteUrl, getMetaTitle, getMetaThumbnail, metadataBase } from '@/lib/meta';
import { getAllPostList } from '@/lib/staticFileApi';

import PostListItem from './components/PostListItem';

const title = getMetaTitle('Posts');
const description = '개발하면서 배운 것들을 기록하고 공유합니다';
export const metadata: Metadata = {
  metadataBase,
  title,
  description,
  alternates: { canonical: buildSiteUrl(['posts']) },
  openGraph: {
    title,
    description,
    images: [{ url: getMetaThumbnail() }],
    siteName: "Bran's codeverse",
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [{ url: getMetaThumbnail() }],
    site: '@codeverse',
  },
};

const Posts: NextPage = () => {
  const posts: PostSummary[] = getAllPostList();
  return (
    <section style={{ maxWidth: '720px', margin: '0 auto', width: '100%' }}>
      {posts.map((post, index) => (
        <PostListItem post={post} key={index} />
      ))}
    </section>
  );
};

export default Posts;
