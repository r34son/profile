import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { Info } from '@/components/sections/Info';
import { Experience } from '@/components/sections/Experience';
import { Contacts } from '@/components/sections/Contacts';
import { Locales } from '@/lib/i18n';
import { DynamicTechnologies } from '@/components/sections/DynamicTechnologies';

interface ProfileProps {
  params: {
    locale: Locales;
  };
}

export default async function Profile({ params: { locale } }: ProfileProps) {
  unstable_setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'header' });

  return (
    <>
      <Info />
      <Experience />
      <DynamicTechnologies title={t('anchors.technologies')} />
      <Contacts />
    </>
  );
}
