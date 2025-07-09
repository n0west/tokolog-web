import type { Meta, StoryObj } from '@storybook/react';
import RecordCard from './RecordCard';

const meta: Meta<typeof RecordCard> = {
  title: 'Components/RecordCard',
  component: RecordCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// おトク記録
export const OtokuRecord: Story = {
  args: {
    type: 'otoku',
    amount: 99999,
    date: '2025年1月28日',
    productName: 'ここに商品名を表示',
  },
};

// ガマン記録
export const GamanRecord: Story = {
  args: {
    type: 'gaman',
    amount: 50000,
    date: '2025年1月27日',
    productName: '欲しかったバッグ',
  },
};

// 短い商品名
export const ShortProductName: Story = {
  args: {
    type: 'otoku',
    amount: 5000,
    date: '2025年1月26日',
    productName: '食材',
  },
};

// 長い商品名
export const LongProductName: Story = {
  args: {
    type: 'gaman',
    amount: 120000,
    date: '2025年1月25日',
    productName: '高級腕時計（ブランド名入り）',
  },
};