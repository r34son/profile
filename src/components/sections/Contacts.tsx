import { useTranslations } from 'next-intl';

export const Contacts = () => {
  const t = useTranslations('metadata');
  return (
    <section id="contacts" className="h-96">
      <h1>{t('title')}</h1>
    </section>
  );
};
