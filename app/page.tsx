import { PostSummary } from '@/interfaces/PostType';
import { getAllPostList } from '@/lib/staticFileApi';
import { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';

const Home: NextPage = () => {
  const posts: PostSummary[] = getAllPostList();
  return (
    <ul>
      {posts.map((post, index) => (
        <li key={index}>
          <Link href={`posts/${post.slug}`}>
            {post.title} - {post.author}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default Home;
