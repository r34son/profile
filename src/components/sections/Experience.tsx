import { useTranslations } from 'next-intl';

export const Experience = () => {
  const t = useTranslations('metadata');
  return (
    <section id="experience" className="h-96">
      <h1>{t('title')}</h1>
    </section>
  );
};
