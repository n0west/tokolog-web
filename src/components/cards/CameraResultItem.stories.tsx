import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import CameraResultItem from './CameraResultItem';

const meta: Meta<typeof CameraResultItem> = {
  title: 'UI/Lists/CameraResultItem',
  component: CameraResultItem,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden max-w-md">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockHandlers = {
  onEdit: (id: string) => console.log(`Edit item ${id}`),
  onSave: (id: string, data: { amount: number; productName: string }) => 
    console.log(`Save item ${id}:`, data),
  onCancel: (id: string) => console.log(`Cancel edit ${id}`),
};

// おトクタイプの基本表示
export const OtokuDefault: Story = {
  args: {
    id: '1',
    type: 'otoku',
    amount: 9999,
    productName: 'もやし',
    date: '2025年1月28日',
    isEditing: false,
    ...mockHandlers,
  },
};

// ガマンタイプの基本表示
export const GamanDefault: Story = {
  args: {
    id: '2',
    type: 'gaman',
    amount: 2980,
    productName: 'ジャケット',
    date: '2025年1月28日',
    isEditing: false,
    ...mockHandlers,
  },
};

// 編集モード（おトク）
export const OtokuEditing: Story = {
  args: {
    id: '3',
    type: 'otoku',
    amount: 150,
    productName: '豆腐',
    date: '2025年1月28日',
    isEditing: true,
    ...mockHandlers,
  },
};

// 編集モード（ガマン）
export const GamanEditing: Story = {
  args: {
    id: '4',
    type: 'gaman',
    amount: 5800,
    productName: 'ワイヤレスイヤホン',
    date: '2025年1月28日',
    isEditing: true,
    ...mockHandlers,
  },
};

// 長い商品名
export const LongProductName: Story = {
  args: {
    id: '5',
    type: 'otoku',
    amount: 480,
    productName: '有機栽培フレッシュキャベツ（国産・農薬不使用）',
    date: '2025年1月28日',
    isEditing: false,
    ...mockHandlers,
  },
};

// 高額商品
export const HighAmount: Story = {
  args: {
    id: '6',
    type: 'gaman',
    amount: 298000,
    productName: '4K液晶テレビ',
    date: '2025年1月28日',
    isEditing: false,
    ...mockHandlers,
  },
};

// 複数アイテムのリスト表示例
export const ListExample: Story = {
  render: () => (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden max-w-md">
      <CameraResultItem
        id="list-1"
        type="otoku"
        amount={298}
        productName="もやし"
        date="2025年1月28日"
        isEditing={false}
        {...mockHandlers}
        className="border-b border-gray-100"
      />
      <CameraResultItem
        id="list-2"
        type="otoku"
        amount={158}
        productName="豆腐"
        date="2025年1月28日"
        isEditing={false}
        {...mockHandlers}
        className="border-b border-gray-100"
      />
      <CameraResultItem
        id="list-3"
        type="otoku"
        amount={480}
        productName="キャベツ"
        date="2025年1月28日"
        isEditing={true}
        {...mockHandlers}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'カメラ結果画面での複数アイテムリスト表示例。一つのアイテムが編集モードになっている状態。',
      },
    },
  },
};

// ガマンタイプのリスト例
export const GamanListExample: Story = {
  render: () => (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden max-w-md">
      <CameraResultItem
        id="gaman-list-1"
        type="gaman"
        amount={2980}
        productName="ジャケット"
        date="2025年1月28日"
        isEditing={false}
        {...mockHandlers}
        className="border-b border-gray-100"
      />
      <CameraResultItem
        id="gaman-list-2"
        type="gaman"
        amount={1580}
        productName="スニーカー"
        date="2025年1月28日"
        isEditing={false}
        {...mockHandlers}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'ガマン記録でのカメラ結果リスト表示例。',
      },
    },
  },
};