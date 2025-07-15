import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import NumberInput from './NumberInput';

const meta: Meta<typeof NumberInput> = {
  title: 'Components/Forms/NumberInput',
  component: NumberInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '数値入力コンポーネント - 数値のみの入力を受け付け、接尾辞の表示に対応',
      },
    },
  },
  argTypes: {
    value: {
      control: { type: 'text' },
      description: '入力値',
    },
    onChange: {
      action: 'changed',
      description: '値変更時のコールバック',
    },
    placeholder: {
      control: { type: 'text' },
      description: 'プレースホルダーテキスト',
    },
    suffix: {
      control: { type: 'text' },
      description: '接尾辞（「円」など）',
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
    onChange: (value: string) => console.log('NumberInput changed:', value),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 基本表示
export const Default: Story = {
  args: {
    value: '',
    placeholder: '数値を入力してください',
  },
};

// 円接尾辞付き
export const WithYenSuffix: Story = {
  args: {
    value: '1000',
    placeholder: '0',
    suffix: '円',
  },
};

// パーセント接尾辞付き
export const WithPercentSuffix: Story = {
  args: {
    value: '15',
    placeholder: '0',
    suffix: '%',
  },
};

// エラー状態
export const WithError: Story = {
  args: {
    value: '',
    placeholder: '0',
    suffix: '円',
    error: '金額を入力してください',
  },
};

// 大きな値
export const WithLargeValue: Story = {
  args: {
    value: '123456',
    placeholder: '0',
    suffix: '円',
  },
};

// 空の状態
export const Empty: Story = {
  args: {
    value: '',
    placeholder: '金額を入力',
    suffix: '円',
  },
};

// カスタムクラス
export const WithCustomClass: Story = {
  args: {
    value: '500',
    placeholder: '0',
    suffix: '円',
    className: 'max-w-xs',
  },
};

// 長い接尾辞
export const WithLongSuffix: Story = {
  args: {
    value: '100',
    placeholder: '0',
    suffix: 'ポイント',
  },
};