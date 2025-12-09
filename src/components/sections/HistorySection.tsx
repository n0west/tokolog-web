import React from 'react';
import RecordCard from '../cards/RecordCard';

interface RecordData {
  id: string;
  type: 'otoku' | 'gaman';
  amount: number;
  date: string;
  productName: string;
}

interface HistorySectionProps {
  records?: RecordData[];
  onViewAllClick?: () => void;
  maxRecords?: number;
  title?: string;
  emptyMessage?: string;
  className?: string;
}

const HistorySection: React.FC<HistorySectionProps> = ({
  records = [],
  onViewAllClick,
  maxRecords = 3,
  title = '履歴',
  emptyMessage = 'まだ記録がありません',
  className = ""
}) => {
  // 表示する記録を制限
  const displayRecords = records.slice(0, maxRecords);
  const hasRecords = records.length > 0;

  return (
    <div className={`bg-white rounded-2xl p-6 border border-sub-border ${className}`}>
      {/* ヘッダー */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-primary">{title}</h2>
        {hasRecords && onViewAllClick && (
          <button 
            onClick={onViewAllClick}
            className="text-secondary hover:text-secondary text-sm font-bold transition-colors flex items-center gap-1"
          >
            すべて見る
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      {/* 記録一覧 or 空状態 */}
      {hasRecords ? (
        <div className="divide-y divide-sub-border">
          {displayRecords.map((record) => (
            <div key={record.id} className="first:pt-0 last:pb-0">
              <RecordCard
                type={record.type}
                amount={record.amount}
                date={record.date}
                productName={record.productName}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-tertiary text-sm mb-4">
            {emptyMessage}
          </div>
          <div className="w-16 h-16 mx-auto bg-home rounded-full flex items-center justify-center">
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="text-tertiary"
            >
              <path 
                d="M9 12H15M9 16H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L19.7071 9.70711C19.8946 9.89464 20 10.149 20 10.4142V19C20 20.1046 19.1046 21 18 21H17Z" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistorySection;