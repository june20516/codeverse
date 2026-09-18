import { Metadata } from 'next';

import { claudeTools, ClaudeToolWithPosts } from '@/lib/claudeToolsData';
import { getLabItemById } from '@/lib/labData';
import { buildSiteUrl, getMetaThumbnail, getMetaTitle, metadataBase } from '@/lib/meta';
import { getPostBySlug, getPostSlugs } from '@/lib/staticFileApi';

import ClaudeToolsContent from './components/ClaudeToolsContent';

const labItem = getLabItemById('claude-tools');
const title = getMetaTitle(labItem?.title || 'Claude Tools');
const description = labItem?.description || 'Claude Code를 내 손에 맞게 쓰려고 만든 플러그인 모음';

export const metadata: Metadata = {
  metadataBase,
  title,
  description,
  alternates: { canonical: buildSiteUrl(['lab', 'claude-tools']) },
  openGraph: {
    title,
    description,
    images: [{ url: getMetaThumbnail(labItem?.thumbnail) }],
    siteName: "Bran's codeverse",
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [getMetaThumbnail(labItem?.thumbnail)],
    site: '@codeverse',
  },
};

// 아직 발행되지 않은 글은 링크하지 않는다
const attachPublishedPosts = (): ClaudeToolWithPosts[] => {
  const publishedSlugs = new Set(getPostSlugs());

  return claudeTools.map(tool => ({
    ...tool,
    relatedPosts: tool.relatedPostSlugs
      .filter(slug => publishedSlugs.has(slug))
      .map(slug => ({ slug, title: getPostBySlug({ slug }).meta.title })),
  }));
};

const ClaudeToolsPage = () => {
  return <ClaudeToolsContent tools={attachPublishedPosts()} />;
};

export default ClaudeToolsPage;
