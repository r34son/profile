export const locales = ['en', 'ru'] as const;

export type Locales = (typeof locales)[number];
