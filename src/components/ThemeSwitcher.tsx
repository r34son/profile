'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Button } from '@nextui-org/react';

export const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (theme === 'dark')
    return (
      <Button variant="flat" onClick={() => setTheme('light')}>
        Light
      </Button>
    );

  return (
    <Button variant="flat" onClick={() => setTheme('dark')}>
      Dark
    </Button>
  );
};
