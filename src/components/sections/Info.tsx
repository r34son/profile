import { useTranslations } from 'next-intl';
import { MoveRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
  Drawer,
} from '@/components/ui/drawer';
import { Contacts } from '@/components/Contacts';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';

export const Info = () => {
  const t = useTranslations('sections.info');
  // @ts-ignore
  window.a.b();
  return (
    <section id="info" className="py-48 text-center xl:px-16">
      <TextGenerateEffect
        className="mt-8 scroll-m-20 bg-gradient-to-br from-slate-300 to-slate-500 bg-clip-text py-4 text-center text-4xl font-extrabold tracking-tight text-transparent md:text-7xl lg:text-5xl"
        words={t('heading')}
      />
      <p className="mt-16 leading-7 [text-wrap:balance]">
        {t.rich('subtitle', {
          br: () => <br />,
          bold: (chunks) => (
            <span className="bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% bg-clip-text text-lg font-bold text-transparent">
              {chunks}
            </span>
          ),
        })}
      </p>
      <div className="mt-24 flex items-center justify-center">
        <div className="relative">
          <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 opacity-75 blur"></div>
          <Drawer>
            <DrawerTrigger asChild>
              <Button
                className="relative h-14 rounded-lg px-7 py-4 text-base dark:bg-black dark:text-white dark:hover:bg-black/75"
                size="lg"
              >
                {t('callToAction')} <MoveRight className="ml-2 h-4 w-4" />
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <div className="mx-auto w-full max-w-sm">
                <DrawerHeader>
                  <DrawerTitle className="text-center">
                    {t('drawer.title')}
                  </DrawerTitle>
                </DrawerHeader>
                <Contacts />
                <DrawerFooter>
                  <DrawerClose asChild>
                    <Button variant="outline">
                      {t('drawer.closeBtnText')}
                    </Button>
                  </DrawerClose>
                </DrawerFooter>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </section>
  );
};
