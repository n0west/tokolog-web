import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import ModalSection from './ModalSection';

const meta: Meta<typeof ModalSection> = {
  title: 'Sections/ModalSection',
  component: ModalSection,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '登録完了モーダル - チェックマークアイコン、登録内容、OKボタンを表示',
      },
    },
  },
  argTypes: {
    isOpen: {
      control: { type: 'boolean' },
      description: 'モーダルの表示状態',
    },
    onClose: {
      action: 'モーダル閉じる',
      description: 'モーダルを閉じる時のコールバック',
    },
    type: {
      control: { type: 'select' },
      options: ['otoku', 'gaman'],
      description: '記録タイプ（おトク or ガマン）',
    },
    amount: {
      control: { type: 'number' },
      description: '記録した金額',
    },
    date: {
      control: { type: 'text' },
      description: '記録日付',
    },
    productName: {
      control: { type: 'text' },
      description: '商品名',
    },
    title: {
      control: { type: 'text' },
      description: 'モーダルタイトル',
    },
    className: {
      control: { type: 'text' },
      description: '追加のCSSクラス',
    },
  },
  args: {
    onClose: () => console.log('モーダルが閉じられました'),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// おトク記録完了
export const OtokuComplete: Story = {
  args: {
    isOpen: true,
    type: 'otoku',
    amount: 9999,
    date: '2025年1月28日',
    productName: 'もやし',
  },
};

// ガマン記録完了
export const GamanComplete: Story = {
  args: {
    isOpen: true,
    type: 'gaman',
    amount: 15000,
    date: '2025年1月28日',
    productName: 'ブランドバッグ',
  },
};

// 大きな金額のおトク
export const LargeAmountOtoku: Story = {
  args: {
    isOpen: true,
    type: 'otoku',
    amount: 250000,
    date: '2025年1月28日',
    productName: '家電セット（大幅割引）',
  },
};

// 長い商品名
export const LongProductName: Story = {
  args: {
    isOpen: true,
    type: 'gaman',
    amount: 85000,
    date: '2025年1月28日',
    productName: '有機野菜詰め合わせセット（キャベツ、にんじん、玉ねぎ、じゃがいも、ブロッコリー）',
  },
};

// カスタムタイトル
export const CustomTitle: Story = {
  args: {
    isOpen: true,
    type: 'otoku',
    amount: 1200,
    date: '2025年1月28日',
    productName: 'コーヒー豆',
    title: '記録が保存されました',
  },
};

// 小額のガマン
export const SmallAmountGaman: Story = {
  args: {
    isOpen: true,
    type: 'gaman',
    amount: 150,
    date: '2025年1月28日',
    productName: 'お菓子',
  },
};

// 閉じた状態（非表示）
export const Closed: Story = {
  args: {
    isOpen: false,
    type: 'otoku',
    amount: 9999,
    date: '2025年1月28日',
    productName: 'もやし',
  },
  parameters: {
    docs: {
      description: {
        story: 'isOpen=falseの場合、モーダルは表示されません',
      },
    },
  },
};

// インタラクティブな例
export const Interactive: Story = {
  args: {
    isOpen: true,
    type: 'otoku',
    amount: 9999,
    date: '2025年1月28日',
    productName: 'もやし',
  },
  render: (args) => {
    const [isOpen, setIsOpen] = React.useState(args.isOpen);
    
    return (
      <div>
        {!isOpen && (
          <div className="p-8 text-center">
            <button
              onClick={() => setIsOpen(true)}
              className="bg-otoku text-white px-6 py-3 rounded-lg font-bold hover:opacity-90"
            >
              モーダルを表示
            </button>
          </div>
        )}
        <ModalSection
          type={args.type}
          amount={args.amount}
          date={args.date}
          productName={args.productName}
          title={args.title}
          className={args.className}
          isOpen={isOpen}
          onClose={() => {
            setIsOpen(false);
            args.onClose?.();
          }}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'インタラクティブな例。モーダルの開閉を実際に試すことができます。',
      },
    },
  },
};

// 背景クリックで閉じる例
export const ClickOutsideToClose: Story = {
  args: {
    isOpen: true,
    type: 'gaman',
    amount: 3500,
    date: '2025年1月28日',
    productName: 'ランチセット',
  },
  parameters: {
    docs: {
      description: {
        story: '背景（オーバーレイ）をクリックするとモーダルが閉じます。',
      },
    },
  },
};

// モバイル表示
export const Mobile: Story = {
  args: {
    isOpen: true,
    type: 'otoku',
    amount: 9999,
    date: '2025年1月28日',
    productName: 'もやし',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'モバイルデバイスでの表示例',
      },
    },
  },
};