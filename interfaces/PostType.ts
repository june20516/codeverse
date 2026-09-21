export interface PostMeta {
  thumbnail: string;
  title: string;
  author: string;
  date: string;
  description?: string;
  cardImage: string;
  tags?: string[];
  series?: string;
  seriesOrder?: number;
}

export interface PostSummary {
  meta: PostMeta;
  slug: string;
}

export interface Post extends PostSummary {
  content: string;
  lastmod?: string;
}

export interface SeriesEntry {
  slug: string;
  title: string;
  order: number;
  isCurrent: boolean;
}

export interface SeriesNavigation {
  name: string;
  entries: SeriesEntry[];
  previous?: SeriesEntry;
  next?: SeriesEntry;
}
