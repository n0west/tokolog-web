import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import ManualInputPage from './ManualInputPage';

const meta: Meta<typeof ManualInputPage> = {
  title: 'Pages/ManualInputPage',
  component: ManualInputPage,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const OtokuDefault: Story = {
  args: {
    type: 'otoku',
  },
};

export const GamanDefault: Story = {
  args: {
    type: 'gaman',
  },
};

export const WithValidationErrors: Story = {
  args: {
    type: 'otoku',
    // エラー状態のシミュレーション
  },
};