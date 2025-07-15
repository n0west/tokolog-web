import React from 'react';
import RecordCard from '../cards/RecordCard';

interface RecordItem {
  id: string;
  type: 'otoku' | 'gaman';
  amount: number;
  date: string;
  productName: string;
}

interface RecordListProps {
  records: RecordItem[];
  title?: string;
  className?: string;
}

const RecordList: React.FC<RecordListProps> = ({ 
  records, 
  title,
  className = ""
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* タイトル（オプション） */}
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {title}
        </h3>
      )}
      
      {/* 記録リスト */}
      <div className="space-y-3">
        {records.map((record) => (
          <RecordCard
            key={record.id}
            type={record.type}
            amount={record.amount}
            date={record.date}
            productName={record.productName}
          />
        ))}
      </div>
      
      {/* 空の状態 */}
      {records.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>記録がありません</p>
        </div>
      )}
    </div>
  );
};

export default RecordList;