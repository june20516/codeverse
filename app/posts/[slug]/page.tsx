import { getPostBySlug, getPostSlugs } from '@/lib/staticFileApi';
import markdownToHtml from '@/lib/markdownToHTML';
import './styles.css';
import '@/styles/prism-duotone-dark.css';
import Head from 'next/head';

export async function generateStaticParams() {
  const slugs = getPostSlugs().map(postSlug => {
    return { slug: postSlug };
  });
  return slugs;
}

export default async function Page({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  const content = await markdownToHtml(post.content || '');
  const meta = post.meta;
  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta charSet="utf-8" />
        <meta content="IE=edge" httpEquiv="X-UA-Compatible" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <meta name="robots" content="follow, index" />
        <link href="/favicon.ico" rel="shortcut icon" />
        <meta content={meta.description} name="description" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:image" content={meta.cardImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@vercel" />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
        <meta name="twitter:image" content={meta.cardImage} />
      </Head>
      <article>
        <div className="text-4xl font-bold text-center p-10 mb-3 sticky top-0 text-green-800">
          {post.meta.title}
        </div>
        <div className="markdown-body post" dangerouslySetInnerHTML={{ __html: content }} />
      </article>
    </>
  );
}
