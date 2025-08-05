import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import AmountInput from './AmountInput';

const meta: Meta<typeof AmountInput> = {
  title: 'Components/Form/AmountInput',
  component: AmountInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '割引額入力コンポーネント - 直接入力と計算機能の両方をサポート',
      },
    },
  },
  argTypes: {
    value: {
      control: { type: 'text' },
      description: '入力値',
    },
    onChange: {
      action: 'changed',
      description: '値変更時のコールバック',
    },
    label: {
      control: { type: 'text' },
      description: 'ラベルテキスト',
    },
    placeholder: {
      control: { type: 'text' },
      description: 'プレースホルダーテキスト',
    },
    suffix: {
      control: { type: 'text' },
      description: '接尾辞',
    },
    error: {
      control: { type: 'text' },
      description: 'エラーメッセージ',
    },
    variant: {
      control: { type: 'select' },
      options: ['direct', 'calculated'],
      description: '入力方式のバリアント',
    },
    type: {
      control: { type: 'select' },
      options: ['otoku', 'gaman'],
      description: 'おトク・ガマンのタイプ',
    },
  },
  args: {
    onChange: (value: string) => console.log('AmountInput changed:', value),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 直接入力バリアント
export const DirectInput: Story = {
  args: {
    value: '',
    variant: 'direct',
    type: 'otoku',
    label: '割引額',
    placeholder: '0',
    suffix: '円',
  },
};

// 計算機能付きバリアント
export const WithCalculation: Story = {
  args: {
    value: '',
    variant: 'calculated',
    type: 'otoku',
    label: '割引額',
    placeholder: '0',
    suffix: '円',
  },
};

// ガマンタイプ（計算機能付き）
export const GamanWithCalculation: Story = {
  args: {
    value: '',
    variant: 'calculated',
    type: 'gaman',
    label: 'ガマン額',
    placeholder: '0',
    suffix: '円',
  },
};

// エラー状態
export const WithError: Story = {
  args: {
    value: '',
    variant: 'calculated',
    type: 'otoku',
    label: '割引額',
    placeholder: '0',
    suffix: '円',
    error: '金額を入力してください',
  },
};

// 初期値あり
export const WithInitialValue: Story = {
  args: {
    value: '1500',
    variant: 'calculated',
    type: 'otoku',
    label: '割引額',
    placeholder: '0',
    suffix: '円',
  },
};

// カスタムラベル
export const CustomLabel: Story = {
  args: {
    value: '',
    variant: 'calculated',
    type: 'gaman',
    label: '節約金額',
    placeholder: '0',
    suffix: '円',
  },
};

// 計算機能使用例のシミュレーション
export const CalculationExample: Story = {
  args: {
    value: '',
    variant: 'calculated',
    type: 'otoku',
    label: '割引額',
    placeholder: '0',
    suffix: '円',
  },
  parameters: {
    docs: {
      description: {
        story: '計算機能の使用例。「割引額の計算」ボタンをクリックして展開し、通常価格と購入価格または割引率を入力すると自動計算されます。',
      },
    },
  },
};

// インタラクティブな例
export const Interactive: Story = {
  args: {
    value: '',
    variant: 'calculated',
    type: 'otoku',
    label: '割引額',
    placeholder: '0',
    suffix: '円',
  },
  render: (args) => {
    const [value, setValue] = React.useState(args.value);
    
    return (
      <div className="w-80">
        <AmountInput
          {...args}
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
            args.onChange?.(newValue);
          }}
        />
        <div className="mt-4 p-3 bg-gray-100 rounded text-sm">
          <strong>現在の値:</strong> {value || '未入力'}
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'インタラクティブな例。実際に入力や計算機能を試すことができます。',
      },
    },
  },
};

// モバイル表示
export const Mobile: Story = {
  args: {
    value: '',
    variant: 'calculated',
    type: 'otoku',
    label: '割引額',
    placeholder: '0',
    suffix: '円',
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

// 計算結果表示例
export const WithCalculationResult: Story = {
  render: () => {
    const [value, setValue] = React.useState('');
    
    return (
      <div className="w-80">
        <AmountInput
          value={value}
          onChange={setValue}
          variant="calculated"
          type="otoku"
          label="割引額"
          placeholder="0"
          suffix="円"
        />
        <div className="mt-4 text-xs text-gray-600">
          <p><strong>使用例:</strong></p>
          <p>1. 「割引額の計算」をクリック</p>
          <p>2. 通常価格: 3000円</p>
          <p>3. 購入価格: 2200円</p>
          <p>→ 自動計算: 800円</p>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: '計算結果の表示例。上記の手順で実際に計算機能を試してみてください。',
      },
    },
  },
};