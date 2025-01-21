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
    divider: '#5158d9',
    primary: {
      main: '#B782F4',
    },
    secondary: {
      main: '#EF89E1',
    },
    action: {
      active: '#F4A261',
      disabled: '#1E299E',
    },
    info: {
      main: '#5158d9',
    },
    error: {
      main: '#EA3786',
    },
    background: {
      default: '#080046',
    },
    text: {
      primary: '#B782F4',
      secondary: '#EF89E1',
      disabled: '#1E299E',
    },
  },
  components: {
    MuiTypography: {
      defaultProps: {
        color: 'text.primary', // 기본 텍스트 색상을 text.primary로 설정
      },
    },
  },
});

export const pxToRem = theme.typography.pxToRem;

export default theme;
