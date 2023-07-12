// blog-starter/lib/api.ts
import fs from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import { Post } from '@/interfaces/PostType';
import { flat, uniq } from '@/utils';

const postsDirectory = join(process.cwd(), '__posts');

const postSlugList: string[] = [];
const allPostList: Post[] = [];
const tags: string[] = [];

export function getPostSlugs() {
  if (postSlugList.length > 0) {
    return postSlugList;
  }

  postSlugList.push(
    ...fs.readdirSync(postsDirectory).map(fileName => fileName.replace(/\.md$/, '')),
  );
  return postSlugList;
}

export function getPostBySlug(slug: string): Post {
  if (allPostList.length > 0) {
    const loadedPost = allPostList.filter(post => post.slug === slug);
    if (loadedPost.length > 0) {
      return loadedPost[0];
    }
  }
  const fullPath = join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return { slug, meta: data, content } as Post;
}

export function getAllPostList() {
  if (allPostList.length > 0) return allPostList;

  const slugs = getPostSlugs();
  allPostList.push(
    ...slugs
      .map(slug => getPostBySlug(slug))
      .sort((post1, post2) => (post1.meta.date > post2.meta.date ? -1 : 1)),
  );
  return allPostList;
}

export function getAllTags() {
  if (tags.length > 0) return tags;
  if (allPostList.length < 1) getAllPostList();
  tags.push(...uniq(flat(allPostList.map(post => post.meta.tags))));
  return tags;
}
