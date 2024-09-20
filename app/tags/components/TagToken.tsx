'use client';

import { Box, Typography } from '@mui/material';

const TagToken = ({ tag }: { tag: string }) => {
  return (
    <Box component={'code'} sx={{ px: 2, mr: 1, borderRadius: 1, bgcolor: 'whitesmoke' }}>
      <Typography component={'span'} color="primary">
        {tag}
      </Typography>
    </Box>
  );
};

export default TagToken;
