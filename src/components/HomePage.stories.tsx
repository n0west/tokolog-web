import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import StatsSection from './StatsSection';
import ActionSection from './ActionSection';
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
];

// ホーム画面コンポーネント
const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 space-y-2">
      <StatsSection
        className="w-full"
        otokuAmount={15420}
        gamanAmount={8750}
        otokuComparison={3200}
        gamanComparison={-1500}
      />
      
      <ActionSection
        className="w-full"
        onOtokuClick={() => console.log('おトクがクリックされました')}
        onGamanClick={() => console.log('ガマンがクリックされました')}
      />
      
      <HistorySection
        className="w-full"
        records={sampleRecords}
        onViewAllClick={() => console.log('すべて見るがクリックされました')}
      />
    </div>
  );
};

const meta: Meta<typeof HomePage> = {
  title: 'Pages/HomePage',
  component: HomePage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '仮想のホーム画面 - 全セクションを統合したページレイアウト',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 基本ホーム画面
export const Default: Story = {};

// 空の履歴状態
export const EmptyHistory: Story = {
  render: () => (
    <div className="min-h-screen bg-gray-50 py-10 px-4 space-y-2">
      <StatsSection
        className="w-full"
        otokuAmount={15420}
        gamanAmount={8750}
        otokuComparison={3200}
        gamanComparison={-1500}
      />
      
      <ActionSection
        className="w-full"
        onOtokuClick={() => console.log('おトクがクリックされました')}
        onGamanClick={() => console.log('ガマンがクリックされました')}
      />
      
      <HistorySection
        className="w-full"
        records={[]}
        onViewAllClick={() => console.log('すべて見るがクリックされました')}
      />
    </div>
  ),
};

// 初回利用者向け（全て0）
export const FirstTimeUser: Story = {
  render: () => (
    <div className="min-h-screen bg-gray-50 py-10 px-4 space-y-2">
      <StatsSection
        className="w-full"
        otokuAmount={0}
        gamanAmount={0}
        showComparison={false}
      />
      
      <ActionSection
        className="w-full"
        onOtokuClick={() => console.log('おトクがクリックされました')}
        onGamanClick={() => console.log('ガマンがクリックされました')}
      />
      
      <HistorySection
        className="w-full"
        records={[]}
        emptyMessage="記録を始めてみましょう！"
        onViewAllClick={() => console.log('すべて見るがクリックされました')}
      />
    </div>
  ),
};

// 大きな金額の場合
export const LargeAmounts: Story = {
  render: () => (
    <div className="min-h-screen bg-gray-50 py-10 px-4 space-y-2">
      <StatsSection
        className="w-full"
        otokuAmount={156750}
        gamanAmount={98250}
        otokuComparison={12500}
        gamanComparison={-5800}
      />
      
      <ActionSection
        className="w-full"
        onOtokuClick={() => console.log('おトクがクリックされました')}
        onGamanClick={() => console.log('ガマンがクリックされました')}
      />
      
      <HistorySection
        className="w-full"
        records={[
          {
            id: '1',
            type: 'otoku' as const,
            amount: 25000,
            date: '2024/01/15',
            productName: '家電セット（大幅割引）',
          },
          {
            id: '2',
            type: 'gaman' as const,
            amount: 85000,
            date: '2024/01/14',
            productName: '高級ブランドバッグ',
          },
        ]}
        onViewAllClick={() => console.log('すべて見るがクリックされました')}
      />
    </div>
  ),
};

// モバイル表示確認
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

// タブレット表示確認
export const Tablet: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};