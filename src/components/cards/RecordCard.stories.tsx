import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import RecordCard from './RecordCard';

const meta: Meta<typeof RecordCard> = {
  title: 'Components/Display/RecordCard',
  component: RecordCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onNavigateToEdit: {
      action: 'navigate-to-edit',
      description: '編集ページへの遷移コールバック',
    },
  },
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
    onNavigateToEdit: () => console.log('編集ページに遷移'),
  },
};

// ガマン記録
export const GamanRecord: Story = {
  args: {
    type: 'gaman',
    amount: 50000,
    date: '2025年1月27日',
    productName: '欲しかったバッグ',
    onNavigateToEdit: () => console.log('編集ページに遷移'),
  },
};

// 短い商品名
export const ShortProductName: Story = {
  args: {
    type: 'otoku',
    amount: 5000,
    date: '2025年1月26日',
    productName: '食材',
    onNavigateToEdit: () => console.log('編集ページに遷移'),
  },
};

// 長い商品名
export const LongProductName: Story = {
  args: {
    type: 'gaman',
    amount: 120000,
    date: '2025年1月25日',
    productName: '高級腕時計（ブランド名入り）',
    onNavigateToEdit: () => console.log('編集ページに遷移'),
  },
};

// 編集機能なし（シェブロンアイコンが表示されない）
export const WithoutEditFeature: Story = {
  args: {
    type: 'otoku',
    amount: 3000,
    date: '2025年1月24日',
    productName: '編集不可な記録',
    // onNavigateToEditを渡さない
  },
};

// 複数のレコードカード
export const MultipleRecords: Story = {
  render: () => (
    <div className="space-y-2 w-80">
      <RecordCard
        type="otoku"
        amount={1500}
        date="2025年1月28日"
        productName="スーパーでの買い物"
        onNavigateToEdit={() => console.log('おトク記録を編集')}
      />
      <RecordCard
        type="gaman"
        amount={8000}
        date="2025年1月27日"
        productName="新しいヘッドフォン"
        onNavigateToEdit={() => console.log('ガマン記録を編集')}
      />
      <RecordCard
        type="otoku"
        amount={500}
        date="2025年1月26日"
        productName="コンビニ弁当"
        onNavigateToEdit={() => console.log('おトク記録を編集')}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '複数のRecordCardを並べた表示例。履歴一覧画面での使用を想定。',
      },
    },
  },
};