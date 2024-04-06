'use client';
import { PropsWithChildren } from 'react';
import { LazyMotion, domAnimation } from 'framer-motion';

/** @see https://www.framer.com/motion/guide-reduce-bundle-size/ */
export const LazyMotionProvider = ({ children }: PropsWithChildren) => (
  <LazyMotion features={domAnimation}>{children}</LazyMotion>
);
