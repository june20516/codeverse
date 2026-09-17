'use client';

import { Box, Typography, useTheme } from '@mui/material';

import ArticleContainer from '@/app/components/ArticleContainer';
import { ClaudeToolWithPosts } from '@/lib/claudeToolsData';

import ClaudeToolCard from './ClaudeToolCard';

interface ClaudeToolsContentProps {
  tools: ClaudeToolWithPosts[];
}

const ClaudeToolsContent = ({ tools }: ClaudeToolsContentProps) => {
  const theme = useTheme();

  return (
    <ArticleContainer>
      <Box component="header" sx={{ mb: 5 }}>
        <Typography
          variant="micro"
          component="p"
          sx={{
            mb: 1,
            color: theme.palette.text.tertiary,
            fontWeight: 500,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}>
          Lab
        </Typography>
        <Typography variant="h3" component="h1" sx={{ mb: 1.5 }}>
          Claude Tools
        </Typography>
        <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
          Claude Code를 내 손에 맞게 쓰려고 만든 플러그인들
        </Typography>
      </Box>

      <Box
        component="ul"
        sx={{ listStyle: 'none', p: 0, m: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
        {tools.map(tool => (
          <Box component="li" key={tool.id}>
            <ClaudeToolCard tool={tool} />
          </Box>
        ))}
      </Box>
    </ArticleContainer>
  );
};

export default ClaudeToolsContent;
