import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import RecordMethodPage from './RecordMethodPage';

const meta: Meta<typeof RecordMethodPage> = {
  title: 'Pages/RecordMethodPage',
  component: RecordMethodPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '記録方法選択ページ - おトクまたはガマンの記録方法を選択',
      },
    },
  },
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['otoku', 'gaman'],
      description: '記録タイプ（おトク or ガマン）',
    },
    onBack: {
      action: '戻るクリック',
      description: '戻るボタンクリック時のコールバック',
    },
    onCameraClick: {
      action: 'カメラクリック',
      description: '撮影ボタンクリック時のコールバック',
    },
    onGalleryClick: {
      action: 'ギャラリークリック',
      description: 'カメラロールボタンクリック時のコールバック',
    },
    onManualClick: {
      action: '手動入力クリック',
      description: '手動入力ボタンクリック時のコールバック',
    },
    className: {
      control: { type: 'text' },
      description: '追加のCSSクラス',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// おトク記録ページ
export const OtokuRecord: Story = {
  args: {
    type: 'otoku',
    onBack: () => console.log('戻るがクリックされました'),
    onCameraClick: () => console.log('カメラがクリックされました'),
    onGalleryClick: () => console.log('ギャラリーがクリックされました'),
    onManualClick: () => console.log('手動入力がクリックされました'),
  },
};

// ガマン記録ページ
export const GamanRecord: Story = {
  args: {
    type: 'gaman',
    onBack: () => console.log('戻るがクリックされました'),
    onCameraClick: () => console.log('カメラがクリックされました'),
    onGalleryClick: () => console.log('ギャラリーがクリックされました'),
    onManualClick: () => console.log('手動入力がクリックされました'),
  },
};

// コールバックなし（デバッグ用）
export const NoCallbacks: Story = {
  args: {
    type: 'otoku',
    // コールバックを指定しない
  },
};

// モバイル表示確認
export const Mobile: Story = {
  args: {
    type: 'otoku',
    onBack: () => console.log('戻るがクリックされました'),
    onCameraClick: () => console.log('カメラがクリックされました'),
    onGalleryClick: () => console.log('ギャラリーがクリックされました'),
    onManualClick: () => console.log('手動入力がクリックされました'),
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

// タブレット表示確認
export const Tablet: Story = {
  args: {
    type: 'otoku',
    onBack: () => console.log('戻るがクリックされました'),
    onCameraClick: () => console.log('カメラがクリックされました'),
    onGalleryClick: () => console.log('ギャラリーがクリックされました'),
    onManualClick: () => console.log('手動入力がクリックされました'),
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};