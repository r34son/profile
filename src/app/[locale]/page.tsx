import { unstable_setRequestLocale } from 'next-intl/server';
import { Info } from '@/components/blocks/Info';
import { Locales } from '@/lib/i18n';
import styles from './page.module.css';

interface HomeProps {
  params: {
    locale: Locales;
  };
}

export default function Home({ params: { locale } }: HomeProps) {
  unstable_setRequestLocale(locale);

  return (
    <main className={styles.main}>
      <Info />
    </main>
  );
}
