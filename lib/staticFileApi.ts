// blog-starter/lib/api.ts
import fs from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import { Post, SeriesEntry, SeriesNavigation } from '@/interfaces/PostType';
import { flat, uniq } from '@/utils';

const aboutMe = join(process.cwd(), '/manuscripts/about-me.md');

const postsDirectory = join(process.cwd(), '/manuscripts/posts');
const draftsDirectory = join(process.cwd(), '/manuscripts/drafts');

const postSlugList: string[] = [];
const draftPostSlugList: string[] = [];

const allPostList: Post[] = [];
const allDfratList: Post[] = [];

const tags: string[] = [];

export function getPostSlugs(options?: { isDraft?: boolean }) {
  const isDraft = options?.isDraft ?? false;
  const slugList = isDraft ? draftPostSlugList : postSlugList;
  const directory = isDraft ? draftsDirectory : postsDirectory;
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
  const directory = isDraft ? draftsDirectory : postsDirectory;
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
      .sort((post1, post2) => {
        const date1 = new Date(post1.meta.date);
        const date2 = new Date(post2.meta.date);
        return date2.getTime() - date1.getTime();
      }),
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
      .sort((post1, post2) => {
        const date1 = new Date(post1.meta.date);
        const date2 = new Date(post2.meta.date);
        return date2.getTime() - date1.getTime();
      }),
  );
  return allDfratList;
}

const readSeriesOrder = (post: Post): number => {
  const { seriesOrder } = post.meta;
  if (seriesOrder === undefined || !Number.isInteger(seriesOrder) || seriesOrder < 1) {
    throw new Error(
      `[series] ${post.slug}: seriesOrder는 1 이상의 정수여야 합니다. (현재 값: ${seriesOrder})`,
    );
  }
  return seriesOrder;
};

const toSeriesEntry = (seriesPost: Post, currentSlug: string): SeriesEntry => ({
  slug: seriesPost.slug,
  title: seriesPost.meta.title,
  order: readSeriesOrder(seriesPost),
  isCurrent: seriesPost.slug === currentSlug,
});

// 현재 글과, 발행된 글 중 같은 시리즈에 속한 다른 글을 순서대로 모은다.
// 현재 글이 draft여도 목록에 들어가므로 draft 미리보기에서도 시리즈 위치가 보인다.
export function getSeriesNavigation(post: Post): SeriesNavigation | undefined {
  const seriesName = post.meta.series;
  if (!seriesName) return undefined;

  const otherSeriesPosts = getAllPostList().filter(
    candidate => candidate.meta.series === seriesName && candidate.slug !== post.slug,
  );
  const entries = [...otherSeriesPosts, post]
    .map(seriesPost => toSeriesEntry(seriesPost, post.slug))
    .sort((entry1, entry2) => entry1.order - entry2.order);

  const duplicatedIndex = entries.findIndex(
    (entry, index) => index > 0 && entries[index - 1].order === entry.order,
  );
  if (duplicatedIndex !== -1) {
    const [first, second] = [entries[duplicatedIndex - 1], entries[duplicatedIndex]];
    throw new Error(
      `[series] ${seriesName}: ${first.slug}와 ${second.slug}의 seriesOrder(${second.order})가 겹칩니다.`,
    );
  }

  const currentIndex = entries.findIndex(entry => entry.isCurrent);
  return {
    name: seriesName,
    entries,
    previous: currentIndex > 0 ? entries[currentIndex - 1] : undefined,
    next: currentIndex < entries.length - 1 ? entries[currentIndex + 1] : undefined,
  };
}

export function getAllTags() {
  if (tags.length > 0) return tags;
  if (allPostList.length < 1) getAllPostList();
  tags.push(...uniq(flat(allPostList.map(post => post.meta.tags))));
  return tags;
}

export function getAboutMe() {
  const fileContents = fs.readFileSync(aboutMe, 'utf8');
  const { content } = matter(fileContents);
  return content;
}
