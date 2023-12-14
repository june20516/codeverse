'use client';
import { useScrollStore } from '@/app/stores/scroll';
/* eslint-disable @next/next/no-img-element */
import { Post, PostMeta } from '@/interfaces/PostType';
import { useRef } from 'react';

interface PostDetailProps {
  post: Post;
  meta: PostMeta;
  content: string;
}
const PostDetail = ({ post, meta, content }: PostDetailProps) => {
  const titleRef = useRef<HTMLDivElement>(null);
  const { isStickTop } = useScrollStore();

  return (
    <>
      <div
        ref={titleRef}
        className={`text-4xl font-bold text-center p-10 bg-white max-h-96 min-h-fit transition-all`}>
        <span
          className={`${
            !isStickTop ? 'absolute top-5 -translate-x-[50%] translate-y-[50%] text-2xl' : ''
          }`}>
          {post.meta.title}
        </span>
        <p className="text-base text-right italic text-secondary-400"> - {meta.date}</p>
      </div>
      <div className="w-full bg-background-primary-100 p-4">
        <p className="font-semibold text-secondary-600">{meta.description}</p>
      </div>
      <img src={`/${meta.thumbnail}`} className="w-[90%] mx-auto" alt="thumbnail" loading="lazy" />
      <div className="markdown-body post" dangerouslySetInnerHTML={{ __html: content }} />
    </>
  );
};

export default PostDetail;
