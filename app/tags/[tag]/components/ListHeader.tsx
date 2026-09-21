'use client';

import { Box, Typography } from '@mui/material';

import { pxToRem } from '@/styles/theme';

import TagToken from '../../components/TagToken';

const ListHeader = ({ tag, count }: { tag: string; count: number }) => (
  <Box sx={{ display: 'flex' }}>
    <TagToken tag={tag} />
    <Typography variant="body1">가 태그된 글 목록 -</Typography>
    <Typography variant="body1" fontStyle={'italic'} color="textPrimary" sx={{ px: pxToRem(5) }}>
      {count}
    </Typography>
    <Typography variant="body1">개</Typography>
  </Box>
);

export default ListHeader;
