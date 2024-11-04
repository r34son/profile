import { type MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://r34s0n.tech',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
      alternates: {
        languages: routing.locales.reduce(
          (acc, locale) => {
            acc[locale] = `https://r34s0n.tech/${locale}`;
            return acc;
          },
          {} as Record<string, string>,
        ),
      },
    },
  ];
}
