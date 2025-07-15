import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import StatsSection from './StatsSection';

const meta: Meta<typeof StatsSection> = {
  title: 'Components/StatsSection',
  component: StatsSection,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '今月の集計セクション - StatCardを横並びで表示するレスポンシブコンポーネント',
      },
    },
  },
  argTypes: {
    otokuAmount: {
      control: { type: 'number' },
      description: 'おトク額（円）',
    },
    gamanAmount: {
      control: { type: 'number' },
      description: 'ガマン額（円）',
    },
    otokuComparison: {
      control: { type: 'number' },
      description: 'おトクの先月比（円）',
    },
    gamanComparison: {
      control: { type: 'number' },
      description: 'ガマンの先月比（円）',
    },
    showComparison: {
      control: { type: 'boolean' },
      description: '先月比表示の有無',
    },
    title: {
      control: { type: 'text' },
      description: 'セクションタイトル',
    },
    className: {
      control: { type: 'text' },
      description: '追加のCSSクラス',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 基本表示
export const Default: Story = {
  args: {
    otokuAmount: 15420,
    gamanAmount: 8750,
  },
};

// 先月比あり（正値）
export const WithPositiveComparison: Story = {
  args: {
    otokuAmount: 15420,
    gamanAmount: 8750,
    otokuComparison: 3200,
    gamanComparison: 1500,
    showComparison: true,
  },
};

// 先月比あり（負値）
export const WithNegativeComparison: Story = {
  args: {
    otokuAmount: 12220,
    gamanAmount: 6250,
    otokuComparison: -3200,
    gamanComparison: -2500,
    showComparison: true,
  },
};

// 先月比非表示
export const WithoutComparison: Story = {
  args: {
    otokuAmount: 15420,
    gamanAmount: 8750,
    otokuComparison: 3200,
    gamanComparison: 1500,
    showComparison: false,
  },
};

// カスタムタイトル
export const CustomTitle: Story = {
  args: {
    otokuAmount: 15420,
    gamanAmount: 8750,
    title: '先月の集計',
  },
};

// 高額表示
export const LargeAmounts: Story = {
  args: {
    otokuAmount: 156750,
    gamanAmount: 98250,
    otokuComparison: 12500,
    gamanComparison: -5800,
  },
};

// 少額表示
export const SmallAmounts: Story = {
  args: {
    otokuAmount: 120,
    gamanAmount: 350,
    otokuComparison: 50,
    gamanComparison: -20,
  },
};

// ゼロ表示
export const ZeroAmounts: Story = {
  args: {
    otokuAmount: 0,
    gamanAmount: 0,
    otokuComparison: 0,
    gamanComparison: 0,
  },
};

// モバイル表示確認用（縦並び）
export const Mobile: Story = {
  args: {
    otokuAmount: 15420,
    gamanAmount: 8750,
    otokuComparison: 3200,
    gamanComparison: 1500,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};