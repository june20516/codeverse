'use client';

import './globals.css';

import { Box, Grid2, ThemeProvider } from '@mui/material';
import Head from 'next/head';
import Script from 'next/script';
import { Suspense, useRef } from 'react';

import theme, { pxToRem } from '@/styles/theme';

import GtagNavigationEvents from './components/GtagNavigationEvents';
import Header from './components/Header';
import { useTrackScrollPositions } from './hooks/useTrackScrollPositions';
import MenuBar from './layouts/MenuBar';
import { Global } from '@emotion/react';
import GlobalCssVariables from './components/GlobalCssVariables';

const metadata = {
  title: "Bran's codeverse",
  description: 'We are little dusts in the galaxy full of code',
};

const sideBarMenu = [
  { name: 'Posts', href: '/posts' },
  { name: 'Tags', href: '/tags' },
  { name: 'About Me', href: '/about' },
];

const GA_MEASUREMENT_ID = process.env['GA_MEASUREMENT_ID'];

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const wrapperRef = useRef<HTMLElement>(null);
  useTrackScrollPositions(wrapperRef);
  return (
    <ThemeProvider theme={theme}>
      <GlobalCssVariables />
      <html lang="en">
        <Head>
          <title>{metadata.title}</title>
          <meta name="description" content={metadata.description}></meta>
        </Head>
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
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: theme.palette.background.default,
          }}>
          <Header layoutStyle={{ height: '10%' }} />
          <Box
            component={'main'}
            sx={{
              height: '90%',
              width: theme.breakpoints.values.md,
              mx: 'auto',
              display: 'flex',
              flexDirection: 'column',
            }}>
            <MenuBar menuList={sideBarMenu} />
            <Box
              component="section"
              ref={wrapperRef}
              sx={{
                overflow: 'scroll',
                '::-webkit-scrollbar': {
                  display: 'none',
                },
                '-ms-overflow-style': 'none',
                // 'scrollbar-width': 'none',
              }}>
              {children}
            </Box>
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
