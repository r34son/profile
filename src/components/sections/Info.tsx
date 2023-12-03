import { useTranslations } from 'next-intl';
import { MoveRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from '@/navigation';

export const Info = () => {
  const t = useTranslations('sections.info');
  return (
    <section id="info" className="py-48 xl:px-16 text-center">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        {t('heading')}
      </h1>
      <p className="leading-7 mt-16 [text-wrap:balance]">
        {t.rich('subtitle', {
          br: () => <br />,
          bold: (chunks) => (
            <span className="text-lg font-bold bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% text-transparent bg-clip-text">
              {chunks}
            </span>
          ),
        })}
      </p>
      <div className="flex items-center justify-center mt-24">
        <div className="relative">
          <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 opacity-75 blur"></div>
          <Button
            className="relative h-14 text-base rounded-lg px-7 py-4 dark:bg-black dark:text-white dark:hover:bg-black/75"
            size="lg"
            asChild
          >
            <Link href="#contacts">
              {t('callToAction')} <MoveRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
