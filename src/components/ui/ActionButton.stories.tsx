import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import ActionButton from './ActionButton';

const meta: Meta<typeof ActionButton> = {
  title: 'Components/Navigation/ActionButton',
  component: ActionButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['otoku', 'gaman', 'neutral'],
      description: 'ボタンのタイプ（色・機能を決定）',
    },
    variant: {
      control: { type: 'select' },
      options: ['record', 'camera', 'manual', 'gallery', 'default', 'settings'],
      description: 'ボタンの表示形式',
    },
    disabled: {
      control: { type: 'boolean' },
      description: '無効状態',
    },
    subtitle: {
      control: { type: 'text' },
      description: 'カスタムサブタイトル（空文字で非表示）',
    },
    title: {
      control: { type: 'text' },
      description: 'カスタムタイトル（指定時はデフォルトタイトルを上書き）',
    },
    onClick: { 
      action: 'clicked',
      description: 'クリック時のアクション',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// === 基本パターン ===
export const Otoku: Story = {
  args: {
    type: 'otoku',
    variant: 'record',
  },
};

export const Gaman: Story = {
  args: {
    type: 'gaman',
    variant: 'record',
  },
};

export const Neutral: Story = {
  args: {
    type: 'neutral',
    variant: 'record',
  },
};

// === バリアント比較 ===

export const VariantComparison: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold mb-4">おトクボタン - 全バリアント</h3>
        <div className="space-y-3 w-80">
          <ActionButton type="otoku" variant="record" />
          <ActionButton type="otoku" variant="camera" />
          <ActionButton type="otoku" variant="manual" />
          <ActionButton type="otoku" variant="gallery" />
          <ActionButton type="otoku" variant="default" />
        </div>
      </div>
    </div>
  ),
};

export const TypeComparison: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold mb-4">タイプ比較 - recordバリアント</h3>
        <div className="flex space-x-4">
          <ActionButton type="otoku" variant="record" />
          <ActionButton type="gaman" variant="record" />
          <ActionButton type="neutral" variant="record" />
        </div>
      </div>
      <div>
        <h3 className="text-lg font-bold mb-4">タイプ比較 - cameraバリアント</h3>
        <div className="space-y-3 w-80">
          <ActionButton type="otoku" variant="camera" />
          <ActionButton type="gaman" variant="camera" />
          <ActionButton type="neutral" variant="camera" />
        </div>
      </div>
    </div>
  ),
};

// === 実用的なレイアウト例 ===

export const SideBySide: Story = {
  render: () => (
    <div className="flex space-x-4 w-96">
      <ActionButton type="otoku" variant="record" />
      <ActionButton type="gaman" variant="record" />
    </div>
  ),
};

export const VerticalStack: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <ActionButton type="otoku" variant="record" />
      <ActionButton type="gaman" variant="record" />
    </div>
  ),
};

// === 実際の使用シーン ===

export const ReceiptFlow: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <div className="text-center mb-6">
        <h3 className="text-lg font-bold">レシート記録フロー</h3>
        <p className="text-sm text-gray-600">おトク記録の流れ</p>
      </div>
      <ActionButton type="otoku" variant="camera" />
      <ActionButton type="otoku" variant="manual" />
      <ActionButton type="otoku" variant="gallery" />
      <ActionButton type="otoku" variant="default" />
    </div>
  ),
};

export const ModalButtons: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold mb-4">モーダル用ボタン</h3>
        <div className="flex space-x-4">
          <ActionButton type="neutral" variant="default" subtitle="キャンセル" />
          <ActionButton type="otoku" variant="default" subtitle="保存" />
          <ActionButton type="neutral" variant="default" title="OK" subtitle="" />
        </div>
      </div>
      <div>
        <h3 className="text-lg font-bold mb-4">設定画面用ボタン</h3>
        <div className="space-y-3 w-80">
          <ActionButton type="neutral" variant="manual" subtitle="プロフィール設定" />
          <ActionButton type="neutral" variant="gallery" subtitle="テーマ設定" />
          <ActionButton type="neutral" variant="camera" subtitle="通知設定" />
        </div>
      </div>
    </div>
  ),
};

// === 状態テスト ===

export const Disabled: Story = {
  args: {
    type: 'otoku',
    variant: 'record',
    disabled: true,
  },
};

export const DisabledComparison: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold mb-4">通常状態 vs 無効状態</h3>
        <div className="space-y-4 w-80">
          <ActionButton type="otoku" variant="record" />
          <ActionButton type="otoku" variant="record" disabled />
          <ActionButton type="gaman" variant="camera" />
          <ActionButton type="gaman" variant="camera" disabled />
        </div>
      </div>
    </div>
  ),
};

// === カスタマイズ例 ===

export const CustomSubtitle: Story = {
  args: {
    type: 'otoku',
    variant: 'default',
    subtitle: 'カスタムメッセージ',
  },
};

export const NoSubtitle: Story = {
  args: {
    type: 'neutral',
    variant: 'default',
    subtitle: '',
  },
};

export const CustomSubtitleExamples: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <div className="text-center mb-6">
        <h3 className="text-lg font-bold">カスタムサブタイトル例</h3>
      </div>
      <ActionButton type="otoku" variant="default" subtitle="データを保存" />
      <ActionButton type="gaman" variant="default" subtitle="操作を中止" />
      <ActionButton type="neutral" variant="default" subtitle="" />
      <ActionButton type="neutral" variant="default" subtitle="設定を変更" />
    </div>
  ),
};

// === サイズ・レスポンシブテスト ===

export const ResponsiveTest: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold mb-4">幅制限テスト</h3>
        <div className="space-y-4">
          <div className="w-64">
            <ActionButton type="otoku" variant="record" />
          </div>
          <div className="w-48">
            <ActionButton type="gaman" variant="camera" />
          </div>
          <div className="w-32">
            <ActionButton type="neutral" variant="default" subtitle="" />
          </div>
        </div>
      </div>
    </div>
  ),
};

// === 全パターン一覧 ===

export const AllCombinations: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-bold mb-4">全組み合わせ一覧</h3>
        <div className="grid grid-cols-3 gap-4 w-full max-w-4xl">
          {/* Record variant */}
          <ActionButton type="otoku" variant="record" />
          <ActionButton type="gaman" variant="record" />
          <ActionButton type="neutral" variant="record" />
          
          {/* Camera variant */}
          <ActionButton type="otoku" variant="camera" />
          <ActionButton type="gaman" variant="camera" />
          <ActionButton type="neutral" variant="camera" />
          
          {/* Manual variant */}
          <ActionButton type="otoku" variant="manual" />
          <ActionButton type="gaman" variant="manual" />
          <ActionButton type="neutral" variant="manual" />
          
          {/* Gallery variant */}
          <ActionButton type="otoku" variant="gallery" />
          <ActionButton type="gaman" variant="gallery" />
          <ActionButton type="neutral" variant="gallery" />
          
          {/* Default variant */}
          <ActionButton type="otoku" variant="default" />
          <ActionButton type="gaman" variant="default" />
          <ActionButton type="neutral" variant="default" />
        </div>
      </div>
    </div>
  ),
};