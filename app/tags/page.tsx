import { getAllTags } from '@/lib/staticFileApi';
import { NextPage } from 'next';
import SearchableTagPanel from './components/SearchableTagPanel';
import { Metadata } from 'next';
import { getMetaTitle, getMetaThumbnail } from '@/lib/meta';

const title = getMetaTitle('Tags');
const description = '태그로 포스트 찾기';
export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    images: [{ url: getMetaThumbnail() }],
    siteName: "Bran's codeverse",
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [{ url: getMetaThumbnail() }],
    site: '@codeverse',
  },
};

const Tags: NextPage = () => {
  const tags: string[] = getAllTags();

  return <SearchableTagPanel tags={tags} />;
};

export default Tags;
