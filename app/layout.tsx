import Link from 'next/link';
import './globals.css';
import LeftSideBar from './layouts/LeftSideBar';
import Image from 'next/image';
import Script from 'next/script';
import Head from 'next/head';
import { Suspense } from 'react';
import GtagNavigationEvents from './components/GtagNavigationEvents';
import GA_MEASUREMENT_ID from '@/lib/gtag';

const metadata = {
  title: "Bran's codeverse",
  description: 'we are little dusts in the galaxy full of code',
};

const sideBarMenu = [
  { name: 'Posts', href: '/posts' },
  { name: 'About Me', href: '/about' },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} />
      <Script
        id="google-analytics"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
   
            gtag('config', ${GA_MEASUREMENT_ID});
          `,
        }}
      />
      <body>
        <header className="px-8 flex items-center">
          <Link href="/" className="flex items-center">
            <div className="relative w-10 aspect-square mr-4">
              <Image src={'assets/images/codeverse_icon.png'} fill alt="icon of codeverse" />
            </div>
            <h1 className="text-3xl font-bold">Codeverse</h1>
          </Link>
        </header>
        <LeftSideBar menuList={sideBarMenu} />
        <main className="overflow-auto">{children}</main>
        <Suspense fallback={null}>
          <GtagNavigationEvents />
        </Suspense>
      </body>
    </html>
  );
}
