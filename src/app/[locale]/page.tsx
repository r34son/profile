import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Info } from '@/components/sections/Info';
import { Experience } from '@/components/sections/Experience';
import { Contacts } from '@/components/sections/Contacts';
import { Technologies } from '@/components/sections/Technologies';
// import { BackgroundBeams } from '@/components/ui/background-beams';

interface ProfileProps {
  params: Promise<{ locale: string }>;
}

export default async function Profile(props: ProfileProps) {
  const { locale } = await props.params;

  setRequestLocale(locale);

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
