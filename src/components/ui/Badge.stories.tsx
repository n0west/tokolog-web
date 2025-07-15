import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['otoku', 'gaman'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Otoku: Story = {
  args: {
    type: 'otoku',
    size: 'md',
  },
};

export const Gaman: Story = {
  args: {
    type: 'gaman',
    size: 'md',
  },
};

export const Small: Story = {
  args: {
    type: 'otoku',
    size: 'sm',
  },
};