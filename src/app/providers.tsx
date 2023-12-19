'use client';

import { PropsWithChildren } from 'react';
import { ThemeProvider } from 'next-themes';

interface ProviderProps {
  nonce?: string;
}

export const Providers = ({
  children,
  nonce,
}: PropsWithChildren<ProviderProps>) => {
  return (
    <ThemeProvider
      enableSystem
      disableTransitionOnChange
      attribute="class"
      defaultTheme="system"
      nonce={nonce}
    >
      {children}
    </ThemeProvider>
  );
};
