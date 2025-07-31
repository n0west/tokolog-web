import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import CameraResultPage from './CameraResultPage';

const meta: Meta<typeof CameraResultPage> = {
  title: 'Pages/CameraResultPage',
  component: CameraResultPage,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// モックの画像データ（小さなグレーの矩形）
const mockImageData = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDEyOCAxNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTYwIiBmaWxsPSIjQzRDNEM0Ii8+Cjx0ZXh0IHg9IjY0IiB5PSI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzY2NjY2NiIgZm9udC1zaXplPSIxMiI+UmVjZWlwdDwvdGV4dD4KPC9zdmc+';

const mockExtractedData = [
  {
    id: '1',
    amount: 9999,
    productName: 'もやし'
  },
  {
    id: '2',
    amount: 9999,
    productName: 'もやし'
  },
  {
    id: '3',
    amount: 9999,
    productName: 'もやし'
  }
];

export const OtokuDefault: Story = {
  args: {
    type: 'otoku',
    imageData: mockImageData,
    extractedData: mockExtractedData,
    onBack: () => console.log('Back clicked'),
    onRegisterAll: (data) => console.log('Register all:', data),
    isRegistering: false,
  },
};

export const GamanDefault: Story = {
  args: {
    type: 'gaman',
    imageData: mockImageData,
    extractedData: [
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
    ],
    onBack: () => console.log('Back clicked'),
    onRegisterAll: (data) => console.log('Register all:', data),
    isRegistering: false,
  },
};

export const Registering: Story = {
  args: {
    type: 'otoku',
    imageData: mockImageData,
    extractedData: mockExtractedData,
    onBack: () => console.log('Back clicked'),
    onRegisterAll: (data) => console.log('Register all:', data),
    isRegistering: true,
  },
};

export const EmptyResults: Story = {
  args: {
    type: 'otoku',
    imageData: mockImageData,
    extractedData: [],
    onBack: () => console.log('Back clicked'),
    onRegisterAll: (data) => console.log('Register all:', data),
    isRegistering: false,
  },
};

export const SingleItem: Story = {
  args: {
    type: 'gaman',
    imageData: mockImageData,
    extractedData: [
      {
        id: '1',
        amount: 5800,
        productName: 'ワイヤレスイヤホン'
      }
    ],
    onBack: () => console.log('Back clicked'),
    onRegisterAll: (data) => console.log('Register all:', data),
    isRegistering: false,
  },
};