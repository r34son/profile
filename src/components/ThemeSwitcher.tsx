'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted)
    return (
      <Button variant="outline" size="icon">
        <Skeleton className="h-full w-full" />
      </Button>
    );

  if (theme === 'dark')
    return (
      <Button variant="outline" size="icon" onClick={() => setTheme('light')}>
        <Sun />
      </Button>
    );

  return (
    <Button variant="outline" size="icon" onClick={() => setTheme('dark')}>
      <Moon />
    </Button>
  );
};
