import type { Meta, StoryObj } from '@storybook/react';
import RecordList from './RecordList';

const meta: Meta<typeof RecordList> = {
  title: 'Components/RecordList',
  component: RecordList,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// サンプルデータ
const sampleRecords = [
  {
    id: '1',
    type: 'otoku' as const,
    amount: 99999,
    date: '2025年1月28日',
    productName: 'ここに商品名を表示',
  },
  {
    id: '2', 
    type: 'gaman' as const,
    amount: 50000,
    date: '2025年1月27日',
    productName: '欲しかったバッグ',
  },
  {
    id: '3',
    type: 'otoku' as const,
    amount: 5000,
    date: '2025年1月26日',
    productName: '食材',
  },
  {
    id: '4',
    type: 'gaman' as const,
    amount: 120000,
    date: '2025年1月25日',
    productName: '高級腕時計（ブランド名入り）',
  },
];

// 基本のリスト表示
export const BasicList: Story = {
  args: {
    records: sampleRecords,
  },
};

// タイトル付きリスト
export const WithTitle: Story = {
  args: {
    records: sampleRecords,
    title: '最近の記録',
  },
};

// 少ない記録
export const FewRecords: Story = {
  args: {
    records: sampleRecords.slice(0, 2),
    title: '今週の記録',
  },
};

// 空のリスト
export const EmptyList: Story = {
  args: {
    records: [],
    title: '記録一覧',
  },
};

// 狭い幅でのテスト
export const NarrowWidth: Story = {
  args: {
    records: sampleRecords.slice(0, 3),
    title: 'モバイル表示',
    className: 'max-w-sm',
  },
};

// 広い幅でのテスト
export const WideWidth: Story = {
  args: {
    records: sampleRecords,
    title: 'デスクトップ表示',
    className: 'max-w-2xl',
  },
};