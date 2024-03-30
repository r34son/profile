import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, Locales } from '@/lib/i18n';

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as Locales)) notFound();

  return {
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
