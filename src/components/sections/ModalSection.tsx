import React from 'react';
import CheckIcon from '../icons/CheckIcon';
import RecordCard from '../cards/RecordCard';
import ActionButton from '../ui/ActionButton';

interface ModalSectionProps {
  isOpen?: boolean;
  onClose?: () => void;
  type: 'otoku' | 'gaman';
  amount: number;
  date: string;
  productName: string;
  title?: string;
  className?: string;
}

const ModalSection: React.FC<ModalSectionProps> = ({
  isOpen = true,
  onClose,
  type,
  amount,
  date,
  productName,
  title = '登録が完了しました',
  className = '',
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose?.();
    }
  };

  return (
    <div 
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 ${className}`}
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full mx-4 shadow-xl">
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

        {/* 登録内容表示（RecordCard使用） */}
        <div className="mb-8 border border-sub-border rounded-2xl overflow-hidden">
          <RecordCard
            type={type}
            amount={amount}
            date={date}
            productName={productName}
          />
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

export default ModalSection;