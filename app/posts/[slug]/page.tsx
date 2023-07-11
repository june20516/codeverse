/* eslint-disable @next/next/no-img-element */
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
  const signedTitle = `${meta.title} - Bran's codeverse`;
  return (
    <>
      <Head>
        <title>{signedTitle}</title>
        <meta charSet="utf-8" />
        <meta content="IE=edge" httpEquiv="X-UA-Compatible" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <meta name="robots" content="follow, index" />
        <link href="/favicon.ico" rel="shortcut icon" />
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
      <article>
        <div className="text-4xl font-bold text-center p-10 mb-3 sticky top-0 bg-white max-h-96 min-h-fit">
          {post.meta.title}
          <p className="text-base text-right italic text-secondary-400"> - {meta.date}</p>
        </div>
        <div className="w-full bg-background-primary-100 p-4">
          <p className="font-semibold text-secondary-600">{meta.description}</p>
        </div>
        <img src={`/${meta.thumbnail}`} className="w-[90%] mx-auto" alt="thumbnail" />
        <div className="markdown-body post" dangerouslySetInnerHTML={{ __html: content }} />
      </article>
    </>
  );
}
