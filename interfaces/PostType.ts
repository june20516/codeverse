export interface PostMeta {
  thumbnail: string;
  title: string;
  author: string;
  date: string;
  description?: string;
  cardImage: string;
}

export interface PostSummary {
  meta: PostMeta;
  slug: string;
}

export interface Post extends PostSummary {
  content: string;
  lastmod?: string;
  tags?: string[];
}
