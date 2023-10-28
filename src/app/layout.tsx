import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Navbar, NavbarContent, NavbarItem } from '@nextui-org/react';
import { Providers } from '@/app/providers';
import { ThemeSwitcher } from '@/app/components/ThemeSwitcher';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
  ],
  colorScheme: 'dark light',
};

export const metadata: Metadata = {
  applicationName: '',
  authors: [{ name: 'Next.js Team', url: 'https://nextjs.org' }],
  keywords: ['react', 'server components'],
  referrer: 'origin',
  creator: '',
  publisher: '',
  robots: '',
  icons: [
    { rel: 'icon', url: 'https://example.com/icon.png' },
    { rel: 'apple-touch-icon', url: 'https://example.com/apple-icon.png' },
  ],
  title: 'Iakhub Seitasanov',
  description: 'Profile',
  openGraph: {
    title: 'Next.js',
    description: 'The React Framework for the Web',
    url: 'https://nextjs.org',
    siteName: 'Next.js',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    title: 'Next.js',
    description: 'The React Framework for the Web',
    siteId: '1467726470533754880',
    creator: '@nextjs',
    creatorId: '1467726470533754880',
  },
  verification: {
    google: 'google',
    yandex: 'yandex',
    yahoo: 'yahoo',
    other: {
      me: ['my-email', 'my-link'],
    },
  },
  category: 'technology',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en" className="dark">
      <body className={inter.className}>
        <Providers>
          <Navbar position="static">
            <NavbarContent justify="end">
              <NavbarItem>
                <ThemeSwitcher />
              </NavbarItem>
            </NavbarContent>
          </Navbar>
          {children}
        </Providers>
      </body>
    </html>
  );
}
