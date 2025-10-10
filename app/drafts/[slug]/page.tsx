import { getPostBySlug, getPostSlugs } from '@/lib/staticFileApi';
import markdownToHtml from '@/lib/markdownToHTML';
import '@/styles/prism-duotone-dark.css';
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

  return <PostDetail post={post} meta={meta} content={content} />;
};

export default Draft;
