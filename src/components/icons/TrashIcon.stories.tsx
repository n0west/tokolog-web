import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import TrashIcon from './TrashIcon';

const meta: Meta<typeof TrashIcon> = {
  title: 'Foundation/Icons/TrashIcon',
  component: TrashIcon,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'ゴミ箱アイコン - 削除機能を表すアイコン。ヘッダーでの使用を想定。',
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

// 基本表示（ヘッダー用サイズ）
export const Default: Story = {
  args: {
    width: 20,
    height: 20,
    color: '#9CA3AF',
  },
};

// 小さいサイズ
export const Small: Story = {
  args: {
    width: 16,
    height: 16,
    color: '#9CA3AF',
  },
};

// 大きいサイズ
export const Large: Story = {
  args: {
    width: 32,
    height: 32,
    color: '#9CA3AF',
  },
};

// 通常時（グレー）
export const Normal: Story = {
  args: {
    width: 20,
    height: 20,
    color: '#9CA3AF',
  },
};

// アクティブ時（赤）
export const Active: Story = {
  args: {
    width: 20,
    height: 20,
    color: '#EF4444',
  },
};

// 暗い背景用
export const OnDark: Story = {
  args: {
    width: 20,
    height: 20,
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

// ヘッダーでの使用例
export const InHeader: Story = {
  render: (args) => (
    <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
      <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
        ← 戻る
      </button>
      <h1 className="text-lg font-bold text-gray-900">記録を編集</h1>
      <button 
        className="p-3 hover:bg-gray-100 rounded-full transition-colors"
        style={{ width: '44px', height: '44px' }}
      >
        <div className="flex items-center justify-center">
          <TrashIcon {...args} />
        </div>
      </button>
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
        story: 'ヘッダーでの使用例。44x44pxのタップエリアでアクセシビリティに配慮。',
      },
    },
  },
};

// インタラクティブな例（ホバー効果）
export const Interactive: Story = {
  render: (args) => {
    const [isHovered, setIsHovered] = React.useState(false);
    
    return (
      <button 
        className="p-3 hover:bg-gray-100 rounded-full transition-colors"
        style={{ width: '44px', height: '44px' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center justify-center">
          <TrashIcon 
            width={20} 
            height={20} 
            color={isHovered ? '#EF4444' : '#9CA3AF'}
          />
        </div>
      </button>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'インタラクティブな例。ホバー時に色が変わる動作を確認できます。',
      },
    },
  },
};

// 色のバリエーション
export const ColorVariations: Story = {
  render: () => (
    <div className="flex items-center space-x-6">
      <div className="text-center">
        <TrashIcon width={24} height={24} color="#9CA3AF" />
        <div className="text-xs text-gray-500 mt-1">通常</div>
      </div>
      <div className="text-center">
        <TrashIcon width={24} height={24} color="#EF4444" />
        <div className="text-xs text-gray-500 mt-1">削除時</div>
      </div>
      <div className="text-center">
        <TrashIcon width={24} height={24} color="#6B7280" />
        <div className="text-xs text-gray-500 mt-1">無効</div>
      </div>
      <div className="text-center">
        <TrashIcon width={24} height={24} color="#FFFFFF" />
        <div className="text-xs text-gray-500 mt-1">反転</div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '異なる状態での色のバリエーション',
      },
    },
  },
};