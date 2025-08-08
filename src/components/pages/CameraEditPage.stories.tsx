import type { Meta, StoryObj } from '@storybook/react';
import CameraEditPage, { CameraEditItem } from './CameraEditPage';

const meta = {
  title: 'Pages/CameraEditPage',
  component: CameraEditPage,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CameraEditPage>;

export default meta;
type Story = StoryObj<typeof meta>;

// サンプルデータ
const sampleOtokuItem: CameraEditItem = {
  id: '1',
  productName: 'おいしいりんご',
  amount: 100,
  confidence: 0.85,
};

const sampleGamanItem: CameraEditItem = {
  id: '1',
  productName: '高級アイスクリーム',
  amount: 500,
  confidence: 0.90,
};

const emptyItem: CameraEditItem = {
  id: '1',
  productName: '',
  amount: 0,
};

const defaultArgs = {
  onSave: async (item: CameraEditItem) => {
    console.log('保存:', item);
    await new Promise(resolve => setTimeout(resolve, 1000));
  },
  onDelete: async (itemId: string) => {
    console.log('削除:', itemId);
    await new Promise(resolve => setTimeout(resolve, 500));
  },
  onBack: () => console.log('戻る'),
  isSubmitting: false,
};

export const OtokuWithConfidence: Story = {
  args: {
    ...defaultArgs,
    type: 'otoku',
    item: sampleOtokuItem,
  },
};

export const OtokuEdit: Story = {
  args: {
    ...defaultArgs,
    type: 'otoku',
    item: sampleOtokuItem,
  },
};

export const GamanEdit: Story = {
  args: {
    ...defaultArgs,
    type: 'gaman',
    item: sampleGamanItem,
  },
};

export const NewItem: Story = {
  args: {
    ...defaultArgs,
    type: 'otoku',
    item: emptyItem,
  },
};

export const LoadingState: Story = {
  args: {
    ...defaultArgs,
    type: 'otoku',
    item: sampleOtokuItem,
    isSubmitting: true,
  },
};

export const LowConfidenceItem: Story = {
  args: {
    ...defaultArgs,
    type: 'otoku',
    item: {
      id: '1',
      productName: 'あいまいな文字',
      amount: 200,
      confidence: 0.32,
    },
  },
};

export const WithDelete: Story = {
  args: {
    ...defaultArgs,
    type: 'otoku',
    item: sampleOtokuItem,
    onDelete: async (itemId: string) => {
      console.log('削除:', itemId);
      await new Promise(resolve => setTimeout(resolve, 500));
    },
  },
};