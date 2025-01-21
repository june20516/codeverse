'use client';

import { PostSummary } from '@/interfaces/PostType';
import { Box, ListItem, Typography, useTheme } from '@mui/material';
import Link from 'next/link';

const PostListItem = ({
  post,
  hasThumbnail = true,
}: {
  post: PostSummary;
  hasThumbnail?: boolean;
}) => {
  const theme = useTheme();
  return (
    <Link href={`drafts/${post.slug}`}>
      <ListItem
        sx={{
          width: '100%',
          mt: 4,
          borderBottom: '1px dashed',
          borderColor: theme.palette.divider,
          display: 'flex',
          flexDirection: 'column',
          px: 5,
        }}>
        {hasThumbnail ? (
          <Box
            style={{
              backgroundImage: `url(${post.meta.thumbnail})`,
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
            }}
            sx={{ width: '100%', height: '18rem', mx: 'auto' }}
          />
        ) : null}
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            my: 3,
            pb: 2,
            gap: 1,
          }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant="subtitle1">{post.meta.title}</Typography>
            <Typography variant="subtitle2" color="textSecondary">
              {post.meta.description ? post.meta.description : null}
            </Typography>
          </Box>
          <Typography
            variant="subtitle2"
            color="textSecondary"
            fontStyle={'italic'}
            sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'start' }}>
            {post.meta.date}
          </Typography>
        </Box>
      </ListItem>
    </Link>
  );
};

export default PostListItem;
