import PostListItem from '@/app/posts/components/PostListItem';
import { getAllPostList, getAllTags } from '@/lib/staticFileApi';
import { NextPage } from 'next';
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

const Tag: NextPage<TagProps> = ({ params }: TagProps) => {
  const tagParam = ensureDecoded(params.tag).toLowerCase();
  const tagedPosts = getAllPostList().filter(post =>
    post.meta.tags?.some(t => t.toLowerCase() === tagParam),
  );

  const displayTag = tagedPosts[0]?.meta.tags?.find(t => t.toLowerCase() === tagParam) || tagParam;
  return (
    <>
      <ListHeader tag={displayTag} count={tagedPosts.length} />
      <ol>
        {tagedPosts.map((post, index) => (
          <PostListItem key={index} post={post} />
        ))}
      </ol>
    </>
  );
};

export default Tag;
