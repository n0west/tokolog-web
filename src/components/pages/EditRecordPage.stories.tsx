import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import EditRecordPage from './EditRecordPage';

const meta: Meta<typeof EditRecordPage> = {
  title: 'Pages/EditRecordPage',
  component: EditRecordPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '記録編集ページ - 既存の記録を編集・削除できるページ。削除機能はヘッダー右部のゴミ箱アイコンに配置され、誤操作を防止しています。',
      },
    },
  },
  argTypes: {
    onSave: {
      action: 'save',
      description: '保存時のコールバック',
    },
    onDelete: {
      action: 'delete',
      description: '削除時のコールバック',
    },
    onCancel: {
      action: 'cancel',
      description: 'キャンセル時のコールバック',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// おトク記録の編集
export const EditOtokuRecord: Story = {
  args: {
    recordId: '1',
    initialData: {
      id: '1',
      type: 'otoku',
      amount: 1500,
      date: '2025年1月28日',
      productName: 'スーパーでの買い物',
    },
    onSave: (data: any) => console.log('保存:', data),
    onDelete: (id: any) => console.log('削除:', id),
    onCancel: () => console.log('キャンセル'),
    isSubmitting: false,
  },
};

// ガマン記録の編集
export const EditGamanRecord: Story = {
  args: {
    recordId: '2',
    initialData: {
      id: '2',
      type: 'gaman',
      amount: 8000,
      date: '2025年1月27日',
      productName: '新しいヘッドフォン',
    },
    onSave: (data: any) => console.log('保存:', data),
    onDelete: (id: any) => console.log('削除:', id),
    onCancel: () => console.log('キャンセル'),
    isSubmitting: false,
  },
};

// 高額なおトク記録
export const EditLargeOtokuRecord: Story = {
  args: {
    recordId: '3',
    initialData: {
      id: '3',
      type: 'otoku',
      amount: 25000,
      date: '2025年1月26日',
      productName: '家電セット（大幅割引）',
    },
    onSave: (data: any) => console.log('保存:', data),
    onDelete: (id: any) => console.log('削除:', id),
    onCancel: () => console.log('キャンセル'),
    isSubmitting: false,
  },
};

// 送信中状態
export const Submitting: Story = {
  args: {
    recordId: '4',
    initialData: {
      id: '4',      
      type: 'otoku',
      amount: 500,
      date: '2025年1月25日',
      productName: 'コンビニ弁当',
    },
    onSave: (data: any) => console.log('保存:', data),
    onDelete: (id: any) => console.log('削除:', id),
    onCancel: () => console.log('キャンセル'),
    isSubmitting: true,
  },
};

// 初期データなし（新規作成風）
export const WithoutInitialData: Story = {
  args: {
    recordId: 'new',
    // initialDataを渡さない
    onSave: (data: any) => console.log('保存:', data),
    onDelete: (id: any) => console.log('削除:', id),
    onCancel: () => console.log('キャンセル'),
    isSubmitting: false,
  },
};

// 長い商品名の記録
export const EditLongProductName: Story = {
  args: {
    recordId: '5',
    initialData: {
      id: '5',
      type: 'gaman',
      amount: 120000,
      date: '2025年1月24日',
      productName: '高級ブランドの腕時計（限定モデル・日本製）',
    },
    onSave: (data: any) => console.log('保存:', data),
    onDelete: (id: any) => console.log('削除:', id),
    onCancel: () => console.log('キャンセル'),
    isSubmitting: false,
  },
};

// インタラクティブ例（削除ダイアログの動作確認）
export const InteractiveExample: Story = {
  render: (args) => {
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    
    const handleSave = (data: any) => {
      setIsSubmitting(true);
      console.log('保存中...', data);
      
      // 2秒後に完了をシミュレート
      setTimeout(() => {
        setIsSubmitting(false);
        console.log('保存完了');
        args.onSave?.(data);
      }, 2000);
    };
    
    const handleDelete = (id: string) => {
      console.log('削除実行:', id);
      args.onDelete?.(id);
    };
    
    return (
      <EditRecordPage
        {...args}
        isSubmitting={isSubmitting}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    );
  },
  args: {
    recordId: '6',
    initialData: {
      id: '6',
      type: 'otoku',
      amount: 2000,
      date: '2025年1月23日',
      productName: 'インタラクティブ例',
    },
    onCancel: () => console.log('キャンセル'),
  },
  parameters: {
    docs: {
      description: {
        story: 'インタラクティブな例。実際に保存や削除の動作を確認できます。',
      },
    },
  },
};