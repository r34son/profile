import { locales } from '@/lib/i18n';
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://r34s0n.tech',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    ...locales.map(
      (locale) =>
        ({
          url: `https://r34s0n.tech/${locale}`,
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.8,
        }) as const,
    ),
  ];
}
