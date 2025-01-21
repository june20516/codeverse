import theme from '@/styles/theme';
import { GlobalStyles } from '@mui/material';

const GlobalCssVariables = () => {
  return (
    <GlobalStyles
      styles={`
          :root {
            --mui-palette-primary-main: ${theme.palette.primary.main};
            --mui-palette-secondary-main: ${theme.palette.secondary.main};
            --mui-palette-info-main: ${theme.palette.info.main};
            --mui-palette-error-main: ${theme.palette.error.main};
            --mui-palette-background-default: ${theme.palette.background.default};
            --mui-palette-action-active: ${theme.palette.action.active};
            --mui-palette-action-disabled: ${theme.palette.action.disabled};
            --mui-palette-text-primary: ${theme.palette.text.primary};
            --mui-palette-text-secondary: ${theme.palette.text.secondary};
            --mui-palette-text-disabled: ${theme.palette.text.disabled};
            --mui-palette-divider: ${theme.palette.divider};
            --mui-typography-fontFamily: ${theme.typography.fontFamily};
          }
        `}
    />
  );
};

export default GlobalCssVariables;
