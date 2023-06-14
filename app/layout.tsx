import Link from 'next/link';
import './globals.css';
import { Inter } from 'next/font/google';
import LeftSideBar from './components/LeftSideBar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export const sideBarMenu = [
  { name: 'Posts', href: '/' },
  { name: 'About Me', href: '/about' },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="flex items-center px-8">
          <Link href="/">
            <h1 className="text-3xl font-bold">Codeverse</h1>
          </Link>
        </header>
        <LeftSideBar menuList={sideBarMenu} />
        <main className="overflow-auto">{children}</main>
      </body>
    </html>
  );
}
