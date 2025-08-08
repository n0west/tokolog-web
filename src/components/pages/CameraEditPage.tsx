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

export interface CameraEditItem {
  id: string;
  productName: string;
  amount: number;
  confidence?: number;
}

interface CameraEditPageProps {
  type: 'otoku' | 'gaman';
  item: CameraEditItem;
  onSave: (item: CameraEditItem) => Promise<void>;
  onDelete?: (itemId: string) => Promise<void>;
  onBack: () => void;
  isSubmitting?: boolean;
  className?: string;
}

const CameraEditPage: React.FC<CameraEditPageProps> = ({
  type,
  item: initialItem,
  onSave,
  onDelete,
  onBack,
  isSubmitting = false,
  className = ""
}) => {
  const [item, setItem] = useState<CameraEditItem>(initialItem);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [errors, setErrors] = useState({
    productName: '',
    amount: ''
  });
  
  const pageTitle = type === 'otoku' ? 'おトク記録を編集' : 'ガマン記録を編集';
  const amountLabel = type === 'otoku' ? '割引額' : 'ガマン額';
  
  // 項目の更新
  const updateItem = (field: keyof CameraEditItem, value: string | number) => {
    setItem(prev => ({ ...prev, [field]: value }));
  };

  // 保存処理
  const handleSave = async () => {
    // バリデーション
    const newErrors = {
      productName: item.productName.trim() ? '' : '商品名を入力してください',
      amount: item.amount > 0 ? '' : '金額を入力してください'
    };
    
    setErrors(newErrors);
    
    // エラーがない場合のみ保存
    if (!newErrors.productName && !newErrors.amount) {
      await onSave(item);
    }
  };

  // 削除処理
  const handleDelete = async () => {
    if (onDelete) {
      await onDelete(item.id);
    }
    setShowDeleteDialog(false);
  };

  // 現在の日付を取得
  const getCurrentDate = () => {
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
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="戻る"
            >
              <BackIcon width={24} height={24} color="#374151" />
            </button>
            <h1 className="text-lg font-bold text-primary">{pageTitle}</h1>
            {onDelete && (
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
            )}
          </div>
        </ResponsiveContainer>

        {/* メインコンテンツ */}
        <ResponsiveContainer variant="content" className="space-y-6 pb-4">
          {/* メインフォーム */}
          <div className="bg-white rounded-3xl p-6 border border-sub-border space-y-6">
            {/* 信頼度表示 */}
            {item.confidence && (
              <div className="text-center">
                <span className="text-sm text-secondary">
                  OCR信頼度: {Math.round(item.confidence * 100)}%
                </span>
              </div>
            )}

            {/* 商品名フィールド */}
            <FormField
              label="商品名"
              required
              error={errors.productName}
            >
              <input
                type="text"
                value={item.productName}
                onChange={(e) => updateItem('productName', e.target.value)}
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
                value={item.amount.toString()}
                onChange={(value) => updateItem('amount', parseInt(value) || 0)}
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
                  value={item.amount.toString()}
                  onChange={(value) => updateItem('amount', parseInt(value) || 0)}
                  placeholder="0"
                  suffix="円"
                  error={errors.amount}
                />
              </FormField>
            )}
          </div>

          {/* プレビューエリア */}
          <div className="space-y-4">
            <h3 className="text-center text-secondary text-sm">
              この内容で更新しますか？
            </h3>
            
            <PreviewCard
              type={type}
              amount={item.amount}
              productName={item.productName}
              date={getCurrentDate()}
            />
          </div>

          {/* 更新ボタン */}
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
      {onDelete && (
        <DeleteConfirmationDialog
          isOpen={showDeleteDialog}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteDialog(false)}
          recordName={item.productName || '項目'}
        />
      )}
    </ResponsiveContainer>
  );
};

export default CameraEditPage;