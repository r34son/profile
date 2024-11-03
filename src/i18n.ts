import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

export const locales = ['en', 'ru'] as const;

export type Locales = (typeof locales)[number];

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as Locales)) notFound();

  return {
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
