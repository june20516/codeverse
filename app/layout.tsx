'use client';

import Link from 'next/link';
import './globals.css';
import LeftSideBar from './layouts/MenuBar';
import Image from 'next/image';
import Script from 'next/script';
import { Suspense, useRef } from 'react';
import GtagNavigationEvents from './components/GtagNavigationEvents';
import Head from 'next/head';
import { useTrackScrollPositions } from './hooks/useTrackScrollPositions';
import Header from './components/Header';
import { ThemeProvider } from '@mui/material';
import theme from '@/styles/theme';

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
        <body>
          <Header layoutStyle={{ gridRowStart: 1 }} />
          <main>
            <LeftSideBar menuList={sideBarMenu} />
            <section ref={wrapperRef} className="overflow-auto">
              {children}
            </section>
          </main>

          <Suspense fallback={null}>
            <GtagNavigationEvents />
          </Suspense>
        </body>
      </html>
    </ThemeProvider>
  );
};

export default RootLayout;
