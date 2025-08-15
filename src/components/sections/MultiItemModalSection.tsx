import React from 'react';
import CheckIcon from '../icons/CheckIcon';
import RecordCard from '../cards/RecordCard';
import ActionButton from '../ui/ActionButton';

interface ModalItem {
  id: string;
  productName: string;
  amount: number;
}

interface MultiItemModalSectionProps {
  isOpen?: boolean;
  onClose?: () => void;
  type: 'otoku' | 'gaman';
  items: ModalItem[];
  title?: string;
  className?: string;
}

const MultiItemModalSection: React.FC<MultiItemModalSectionProps> = ({
  isOpen = true,
  onClose,
  type,
  items,
  title = '登録が完了しました',
  className = '',
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose?.();
    }
  };

  // 現在の日付を取得
  const getCurrentDate = () => {
    const now = new Date();
    return `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`;
  };

  // 表示用のアイテムを準備（最大3件まで表示）
  const displayItems = items.slice(0, 3);
  const remainingCount = items.length - 3;

  return (
    <div 
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 ${className}`}
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full mx-4 shadow-xl max-h-[90vh] overflow-y-auto">
        {/* チェックマークアイコン */}
        <div className="flex justify-center mb-6">
          <div className="bg-blue-50 rounded-full border-2 border-blue-100">
            <CheckIcon width={120} height={120} color="#10B981" />
          </div>
        </div>

        {/* タイトル */}
        <div className="text-center mb-8">
          <h2 className="text-lg font-bold text-primary">
            {title}
          </h2>
        </div>

        {/* 登録内容表示（複数項目対応） */}
        <div className="mb-8 space-y-4">
          {displayItems.map((item, index) => (
            <div key={item.id} className="border border-sub-border rounded-2xl overflow-hidden">
              <RecordCard
                type={type}
                amount={item.amount}
                date={getCurrentDate()}
                productName={item.productName}
              />
            </div>
          ))}
          
          {/* 残りの件数表示 */}
          {remainingCount > 0 && (
            <div className="text-center py-4">
              <span className="text-secondary text-sm">
                ほか{remainingCount}件
              </span>
            </div>
          )}
        </div>

        {/* OKボタン */}
        <ActionButton
          type={type}
          variant="default"
          title="OK"
          subtitle=""
          onClick={onClose}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default MultiItemModalSection;