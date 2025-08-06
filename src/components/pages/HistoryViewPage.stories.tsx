import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import HistoryViewPage from './HistoryViewPage';

const meta: Meta<typeof HistoryViewPage> = {
  title: 'Pages/HistoryViewPage',
  component: HistoryViewPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '履歴一覧ページ - フィルター機能、合計表示、編集可能な履歴リスト',
      },
    },
  },
  argTypes: {
    records: {
      control: { type: 'object' },
      description: '履歴データの配列',
    },
    onBack: {
      action: '戻る',
      description: '戻るボタンクリック時のコールバック',
    },
    onNavigateToEdit: {
      action: '編集ページに遷移',
      description: '編集ページ遷移時のコールバック',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// サンプルデータ
const sampleRecords = [
  {
    id: '1',
    type: 'otoku' as const,
    amount: 9999,
    date: '2025-01-28',
    productName: 'もやし',
  },
  {
    id: '2',
    type: 'gaman' as const,
    amount: 9999,
    date: '2025-01-28',
    productName: 'もやし',
  },
  {
    id: '3',
    type: 'otoku' as const,
    amount: 9999,
    date: '2025-01-28',
    productName: 'もやし',
  },
  {
    id: '4',
    type: 'gaman' as const,
    amount: 9999,
    date: '2025-01-28',
    productName: 'もやし',
  },
  {
    id: '5',
    type: 'otoku' as const,
    amount: 9999,
    date: '2025-02-15',
    productName: 'もやし',
  },
  {
    id: '6',
    type: 'gaman' as const,
    amount: 9999,
    date: '2025-02-10',
    productName: 'もやし',
  },
];

// 基本表示
export const Default: Story = {
  args: {
    records: sampleRecords,
    onBack: () => console.log('戻る'),
    onNavigateToEdit: (id) => console.log('編集ページに遷移:', id),
  },
};

// 空の履歴
export const Empty: Story = {
  args: {
    records: [],
    onBack: () => console.log('戻る'),
    onNavigateToEdit: (id) => console.log('編集ページに遷移:', id),
  },
};

// 大量データ
export const ManyRecords: Story = {
  args: {
    records: Array.from({ length: 50 }, (_, i) => ({
      id: `${i + 1}`,
      type: i % 2 === 0 ? 'otoku' as const : 'gaman' as const,
      amount: Math.floor(Math.random() * 50000) + 100,
      date: `2025-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      productName: ['もやし', 'ブランドバッグ', 'コーヒー豆', '野菜セット', 'お菓子'][Math.floor(Math.random() * 5)],
    })),
    onBack: () => console.log('戻る'),
    onNavigateToEdit: (id) => console.log('編集ページに遷移:', id),
  },
};