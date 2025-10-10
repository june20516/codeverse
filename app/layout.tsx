'use client';

import './globals.css';

import { Box, ThemeProvider } from '@mui/material';
import Script from 'next/script';
import { Suspense, useRef } from 'react';

import theme from '@/styles/theme';

import GtagNavigationEvents from './components/GtagNavigationEvents';
import Header from './components/Header';
import { useTrackScrollPositions } from './hooks/useTrackScrollPositions';
import GlobalCssVariables from './components/GlobalCssVariables';

const sideBarMenu = [
  { name: 'Posts', href: '/posts' },
  { name: 'Tags', href: '/tags' },
  { name: 'Lab', href: '/lab' },
  { name: 'About', href: '/about' },
];

const GA_MEASUREMENT_ID = process.env['GA_MEASUREMENT_ID'];

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const wrapperRef = useRef<HTMLElement>(null);
  useTrackScrollPositions(wrapperRef);
  return (
    <ThemeProvider theme={theme}>
      <GlobalCssVariables />
      <html lang="en">
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} />
        <Script
          id="google-analytics"
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
   
            gtag('config', '${GA_MEASUREMENT_ID}');
          `,
          }}
        />
        <Box
          component={'body'}
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: theme.palette.background.default,
          }}>
          <Header menuList={sideBarMenu} />
          <Box
            component="main"
            ref={wrapperRef}
            sx={{
              flex: 1,
              width: '100%',
              maxWidth: '1024px',
              mx: 'auto',
              px: { xs: 3, sm: 4, md: 6 },
              py: 6,
            }}>
            {children}
          </Box>

          <Suspense fallback={null}>
            <GtagNavigationEvents />
          </Suspense>
        </Box>
      </html>
    </ThemeProvider>
  );
};

export default RootLayout;
