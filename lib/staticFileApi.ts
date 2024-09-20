// blog-starter/lib/api.ts
import fs from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import { Post } from '@/interfaces/PostType';
import { flat, uniq } from '@/utils';

const postsDirectory = join(process.cwd(), '__posts');
const draftPostsDirectory = join(process.cwd(), '__posts/draft');

const postSlugList: string[] = [];
const draftPostSlugList: string[] = [];

const allPostList: Post[] = [];
const allDfratList: Post[] = [];

const tags: string[] = [];

export function getPostSlugs(options?: { isDraft?: boolean }) {
  const isDraft = options?.isDraft ?? false;
  const slugList = isDraft ? draftPostSlugList : postSlugList;
  const directory = isDraft ? draftPostsDirectory : postsDirectory;
  if (slugList.length > 0) {
    return slugList;
  }

  slugList.push(
    ...fs
      .readdirSync(directory)
      .filter(fileName => fileName.includes('.md'))
      .map(fileName => fileName.replace(/\.md$/, '')),
  );
  return slugList;
}

export function getPostBySlug({ slug, isDraft }: { slug: string; isDraft?: boolean }): Post {
  const list = isDraft ? allDfratList : allPostList;
  const directory = isDraft ? draftPostsDirectory : postsDirectory;
  if (list.length > 0) {
    const loadedPost = list.filter(post => post.slug === slug);
    if (loadedPost.length > 0) {
      return loadedPost[0];
    }
  }
  const fullPath = join(directory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return { slug, meta: data, content } as Post;
}

export function getAllPostList() {
  if (allPostList.length > 0) return allPostList;

  const slugs = getPostSlugs();
  allPostList.push(
    ...slugs
      .map(slug => getPostBySlug({ slug }))
      .sort((post1, post2) => (post1.meta.date > post2.meta.date ? -1 : 1)),
  );
  return allPostList;
}

export function getAllDraftList() {
  const isDraft = true;
  if (allDfratList.length > 0) return allDfratList;

  const slugs = getPostSlugs({ isDraft });
  allDfratList.push(
    ...slugs
      .map(slug => getPostBySlug({ slug, isDraft }))
      .sort((post1, post2) => (post1.meta.date > post2.meta.date ? -1 : 1)),
  );
  return allDfratList;
}

export function getAllTags() {
  if (tags.length > 0) return tags;
  if (allPostList.length < 1) getAllPostList();
  tags.push(...uniq(flat(allPostList.map(post => post.meta.tags))));
  return tags;
}
