'use client';

import { useTheme } from 'next-themes';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

interface TechnologiesProps {
  title: string;
}

export const Technologies = ({ title }: TechnologiesProps) => {
  const { theme } = useTheme();

  return (
    <section id="technologies" className="py-4">
      <h2 className="mb-8 max-w-none text-center text-xl">{title}</h2>
      <Carousel
        className="w-full"
        opts={{ loop: true }}
        plugins={[Autoplay({ delay: 1200 })]}
      >
        <CarouselContent className="-ml-1">
          {logoClassnames.map((className, index) => (
            <CarouselItem
              key={index}
              className="flex pl-1 md:basis-1/2 lg:basis-1/3"
            >
              <i
                className={`m-auto text-8xl ${className} ${
                  theme === 'dark' ? 'colored' : ''
                }`}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <button
        type="button"
        onClick={() => {
          throw new Error('Sentry Frontend Error');
        }}
      >
        Throw error
      </button>
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
