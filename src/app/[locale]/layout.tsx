import type { PropsWithChildren } from 'react';
import type { Metadata, Viewport } from 'next';
import { headers } from 'next/headers';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { LazyMotionProvider } from '@/components/LazyMotionProvider';
import { Header } from '@/components/Header';
import { YMScript } from '@/components/YMScript';
import { Locales, locales } from '@/lib/i18n';
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
  unstable_setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'header' });
  const nonce = headers().get('x-nonce')!;

  return (
    <html suppressHydrationWarning lang={locale} className="dark">
      <body
        className={`${inter.className} flex h-screen flex-col overflow-hidden`}
      >
        <YMScript nonce={nonce} />
        <ThemeProvider
          enableSystem
          disableTransitionOnChange
          attribute="class"
          defaultTheme="system"
          nonce={nonce}
        >
          <LazyMotionProvider>
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
          </LazyMotionProvider>
          <div className="overflow-y-auto">
            <main className="container flex-1">{children}</main>
          </div>
        </ThemeProvider>
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
}: LocaleLayoutProps): Promise<Metadata> => {
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
    metadataBase: new URL(process.env.URL ?? 'http://localhost:3000'),
    generator: 'Next.js',
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
      title,
      capable: true,
      statusBarStyle: 'black-translucent',
    },
    verification: {
      other: {
        me: [email, githubUrl],
      },
    },
    category: 'technology',
  };
};
