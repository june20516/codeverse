import { Metadata } from 'next';
import { getMetaTitle, getMetaThumbnail } from '@/lib/meta';
import { getLabItemById } from '@/lib/labData';
import ScrambleText from './ScrambleText';
import ScrambleTextContainer from './ScrambleTextContainer';

const labItem = getLabItemById('scramble-text');

export const metadata: Metadata = {
  title: getMetaTitle(labItem?.title || "Bran's Lab"),
  description: labItem?.description || '여러가지 주제로 작업해본 결과물들을 소개합니다',
  openGraph: {
    title: getMetaTitle(labItem?.title || "Bran's Lab"),
    description: labItem?.description,
    images: [{ url: getMetaThumbnail(labItem?.thumbnail) }],
    siteName: "Bran's codeverse",
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: getMetaTitle(labItem?.title || "Bran's Lab"),
    description: labItem?.description,
    images: [getMetaThumbnail(labItem?.thumbnail)],
    site: '@codeverse',
  },
};

const ScrambleTextPage = () => {
  return (
    <div>
      <ScrambleTextContainer />
    </div>
  );
};

export default ScrambleTextPage;
