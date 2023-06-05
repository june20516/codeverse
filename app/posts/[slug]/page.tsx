import { getPostBySlug, getPostSlugs } from '@/lib/staticFileApi';
import markdownToHtml from '@/lib/markdownToHTML';

export async function generateStaticParams() {
  const slugs = getPostSlugs().map(postSlug => {
    return { slug: postSlug };
  });
  return slugs;
}

export default async function Page({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  const content = await markdownToHtml(post.content || '');
  return (
    <>
      <div>{post.title}</div>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </>
  );
}
