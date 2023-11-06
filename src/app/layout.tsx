import type { Metadata, Viewport } from 'next';
import { GoogleTagManager } from '@next/third-parties/google';
import { Inter } from 'next/font/google';
import { Navbar, NavbarContent, NavbarItem } from '@nextui-org/react';
import { Providers } from '@/app/providers';
import { ThemeSwitcher } from '@/app/components/ThemeSwitcher';
import './globals.css';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
  ],
  colorScheme: 'dark light',
};

const title = 'Profile | Iakhub Seitasanov';
const description =
  'Explore the profile of Iakhub Seitasanov, a tech enthusiast with a passion for software development and innovation. Stay updated with his insights and latest projects.';
const name = 'Iakhub Seitasanov';
const appName = 'Iakhub Seitasanov Profile';
const url = 'https://github.com/r34son';

export const metadata: Metadata = {
  applicationName: appName,
  authors: [
    { name, url },
    { name: 'Яхуб Сеитасанов', url },
  ],
  keywords: ['profile', 'developer', 'dev', 'innovation'],
  referrer: 'origin',
  creator: name,
  publisher: name,
  // robots: '',
  icons: [
    { rel: 'icon', url: 'https://example.com/icon.png' },
    { rel: 'apple-touch-icon', url: 'https://example.com/apple-icon.png' },
  ],
  title,
  description,
  openGraph: {
    title,
    description,
    url,
    siteName: appName,
    locale: 'en_US',
    alternateLocale: 'ru_RU',
    type: 'profile',
  },
  twitter: {
    title,
    description,
    // siteId: '1467726470533754880',
    creator: name,
    // creatorId: '1467726470533754880',
  },
  verification: {
    // google: 'google',
    // yandex: 'yandex',
    // yahoo: 'yahoo',
    other: {
      me: ['seitasanov.yahub@gmail.com', url],
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
        <Script id="metrika-counter">
          {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)}; m[i].l=1*new Date(); for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }} k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)}) (window, document, "script", "https://cdn.jsdelivr.net/npm/yandex-metrica-watch/tag.js", "ym"); ym(95478689, "init", { clickmap:true, trackLinks:true, accurateTrackBounce:true, webvisor:true });`}
        </Script>
        <noscript>
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://mc.yandex.ru/watch/95478689"
              style={{ position: 'absolute', left: -9999 }}
              alt=""
            />
          </div>
        </noscript>
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
      <GoogleTagManager gtmId="GTM-MW45T8L4" />
    </html>
  );
}
