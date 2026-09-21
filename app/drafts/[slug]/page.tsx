import { getPostBySlug, getPostSlugs, getSeriesNavigation } from '@/lib/staticFileApi';
import markdownToHtml from '@/lib/markdownToHTML';
import '@/styles/prism-one-light.css';
import '@/app/posts/[slug]/styles.css';
import PostDetail from '@/app/posts/[slug]/PostDetail';
import { Metadata } from 'next';
import { generatePostMetadata } from '@/lib/meta';

export async function generateStaticParams() {
  const slugs = getPostSlugs({ isDraft: true }).map(postSlug => {
    return { slug: postSlug };
  });
  return slugs;
}

interface PostProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PostProps): Promise<Metadata> {
  const post = getPostBySlug({ slug: params.slug, isDraft: true });
  return generatePostMetadata(post.meta, true);
}

const Draft = async ({ params }: PostProps) => {
  const post = getPostBySlug({ slug: params.slug, isDraft: true });
  const content = await markdownToHtml(post.content || '');
  const meta = post.meta;
  const series = getSeriesNavigation(post);

  return <PostDetail post={post} meta={meta} content={content} series={series} />;
};

export default Draft;
