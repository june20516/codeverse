import { createTheme } from '@mui/material';

// TypeScript module augmentation for custom theme properties
declare module '@mui/material/styles' {
  interface TypeText {
    tertiary: string;
  }

  interface TypographyVariants {
    micro: React.CSSProperties;
    small: React.CSSProperties;
    label: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    micro?: React.CSSProperties;
    small?: React.CSSProperties;
    label?: React.CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    micro: true;
    small: true;
    label: true;
  }
}

// Linear-inspired design system
const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
    },
  },
  typography: {
    fontFamily:
      'Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    // Display styles
    h1: {
      fontSize: '3rem', // 48px
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '2.25rem', // 36px
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '1.875rem', // 30px
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontSize: '1.5rem', // 24px
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem', // 20px
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1.125rem', // 18px
      fontWeight: 600,
      lineHeight: 1.5,
    },
    // Body styles
    body1: {
      fontSize: '1rem', // 16px
      lineHeight: 1.7,
      fontWeight: 400,
    },
    body2: {
      fontSize: '0.875rem', // 14px
      lineHeight: 1.6,
      fontWeight: 400,
    },
    // Utility styles
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    caption: {
      fontSize: '0.75rem', // 12px
      lineHeight: 1.5,
      fontWeight: 400,
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 500,
      textTransform: 'none',
      letterSpacing: '0',
    },
    // Custom typography variants for consistent sizing
    micro: {
      fontSize: '0.8125rem', // 13px - for small labels, meta info
      lineHeight: 1.5,
      fontWeight: 400,
    },
    small: {
      fontSize: '0.9375rem', // 15px - between body2 and body1
      lineHeight: 1.6,
      fontWeight: 400,
    },
    label: {
      fontSize: '1.0625rem', // 17px - for slightly larger labels
      lineHeight: 1.5,
      fontWeight: 500,
    },
  },
  palette: {
    mode: 'light',
    // Primary grayscale
    primary: {
      main: '#171717', // near black
      light: '#404040',
      dark: '#000000',
    },
    secondary: {
      main: '#737373', // neutral-500
      light: '#a3a3a3',
      dark: '#525252',
    },
    // Background colors
    background: {
      default: '#ffffff',
      paper: '#fafafa',
    },
    // Text colors - grayscale hierarchy
    text: {
      primary: '#171717', // main text - near black
      secondary: '#737373', // secondary text - neutral-500
      tertiary: '#a3a3a3', // tertiary text - neutral-400
      disabled: '#d4d4d4', // disabled text - neutral-300
    },
    // Dividers and borders
    divider: '#e5e5e5',
    // Accent color (minimal use)
    info: {
      main: '#3b82f6', // blue-500
      light: '#60a5fa',
      dark: '#2563eb',
    },
    success: {
      main: '#10b981', // green-500
      light: '#34d399',
      dark: '#059669',
    },
    warning: {
      main: '#f59e0b', // amber-500
      light: '#fbbf24',
      dark: '#d97706',
    },
    error: {
      main: '#ef4444', // red-500
      light: '#f87171',
      dark: '#dc2626',
    },
    // Action colors
    action: {
      active: '#171717',
      hover: 'rgba(0, 0, 0, 0.04)',
      selected: 'rgba(0, 0, 0, 0.08)',
      disabled: '#d4d4d4',
      disabledBackground: '#f5f5f5',
    },
  },
  spacing: 8, // 8px base unit
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiTypography: {
      defaultProps: {
        color: 'text.primary',
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          padding: '8px 16px',
          fontWeight: 500,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

export const pxToRem = theme.typography.pxToRem;

export default theme;
