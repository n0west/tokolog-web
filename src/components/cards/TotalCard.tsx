import React from 'react';

interface TotalCardProps {
  totalAmount: number;
  comparisonAmount?: number;
  comparisonLabel?: string;
  className?: string;
}

const TotalCard: React.FC<TotalCardProps> = ({
  totalAmount,
  comparisonAmount,
  comparisonLabel = '先月比',
  className = ''
}) => {
  const formatAmount = (amount: number) => {
    return amount.toLocaleString();
  };

  const formatComparison = (amount: number) => {
    const sign = amount >= 0 ? '+' : '';
    return `${sign}${amount.toLocaleString()}`;
  };

  const getComparisonColor = (amount: number) => {
    if (amount > 0) return 'text-green-600';
    if (amount < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className={`p-4 border border-gray-300 rounded-2xl space-y-4 ${className}`}>
      {/* ヘッダー */}
      <div>
        <h3 className="text-sm font-bold text-secondary mb-1">合計</h3>
      </div>

      {/* メイン金額 */}
      <div className="text-right">
        <span className="text-4xl font-bold text-primary">
          {formatAmount(totalAmount)}
        </span>
        <span className="text-lg font-bold text-secondary ml-1">円</span>
      </div>

      {/* 比較表示 */}
      {comparisonAmount !== undefined && (
        <div className="text-right">
          <span className="text-sm text-secondary mr-2">{comparisonLabel}</span>
          <span className={`text-sm font-medium ${getComparisonColor(comparisonAmount)}`}>
            {formatComparison(comparisonAmount)}
          </span>
        </div>
      )}
    </div>
  );
};

export default TotalCard;