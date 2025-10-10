import { NextPage } from 'next';
import { Metadata } from 'next';
import LabContent from './components/LabContent';
import { getMetaTitle, getMetaThumbnail } from '@/lib/meta';

const title = getMetaTitle('Lab');
const description = '여러가지 주제로 작업해본 결과물들을 소개합니다';
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

const Lab: NextPage = () => {
  return <LabContent />;
};

export default Lab;
