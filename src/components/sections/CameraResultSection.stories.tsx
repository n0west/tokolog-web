import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import CameraResultSection from './CameraResultSection';

const meta: Meta<typeof CameraResultSection> = {
  title: 'Sections/CameraResultSection',
  component: CameraResultSection,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="bg-home min-h-screen p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

// モックの画像データ（レシートをイメージした画像）
const mockReceiptImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDEyOCAxNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTYwIiBmaWxsPSIjRjVGNUY1IiBzdHJva2U9IiNEREREREQiLz4KPHR5IHg9IjEwIiB5PSIyMCIgZm9udC1zaXplPSI5IiBmaWxsPSIjMzMzMzMzIj5TdXBlcm1hcmtldDwvdGV4dD4KPHR5IHg9IjEwIiB5PSI0MCIgZm9udC1zaXplPSI4IiBmaWxsPSIjNjY2NjY2Ij7jgoLjgoTjgZcgwq0xNTjjgIApPC90ZXh0Pgo8dGV4dCB4PSI5MCIgeT0iNDAiIGZvbnQtc2l6ZT0iOCIgZmlsbD0iIzY2NjY2NiI+wqUyOTg8L3RleHQ+Cjx0ZXh0IHg9IjEwIiB5PSI2MCIgZm9udC1zaXplPSI4IiBmaWxsPSIjNjY2NjY2Ij7ooYzmiI/orInmv6ogwqUzODgjgIApPC90ZXh0Pgo8dGV4dCB4PSI5MCIgeT0iNjAiIGZvbnQtc2l6ZT0iOCIgZmlsbD0iIzY2NjY2NiI+wqU0ODA8L3RleHQ+Cjx0ZXh0IHg9IjEwIiB5PSIxMDAiIGZvbnQtc2l6ZT0iOCIgZmlsbD0iIzMzMzMzMyI+5ZCI6KiIMTIzNOWGhzwvdGV4dD4KPC9zdmc+';

const mockOtokuData = [
  {
    id: '1',
    amount: 298,
    productName: 'もやし'
  },
  {
    id: '2',
    amount: 158,
    productName: '豆腐'
  },
  {
    id: '3',
    amount: 480,
    productName: 'キャベツ'
  }
];

const mockGamanData = [
  {
    id: '1',
    amount: 2980,
    productName: 'ジャケット'
  },
  {
    id: '2',
    amount: 1580,
    productName: 'スニーカー'
  }
];

// おトク結果の基本表示
export const OtokuResults: Story = {
  args: {
    type: 'otoku',
    imageData: mockReceiptImage,
    extractedData: mockOtokuData,
    onDataChange: (data) => console.log('Data changed:', data),
  },
};

// ガマン結果の表示
export const GamanResults: Story = {
  args: {
    type: 'gaman',
    imageData: mockReceiptImage,
    extractedData: mockGamanData,
    onDataChange: (data) => console.log('Data changed:', data),
  },
};

// 単一アイテム
export const SingleItem: Story = {
  args: {
    type: 'otoku',
    imageData: mockReceiptImage,
    extractedData: [
      {
        id: '1',
        amount: 9999,
        productName: 'もやし'
      }
    ],
    onDataChange: (data) => console.log('Data changed:', data),
  },
};

// 結果が空の場合
export const EmptyResults: Story = {
  args: {
    type: 'otoku',
    imageData: mockReceiptImage,
    extractedData: [],
    onDataChange: (data) => console.log('Data changed:', data),
  },
};

// 多数のアイテム
export const ManyItems: Story = {
  args: {
    type: 'gaman',
    imageData: mockReceiptImage,
    extractedData: [
      { id: '1', amount: 1280, productName: 'Tシャツ' },
      { id: '2', amount: 2980, productName: 'ジーンズ' },
      { id: '3', amount: 5800, productName: 'スニーカー' },
      { id: '4', amount: 3200, productName: 'キャップ' },
      { id: '5', amount: 890, productName: 'ソックス' },
      { id: '6', amount: 15800, productName: 'ジャケット' },
    ],
    onDataChange: (data) => console.log('Data changed:', data),
  },
};

// 高額アイテム
export const HighValueItems: Story = {
  args: {
    type: 'gaman',
    imageData: mockReceiptImage,
    extractedData: [
      {
        id: '1',
        amount: 298000,
        productName: '4K液晶テレビ'
      },
      {
        id: '2',
        amount: 45800,
        productName: 'ワイヤレスイヤホン'
      }
    ],
    onDataChange: (data) => console.log('Data changed:', data),
  },
};