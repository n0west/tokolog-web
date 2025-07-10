import React from 'react';
import Stat from './Stat';

interface RecordCardProps {
  type: 'otoku' | 'gaman';
  amount: number;
  date: string;
  productName: string;
}

const RecordCard: React.FC<RecordCardProps> = ({ 
  type, 
  amount, 
  date, 
  productName 
}) => {
  return (
    <div className="bg-white p-6 w-full">
      <div className="flex justify-between items-start gap-6">
        {/* 左側：Stat（金額情報）- 左端配置 */}
        <div className="flex-shrink-0">
          <Stat type={type} amount={amount} />
        </div>
        
        {/* 右側：日付・商品名 - 右端配置 */}
        <div 
          className="text-xs flex-shrink-0 mb-4"
          style={{ 
            textAlign: 'right',
            maxWidth: '120px',
            wordBreak: 'break-word'
          }}
        >
          <div className="mb-3 text-tx-tertiary" style={{ textAlign: 'right' }}>{date}</div>
          <div 
            className="text-tx-secondary" 
            style={{ 
              textAlign: 'right',
              wordBreak: 'break-word',
              overflowWrap: 'break-word'
            }}
          >
            {productName}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordCard;