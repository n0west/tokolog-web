import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import ChevronRightIcon from './ChevronRightIcon';

const meta: Meta<typeof ChevronRightIcon> = {
  title: 'Foundation/Icons/ChevronRightIcon',
  component: ChevronRightIcon,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '右シェブロンアイコン - ページ遷移や次への移動を示すアイコン',
      },
    },
  },
  argTypes: {
    width: {
      control: { type: 'number', min: 16, max: 64, step: 4 },
      description: 'アイコンの幅（px）',
    },
    height: {
      control: { type: 'number', min: 16, max: 64, step: 4 },
      description: 'アイコンの高さ（px）',
    },
    color: {
      control: { type: 'color' },
      description: 'アイコンの色',
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
    width: 24,
    height: 24,
    color: '#6B7280',
  },
};

// 小さいサイズ
export const Small: Story = {
  args: {
    width: 16,
    height: 16,
    color: '#6B7280',
  },
};

// 大きいサイズ
export const Large: Story = {
  args: {
    width: 32,
    height: 32,
    color: '#6B7280',
  },
};

// リストアイテム用（グレー）
export const ListItem: Story = {
  args: {
    width: 20,
    height: 20,
    color: '#9CA3AF',
  },
};

// アクティブ状態（青）
export const Active: Story = {
  args: {
    width: 24,
    height: 24,
    color: '#3B82F6',
  },
};

// 暗い背景用（白）
export const OnDark: Story = {
  args: {
    width: 24,
    height: 24,
    color: '#FFFFFF',
  },
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#374151' },
      ],
    },
  },
};

// リストアイテムでの使用例
export const InListItem: Story = {
  render: (args) => (
    <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
      <div>
        <div className="font-medium text-gray-900">設定項目</div>
        <div className="text-sm text-gray-500">詳細設定を確認・変更</div>
      </div>
      <ChevronRightIcon {...args} />
    </div>
  ),
  args: {
    width: 20,
    height: 20,
    color: '#9CA3AF',
  },
  parameters: {
    docs: {
      description: {
        story: 'リストアイテム内での使用例。右側に配置して次のページへの遷移を示す。',
      },
    },
  },
};

// 複数のリストアイテム
export const MultipleListItems: Story = {
  render: (args) => (
    <div className="space-y-2 w-80">
      <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
        <span className="text-gray-900">プロフィール設定</span>
        <ChevronRightIcon {...args} />
      </div>
      <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
        <span className="text-gray-900">通知設定</span>
        <ChevronRightIcon {...args} />
      </div>
      <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
        <span className="text-gray-900">プライバシー設定</span>
        <ChevronRightIcon {...args} />
      </div>
    </div>
  ),
  args: {
    width: 20,
    height: 20,
    color: '#9CA3AF',
  },
  parameters: {
    docs: {
      description: {
        story: '複数のリストアイテムでの使用例。設定画面や一覧画面でよく使用される。',
      },
    },
  },
};