import { MetadataRoute } from 'next';
import { generateMetadata } from './[locale]/layout';
import icon16 from './icon1.png';
import icon32 from './icon2.png';
import icon57 from './icon3.png';
import icon60 from './icon4.png';
import icon72 from './icon5.png';
import icon96 from './icon6.png';
import icon114 from './icon7.png';
import icon144 from './icon8.png';
import icon152 from './icon9.png';
import icon192 from './icon10.png';
import icon384 from './icon11.png';
import icon512 from './icon12.png';
import maskableIcon from './maskable_icon_x192.png';

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const metadata = await generateMetadata({ params: { locale: 'en' } });

  return {
    name: metadata.title as string,
    short_name: metadata.title as string,
    description: metadata.description as string,
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        sizes: '16x16',
        src: icon16.src,
        type: 'image/png',
      },
      {
        sizes: '32x32',
        src: icon32.src,
        type: 'image/png',
      },
      {
        sizes: '57x57',
        src: icon57.src,
        type: 'image/png',
      },
      {
        sizes: '60x60',
        src: icon60.src,
        type: 'image/png',
      },
      {
        sizes: '72x72',
        src: icon72.src,
        type: 'image/png',
      },
      {
        sizes: '96x96',
        src: icon96.src,
        type: 'image/png',
      },
      {
        sizes: '114x114',
        src: icon114.src,
        type: 'image/png',
      },
      {
        sizes: '144x144',
        src: icon144.src,
        type: 'image/png',
      },
      {
        sizes: '152x152',
        src: icon152.src,
        type: 'image/png',
      },
      {
        sizes: '192x192',
        src: icon192.src,
        type: 'image/png',
      },
      {
        sizes: '384x384',
        src: icon384.src,
        type: 'image/png',
      },
      {
        sizes: '512x512',
        src: icon512.src,
        type: 'image/png',
      },
      {
        src: maskableIcon.src,
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    screenshots: [
      {
        sizes: '512x512',
        src: icon512.src,
        type: 'image/png',
      },
      {
        sizes: '512x512',
        src: icon512.src,
        type: 'image/png',
        // @ts-expect-error no typings
        form_factor: 'wide',
      },
    ],
    theme_color: '#FFFFFF',
    background_color: '#FFFFFF',
    id: '/',
    start_url: '.',
    display: 'standalone',
    orientation: 'portrait',
  };
}
