import type { Preview, ReactRenderer } from '@storybook/react';
import { withThemeByClassName } from '@storybook/addon-themes';
import { NextIntlClientProvider } from 'next-intl';
import englishLocale from '@/messages/en.json';
import '@/app/globals.css';

const preview: Preview = {
  parameters: {
    nextjs: { appDirectory: true },
    actions: { argTypesRegex: '^on.*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <NextIntlClientProvider locale="en" messages={englishLocale}>
        <Story />
      </NextIntlClientProvider>
    ),
    withThemeByClassName<ReactRenderer>({
      themes: {
        light: 'light',
        dark: 'dark',
      },
      defaultTheme: 'light',
    }),
  ],
};

export default preview;
