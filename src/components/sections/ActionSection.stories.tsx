import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import ActionSection from './ActionSection';

const meta: Meta<typeof ActionSection> = {
  title: 'Sections/ActionSection',
  component: ActionSection,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '記録するセクション - おトクとガマンのActionButtonを横並びで表示',
      },
    },
  },
  argTypes: {
    onOtokuClick: {
      action: 'おトククリック',
      description: 'おトクボタンクリック時のコールバック',
    },
    onGamanClick: {
      action: 'ガマンクリック', 
      description: 'ガマンボタンクリック時のコールバック',
    },
    title: {
      control: { type: 'text' },
      description: 'セクションタイトル',
    },
    showTitle: {
      control: { type: 'boolean' },
      description: 'タイトル表示の有無',
    },
    isLoading: {
      control: { type: 'boolean' },
      description: 'ローディング状態（ボタン無効化）',
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
    onOtokuClick: () => console.log('おトクがクリックされました'),
    onGamanClick: () => console.log('ガマンがクリックされました'),
  },
};

// タイトル非表示
export const WithoutTitle: Story = {
  args: {
    onOtokuClick: () => console.log('おトクがクリックされました'),
    onGamanClick: () => console.log('ガマンがクリックされました'),
    showTitle: false,
  },
};

// カスタムタイトル
export const CustomTitle: Story = {
  args: {
    onOtokuClick: () => console.log('おトクがクリックされました'),
    onGamanClick: () => console.log('ガマンがクリックされました'),
    title: '今日の記録',
  },
};

// ローディング状態
export const Loading: Story = {
  args: {
    onOtokuClick: () => console.log('おトクがクリックされました'),
    onGamanClick: () => console.log('ガマンがクリックされました'),
    isLoading: true,
  },
};

// モバイル表示確認用（縦並び）
export const Mobile: Story = {
  args: {
    onOtokuClick: () => console.log('おトクがクリックされました'),
    onGamanClick: () => console.log('ガマンがクリックされました'),
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

// アクションなし（非活性状態のテスト）
export const NoActions: Story = {
  args: {
    // onOtokuClick, onGamanClickを指定しない
  },
};