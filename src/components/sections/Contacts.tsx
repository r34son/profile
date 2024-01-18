import { useTranslations } from 'next-intl';
import { Contacts as ContactsList } from '@/components/Contacts';

export const Contacts = () => {
  const t = useTranslations('sections.contacts');
  return (
    <section id="contacts" className="h-96">
      <h2 className="mb-8 max-w-none text-center text-xl">{t('heading')}</h2>
      <div className="flex justify-center">
        <ContactsList />
      </div>
    </section>
  );
};
