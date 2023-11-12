import { Info } from '@/components/blocks/Info';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <Info />
    </main>
  );
}
