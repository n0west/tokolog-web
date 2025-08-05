import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import ResponsiveContainer from './ResponsiveContainer';

const meta: Meta<typeof ResponsiveContainer> = {
  title: 'Layout/ResponsiveContainer',
  component: ResponsiveContainer,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// ページバリアント
export const PageVariant: Story = {
  args: {
    variant: 'page',
    children: (
      <div className="bg-home min-h-screen">
        <div className="bg-white p-4 m-4 rounded-lg border">
          <h1 className="text-xl font-bold mb-4">ページレイアウト例</h1>
          <p className="text-secondary">
            大きめのスマートフォンサイズ（max-w-md: 448px）に制限され、
            タブレットやPCでは左右に空白が表示されます。
          </p>
        </div>
      </div>
    ),
  },
};

// セクションバリアント
export const SectionVariant: Story = {
  args: {
    variant: 'section',
    children: (
      <div className="bg-white rounded-lg border p-6 my-4">
        <h2 className="text-lg font-bold mb-2">セクション例</h2>
        <p className="text-secondary">
          セクション用レイアウト。外側の余白は各セクションで管理します。
        </p>
      </div>
    ),
  },
  decorators: [
    (Story) => (
      <div className="bg-home min-h-screen p-4">
        <Story />
      </div>
    ),
  ],
};

// コンテンツバリアント
export const ContentVariant: Story = {
  args: {
    variant: 'content',
    children: (
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-lg font-bold mb-2">コンテンツ例</h2>
        <p className="text-secondary">
          コンテンツ用レイアウト。px-4のパディングが自動的に適用されます。
        </p>
      </div>
    ),
  },
  decorators: [
    (Story) => (
      <div className="bg-home min-h-screen py-4">
        <Story />
      </div>
    ),
  ],
};

// 複数セクションの例
export const MultipleSections: Story = {
  render: () => (
    <ResponsiveContainer variant="page">
      <div className="bg-home min-h-screen">
        <ResponsiveContainer variant="content" className="py-4">
          <div className="bg-white rounded-lg border p-6 mb-4">
            <h2 className="text-lg font-bold mb-2">セクション 1</h2>
            <p className="text-secondary">最初のセクション</p>
          </div>
        </ResponsiveContainer>
        
        <ResponsiveContainer variant="content">
          <div className="bg-white rounded-lg border p-6 mb-4">
            <h2 className="text-lg font-bold mb-2">セクション 2</h2>
            <p className="text-secondary">2番目のセクション</p>
          </div>
        </ResponsiveContainer>
        
        <ResponsiveContainer variant="content" className="pb-4">
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-bold mb-2">セクション 3</h2>
            <p className="text-secondary">最後のセクション</p>
          </div>
        </ResponsiveContainer>
      </div>
    </ResponsiveContainer>
  ),
};