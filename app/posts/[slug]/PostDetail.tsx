'use client';

import { useScrollStore } from '@/app/stores/scroll';
import { Post, PostMeta } from '@/interfaces/PostType';
import { useRef } from 'react';
import { Box, Icon, Typography } from '@mui/material';
import { FormatQuote } from '@mui/icons-material';

interface PostDetailProps {
  post: Post;
  meta: PostMeta;
  content: string;
}

const PostDetail = ({ post, meta, content }: PostDetailProps) => {
  const titleRef = useRef<HTMLDivElement>(null);
  const { isStickTop } = useScrollStore();
  console.log('isStickTop', isStickTop);

  return (
    <Box component={'article'}>
      <Box
        ref={titleRef}
        sx={{
          fontWeight: 'bold',
          textAlign: 'center',
          p: 5,
          maxHeight: '24rem',
          minHeight: 'fit-content',
          transition: 'all 0.3s',
          position: 'relative',
        }}>
        <Typography
          variant="subtitle1"
          sx={{
            ...(isStickTop
              ? {}
              : {
                  position: 'sticky',
                  top: '5px',
                  fontSize: '1.25rem',
                  zIndex: 1000,
                }),
          }}>
          {post.meta.title}
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{
            textAlign: 'right',
            fontStyle: 'italic',
          }}>
          - {meta.date}
        </Typography>
      </Box>

      {meta.description && (
        <Box
          sx={{
            boxSizing: 'border-box',
            width: '100%',
            p: 4,
          }}>
          <Typography variant="body1" color="info">
            <FormatQuote />
            {meta.description}
          </Typography>
        </Box>
      )}

      {meta.thumbnail && (
        <Box
          component="img"
          src={`/${meta.thumbnail}`}
          sx={{
            width: '90%',
            margin: 'auto',
            display: 'block',
          }}
          alt="thumbnail"
          loading="lazy"
        />
      )}
      <Box
        className="markdown-body post"
        sx={{ mb: 2 }}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </Box>
  );
};

export default PostDetail;
