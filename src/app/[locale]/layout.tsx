import type { PropsWithChildren } from 'react';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { notFound } from 'next/navigation';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { Header } from '@/components/Header';
import { YMScript } from '@/components/YMScript';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Locales, locales } from '@/lib/i18n';
import { Providers } from '@/app/providers';
import { email, githubUrl } from '@/const';

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

  const t = await getTranslations({ locale, namespace: 'header' });

  return (
    <html suppressHydrationWarning lang={locale} className="dark">
      <body
        className={`${inter.className} flex flex-col h-screen overflow-hidden`}
      >
        <YMScript />
        <Providers>
          <Header
            title={t('title')}
            anchors={[
              { title: t('anchors.info'), href: '#info' },
              { title: t('anchors.experience'), href: '#experience' },
              { title: t('anchors.technologies'), href: '#technologies' },
              { title: t('anchors.contacts'), href: '#contacts' },
            ]}
            githubButtonText={t('githubButtonText')}
            localeSelectProps={{
              title: t('localeSelect.title'),
              localeNames: locales.reduce(
                (acc, locale) => ({
                  ...acc,
                  [locale]: t(`localeSelect.locales.${locale}`),
                }),
                {} as Record<Locales, string>,
              ),
            }}
          />
          <ScrollArea>
            <main className="container flex-1 mx-auto p-4">{children}</main>
          </ScrollArea>
        </Providers>
      </body>
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
    authors: [{ name, url: githubUrl }],
    keywords: t('keywords'),
    referrer: 'origin',
    creator: name,
    publisher: name,
    title,
    description,
    openGraph: {
      title,
      description,
      url: githubUrl,
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
        me: [email, githubUrl],
      },
    },
    category: 'technology',
  } as Metadata;
};
