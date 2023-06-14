import { PostSummary } from '@/interfaces/PostType';
import { getAllPostList } from '@/lib/staticFileApi';
import { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';

const Home: NextPage = () => {
  const posts: PostSummary[] = getAllPostList();
  return (
    <ol>
      {posts.map((post, index) => (
        <li key={index} className="odd:backdrop-brightness-90">
          <Link href={`posts/${post.slug}`} className="flex flex-col p-4">
            <div className="flex justify-between items-center">
              <span className="text-xl font-semibold">{post.meta.title}</span>
              <span className="text-sm italic">{post.meta.date}</span>
            </div>
            {post.meta.description ? (
              <p className="max-h-9 mt-5 overflow-y-hidden w-full text-gray-500">
                {post.meta.description}
              </p>
            ) : null}
          </Link>
        </li>
      ))}
    </ol>
  );
};

export default Home;
