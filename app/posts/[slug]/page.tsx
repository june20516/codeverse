import { Metadata } from 'next';

import markdownToHtml from '@/lib/markdownToHTML';
import { buildSiteUrl, generatePostMetadata } from '@/lib/meta';
import { getPostBySlug, getPostSlugs, getSeriesNavigation } from '@/lib/staticFileApi';

import PostDetail from './PostDetail';

import '@/styles/prism-one-light.css';
import './styles.css';

export async function generateStaticParams() {
  const slugs = getPostSlugs().map(postSlug => {
    return { slug: postSlug };
  });
  return slugs;
}

interface PostProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PostProps): Promise<Metadata> {
  const post = getPostBySlug({ slug: params.slug });
  return {
    ...generatePostMetadata(post.meta),
    alternates: { canonical: buildSiteUrl(['posts', params.slug]) },
  };
}

const Post = async ({ params }: PostProps) => {
  const post = getPostBySlug({ slug: params.slug });
  const content = await markdownToHtml(post.content || '');
  const meta = post.meta;
  const series = getSeriesNavigation(post);

  return <PostDetail post={post} meta={meta} content={content} series={series} />;
};

export default Post;
