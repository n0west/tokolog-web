import React, { useState, useEffect } from 'react';
import NumberInput from './NumberInput';

interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  suffix?: string;
  error?: string;
  className?: string;
  variant?: 'direct' | 'calculated';
  type?: 'otoku' | 'gaman';
}

const AmountInput: React.FC<AmountInputProps> = ({
  value,
  onChange,
  label = '割引額',
  placeholder = '0',
  suffix = '円',
  error,
  className = '',
  variant = 'direct',
  type = 'otoku'
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [calculationData, setCalculationData] = useState({
    regularPrice: '',
    purchasePrice: '',
    discountRate: ''
  });
  const [calculatedAmount, setCalculatedAmount] = useState('');
  const [calculationError, setCalculationError] = useState<string | null>(null);

  // 計算ロジック
  const calculateDiscount = () => {
    const regular = parseFloat(calculationData.regularPrice) || 0;
    const purchase = parseFloat(calculationData.purchasePrice) || 0;
    const rate = parseFloat(calculationData.discountRate) || 0;

    let result = 0;

    if (regular > 0) {
      if (purchase > 0) {
        // 通常価格 - 購入価格
        result = regular - purchase;
        
        // 購入価格が通常価格以上の場合はエラー
        if (purchase >= regular) {
          return { value: '0', error: '購入価格が通常価格以上です。正しい金額を入力してください。' };
        }
      } else if (rate > 0) {
        // 通常価格 × 割引率
        result = regular * (rate / 100);
        
        // 割引率が100%以上の場合はエラー
        if (rate >= 100) {
          return { value: '0', error: '割引率が100%以上です。正しい割引率を入力してください。' };
        }
      }
    }

    result = Math.max(0, Math.round(result));
    return { value: result.toString(), error: null };
  };

  // 計算データ変更時に自動計算
  useEffect(() => {
    if (isExpanded && variant === 'calculated') {
      const result = calculateDiscount();
      setCalculatedAmount(result.value);
      setCalculationError(result.error);
      if (result.value !== '0' && !result.error) {
        onChange(result.value);
      }
    }
  }, [calculationData, isExpanded, variant, onChange]);

  // 展開状態変更時の処理
  const handleToggleExpanded = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded && variant === 'calculated') {
      // 展開時は直接入力を無効化
      return;
    }
    if (isExpanded && variant === 'calculated') {
      // 格納時は計算結果をクリア（必要に応じて）
      setCalculationData({
        regularPrice: '',
        purchasePrice: '',
        discountRate: ''
      });
      setCalculatedAmount('');
      setCalculationError(null);
    }
  };

  const handleDirectInputChange = (newValue: string) => {
    if (!isExpanded) {
      onChange(newValue);
    }
  };

  const handleDirectInputClick = () => {
    if (isExpanded) {
      // 展開状態の場合は格納する
      setIsExpanded(false);
      setCalculationData({
        regularPrice: '',
        purchasePrice: '',
        discountRate: ''
      });
      setCalculatedAmount('');
      setCalculationError(null);
    }
  };

  const handleCalculationInputChange = (field: keyof typeof calculationData, newValue: string) => {
    setCalculationData(prev => ({
      ...prev,
      [field]: newValue
    }));
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 直接入力部分 */}
      <div className="space-y-2">
        <label className="block text-sm font-bold text-primary">
          {label}
          <span className="ml-1 text-red-500 text-xs">必須</span>
        </label>
        
        <NumberInput
          value={value}
          onChange={handleDirectInputChange}
          onClick={handleDirectInputClick}
          placeholder={placeholder}
          suffix={suffix}
          error={error}
          className={isExpanded ? 'opacity-50' : ''}
        />
        
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </div>

      {/* 計算機能トグルボタン */}
      {variant === 'calculated' && (
        <button
          type="button"
          onClick={handleToggleExpanded}
          className="flex items-center justify-between w-full p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <span className="text-sm font-bold text-secondary">
            割引額の計算
          </span>
          <svg
            className={`w-5 h-5 text-secondary transition-transform ${
              isExpanded ? 'transform rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      )}

      {/* 展開された計算エリア */}
      {isExpanded && variant === 'calculated' && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          {/* 説明文 */}
          <p className="text-xs text-secondary">
            通常価格と購入価格、または通常価格と割引率を入力することで、割引額を自動計算できます。
          </p>

          {/* 計算フォーム */}
          <div className="space-y-3">
            {/* 通常価格 */}
            <div>
              <label className="block text-xs font-bold text-primary mb-1">
                1. 通常価格（必須）
              </label>
              <NumberInput
                value={calculationData.regularPrice}
                onChange={(value) => handleCalculationInputChange('regularPrice', value)}
                placeholder="0"
                suffix="円"
                className="text-sm"
              />
            </div>

            {/* 購入価格 */}
            <div>
              <label className="block text-xs font-bold text-primary mb-1">
                2. 購入価格
              </label>
              <NumberInput
                value={calculationData.purchasePrice}
                onChange={(value) => handleCalculationInputChange('purchasePrice', value)}
                placeholder="0"
                suffix="円"
                className="text-sm"
              />
            </div>

            {/* または区切り */}
            <div className="flex items-center">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-3 text-xs text-tertiary">または</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* 割引率 */}
            <div>
              <label className="block text-xs font-bold text-primary mb-1">
                3. 割引率
              </label>
              <NumberInput
                value={calculationData.discountRate}
                onChange={(value) => handleCalculationInputChange('discountRate', value)}
                placeholder="0"
                suffix="%"
                className="text-sm"
              />
            </div>
          </div>

          {/* エラー表示 */}
          {calculationError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="text-sm text-red-600">{calculationError}</div>
            </div>
          )}

          {/* 計算結果表示 */}
          {calculatedAmount && calculatedAmount !== '0' && !calculationError && (
            <div className="bg-white rounded-lg p-3 border border-sub-border">
              <div className="text-xs text-secondary mb-1">計算結果</div>
              <div className={`text-lg font-bold ${
                type === 'otoku' ? 'text-otoku' : 'text-gaman'
              }`}>
                {parseInt(calculatedAmount).toLocaleString()}円
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AmountInput;