import { Metadata } from 'next';

import SpaceToday from '@/app/components/SpaceToday/SpaceToday';
import { getLabItemById } from '@/lib/labData';
import { buildSiteUrl, getMetaTitle, getMetaThumbnail, metadataBase } from '@/lib/meta';

const labItem = getLabItemById('space-today');

export const metadata: Metadata = {
  metadataBase,
  title: getMetaTitle(labItem?.title || 'Space Today'),
  description: labItem?.description || 'NASA APOD API를 활용한 우주 사진 갤러리',
  alternates: { canonical: buildSiteUrl(['lab', 'space-today']) },
  openGraph: {
    title: getMetaTitle(labItem?.title || 'Space Today'),
    description: labItem?.description,
    images: [{ url: getMetaThumbnail(labItem?.thumbnail) }],
    siteName: "Bran's codeverse",
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: getMetaTitle(labItem?.title || 'Space Today'),
    description: labItem?.description,
    images: [getMetaThumbnail(labItem?.thumbnail)],
    site: '@codeverse',
  },
};

const SpaceTodayPage = () => {
  return <SpaceToday />;
};

export default SpaceTodayPage;
