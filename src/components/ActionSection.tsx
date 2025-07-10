import React from 'react';
import ActionButton from './ActionButton';

interface ActionSectionProps {
  onOtokuClick?: () => void;
  onGamanClick?: () => void;
  title?: string;
  showTitle?: boolean;
  className?: string;
  isLoading?: boolean;
}

const ActionSection: React.FC<ActionSectionProps> = ({
  onOtokuClick,
  onGamanClick,
  title = '記録する',
  showTitle = true,
  className = "",
  isLoading = false
}) => {
  return (
    <div className={`bg-white rounded-2xl p-6 shadow-sm ${className}`}>
      {/* タイトル */}
      {showTitle && (
        <h2 className="text-xl font-bold text-tx-default mb-6">{title}</h2>
      )}
      
      {/* ActionButtons - レスポンシブ対応 */}
      <div className="grid grid-cols-2 gap-4">
        <ActionButton 
          type="otoku" 
          variant="record" 
          onClick={onOtokuClick}
          disabled={isLoading}
        />
        <ActionButton 
          type="gaman" 
          variant="record" 
          onClick={onGamanClick}
          disabled={isLoading}
        />
      </div>
    </div>
  );
};

export default ActionSection;