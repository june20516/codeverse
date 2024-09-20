/* eslint-disable @next/next/no-img-element */
import { getPostBySlug, getPostSlugs } from '@/lib/staticFileApi';
import markdownToHtml from '@/lib/markdownToHTML';
import './styles.css';
import '@/styles/prism-duotone-dark.css';
import Head from 'next/head';
import PostDetail from '@/app/posts/[slug]/PostDetail';

export async function generateStaticParams() {
  const slugs = getPostSlugs({ isDraft: true }).map(postSlug => {
    return { slug: postSlug };
  });
  return slugs;
}

interface PostProps {
  params: { slug: string };
}

const Post = async ({ params }: PostProps) => {
  const post = getPostBySlug({ slug: params.slug, isDraft: true });
  const content = await markdownToHtml(post.content || '');
  const meta = post.meta;
  const signedTitle = `${meta.title} - Bran's codeverse`;
  return (
    <>
      <Head>
        <title>{signedTitle}</title>
        <meta charSet="utf-8" />
        <meta content="IE=edge" httpEquiv="X-UA-Compatible" />
        <meta name="robots" content="noindex, nofollow" />
        <meta content={meta.description} name="description" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={signedTitle} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:title" content={signedTitle} />
        <meta property="og:image" content={meta.thumbnail} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="codeverse" />
        <meta name="twitter:title" content={signedTitle} />
        <meta name="twitter:description" content={meta.description} />
        <meta name="twitter:image" content={meta.thumbnail} />
      </Head>
      <PostDetail post={post} meta={meta} content={content} />
    </>
  );
};

export default Post;
