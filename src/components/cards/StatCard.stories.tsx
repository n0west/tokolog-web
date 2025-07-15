import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import StatCard from './StatCard';

const meta: Meta<typeof StatCard> = {
  title: 'Components/Cards/StatCard',
  component: StatCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// おトクカード（先月比表示）
export const OtokuWithComparison: Story = {
  args: {
    type: 'otoku',
    amount: 99999,
    comparison: 5000,
    showComparison: true,
  },
};

// ガマンカード（先月比表示）
export const GamanWithComparison: Story = {
  args: {
    type: 'gaman',
    amount: 50000,
    comparison: -3000,
    showComparison: true,
  },
};

// おトクカード（先月比非表示）
export const OtokuWithoutComparison: Story = {
  args: {
    type: 'otoku',
    amount: 99999,
    showComparison: false,
  },
};

// ガマンカード（先月比非表示）
export const GamanWithoutComparison: Story = {
  args: {
    type: 'gaman',
    amount: 50000,
    showComparison: false,
  },
};