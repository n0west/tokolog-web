import React, { useState } from 'react';
import BackIcon from '../icons/BackIcon';
import FormField from '../forms/FormField';
import AmountInput from '../forms/AmountInput';
import NumberInput from '../forms/NumberInput';
import DropdownField from '../forms/DropdownField';
import PreviewCard from '../cards/PreviewCard';
import ActionButton from '../ui/ActionButton';

import { ManualInputPageProps } from '@/types/database';

interface ManualInputPagePropsExtended extends ManualInputPageProps {
  className?: string;
}

const ManualInputPage: React.FC<ManualInputPagePropsExtended> = ({
  type,
  onBack,
  onSubmit,
  isSubmitting = false,
  className = ""
}) => {
  const [formData, setFormData] = useState({
    productName: '',
    amount: '',
    originalAmount: '',
    discountAmount: '',
    calculationMethod: '',
    gamanReason: '',
    memo: ''
  });
  
  const [errors, setErrors] = useState({
    productName: '',
    amount: ''
  });

  const pageTitle = type === 'otoku' ? 'おトクを記録する' : 'ガマンを記録する';
  const amountLabel = type === 'otoku' ? '割引額' : 'ガマン額';
  
  // ガマンの理由選択肢
  const gamanReasonOptions = [
    { value: 'budget', label: '予算オーバー' },
    { value: 'unnecessary', label: '必要がない' },
    { value: 'better_alternative', label: '他に良い選択肢がある' },
    { value: 'save_money', label: '節約のため' },
    { value: 'impulse_buy', label: '衝動買いだと気づいた' },
    { value: 'quality_concern', label: '品質に不安がある' },
    { value: 'timing', label: 'タイミングが悪い' },
    { value: 'other', label: 'その他' }
  ];

  const handleSubmit = () => {
    // バリデーション
    const newErrors = {
      productName: formData.productName ? '' : '商品名を入力してください',
      amount: formData.amount ? '' : '金額を入力してください'
    };
    
    setErrors(newErrors);
    
    // エラーがない場合のみ送信
    if (!newErrors.productName && !newErrors.amount) {
      onSubmit?.({
        productName: formData.productName,
        amount: parseInt(formData.amount),
        originalAmount: formData.originalAmount ? parseInt(formData.originalAmount) : undefined,
        discountAmount: formData.discountAmount ? parseInt(formData.discountAmount) : undefined,
        calculationMethod: formData.calculationMethod,
        gamanReason: formData.gamanReason,
        memo: formData.memo
      });
    }
  };

  // 現在の日付を取得
  const getCurrentDate = () => {
    const now = new Date();
    return `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`;
  };

  return (
    <div className={`min-h-screen bg-home ${className}`}>
      {/* ヘッダー */}
      <div className="bg-home">
        <div className="flex items-center justify-between p-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="戻る"
          >
            <BackIcon width={24} height={24} color="#374151" />
          </button>
          <h1 className="text-lg font-bold text-primary">{pageTitle}</h1>
          <div className="w-8"></div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="p-4 space-y-6">
        {/* メインフォーム */}
        <div className="bg-white rounded-3xl p-6 border border-sub-border space-y-6">
          {/* 商品名フィールド */}
          <FormField
            label="商品名"
            required
            error={errors.productName}
          >
            <input
              type="text"
              value={formData.productName}
              onChange={(e) => setFormData(prev => ({ ...prev, productName: e.target.value }))}
              placeholder="商品名を入力してください"
              className={`
                w-full px-4 py-3 text-primary bg-white border-2 rounded-lg
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                ${errors.productName ? 'border-red-500' : 'border-sub-border'}
              `}
            />
          </FormField>

          {/* 割引額/ガマン額フィールド */}
          {type === 'otoku' ? (
            <AmountInput
              value={formData.amount}
              onChange={(value) => setFormData(prev => ({ ...prev, amount: value }))}
              label={amountLabel}
              placeholder="0"
              suffix="円"
              error={errors.amount}
              variant="calculated"
              type={type}
            />
          ) : (
            <FormField
              label={amountLabel}
              required
              error={errors.amount}
            >
              <NumberInput
                value={formData.amount}
                onChange={(value) => setFormData(prev => ({ ...prev, amount: value }))}
                placeholder="0"
                suffix="円"
                error={errors.amount}
              />
            </FormField>
          )}

          {/* ガマンの理由（ガマンタイプのみ） */}
          {type === 'gaman' && (
            <FormField label="ガマンの理由">
              <DropdownField
                value={formData.gamanReason}
                onChange={(value) => setFormData(prev => ({ ...prev, gamanReason: value }))}
                options={gamanReasonOptions}
                placeholder="理由を選択してください"
              />
            </FormField>
          )}

          {/* メモフィールド */}
          <FormField label="メモ">
            <textarea
              value={formData.memo}
              onChange={(e) => setFormData(prev => ({ ...prev, memo: e.target.value }))}
              placeholder="メモを入力してください（任意）"
              rows={3}
              className="
                w-full px-4 py-3 text-primary bg-white border-2 border-sub-border rounded-lg
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                resize-none
              "
            />
          </FormField>
        </div>

        {/* プレビューエリア */}
        <div className="space-y-4">
          <h3 className="text-center text-secondary text-sm">
            この内容で登録しますか？
          </h3>
          
          <PreviewCard
            type={type}
            amount={formData.amount ? parseInt(formData.amount) : null}
            productName={formData.productName}
            date={getCurrentDate()}
          />
        </div>

        {/* 登録ボタン */}
        <ActionButton
          type={type}
          variant="default"
          onClick={handleSubmit}
          title={isSubmitting ? "登録中..." : "登録"}
          subtitle=""
          disabled={isSubmitting}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default ManualInputPage;