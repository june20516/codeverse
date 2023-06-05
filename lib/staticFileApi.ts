// blog-starter/lib/api.ts
import fs from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import { Post } from '@/interfaces/PostType';

const postsDirectory = join(process.cwd(), '__posts');

const PostSlugList: string[] = [];
const AllPostList: Post[] = [];

export function getPostSlugs() {
  if (PostSlugList.length > 0) {
    return PostSlugList;
  }

  PostSlugList.push(
    ...fs.readdirSync(postsDirectory).map(fileName => fileName.replace(/\.md$/, '')),
  );
  return PostSlugList;
}

export function getPostBySlug(slug: string): Post {
  if (AllPostList.length > 0) {
    const loadedPost = AllPostList.filter(post => post.slug === slug);
    if (loadedPost.length > 0) {
      return loadedPost[0];
    }
  }
  const fullPath = join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  const item = {
    slug,
    content,
    ...data,
  } as Post;

  return item;
}

export function getAllPostList() {
  if (AllPostList.length > 0) return AllPostList;

  const slugs = getPostSlugs();
  AllPostList.push(
    ...slugs
      .map(slug => getPostBySlug(slug))
      .sort((post1, post2) => (post1.date > post2.date ? -1 : 1)),
  );
  return AllPostList;
}
