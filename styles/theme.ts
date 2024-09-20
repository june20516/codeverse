import { createTheme } from '@mui/material';

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0, // 모바일
      sm: 600, // 태블릿
      md: 900, // 작은 데스크탑
      lg: 1200, // 큰 데스크탑
      xl: 1536,
    },
  },
  typography: {
    fontFamily: 'Pretendard, Arial, sans-serif',
    h1: {
      fontSize: '2rem',
      fontWeight: 'bold',
    },
    h2: {
      fontSize: '1.5rem',
    },
    subtitle1: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
    },
    subtitle2: {
      fontSize: '1.25rem',
    },
    body1: {
      fontSize: '1rem',
    },
    body2: {
      fontSize: '0.875rem',
    },
    caption: {
      fontSize: '0.75rem',
    },
  },
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: '#ff1744',
    },
    background: {
      default: '#f5f5f5',
    },
    text: {
      primary: '#333',
      secondary: '#666',
    },
  },
});

export default theme;
