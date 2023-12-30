import type { Meta, StoryObj } from '@storybook/react';

import { Info } from './Info';

const meta: Meta<typeof Info> = {
  component: Info,
};

export default meta;

type Story = StoryObj<typeof Info>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  args: {},
};
