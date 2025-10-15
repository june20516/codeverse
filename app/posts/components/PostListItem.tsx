'use client';

import { PostSummary } from '@/interfaces/PostType';
import { Box, Typography, useTheme } from '@mui/material';
import Link from 'next/link';
import { getMetaThumbnail } from '@/lib/meta';

interface PostListItemProps {
  post: PostSummary;
  baseUrl?: string;
}

const PostListItem = ({ post, baseUrl = 'posts' }: PostListItemProps) => {
  const theme = useTheme();
  const thumbnail = getMetaThumbnail(post.meta.thumbnail);

  const containerStyle = {
    py: 3,
    borderBottom: `1px solid ${theme.palette.divider}`,
    transition: 'all 0.2s ease',
    '&:hover': {
      borderBottomColor: theme.palette.text.tertiary,
    },
    '&:hover .post-title': {
      color: theme.palette.primary.main,
    },
  };

  const contentWrapperStyle = {
    display: 'flex',
    gap: 3,
    alignItems: 'flex-start',
  };

  const thumbnailStyle = {
    width: { xs: '80px', sm: '120px' },
    height: { xs: '80px', sm: '120px' },
    borderRadius: 2,
    overflow: 'hidden',
    flexShrink: 0,
    backgroundColor: theme.palette.grey[100],
  };

  const thumbnailImageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
  };

  const textContentStyle = {
    flex: 1,
    minWidth: 0,
  };

  return (
    <Link href={`${baseUrl}/${post.slug}`} style={{ textDecoration: 'none' }}>
      <Box sx={containerStyle}>
        <Box sx={contentWrapperStyle}>
          {/* Thumbnail */}
          <Box sx={thumbnailStyle}>
            <img src={thumbnail} alt={post.meta.title} style={thumbnailImageStyle} />
          </Box>

          {/* Text Content */}
          <Box sx={textContentStyle}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                gap: 2,
                mb: 1,
              }}>
              <Typography
                className="post-title"
                variant="h6"
                sx={{
                  fontWeight: 500,
                  color: theme.palette.text.primary,
                  transition: 'color 0.2s ease',
                  fontSize: {
                    xs: theme.typography.label.fontSize,
                    sm: theme.typography.h6.fontSize,
                  },
                }}>
                {post.meta.title}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.text.tertiary,
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  display: { xs: 'none', sm: 'block' },
                }}>
                {post.meta.date}
              </Typography>
            </Box>

            {post.meta.description && (
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  lineHeight: 1.6,
                  mb: { xs: 1, sm: 0 },
                }}>
                {post.meta.description}
              </Typography>
            )}

            <Typography
              variant="caption"
              sx={{
                color: theme.palette.text.tertiary,
                display: { xs: 'block', sm: 'none' },
              }}>
              {post.meta.date}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Link>
  );
};

export default PostListItem;
