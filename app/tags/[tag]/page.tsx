import PostListItem from '@/app/posts/components/PostListItem';
import { getAllPostList, getAllTags } from '@/lib/staticFileApi';
import { NextPage } from 'next';

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
  const tag = params.tag;
  const tagedPosts = getAllPostList().filter(post => post.meta.tags?.includes(tag));
  return (
    <>
      <div>
        {tag}가 태그된 글 목록 - <span className="italic">{tagedPosts.length}</span>개
      </div>
      <ol>
        {tagedPosts.map((post, index) => (
          <PostListItem key={index} post={post} hasThumbnail={false} />
        ))}
      </ol>
    </>
  );
};

export default Tag;
