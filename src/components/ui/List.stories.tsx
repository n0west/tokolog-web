import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import List, { ListItem, CameraResultList, RecordListContainer } from './List';
import CameraResultItem from '../cards/CameraResultItem';
import RecordList from './RecordList';
import EditIcon from '../icons/EditIcon';

const meta: Meta<typeof List> = {
  title: 'UI/Lists/List',
  component: List,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="max-w-md mx-auto">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

// 基本的なリスト
export const Default: Story = {
  render: () => (
    <List>
      <ListItem>リストアイテム 1</ListItem>
      <ListItem>リストアイテム 2</ListItem>
      <ListItem>リストアイテム 3</ListItem>
    </List>
  ),
};

// ボーダー付きリスト
export const Bordered: Story = {
  render: () => (
    <List variant="bordered">
      <ListItem>設定項目 1</ListItem>
      <ListItem>設定項目 2</ListItem>
      <ListItem>設定項目 3</ListItem>
    </List>
  ),
};

// 分割線付きリスト
export const Divided: Story = {
  render: () => (
    <List variant="divided">
      <ListItem>アイテム A</ListItem>
      <ListItem>アイテム B</ListItem>
      <ListItem>アイテム C</ListItem>
    </List>
  ),
};

// インタラクティブなリスト
export const Interactive: Story = {
  render: () => (
    <List variant="bordered">
      <ListItem 
        variant="interactive" 
        onClick={() => console.log('Item 1 clicked')}
      >
        <div className="flex justify-between items-center w-full">
          <span>クリック可能なアイテム 1</span>
          <EditIcon width={16} height={16} color="#666" />
        </div>
      </ListItem>
      <ListItem 
        variant="interactive" 
        onClick={() => console.log('Item 2 clicked')}
      >
        <div className="flex justify-between items-center w-full">
          <span>クリック可能なアイテム 2</span>
          <EditIcon width={16} height={16} color="#666" />
        </div>
      </ListItem>
      <ListItem 
        variant="interactive" 
        onClick={() => console.log('Item 3 clicked')}
      >
        <div className="flex justify-between items-center w-full">
          <span>クリック可能なアイテム 3</span>
          <EditIcon width={16} height={16} color="#666" />
        </div>
      </ListItem>
    </List>
  ),
};

// カメラ結果リスト（CameraResultItemのバリエーション）
export const CameraResults: Story = {
  render: () => {
    const mockHandlers = {
      onEdit: (id: string) => console.log(`Edit ${id}`),
      onSave: (id: string, data: any) => console.log(`Save ${id}:`, data),
      onCancel: (id: string) => console.log(`Cancel ${id}`),
    };

    return (
      <CameraResultList>
        <CameraResultItem
          id="1"
          type="otoku"
          amount={298}
          productName="もやし"
          date="2025年1月28日"
          isEditing={false}
          {...mockHandlers}
        />
        <CameraResultItem
          id="2"
          type="otoku"
          amount={158}
          productName="豆腐"
          date="2025年1月28日"
          isEditing={false}
          {...mockHandlers}
        />
        <CameraResultItem
          id="3"
          type="otoku"
          amount={480}
          productName="キャベツ"
          date="2025年1月28日"
          isEditing={true}
          {...mockHandlers}
        />
      </CameraResultList>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'CameraResultItemを使用したリストのバリエーション。カメラで読み取った結果を表示し、編集可能なリストアイテムとして機能する。',
      },
    },
  },
};

// ガマンタイプのカメラ結果リスト
export const GamanCameraResults: Story = {
  render: () => {
    const mockHandlers = {
      onEdit: (id: string) => console.log(`Edit ${id}`),
      onSave: (id: string, data: any) => console.log(`Save ${id}:`, data),
      onCancel: (id: string) => console.log(`Cancel ${id}`),
    };

    return (
      <CameraResultList>
        <CameraResultItem
          id="1"
          type="gaman"
          amount={2980}
          productName="ジャケット"
          date="2025年1月28日"
          isEditing={false}
          {...mockHandlers}
        />
        <CameraResultItem
          id="2"
          type="gaman"
          amount={1580}
          productName="スニーカー"
          date="2025年1月28日"
          isEditing={false}
          {...mockHandlers}
        />
      </CameraResultList>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'ガマンタイプでのカメラ結果リスト表示例。',
      },
    },
  },
};

// RecordListのバリエーション
export const RecordListVariant: Story = {
  render: () => {
    const mockRecords = [
      {
        id: '1',
        type: 'otoku' as const,
        amount: 298,
        date: '2025年1月28日',
        productName: 'もやし'
      },
      {
        id: '2',
        type: 'otoku' as const,
        amount: 158,
        date: '2025年1月28日',
        productName: '豆腐'
      },
      {
        id: '3',
        type: 'gaman' as const,
        amount: 2980,
        date: '2025年1月27日',
        productName: 'ジャケット'
      }
    ];

    return (
      <RecordList
        records={mockRecords}
        title="最近の記録"
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'RecordListコンポーネントをListsの子要素として使用した例。RecordCardを使用してレコードを表示する。',
      },
    },
  },
};

// 複雑なリストアイテム
export const ComplexItems: Story = {
  render: () => (
    <List variant="bordered">
      <ListItem variant="interactive">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-otoku rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">お</span>
            </div>
            <div>
              <div className="font-medium text-primary">今月のおトク</div>
              <div className="text-sm text-secondary">¥15,280</div>
            </div>
          </div>
          <EditIcon width={20} height={20} color="#666" />
        </div>
      </ListItem>
      <ListItem variant="interactive">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gaman rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">ガ</span>
            </div>
            <div>
              <div className="font-medium text-primary">今月のガマン</div>
              <div className="text-sm text-secondary">¥28,400</div>
            </div>
          </div>
          <EditIcon width={20} height={20} color="#666" />
        </div>
      </ListItem>
    </List>
  ),
};