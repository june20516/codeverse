import { PostSummary } from '@/interfaces/PostType';
import { getAllPostList } from '@/lib/staticFileApi';
import { NextPage } from 'next';
import Link from 'next/link';

const Posts: NextPage = () => {
  const posts: PostSummary[] = getAllPostList();
  return (
    <ol>
      {posts.map((post, index) => (
        <li key={index} className="odd:backdrop-brightness-90">
          <Link href={`posts/${post.slug}`}>
            <div className="flex justify-between p-4">
              <div className="flex  flex-col">
                <span className="text-xl font-semibold">{post.meta.title}</span>
                {post.meta.description ? (
                  <p className="mt-5 w-full text-gray-500">{post.meta.description}</p>
                ) : null}
              </div>
              <span className="flex flex-col justify-start text-sm italic">{post.meta.date}</span>
            </div>
          </Link>
        </li>
      ))}
    </ol>
  );
};

export default Posts;
