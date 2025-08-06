import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';

const meta: Meta<typeof DeleteConfirmationDialog> = {
  title: 'Components/Navigation/DeleteConfirmationDialog',
  component: DeleteConfirmationDialog,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '削除確認ダイアログ - 記録削除時の確認ダイアログ',
      },
    },
  },
  argTypes: {
    onConfirm: {
      action: 'confirm',
      description: '削除確認時のコールバック',
    },
    onCancel: {
      action: 'cancel', 
      description: 'キャンセル時のコールバック',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 基本表示
export const Default: Story = {
  args: {
    isOpen: true,
    recordName: 'スーパーでの買い物',
    onConfirm: () => console.log('削除確認'),
    onCancel: () => console.log('キャンセル'),
  },
};

// 長い商品名
export const LongRecordName: Story = {
  args: {
    isOpen: true,
    recordName: '高級ブランドの腕時計（限定モデル・日本製・シリアルナンバー付き）',
    onConfirm: () => console.log('削除確認'),
    onCancel: () => console.log('キャンセル'),
  },
};

// 短い商品名
export const ShortRecordName: Story = {
  args: {
    isOpen: true,
    recordName: '弁当',
    onConfirm: () => console.log('削除確認'),
    onCancel: () => console.log('キャンセル'),
  },
};

// 閉じた状態（非表示）
export const Closed: Story = {
  args: {
    isOpen: false,
    recordName: 'テスト記録',
    onConfirm: () => console.log('削除確認'),
    onCancel: () => console.log('キャンセル'),
  },
};

// インタラクティブな例
export const Interactive: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = React.useState(false);
    
    const handleConfirm = () => {
      console.log('削除を実行しました');
      setIsOpen(false);
      args.onConfirm?.();
    };
    
    const handleCancel = () => {
      console.log('削除をキャンセルしました');
      setIsOpen(false);
      args.onCancel?.();
    };
    
    return (
      <div className="p-8">
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          削除ボタンをクリック
        </button>
        
        <DeleteConfirmationDialog
          isOpen={isOpen}
          recordName="インタラクティブ例の記録"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'インタラクティブな例。ボタンをクリックしてダイアログの動作を確認できます。',
      },
    },
  },
};

// 背景との組み合わせテスト
export const OnColoredBackground: Story = {
  args: {
    isOpen: true,
    recordName: '背景テスト用記録',
    onConfirm: () => console.log('削除確認'),
    onCancel: () => console.log('キャンセル'),
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-500">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: '色付き背景でのダイアログ表示テスト。オーバーレイの効果を確認できます。',
      },
    },
  },
};