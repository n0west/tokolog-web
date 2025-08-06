import React from 'react';
import Stat from '../stats/Stat';
import ChevronRightIcon from '../icons/ChevronRightIcon';

interface RecordCardProps {
  type: 'otoku' | 'gaman';
  amount: number;
  date: string;
  productName: string;
  onNavigateToEdit?: () => void;
}

const RecordCard: React.FC<RecordCardProps> = ({ 
  type, 
  amount, 
  date, 
  productName,
  onNavigateToEdit
}) => {
  return (
    <div 
      className="bg-white p-2 w-full cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={onNavigateToEdit}
    >
      <div className="flex justify-between items-center gap-6">
        {/* 左側：Stat（金額情報）- 左端配置 */}
        <div className="flex-shrink-0">
          <Stat type={type} amount={amount} />
        </div>
        
        {/* 中央：日付・商品名 */}
        <div 
          className="text-xs flex-1 mb-4"
          style={{ 
            maxWidth: '120px',
            wordBreak: 'break-word'
          }}
        >
          <div className="mb-3 text-tertiary text-right">{date}</div>
          <div 
            className="text-secondary text-right" 
            style={{ 
              wordBreak: 'break-word',
              overflowWrap: 'break-word'
            }}
          >
            {productName}
          </div>
        </div>
        
        {/* 右側：シェブロンアイコン */}
        {onNavigateToEdit && (
          <div className="flex-shrink-0">
            <ChevronRightIcon 
              width={20} 
              height={20} 
              color="#9CA3AF" 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default RecordCard;