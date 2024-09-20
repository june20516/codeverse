import { getPostBySlug, getPostSlugs } from '@/lib/staticFileApi';
import markdownToHtml from '@/lib/markdownToHTML';
import './styles.css';
import '@/styles/prism-duotone-dark.css';
import Head from 'next/head';
import PostDetail from './PostDetail';
import { Box } from '@mui/material';

export async function generateStaticParams() {
  const slugs = getPostSlugs().map(postSlug => {
    return { slug: postSlug };
  });
  return slugs;
}

interface PostProps {
  params: { slug: string };
}

const Post = async ({ params }: PostProps) => {
  const post = getPostBySlug(params.slug);
  const content = await markdownToHtml(post.content || '');
  const meta = post.meta;
  const signedTitle = `${meta.title} - Bran's codeverse`;
  return (
    <>
      <Head>
        <title>{signedTitle}</title>
        <meta content={meta.description} name="description" />
        <meta property="og:site_name" content={signedTitle} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:title" content={signedTitle} />
        <meta property="og:image" content={meta.thumbnail} />
        <meta name="twitter:title" content={signedTitle} />
        <meta name="twitter:description" content={meta.description} />
        <meta name="twitter:image" content={meta.thumbnail} />
      </Head>
      <PostDetail post={post} meta={meta} content={content} />
    </>
  );
};

export default Post;
