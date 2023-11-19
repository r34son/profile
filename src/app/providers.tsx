'use client';

import { PropsWithChildren } from 'react';
import { ThemeProvider } from 'next-themes';

export const Providers = ({ children }: PropsWithChildren) => {
  return (
    <ThemeProvider
      enableSystem
      disableTransitionOnChange
      attribute="class"
      defaultTheme="system"
    >
      {children}
    </ThemeProvider>
  );
};
