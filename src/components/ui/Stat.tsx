import React from 'react';

interface StatProps {
  type: 'otoku' | 'gaman';
  amount: number;
  className?: string;
}

const Stat: React.FC<StatProps> = ({ type, amount, className = "" }) => {
  const isOtoku = type === 'otoku';
  
  return (
    <div className={className}>
      {/* ラベル */}
      <div className={`text-sm font-bold mb-1`}
           style={{ color: isOtoku ? '#4C95E4' : '#F08372' }}>
        {isOtoku ? 'おトク' : 'ガマン'}
      </div>
      
      {/* 金額 */}
      <div className="text-3xl font-bold text-primary mb-3">
        {amount.toLocaleString()} <span className="text-lg" style={{ color: isOtoku ? '#4C95E4' : '#F08372' }}>円</span>
      </div>
    </div>
  );
};

export default Stat;