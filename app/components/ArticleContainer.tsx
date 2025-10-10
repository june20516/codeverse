import { Box } from '@mui/material';
import { ReactNode } from 'react';

interface ArticleContainerProps {
  children: ReactNode;
  maxWidth?: string;
}

const ArticleContainer = ({ children, maxWidth = '720px' }: ArticleContainerProps) => {
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth,
        mx: 'auto',
      }}>
      {children}
    </Box>
  );
};

export default ArticleContainer;
