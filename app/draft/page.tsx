import { PostSummary } from '@/interfaces/PostType';
import { getAllPostList } from '@/lib/staticFileApi';
import { NextPage } from 'next';
import PostListItem from './components/PostListItem';

const Posts: NextPage = () => {
  const posts: PostSummary[] = getAllPostList();
  return (
    <ol>
      {posts.map((post, index) => (
        <PostListItem post={post} key={index} />
      ))}
    </ol>
  );
};

export default Posts;
