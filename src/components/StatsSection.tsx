import React from 'react';
import StatCard from './StatCard';

interface StatsSectionProps {
  otokuAmount: number;
  gamanAmount: number;
  otokuComparison?: number;
  gamanComparison?: number;
  showComparison?: boolean;
  title?: string;
  className?: string;
}

const StatsSection: React.FC<StatsSectionProps> = ({
  otokuAmount,
  gamanAmount,
  otokuComparison,
  gamanComparison,
  showComparison = true,
  title = '今月の集計',
  className = ""
}) => {
  return (
    <div className={`bg-white rounded-2xl p-6 shadow-sm ${className}`}>
      {/* タイトル */}
      <h2 className="text-xl font-bold text-tx-default mb-6">{title}</h2>
      
      {/* StatCards */}
      <div className="flex">
        <div className="flex-1">
          <StatCard
            type="otoku"
            amount={otokuAmount}
            comparison={otokuComparison}
            showComparison={showComparison}
          />
        </div>
        <div className="w-px bg-gray-200 mx-4"></div>
        <div className="flex-1">
          <StatCard
            type="gaman"
            amount={gamanAmount}
            comparison={gamanComparison}
            showComparison={showComparison}
          />
        </div>
      </div>
    </div>
  );
};

export default StatsSection;