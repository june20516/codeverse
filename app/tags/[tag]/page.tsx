import { Metadata, NextPage } from 'next';

import PostListItem from '@/app/posts/components/PostListItem';
import { buildSiteUrl, getMetaThumbnail, getMetaTitle, metadataBase } from '@/lib/meta';
import { getAllPostList, getAllTags } from '@/lib/staticFileApi';
import { ensureDecoded } from '@/utils';

import ListHeader from './components/ListHeader';

export async function generateStaticParams() {
  const tags = getAllTags().map(tag => {
    return { tag: tag.toLowerCase() };
  });

  const uniqueTags = Array.from(new Set(tags.map(t => t.tag))).map(tag => ({ tag }));

  return uniqueTags;
}

interface TagProps {
  params: { tag: string };
}

const getTaggedPosts = (tagParam: string) => {
  const tag = ensureDecoded(tagParam).toLowerCase();
  const taggedPosts = getAllPostList().filter(post =>
    post.meta.tags?.some(t => t.toLowerCase() === tag),
  );
  const displayTag = taggedPosts[0]?.meta.tags?.find(t => t.toLowerCase() === tag) || tag;

  return { tag, taggedPosts, displayTag };
};

export async function generateMetadata({ params }: TagProps): Promise<Metadata> {
  const { tag, taggedPosts, displayTag } = getTaggedPosts(params.tag);
  const title = getMetaTitle(displayTag);
  const description = `${displayTag} 태그가 붙은 글 ${taggedPosts.length}개`;

  return {
    metadataBase,
    title,
    description,
    alternates: { canonical: buildSiteUrl(['tags', tag]) },
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
}

const Tag: NextPage<TagProps> = ({ params }: TagProps) => {
  const { taggedPosts, displayTag } = getTaggedPosts(params.tag);

  return (
    <>
      <ListHeader tag={displayTag} count={taggedPosts.length} />
      <ol>
        {taggedPosts.map((post, index) => (
          <PostListItem key={index} post={post} />
        ))}
      </ol>
    </>
  );
};

export default Tag;
