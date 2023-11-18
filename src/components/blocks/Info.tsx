import { useTranslations } from 'next-intl';

export const Info = () => {
  const t = useTranslations('metadata');
  return <h1>{t('title')}</h1>;
};
