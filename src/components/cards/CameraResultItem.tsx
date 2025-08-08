import React, { useState } from 'react';
import ChevronRightIcon from '../icons/ChevronRightIcon';

interface CameraResultItemProps {
  id: string;
  type: 'otoku' | 'gaman';
  amount: number;
  productName: string;
  date: string;
  isEditing: boolean;
  onEdit: (id: string) => void;
  onSave: (id: string, data: { amount: number; productName: string }) => void;
  onCancel: (id: string) => void;
  onNavigateToEdit?: (id: string, data: { amount: number; productName: string; type: string }) => void;
  className?: string;
  confidence?: number;
}

const CameraResultItem: React.FC<CameraResultItemProps> = ({
  id,
  type,
  amount,
  productName,
  date,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onNavigateToEdit,
  className = '',
  confidence,
}) => {
  const [editAmount, setEditAmount] = useState(amount.toString());
  const [editProductName, setEditProductName] = useState(productName);

  // 信頼度に基づくスタイリング
  const getConfidenceStyle = (confidence: number | undefined) => {
    if (!confidence) return '';
    
    if (confidence < 0.3) {
      return 'border-red-200 bg-red-50'; // 低信頼度: 赤
    } else if (confidence < 0.7) {
      return 'border-yellow-200 bg-yellow-50'; // 中信頼度: 黄
    } else {
      return 'border-green-200 bg-green-50'; // 高信頼度: 緑
    }
  };

  // 信頼度アイコン
  const getConfidenceIcon = (confidence: number | undefined) => {
    if (!confidence) return null;
    
    if (confidence < 0.3) {
      return <span className="text-red-500 text-xs">⚠️</span>;
    } else if (confidence < 0.7) {
      return <span className="text-yellow-500 text-xs">⚡</span>;
    } else {
      return <span className="text-green-500 text-xs">✓</span>;
    }
  };

  const isOtoku = type === 'otoku';
  const typeLabel = isOtoku ? 'おトク' : 'ガマン';
  const typeColor = isOtoku ? 'text-otoku' : 'text-gaman';

  const formatAmount = (amount: number) => {
    return amount.toLocaleString();
  };

  const handleSave = () => {
    const newAmount = parseInt(editAmount) || 0;
    const newProductName = editProductName.trim() || '商品名未設定';
    
    onSave(id, {
      amount: newAmount,
      productName: newProductName
    });
  };

  const handleCancel = () => {
    setEditAmount(amount.toString());
    setEditProductName(productName);
    onCancel(id);
  };

  if (isEditing) {
    return (
      <div className={`flex items-center justify-between p-4 ${className}`}>
        {/* 編集フォーム */}
        <div className="flex-1 pr-4">
          <div className={`text-sm font-bold ${typeColor} mb-2`}>
            {typeLabel}
          </div>
          
          {/* 金額編集 */}
          <div className="mb-3">
            <input
              type="number"
              value={editAmount}
              onChange={(e) => setEditAmount(e.target.value)}
              className="text-2xl font-bold text-primary bg-transparent border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none w-24"
            />
            <span className={`text-base ${typeColor} ml-1`}>円</span>
          </div>
          
          {/* 商品名編集 */}
          <input
            type="text"
            value={editProductName}
            onChange={(e) => setEditProductName(e.target.value)}
            className="text-sm text-secondary bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none w-full max-w-[120px]"
            placeholder="商品名"
          />
        </div>

        {/* 右側：日付と保存/キャンセルボタン */}
        <div className="flex items-center space-x-2">
          <div className="text-right mr-2">
            <div className="text-xs text-tertiary">
              {date}
            </div>
          </div>
          
          <button
            onClick={handleSave}
            className="px-3 py-1 bg-blue-500 text-white text-xs rounded font-medium hover:bg-blue-600"
          >
            保存
          </button>
          
          <button
            onClick={handleCancel}
            className="px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded font-medium hover:bg-gray-400"
          >
            キャンセル
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => {
        if (onNavigateToEdit) {
          onNavigateToEdit(id, { amount, productName, type });
        } else {
          onEdit(id);
        }
      }}
      className={`w-full flex items-center justify-between p-4 rounded-lg ${className} ${getConfidenceStyle(confidence)} hover:bg-gray-100 hover:shadow-sm transition-all duration-200 text-left`}
      aria-label="データを編集"
    >
      {/* 左側：タイプと金額 */}
      <div className="flex-1">
        <div className={`text-sm font-bold ${typeColor} mb-1 flex items-center gap-1`}>
          {typeLabel}
          {getConfidenceIcon(confidence)}
        </div>
        <div className="text-2xl font-bold text-primary">
          {formatAmount(amount)} <span className={`text-base ${typeColor}`}>円</span>
        </div>
        {confidence !== undefined && (
          <div className="text-xs text-gray-500 mt-1">
            信頼度: {Math.round(confidence * 100)}%
          </div>
        )}
      </div>

      {/* 右側：日付、商品名、編集アイコン */}
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <div className="text-xs text-tertiary mb-1">
            {date}
          </div>
          <div className="text-sm text-secondary max-w-[120px] truncate">
            {productName}
          </div>
        </div>
        
        <div className="p-2 rounded-full">
          <ChevronRightIcon width={20} height={20} color="#6B7280" />
        </div>
      </div>
    </button>
  );
};

export default CameraResultItem;