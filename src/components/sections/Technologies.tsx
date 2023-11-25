'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { register } from 'swiper/element/bundle';
import { Skeleton } from '@/components/ui/skeleton';

register();

interface TechnologiesProps {
  title: string;
}

export const Technologies = ({ title }: TechnologiesProps) => {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section id="technologies" className="py-4">
      <h2 className="prose prose-xl text-center max-w-none mb-8">{title}</h2>
      {mounted ? (
        <swiper-container
          loop
          autoplay
          autoplay-delay="1000"
          resize-observer
          slides-per-view="7"
          effect="coverflow"
          coverflow-effect-modifier="0.6"
          coverflow-effect-slide-shadows="false"
          breakpoints='{"320": {"slidesPerView": 3}, "480": {"slidesPerView": 4}}'
          // https://github.com/nolimits4web/swiper/issues/3599#issuecomment-1696670314
          inject-styles={
            '[".swiper{display: grid;} .swiper-wrapper{min-width: 0;}"]'
          }
        >
          {logoClassnames.map((className, index) => (
            <swiper-slide key={index}>
              <i
                className={`text-8xl ${className} ${
                  theme === 'dark' ? 'colored' : ''
                }`}
              />
            </swiper-slide>
          ))}
        </swiper-container>
      ) : (
        <Skeleton className="w-full h-24" />
      )}
    </section>
  );
};

const logoClassnames = [
  'devicon-bash-plain',
  'devicon-nodejs-plain-wordmark',
  'devicon-nextjs-original-wordmark',
  'devicon-react-original-wordmark',
  'devicon-javascript-plain',
  'devicon-typescript-plain',
  'devicon-redux-original',
  'devicon-tailwindcss-original-wordmark',
  'devicon-webpack-plain-wordmark',
  'devicon-babel-plain',
  'devicon-npm-original-wordmark',
  'devicon-vscode-plain-wordmark',
  'devicon-storybook-plain-wordmark',
  'devicon-jest-plain',
  'devicon-eslint-original-wordmark',
  'devicon-materialui-plain',
  'devicon-chrome-plain-wordmark',
  'devicon-figma-plain',
  'devicon-github-original-wordmark',
  'devicon-docker-plain-wordmark',
];
