import { getAboutMe } from '@/lib/staticFileApi';
import AboutDetail from './components/AboutDetail';
import markdownToHtml from '@/lib/markdownToHTML';
import { Metadata } from 'next';
import { getMetaTitle, getMetaThumbnail } from '@/lib/meta';

const title = getMetaTitle('About');
const description = '저를 소개합니다';
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

const About = async () => {
  const content = getAboutMe();
  const htmlContent = await markdownToHtml(content || '');
  return <AboutDetail content={htmlContent} />;
};

export default About;
