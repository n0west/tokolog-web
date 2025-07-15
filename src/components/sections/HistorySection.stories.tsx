import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import HistorySection from './HistorySection';

// サンプルデータ
const sampleRecords = [
  {
    id: '1',
    type: 'otoku' as const,
    amount: 1200,
    date: '2024/01/15',
    productName: 'コーヒー豆（割引）',
  },
  {
    id: '2', 
    type: 'gaman' as const,
    amount: 3500,
    date: '2024/01/14',
    productName: 'ブランドバッグ',
  },
  {
    id: '3',
    type: 'otoku' as const,
    amount: 800,
    date: '2024/01/13',
    productName: '野菜セット（タイムセール）',
  },
  {
    id: '4',
    type: 'gaman' as const,
    amount: 15000,
    date: '2024/01/12',
    productName: '高級時計',
  },
  {
    id: '5',
    type: 'otoku' as const,
    amount: 500,
    date: '2024/01/11',
    productName: 'パン（見切り品）',
  },
];

const meta: Meta<typeof HistorySection> = {
  title: 'Sections/HistorySection',
  component: HistorySection,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '履歴セクション - RecordCardのリストを表示し、空状態にも対応',
      },
    },
  },
  argTypes: {
    records: {
      control: { type: 'object' },
      description: '表示する記録の配列',
    },
    onViewAllClick: {
      action: 'すべて見るクリック',
      description: 'すべて見るボタンクリック時のコールバック',
    },
    maxRecords: {
      control: { type: 'number', min: 1, max: 10 },
      description: '最大表示件数',
    },
    title: {
      control: { type: 'text' },
      description: 'セクションタイトル',
    },
    emptyMessage: {
      control: { type: 'text' },
      description: '空状態のメッセージ',
    },
    className: {
      control: { type: 'text' },
      description: '追加のCSSクラス',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 基本表示（3件）
export const Default: Story = {
  args: {
    records: sampleRecords,
    onViewAllClick: () => console.log('すべて見るがクリックされました'),
  },
};

// 空状態
export const Empty: Story = {
  args: {
    records: [],
    onViewAllClick: () => console.log('すべて見るがクリックされました'),
  },
};

// 1件のみ
export const SingleRecord: Story = {
  args: {
    records: [sampleRecords[0]],
    onViewAllClick: () => console.log('すべて見るがクリックされました'),
  },
};

// 2件表示
export const TwoRecords: Story = {
  args: {
    records: sampleRecords.slice(0, 2),
    onViewAllClick: () => console.log('すべて見るがクリックされました'),
  },
};

// 最大表示件数変更（2件まで）
export const MaxTwoRecords: Story = {
  args: {
    records: sampleRecords,
    maxRecords: 2,
    onViewAllClick: () => console.log('すべて見るがクリックされました'),
  },
};

// 最大表示件数変更（5件まで）
export const MaxFiveRecords: Story = {
  args: {
    records: sampleRecords,
    maxRecords: 5,
    onViewAllClick: () => console.log('すべて見るがクリックされました'),
  },
};

// すべて見るボタンなし
export const WithoutViewAllButton: Story = {
  args: {
    records: sampleRecords,
    // onViewAllClickを指定しない
  },
};

// カスタムタイトル
export const CustomTitle: Story = {
  args: {
    records: sampleRecords,
    title: '今週の記録',
    onViewAllClick: () => console.log('すべて見るがクリックされました'),
  },
};

// カスタム空メッセージ
export const CustomEmptyMessage: Story = {
  args: {
    records: [],
    emptyMessage: '今月は記録がありません。記録を始めましょう！',
    onViewAllClick: () => console.log('すべて見るがクリックされました'),
  },
};

// おトクのみ
export const OtokuOnly: Story = {
  args: {
    records: sampleRecords.filter(record => record.type === 'otoku'),
    onViewAllClick: () => console.log('すべて見るがクリックされました'),
  },
};

// ガマンのみ  
export const GamanOnly: Story = {
  args: {
    records: sampleRecords.filter(record => record.type === 'gaman'),
    onViewAllClick: () => console.log('すべて見るがクリックされました'),
  },
};

// 長い商品名のテスト
export const LongProductNames: Story = {
  args: {
    records: [
      {
        id: '1',
        type: 'otoku' as const,
        amount: 2500,
        date: '2024/01/15',
        productName: '有機野菜詰め合わせセット（キャベツ、にんじん、玉ねぎ、じゃがいも、ブロッコリー）',
      },
      {
        id: '2',
        type: 'gaman' as const,
        amount: 45000,
        date: '2024/01/14',
        productName: 'プレミアムブランドハンドバッグ（限定カラー・レザー仕様・金具ゴールド）',
      },
    ],
    onViewAllClick: () => console.log('すべて見るがクリックされました'),
  },
};