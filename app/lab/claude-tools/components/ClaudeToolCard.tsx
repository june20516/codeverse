'use client';

import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import GitHubIcon from '@mui/icons-material/GitHub';
import NorthEastRoundedIcon from '@mui/icons-material/NorthEastRounded';
import { Box, Button, Typography, useTheme } from '@mui/material';
import Link from 'next/link';

import { ClaudeToolWithPosts } from '@/lib/claudeToolsData';

import CopyableCommand from './CopyableCommand';

interface ClaudeToolCardProps {
  tool: ClaudeToolWithPosts;
}

const ClaudeToolCard = ({ tool }: ClaudeToolCardProps) => {
  const theme = useTheme();

  const cardStyle = {
    p: { xs: 3, sm: 4 },
    borderRadius: 3,
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.default,
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    '&:hover': {
      borderColor: theme.palette.text.tertiary,
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)',
    },
  };

  const versionBadgeStyle = {
    px: 1,
    py: 0.25,
    borderRadius: 1,
    backgroundColor: theme.palette.grey[100],
    color: theme.palette.text.secondary,
  };

  const highlightItemStyle = {
    position: 'relative',
    pl: 2.5,
    '&::before': {
      content: '""',
      position: 'absolute',
      left: 4,
      top: '0.65em',
      width: 6,
      height: 6,
      borderRadius: '50%',
      backgroundColor: theme.palette.info.main,
    },
  };

  const sectionLabelStyle = {
    mb: 1,
    color: theme.palette.text.tertiary,
    fontWeight: 500,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  };

  const relatedPostButtonStyle = {
    justifyContent: 'flex-start',
    textAlign: 'left',
    borderColor: theme.palette.divider,
    color: theme.palette.text.primary,
    '&:hover': {
      borderColor: theme.palette.text.tertiary,
      backgroundColor: theme.palette.action.hover,
    },
  };

  return (
    <Box component="article" sx={cardStyle}>
      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1.5, mb: 1 }}>
        <Typography variant="h5" component="h2">
          {tool.name}
        </Typography>
        <Typography variant="caption" sx={versionBadgeStyle}>
          v{tool.version}
        </Typography>
      </Box>

      <Typography variant="label" component="p" sx={{ mb: 1 }}>
        {tool.tagline}
      </Typography>
      <Typography variant="body2" sx={{ mb: 3, color: theme.palette.text.secondary }}>
        {tool.description}
      </Typography>

      <Box
        component="ul"
        sx={{ listStyle: 'none', p: 0, m: 0, mb: 3, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {tool.highlights.map(highlight => (
          <Typography key={highlight} component="li" variant="small" sx={highlightItemStyle}>
            {highlight}
          </Typography>
        ))}
      </Box>

      <Typography variant="micro" component="p" sx={sectionLabelStyle}>
        Install
      </Typography>
      <CopyableCommand commands={tool.installCommands} />

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 3 }}>
        <Button
          component="a"
          href={tool.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          variant="contained"
          disableElevation
          startIcon={<GitHubIcon />}
          endIcon={<NorthEastRoundedIcon sx={{ fontSize: '1rem !important' }} />}>
          GitHub
        </Button>
        {tool.relatedPosts.map(post => (
          <Button
            key={post.slug}
            component={Link}
            href={`/posts/${post.slug}`}
            variant="outlined"
            startIcon={<ArticleOutlinedIcon />}
            sx={relatedPostButtonStyle}>
            {post.title}
          </Button>
        ))}
      </Box>
    </Box>
  );
};

export default ClaudeToolCard;
