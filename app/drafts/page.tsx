import { PostSummary } from '@/interfaces/PostType';
import { getAllDraftList } from '@/lib/staticFileApi';
import { NextPage } from 'next';
import PostListItem from '@/app/posts/components/PostListItem';

const Posts: NextPage = () => {
  const posts: PostSummary[] = getAllDraftList();
  return (
    <ol>
      {posts.map((post, index) => (
        <PostListItem post={post} baseUrl="drafts" key={index} />
      ))}
    </ol>
  );
};

export default Posts;
