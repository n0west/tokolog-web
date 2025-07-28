import React from 'react';
import EditIcon from '../icons/EditIcon';

interface HistoryItemProps {
  id: string;
  type: 'otoku' | 'gaman';
  amount: number;
  date: string;
  productName: string;
  onEdit?: (id: string) => void;
  className?: string;
}

const HistoryItem: React.FC<HistoryItemProps> = ({
  id,
  type,
  amount,
  date,
  productName,
  onEdit,
  className = ''
}) => {
  const isOtoku = type === 'otoku';
  const typeLabel = isOtoku ? 'おトク' : 'ガマン';
  const typeColor = isOtoku ? 'text-otoku' : 'text-gaman';
  const amountColor = isOtoku ? 'text-otoku' : 'text-gaman';

  const formatAmount = (amount: number) => {
    return amount.toLocaleString();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };

  return (
    <div className={`flex items-center justify-between py-4 ${className}`}>
      {/* 左側：タイプと金額 */}
      <div className="flex-1">
        <div className={`text-sm font-medium ${typeColor} mb-1`}>
          {typeLabel}
        </div>
        <div className={`text-2xl font-bold ${amountColor}`}>
          {formatAmount(amount)} <span className="text-base">円</span>
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
        
        {onEdit && (
          <button
            onClick={() => onEdit(id)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="編集"
          >
            <EditIcon width={20} height={20} color="#9CA3AF" />
          </button>
        )}
      </div>
    </div>
  );
};

export default HistoryItem;