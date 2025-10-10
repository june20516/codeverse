import PostListItem from '@/app/posts/components/PostListItem';
import { getAllPostList, getAllTags } from '@/lib/staticFileApi';
import { NextPage } from 'next';
import { ensureDecoded } from '@/utils';
import ListHeader from './components/ListHeader';

export async function generateStaticParams() {
  const tags = getAllTags().map(tag => {
    return { tag: tag };
  });
  return tags;
}

interface TagProps {
  params: { tag: string };
}

const Tag: NextPage<TagProps> = ({ params }: TagProps) => {
  const tag = ensureDecoded(params.tag);
  const tagedPosts = getAllPostList().filter(post => post.meta.tags?.includes(tag));
  return (
    <>
      <ListHeader tag={tag} count={tagedPosts.length} />
      <ol>
        {tagedPosts.map((post, index) => (
          <PostListItem key={index} post={post} />
        ))}
      </ol>
    </>
  );
};

export default Tag;
