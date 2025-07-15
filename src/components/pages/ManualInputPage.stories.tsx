import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import ManualInputPage from './ManualInputPage';

const meta: Meta<typeof ManualInputPage> = {
  title: 'Pages/ManualInputPage',
  component: ManualInputPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '手動入力ページ - おトク・ガマンの記録を手動で入力するためのフォームページ',
      },
    },
  },
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['otoku', 'gaman'],
      description: 'おトク・ガマンのタイプ',
    },
    onBack: {
      action: 'back clicked',
      description: '戻るボタンクリック時のコールバック',
    },
    onSubmit: {
      action: 'form submitted',
      description: 'フォーム送信時のコールバック',
    },
    className: {
      control: { type: 'text' },
      description: '追加のCSSクラス',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// おトクタイプ - 基本表示
export const OtokuDefault: Story = {
  args: {
    type: 'otoku',
    onBack: () => console.log('Back clicked'),
    onSubmit: (data: { productName: string; amount: string; gamanReason?: string; memo: string }) => console.log('Form submitted:', data),
  },
};

// ガマンタイプ - 基本表示
export const GamanDefault: Story = {
  args: {
    type: 'gaman',
    onBack: () => console.log('Back clicked'),
    onSubmit: (data: { productName: string; amount: string; gamanReason?: string; memo: string }) => console.log('Form submitted:', data),
  },
};

// おトクタイプ - コールバックなし
export const OtokuNoCallbacks: Story = {
  args: {
    type: 'otoku',
  },
};

// ガマンタイプ - コールバックなし
export const GamanNoCallbacks: Story = {
  args: {
    type: 'gaman',
  },
};

// カスタムクラス適用
export const WithCustomClass: Story = {
  args: {
    type: 'otoku',
    className: 'custom-container',
    onBack: () => console.log('Back clicked'),
    onSubmit: (data: { productName: string; amount: string; gamanReason?: string; memo: string }) => console.log('Form submitted:', data),
  },
};

// インタラクション例（バリデーションテスト用）
export const ValidationExample: Story = {
  args: {
    type: 'gaman',
    onBack: () => alert('戻るボタンがクリックされました'),
    onSubmit: (data: { productName: string; amount: string; gamanReason?: string; memo: string }) => {
      if (data.productName && data.amount) {
        alert(`送信成功: ${data.productName} - ${data.amount}円`);
      } else {
        alert('バリデーションエラーが発生します');
      }
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'バリデーション機能をテストするためのストーリー。必須項目が空の状態で登録ボタンを押すとエラーが表示されます。',
      },
    },
  },
};

// モバイル表示想定
export const MobileView: Story = {
  args: {
    type: 'otoku',
    onBack: () => console.log('Back clicked'),
    onSubmit: (data: { productName: string; amount: string; gamanReason?: string; memo: string }) => console.log('Form submitted:', data),
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'モバイルデバイスでの表示を想定したストーリー',
      },
    },
  },
};

// タブレット表示想定
export const TabletView: Story = {
  args: {
    type: 'gaman',
    onBack: () => console.log('Back clicked'),
    onSubmit: (data: { productName: string; amount: string; gamanReason?: string; memo: string }) => console.log('Form submitted:', data),
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    docs: {
      description: {
        story: 'タブレットデバイスでの表示を想定したストーリー',
      },
    },
  },
};