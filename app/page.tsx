import { NextPage } from 'next';
import { Metadata } from 'next';
import HomeContent from './components/HomeContent';
import { getMetaTitle, getMetaThumbnail } from '@/lib/meta';

const title = getMetaTitle();
const description = '개발하면서 배운 것들을 기록하고 공유하는 공간입니다';
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

const Home: NextPage = () => {
  return <HomeContent />;
};

export default Home;
