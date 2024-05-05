import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { Info } from '@/components/sections/Info';
import { Experience } from '@/components/sections/Experience';
import { Contacts } from '@/components/sections/Contacts';
import { Locales } from '@/lib/i18n';
import { Technologies } from '@/components/sections/Technologies';
// import { BackgroundBeams } from '@/components/ui/background-beams';

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
      {/* <BackgroundBeams className="-z-10" /> */}
      <Info />
      <Experience />
      <Technologies title={t('anchors.technologies')} />
      <Contacts />
    </>
  );
}
