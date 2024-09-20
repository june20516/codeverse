'use client';

import { useScrollStore } from '@/app/stores/scroll';
import { Post, PostMeta } from '@/interfaces/PostType';
import { useRef } from 'react';
import { Box, Typography } from '@mui/material';

interface PostDetailProps {
  post: Post;
  meta: PostMeta;
  content: string;
}

const PostDetail = ({ post, meta, content }: PostDetailProps) => {
  const titleRef = useRef<HTMLDivElement>(null);
  const { isStickTop } = useScrollStore();

  return (
    <Box component={'article'} sx={{ position: 'relative' }}>
      <Box
        ref={titleRef}
        sx={{
          fontSize: '2rem',
          fontWeight: 'bold',
          textAlign: 'center',
          p: 5,
          backgroundColor: 'white',
          maxHeight: '24rem',
          minHeight: 'fit-content',
          transition: 'all 0.3s',
          position: 'relative',
        }}>
        <Typography
          component="span"
          sx={{
            ...(isStickTop
              ? {}
              : {
                  position: 'absolute',
                  top: '5px',
                  transform: 'translate(-50%, 50%)',
                  fontSize: '1.25rem',
                }),
          }}>
          {post.meta.title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontSize: '1rem',
            textAlign: 'right',
            fontStyle: 'italic',
            color: 'secondary.400',
          }}>
          - {meta.date}
        </Typography>
      </Box>

      <Box
        sx={{
          width: '100%',
          p: 4,
        }}>
        <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'secondary.600' }}>
          {meta.description}
        </Typography>
      </Box>

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

      <Box
        className="markdown-body post"
        sx={{ mt: 2 }}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </Box>
  );
};

export default PostDetail;
