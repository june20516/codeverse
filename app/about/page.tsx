import { getAboutMe } from '@/lib/staticFileApi';
import AboutDetail from './components/AboutDetail';
import markdownToHtml from '@/lib/markdownToHTML';
import { NextPage } from 'next';

const About = async () => {
  const content = getAboutMe();
  const htmlContent = await markdownToHtml(content || '');
  return <AboutDetail content={htmlContent} />;
};

export default About;
