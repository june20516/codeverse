'use client';

import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material';
import ArticleContainer from './ArticleContainer';

const HomeContent = () => {
  const theme = useTheme();

  return (
    <ArticleContainer>
      <Box sx={{ py: { xs: 4, sm: 8 } }}>
      <Typography
        variant="h1"
        sx={{
          mb: 4,
          fontSize: { xs: '2.25rem', sm: '2.75rem', md: '3rem' },
          lineHeight: { xs: 1.3, sm: 1.2 },
        }}>
        안녕하세요, 저는 Bran입니다
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: theme.palette.text.secondary,
          mb: 3,
          lineHeight: { xs: 1.7, sm: 1.8 },
          fontSize: { xs: '1rem', sm: '1.0625rem' },
        }}>
        개발하면서 배운 것들을 기록하고 공유하는 공간입니다.
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: theme.palette.text.secondary,
          lineHeight: { xs: 1.7, sm: 1.8 },
          fontSize: { xs: '1rem', sm: '1.0625rem' },
        }}>
        주로 웹 개발, 타입스크립트, 그리고 일상에서 마주하는 기술적 문제들에 대해 씁니다.
      </Typography>
      </Box>
    </ArticleContainer>
  );
};

export default HomeContent;
