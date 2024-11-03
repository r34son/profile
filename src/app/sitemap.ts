import { locales, Locales } from '@/i18n';
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://r34s0n.tech',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
      alternates: {
        languages: locales.reduce(
          (acc, locale) => {
            acc[locale] = `https://r34s0n.tech/${locale}`;
            return acc;
          },
          {} as Record<Locales, string>,
        ),
      },
    },
  ];
}
