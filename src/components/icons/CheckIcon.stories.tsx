import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import CheckIcon from './CheckIcon';

const meta: Meta<typeof CheckIcon> = {
  title: 'Foundation/Icons/CheckIcon',
  component: CheckIcon,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'チェックマークアイコン - 成功や完了を示すアイコン',
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
    color: '#10B981',
  },
};

// 小さいサイズ
export const Small: Story = {
  args: {
    width: 16,
    height: 16,
    color: '#10B981',
  },
};

// 大きいサイズ
export const Large: Story = {
  args: {
    width: 48,
    height: 48,
    color: '#10B981',
  },
};

// 緑色（成功）
export const Green: Story = {
  args: {
    width: 32,
    height: 32,
    color: '#10B981',
  },
};

// 青色
export const Blue: Story = {
  args: {
    width: 32,
    height: 32,
    color: '#3B82F6',
  },
};

// グレー
export const Gray: Story = {
  args: {
    width: 32,
    height: 32,
    color: '#6B7280',
  },
};

// 白色（暗い背景用）
export const White: Story = {
  args: {
    width: 32,
    height: 32,
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

// 円形背景付き（モーダル風）
export const WithCircleBackground: Story = {
  args: {
    width: 32,
    height: 32,
    color: '#10B981',
  },
  render: (args) => (
    <div className="bg-blue-50 rounded-full p-4 border-2 border-blue-100 inline-flex">
      <CheckIcon {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'モーダルで使用される円形背景付きのスタイル',
      },
    },
  },
};

// 成功メッセージ付き
export const WithSuccessMessage: Story = {
  args: {
    width: 24,
    height: 24,
    color: '#10B981',
  },
  render: (args) => (
    <div className="flex items-center space-x-2 p-4 bg-green-50 border border-green-200 rounded-lg">
      <CheckIcon {...args} />
      <span className="text-green-800 font-medium">完了しました</span>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '成功メッセージと組み合わせた使用例',
      },
    },
  },
};

// 様々なサイズ比較
export const SizeComparison: Story = {
  render: () => (
    <div className="flex items-center space-x-4">
      <div className="text-center">
        <CheckIcon width={16} height={16} color="#10B981" />
        <div className="text-xs text-gray-500 mt-1">16px</div>
      </div>
      <div className="text-center">
        <CheckIcon width={24} height={24} color="#10B981" />
        <div className="text-xs text-gray-500 mt-1">24px</div>
      </div>
      <div className="text-center">
        <CheckIcon width={32} height={32} color="#10B981" />
        <div className="text-xs text-gray-500 mt-1">32px</div>
      </div>
      <div className="text-center">
        <CheckIcon width={48} height={48} color="#10B981" />
        <div className="text-xs text-gray-500 mt-1">48px</div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '異なるサイズのアイコンの比較',
      },
    },
  },
};

// 色のバリエーション
export const ColorVariations: Story = {
  render: () => (
    <div className="flex items-center space-x-4">
      <div className="text-center">
        <CheckIcon width={32} height={32} color="#10B981" />
        <div className="text-xs text-gray-500 mt-1">成功</div>
      </div>
      <div className="text-center">
        <CheckIcon width={32} height={32} color="#3B82F6" />
        <div className="text-xs text-gray-500 mt-1">情報</div>
      </div>
      <div className="text-center">
        <CheckIcon width={32} height={32} color="#6B7280" />
        <div className="text-xs text-gray-500 mt-1">無効</div>
      </div>
      <div className="text-center">
        <CheckIcon width={32} height={32} color="#F59E0B" />
        <div className="text-xs text-gray-500 mt-1">警告</div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '異なる用途に応じた色のバリエーション',
      },
    },
  },
};