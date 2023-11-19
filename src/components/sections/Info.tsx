import { useTranslations } from 'next-intl';

export const Info = () => {
  const t = useTranslations('metadata');
  return (
    <section id="info" className="h-96">
      <h1>{t('title')}</h1>
    </section>
  );
};
