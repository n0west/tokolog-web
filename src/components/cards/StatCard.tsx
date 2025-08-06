import React from 'react';
import Stat from '../stats/Stat';

interface StatCardProps {
  type: 'otoku' | 'gaman';
  amount: number;
  comparison?: number;
  showComparison?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ 
  type, 
  amount, 
  comparison, 
  showComparison = true 
}) => {
  const isPositive = comparison ? comparison > 0 : false;
  
  return (
    <div className="bg-white p-2">
      <Stat type={type} amount={amount} />
      
      {/* 先月比（条件付き表示） */}
      {showComparison && comparison !== undefined && (
        <div className="text-xs"
             style={{ color: isPositive ? '#22C55E' : '#F5A698' }}>
          先月比 {isPositive ? '+' : ''}{comparison.toLocaleString()}
        </div>
      )}
    </div>
  );
};

export default StatCard;