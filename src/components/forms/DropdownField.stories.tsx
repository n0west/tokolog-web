import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import DropdownField from './DropdownField';

const meta: Meta<typeof DropdownField> = {
  title: 'Components/Form/DropdownField',
  component: DropdownField,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'ドロップダウン選択コンポーネント - オプションリストから値を選択する',
      },
    },
  },
  argTypes: {
    value: {
      control: { type: 'text' },
      description: '選択された値',
    },
    onChange: {
      action: 'changed',
      description: '値変更時のコールバック',
    },
    options: {
      control: { type: 'object' },
      description: '選択肢の配列',
    },
    placeholder: {
      control: { type: 'text' },
      description: 'プレースホルダーテキスト',
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
  args: {
    onChange: (value: string) => console.log('DropdownField changed:', value),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const calculationOptions = [
  { value: 'manual', label: '手動入力' },
  { value: 'percent', label: 'パーセント計算' },
  { value: 'fixed', label: '定額割引' }
];

const categoryOptions = [
  { value: 'food', label: '食費' },
  { value: 'transport', label: '交通費' },
  { value: 'entertainment', label: '娯楽費' },
  { value: 'shopping', label: '買い物' },
  { value: 'health', label: '医療・健康' },
  { value: 'other', label: 'その他' }
];

const priorityOptions = [
  { value: 'high', label: '高' },
  { value: 'medium', label: '中' },
  { value: 'low', label: '低' }
];

// 基本表示（未選択）
export const Default: Story = {
  args: {
    value: '',
    options: calculationOptions,
    placeholder: '選択してください',
  },
};

// 値が選択された状態
export const Selected: Story = {
  args: {
    value: 'percent',
    options: calculationOptions,
    placeholder: '選択してください',
  },
};

// 計算方法の選択
export const CalculationMethod: Story = {
  args: {
    value: 'manual',
    options: calculationOptions,
    placeholder: '割引額の計算',
  },
};

// カテゴリー選択
export const CategorySelection: Story = {
  args: {
    value: 'food',
    options: categoryOptions,
    placeholder: 'カテゴリーを選択',
  },
};

// 優先度選択
export const PrioritySelection: Story = {
  args: {
    value: '',
    options: priorityOptions,
    placeholder: '優先度を選択',
  },
};

// エラー状態
export const WithError: Story = {
  args: {
    value: '',
    options: calculationOptions,
    placeholder: '選択してください',
    error: '選択項目を選んでください',
  },
};

// 選択肢が少ない場合
export const FewOptions: Story = {
  args: {
    value: '',
    options: [
      { value: 'yes', label: 'はい' },
      { value: 'no', label: 'いいえ' }
    ],
    placeholder: 'はい/いいえを選択',
  },
};

// 選択肢が多い場合
export const ManyOptions: Story = {
  args: {
    value: '',
    options: [
      { value: 'option1', label: 'オプション1' },
      { value: 'option2', label: 'オプション2' },
      { value: 'option3', label: 'オプション3' },
      { value: 'option4', label: 'オプション4' },
      { value: 'option5', label: 'オプション5' },
      { value: 'option6', label: 'オプション6' },
      { value: 'option7', label: 'オプション7' },
      { value: 'option8', label: 'オプション8' },
      { value: 'option9', label: 'オプション9' },
      { value: 'option10', label: 'オプション10' }
    ],
    placeholder: '多数の選択肢から選択',
  },
};

// 長いラベルの選択肢
export const LongLabels: Story = {
  args: {
    value: '',
    options: [
      { value: 'long1', label: 'これは非常に長いラベルの選択肢です' },
      { value: 'long2', label: '別の長いラベルを持つ選択肢' },
      { value: 'long3', label: '非常に詳細な説明を含む選択肢項目' }
    ],
    placeholder: '長いラベルの選択肢',
  },
};

// カスタムクラス適用
export const WithCustomClass: Story = {
  args: {
    value: 'medium',
    options: priorityOptions,
    placeholder: '優先度',
    className: 'max-w-xs',
  },
};