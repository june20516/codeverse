'use client';

import { Post, PostMeta } from '@/interfaces/PostType';
import { Box, Link, Typography, useTheme } from '@mui/material';
import ArticleContainer from '@/app/components/ArticleContainer';
import { getMetaThumbnail } from '@/lib/meta';
import TagToken from '@/app/tags/components/TagToken';

interface PostDetailProps {
  post: Post;
  meta: PostMeta;
  content: string;
}

const PostDetail = ({ post, meta, content }: PostDetailProps) => {
  const theme = useTheme();
  const thumbnail = getMetaThumbnail(meta.thumbnail);

  const thumbnailContainerStyle = {
    width: '100%',
    height: { xs: '200px', sm: '300px', md: '400px' },
    mb: { xs: 4, sm: 6 },
    borderRadius: 3,
    overflow: 'hidden',
    backgroundColor: theme.palette.grey[100],
  };

  const thumbnailImageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
  };

  const headerStyle = {
    mb: { xs: 6, sm: 8 },
    pb: { xs: 3, sm: 4 },
    borderBottom: `1px solid ${theme.palette.divider}`,
  };

  return (
    <ArticleContainer>
      <Box component="article">
        {/* Thumbnail */}
        <Box sx={thumbnailContainerStyle}>
          <img src={thumbnail} alt={meta.title} style={thumbnailImageStyle} />
        </Box>

        {/* Header */}
        <Box component="header" sx={headerStyle}>
          <Typography
            variant="h1"
            sx={{
              mb: 3,
              fontSize: {
                xs: theme.typography.h3.fontSize,
                sm: theme.typography.h2.fontSize,
                md: '2.5rem',
              },
              lineHeight: { xs: 1.3, sm: 1.2 },
            }}>
            {post.meta.title}
          </Typography>

          {meta.description && (
            <Typography
              variant="body1"
              sx={{
                color: theme.palette.text.secondary,
                mb: 3,
                lineHeight: { xs: 1.7, sm: 1.8 },
                fontSize: {
                  xs: theme.typography.small.fontSize,
                  sm: theme.typography.body1.fontSize,
                },
              }}>
              {meta.description}
            </Typography>
          )}

          <Typography
            variant="micro"
            sx={{
              color: theme.palette.text.tertiary,
            }}>
            {meta.date}
          </Typography>
        </Box>

        {/* Content */}
        <Box className="markdown-body post" dangerouslySetInnerHTML={{ __html: content }} />

        {/* Tags */}
        {meta.tags && meta.tags.length > 0 && (
          <Box
            sx={{
              mt: 6,
              pt: 4,
              borderTop: `1px solid ${theme.palette.divider}`,
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1,
            }}>
            <Typography
              variant="micro"
              sx={{
                color: theme.palette.text.tertiary,
                verticalAlign: 'middle',
              }}>
              Tags
            </Typography>
            {meta.tags.map((tag, index) => (
              <Link key={index} href={`/tags/${tag.toLowerCase()}`}>
                <TagToken tag={tag} />
              </Link>
            ))}
          </Box>
        )}

        {/* Comments */}
        <Box
          sx={{
            mt: 8,
            pt: 6,
            borderTop: `1px solid ${theme.palette.divider}`,
          }}>
          <div data-orb-container data-widget-type="comments" data-post-slug={post.slug} />
        </Box>
      </Box>
    </ArticleContainer>
  );
};

export default PostDetail;
