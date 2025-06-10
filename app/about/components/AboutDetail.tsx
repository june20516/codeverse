'use client';

import { Box, Typography } from '@mui/material';
import '../styles.css';

interface AboutDetailProps {
  content: string;
}

const AboutDetail = ({ content }: AboutDetailProps) => {
  return (
    <Box>
      <Typography variant="h1">Bran</Typography>

      <Box
        className="markdown-body post"
        sx={{ mb: 2 }}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </Box>
  );
};

export default AboutDetail;
