import type { PropsWithChildren } from 'react';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { notFound } from 'next/navigation';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { GoogleTagManager } from '@next/third-parties/google';
import { Navbar, NavbarContent, NavbarItem } from '@nextui-org/react';
import { YMScript } from '@/components/YMScript';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { Locales, locales } from '@/lib/i18n';
import { Providers } from '../providers';

const inter = Inter({ subsets: ['latin'] });

interface LocaleLayoutProps {
  params: {
    locale: Locales;
  };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: PropsWithChildren<LocaleLayoutProps>) {
  if (!locales.includes(locale as any)) notFound();

  unstable_setRequestLocale(locale);

  return (
    <html suppressHydrationWarning lang={locale} className="dark">
      <body className={inter.className}>
        <YMScript />
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

export const generateStaticParams = () => locales.map((locale) => ({ locale }));

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

export const generateMetadata = async ({
  params: { locale },
}: LocaleLayoutProps) => {
  const t = await getTranslations({ locale, namespace: 'metadata' });

  const title = t('title');
  const description = t('description');
  const name = t('name');
  const applicationName = t('applicationName');

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
