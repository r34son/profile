import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { Info } from '@/components/sections/Info';
import { Experience } from '@/components/sections/Experience';
import { Technologies } from '@/components/sections/Technologies';
import { Contacts } from '@/components/sections/Contacts';
import { Locales } from '@/lib/i18n';

interface HomeProps {
  params: {
    locale: Locales;
  };
}

export default async function Home({ params: { locale } }: HomeProps) {
  unstable_setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'header' });

  return (
    <>
      <Info />
      <Experience />
      <Technologies title={t('anchors.technologies')} />
      <Contacts />
    </>
  );
}
