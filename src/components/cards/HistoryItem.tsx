import React from 'react';
import ChevronRightIcon from '../icons/ChevronRightIcon';

interface HistoryItemProps {
  id: string;
  type: 'otoku' | 'gaman';
  amount: number;
  date: string;
  productName: string;
  onNavigateToEdit?: (id: string) => void;
  className?: string;
}

const HistoryItem: React.FC<HistoryItemProps> = ({
  id,
  type,
  amount,
  date,
  productName,
  onNavigateToEdit,
  className = ''
}) => {
  const isOtoku = type === 'otoku';
  const typeLabel = isOtoku ? 'おトク' : 'ガマン';
  const typeColor = isOtoku ? 'text-otoku' : 'text-gaman';
  const amountColor = 'text-primary'; // 金額の色を統一
  const unitColor = isOtoku ? 'text-otoku' : 'text-gaman'; // 「円」の色

  const formatAmount = (amount: number) => {
    return amount.toLocaleString();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };

  return (
    <div 
      className={`flex items-center justify-between py-4 cursor-pointer hover:bg-gray-50 transition-colors ${className}`}
      onClick={() => onNavigateToEdit?.(id)}
    >
      {/* 左側：タイプと金額 */}
      <div className="flex-1">
        <div className={`text-sm font-medium ${typeColor} mb-1`}>
          {typeLabel}
        </div>
        <div className={`text-2xl font-bold ${amountColor}`}>
          {formatAmount(amount)} <span className={`text-base ${unitColor}`}>円</span>
        </div>
      </div>

      {/* 右側：日付、商品名、編集ボタン */}
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <div className="text-xs text-tertiary mb-1">
            {formatDate(date)}
          </div>
          <div className="text-sm text-secondary max-w-[120px] truncate">
            {productName}
          </div>
        </div>
        
        {onNavigateToEdit && (
          <div className="flex-shrink-0">
            <ChevronRightIcon width={20} height={20} color="#9CA3AF" />
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryItem;