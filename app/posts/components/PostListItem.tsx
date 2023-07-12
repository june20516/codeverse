import { PostSummary } from '@/interfaces/PostType';
import Link from 'next/link';

const PostListItem = ({
  post,
  hasThumbnail = true,
}: {
  post: PostSummary;
  hasThumbnail?: boolean;
}) => {
  return (
    <li className="w-full mt-4 border-b border-b-primary-900 px-5">
      <Link href={`posts/${post.slug}`}>
        {hasThumbnail ? (
          <div
            style={{
              backgroundImage: `url(${post.meta.thumbnail})`,
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
            }}
            className="w-full h-72 mx-auto"
          />
        ) : null}
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
  );
};

export default PostListItem;
