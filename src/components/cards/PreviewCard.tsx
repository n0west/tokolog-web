import React from 'react';
import Stat from '../stats/Stat';

interface PreviewCardProps {
  type: 'otoku' | 'gaman';
  amount: number | null;
  productName: string;
  date: string;
  className?: string;
}

const PreviewCard: React.FC<PreviewCardProps> = ({
  type,
  amount,
  productName,
  date,
  className = ""
}) => {
  const displayAmount = amount || 0;
  const displayProductName = productName || '商品名を登録してください';

  return (
    <div className={`bg-white p-6 w-full rounded-3xl ${className}`}>
      <div className="flex justify-between items-start gap-6">
        {/* 左側：Stat（金額情報）*/}
        <div className="flex-shrink-0">
          <Stat type={type} amount={displayAmount} />
        </div>
        
        {/* 右側：日付・商品名 */}
        <div 
          className="text-xs flex-shrink-0 mb-4"
          style={{ 
            textAlign: 'right',
            maxWidth: '120px',
            wordBreak: 'break-word'
          }}
        >
          <div className="mb-3 text-tertiary" style={{ textAlign: 'right' }}>
            {date}
          </div>
          <div 
            className={`${productName ? 'text-secondary' : 'text-tertiary'}`}
            style={{ 
              textAlign: 'right',
              wordBreak: 'break-word',
              overflowWrap: 'break-word'
            }}
          >
            {displayProductName}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewCard;