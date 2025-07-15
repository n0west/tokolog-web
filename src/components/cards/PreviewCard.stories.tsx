import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import PreviewCard from './PreviewCard';

const meta: Meta<typeof PreviewCard> = {
  title: 'Components/PreviewCard',
  component: PreviewCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'プレビューカードコンポーネント - フォーム入力内容のプレビュー表示',
      },
    },
  },
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['otoku', 'gaman'],
      description: 'おトク・ガマンのタイプ',
    },
    amount: {
      control: { type: 'number' },
      description: '金額（null可）',
    },
    productName: {
      control: { type: 'text' },
      description: '商品名',
    },
    date: {
      control: { type: 'text' },
      description: '日付',
    },
    className: {
      control: { type: 'text' },
      description: '追加のCSSクラス',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// おトクタイプ - 完全な情報
export const OtokuComplete: Story = {
  args: {
    type: 'otoku',
    amount: 500,
    productName: 'コーヒー豆',
    date: '2024年7月15日',
  },
};

// ガマンタイプ - 完全な情報
export const GamanComplete: Story = {
  args: {
    type: 'gaman',
    amount: 1200,
    productName: 'スニーカー',
    date: '2024年7月15日',
  },
};

// おトクタイプ - 商品名なし
export const OtokuNoProduct: Story = {
  args: {
    type: 'otoku',
    amount: 300,
    productName: '',
    date: '2024年7月15日',
  },
};

// ガマンタイプ - 商品名なし
export const GamanNoProduct: Story = {
  args: {
    type: 'gaman',
    amount: 800,
    productName: '',
    date: '2024年7月15日',
  },
};

// おトクタイプ - 金額なし
export const OtokuNoAmount: Story = {
  args: {
    type: 'otoku',
    amount: null,
    productName: '本',
    date: '2024年7月15日',
  },
};

// ガマンタイプ - 金額なし
export const GamanNoAmount: Story = {
  args: {
    type: 'gaman',
    amount: null,
    productName: 'ゲーム',
    date: '2024年7月15日',
  },
};

// 全て空の状態
export const Empty: Story = {
  args: {
    type: 'otoku',
    amount: null,
    productName: '',
    date: '2024年7月15日',
  },
};

// 大きな金額
export const LargeAmount: Story = {
  args: {
    type: 'otoku',
    amount: 15000,
    productName: '家電製品',
    date: '2024年7月15日',
  },
};

// 長い商品名
export const LongProductName: Story = {
  args: {
    type: 'gaman',
    amount: 2500,
    productName: 'とても長い商品名のアイテムです',
    date: '2024年7月15日',
  },
};

// 非常に長い商品名（改行テスト）
export const VeryLongProductName: Story = {
  args: {
    type: 'otoku',
    amount: 1000,
    productName: 'これは非常に長い商品名でありテキストの折り返し機能をテストするためのものです',
    date: '2024年7月15日',
  },
};

// 異なる日付形式
export const DifferentDateFormat: Story = {
  args: {
    type: 'gaman',
    amount: 750,
    productName: 'お菓子',
    date: '7/15',
  },
};

// ゼロ円
export const ZeroAmount: Story = {
  args: {
    type: 'otoku',
    amount: 0,
    productName: '無料サンプル',
    date: '2024年7月15日',
  },
};

// カスタムクラス適用
export const WithCustomClass: Story = {
  args: {
    type: 'otoku',
    amount: 400,
    productName: 'ランチ',
    date: '2024年7月15日',
    className: 'shadow-lg border border-gray-200 rounded-lg',
  },
};

// スマートフォン表示想定（狭い幅）
export const MobileWidth: Story = {
  args: {
    type: 'gaman',
    amount: 3000,
    productName: '洋服',
    date: '2024年7月15日',
    className: 'max-w-sm',
  },
};