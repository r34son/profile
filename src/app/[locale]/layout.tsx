import { PropsWithChildren } from 'react';
import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { notFound } from 'next/navigation';
import { GoogleTagManager } from '@next/third-parties/google';
import { Inter } from 'next/font/google';
import { Navbar, NavbarContent, NavbarItem } from '@nextui-org/react';
import { NextIntlClientProvider, createTranslator } from 'next-intl';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { Providers } from './providers';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

interface LayoutProps {
  params: {
    locale: 'en' | 'ru';
  };
}

export default async function RootLayout({
  children,
  params: { locale },
}: PropsWithChildren<LayoutProps>) {
  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }
  return (
    <html suppressHydrationWarning lang={locale} className="dark">
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
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
          </NextIntlClientProvider>
        </Providers>
      </body>
      <GoogleTagManager gtmId="GTM-MW45T8L4" />
    </html>
  );
}

export const generateStaticParams = () => [{ locale: 'en' }, { locale: 'ru' }];

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
  ],
  colorScheme: 'dark light',
};

const url = 'https://github.com/r34son';

const mapLocaleToOG = {
  en: 'en_US',
  ru: 'ru_RU',
};

export const generateMetadata = async ({ params: { locale } }: LayoutProps) => {
  const messages = (await import(`../../messages/${locale}.json`)).default;
  const t = createTranslator({ locale, messages });

  const title = t('metadata.title');
  const description = t('metadata.description');
  const name = t('metadata.name');
  const applicationName = t('metadata.applicationName');

  return {
    applicationName,
    authors: [{ name, url }],
    keywords: ['profile', 'developer', 'dev', 'innovation'],
    referrer: 'origin',
    creator: name,
    publisher: name,
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: applicationName,
      locale: mapLocaleToOG[locale],
      alternateLocale: Object.values(mapLocaleToOG).filter(
        (loc) => loc !== mapLocaleToOG[locale],
      ),
      type: 'profile',
    },
    twitter: {
      title,
      description,
      creator: name,
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: 'black-translucent',
    },
    verification: {
      other: {
        me: ['seitasanov.yahub@gmail.com', url],
      },
    },
    category: 'technology',
  } as Metadata;
};
