import { ImageResponse } from 'next/og';
import { getTranslations } from 'next-intl/server';
import { Locales } from '@/lib/i18n';

export const runtime = 'edge';

export const alt = 'r34s0n.tech';
export const size = {
  width: 800,
  height: 600,
};

export const contentType = 'image/png';

interface OGImageProps {
  params: {
    locale: Locales;
  };
}

export default async function OGImage({ params: { locale } }: OGImageProps) {
  const t = await getTranslations({ locale, namespace: 'metadata' });

  return new ImageResponse(
    (
      <div tw="flex flex-col bg-zinc-900 text-slate-100 items-center text-center h-full w-full p-32">
        <h2 tw="border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          {t('title')}
        </h2>
        <p tw="text-sm">{t('description')}</p>
        <code tw="mt-auto rounded bg-slate-500 px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-green-300">
          r34s0n.tech
        </code>
      </div>
    ),
    {
      ...size,
    },
  );
}
