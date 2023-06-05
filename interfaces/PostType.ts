export interface PostSummary {
  title: string;
  author: string;
  date: string;
  slug: string;
}

export interface Post extends PostSummary {
  content: string;
  description?: string;
  lastmod?: string;
  tags?: string[];
}
