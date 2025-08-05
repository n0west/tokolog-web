import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import FormField from './FormField';

const meta: Meta<typeof FormField> = {
  title: 'Components/Form/FormField',
  component: FormField,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'フォームフィールドコンポーネント - ラベル、必須マーク、エラーメッセージを統一的に表示',
      },
    },
  },
  argTypes: {
    label: {
      control: { type: 'text' },
      description: 'フィールドのラベル',
    },
    required: {
      control: { type: 'boolean' },
      description: '必須項目の表示',
    },
    error: {
      control: { type: 'text' },
      description: 'エラーメッセージ',
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
    label: '商品名',
    children: (
      <input
        type="text"
        placeholder="商品名を入力してください"
        className="w-full px-4 py-3 border-2 border-sub-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    ),
  },
};

// 必須項目
export const Required: Story = {
  args: {
    label: '商品名',
    required: true,
    children: (
      <input
        type="text"
        placeholder="商品名を入力してください"
        className="w-full px-4 py-3 border-2 border-sub-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    ),
  },
};

// エラー状態
export const WithError: Story = {
  args: {
    label: '商品名',
    required: true,
    error: '商品名を入力してください',
    children: (
      <input
        type="text"
        placeholder="商品名を入力してください"
        className="w-full px-4 py-3 border-2 border-red-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
      />
    ),
  },
};

// テキストエリア
export const WithTextarea: Story = {
  args: {
    label: 'メモ',
    children: (
      <textarea
        placeholder="メモを入力してください（任意）"
        rows={3}
        className="w-full px-4 py-3 border border-sub-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      />
    ),
  },
};

// 数値入力
export const WithNumberInput: Story = {
  args: {
    label: '割引額',
    required: true,
    children: (
      <div className="relative">
        <input
          type="text"
          placeholder="0"
          className="w-full px-4 py-3 pr-12 border border-sub-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-primary font-medium">
          円
        </span>
      </div>
    ),
  },
};

// ドロップダウン
export const WithDropdown: Story = {
  args: {
    label: '割引額の計算',
    children: (
      <div className="relative">
        <button
          type="button"
          className="w-full px-4 py-3 text-left bg-white border border-sub-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between text-secondary"
        >
          <span>割引額の計算</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    ),
  },
};