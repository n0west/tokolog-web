import React, { useState, useEffect } from 'react';
import BackIcon from '../icons/BackIcon';
import TrashIcon from '../icons/TrashIcon';
import FormField from '../forms/FormField';
import AmountInput from '../forms/AmountInput';
import NumberInput from '../forms/NumberInput';
import DropdownField from '../forms/DropdownField';
import PreviewCard from '../cards/PreviewCard';
import ActionButton from '../ui/ActionButton';
import ResponsiveContainer from '../layout/ResponsiveContainer';
import DeleteConfirmationDialog from '../ui/DeleteConfirmationDialog';

import { RecordData, FormData } from '@/types/database';

interface EditRecordPageProps {
  recordId: string;
  initialData?: RecordData;
  onSave: (record: FormData) => void;
  onDelete: (recordId: string) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  className?: string;
}

const EditRecordPage: React.FC<EditRecordPageProps> = ({
  recordId,
  initialData,
  onSave,
  onDelete,
  onCancel,
  isSubmitting = false,
  className = ""
}) => {
  const [formData, setFormData] = useState({
    productName: initialData?.productName || '',
    amount: initialData?.amount?.toString() || '',
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

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const type = initialData?.type || 'otoku';
  const pageTitle = type === 'otoku' ? 'おトク記録を編集' : 'ガマン記録を編集';
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

  const handleSave = () => {
    // バリデーション
    const newErrors = {
      productName: formData.productName ? '' : '商品名を入力してください',
      amount: formData.amount ? '' : '金額を入力してください'
    };
    
    setErrors(newErrors);
    
    // エラーがない場合のみ送信
    if (!newErrors.productName && !newErrors.amount) {
      onSave({
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

  const handleDeleteConfirm = () => {
    onDelete(recordId);
    setShowDeleteDialog(false);
  };

  // 現在の日付を取得
  const getCurrentDate = () => {
    if (initialData?.date) {
      return initialData.date;
    }
    const now = new Date();
    return `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`;
  };

  return (
    <ResponsiveContainer variant="page" className={className}>
      <div className="min-h-screen bg-home">
        {/* ヘッダー */}
        <ResponsiveContainer variant="content" className="py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={onCancel}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="戻る"
            >
              <BackIcon width={24} height={24} color="#374151" />
            </button>
            <h1 className="text-lg font-bold text-primary">{pageTitle}</h1>
            <button
              onClick={() => setShowDeleteDialog(true)}
              disabled={isSubmitting}
              className="p-3 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ width: '44px', height: '44px' }}
              aria-label="削除"
            >
              <div className="flex items-center justify-center">
                <TrashIcon width={20} height={20} color="#9CA3AF" />
              </div>
            </button>
          </div>
        </ResponsiveContainer>

        {/* メインコンテンツ */}
        <ResponsiveContainer variant="content" className="space-y-6 pb-4">
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
            この内容で更新しますか？
          </h3>
          
          <PreviewCard
            type={type}
            amount={formData.amount ? parseInt(formData.amount) : null}
            productName={formData.productName}
            date={getCurrentDate()}
          />
        </div>

          {/* 保存ボタン */}
          <ActionButton
            type={type}
            variant="default"
            onClick={handleSave}
            title={isSubmitting ? "更新中..." : "更新"}
            subtitle=""
            disabled={isSubmitting}
            className="w-full"
          />
          
          {/* 下部余白 */}
          <div className="pb-8"></div>
        </ResponsiveContainer>
      </div>

      {/* 削除確認ダイアログ */}
      <DeleteConfirmationDialog
        isOpen={showDeleteDialog}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteDialog(false)}
        recordName={formData.productName || '記録'}
      />
    </ResponsiveContainer>
  );
};

export default EditRecordPage;