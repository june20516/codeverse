import { PostSummary } from '@/interfaces/PostType';
import { getAllPostList } from '@/lib/staticFileApi';
import { NextPage } from 'next';
import Link from 'next/link';

const Posts: NextPage = () => {
  const posts: PostSummary[] = getAllPostList();
  return (
    <ol>
      {posts.map((post, index) => (
        <li key={index} className="w-full mt-4 border-b border-b-primary-900 px-5">
          <Link href={`posts/${post.slug}`}>
            <div
              style={{
                backgroundImage: `url(${post.meta.thumbnail})`,
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
              }}
              className="w-full h-72 mx-auto"
            />
            <div className="flex justify-between my-5 pb-3">
              <div className="flex flex-col">
                <span className="text-xl font-semibold">{post.meta.title}</span>
                <p className="pt-5 w-full text-gray-500 min-h-[1rem]">
                  {post.meta.description ? post.meta.description : null}
                </p>
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
