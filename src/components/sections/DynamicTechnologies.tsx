'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

export const DynamicTechnologies = dynamic(
  () => import('./Technologies').then((module) => module.Technologies),
  {
    ssr: false,
    loading: () => <Skeleton className="h-48 w-full" />,
  },
);
