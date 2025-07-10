import React from 'react';
import ActionButton from './ActionButton';

interface ActionSectionProps {
  layout?: 'horizontal' | 'vertical' | 'flow';
  showTitle?: boolean;
  title?: string;
  onOtokuClick?: () => void;
  onGamanClick?: () => void;
  onCameraClick?: () => void;
  onNextClick?: () => void;
  className?: string;
}

const ActionSection: React.FC<ActionSectionProps> = ({
  layout = 'horizontal',
  showTitle = true,
  title = '記録する',
  onOtokuClick,
  onGamanClick,
  onCameraClick,
  onNextClick,
  className = ""
}) => {
  
  const renderHorizontalLayout = () => (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      {showTitle && (
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-tx-default">{title}</h2>
          <button className="text-tx-secondary hover:text-tx-default text-sm">
            すべて見る →
          </button>
        </div>
      )}
      
      <div className="flex space-x-4">
        <ActionButton 
          type="otoku" 
          variant="primary" 
          onClick={onOtokuClick}
        />
        <ActionButton 
          type="gaman" 
          variant="primary" 
          onClick={onGamanClick}
        />
      </div>
    </div>
  );

  const renderVerticalLayout = () => (
    <div className="space-y-4">
      <ActionButton 
        type="otoku" 
        variant="primary" 
        onClick={onOtokuClick}
      />
      <ActionButton 
        type="gaman" 
        variant="primary" 
        onClick={onGamanClick}
      />
    </div>
  );

  const renderFlowLayout = () => (
    <div className="space-y-4">
      <ActionButton 
        type="otoku" 
        variant="primary" 
        onClick={onOtokuClick}
      />
      {onCameraClick && (
        <ActionButton 
          type="otoku" 
          variant="secondary" 
          onClick={onCameraClick}
        />
      )}
      {onNextClick && (
        <ActionButton 
          type="otoku" 
          variant="cta" 
          onClick={onNextClick}
        />
      )}
    </div>
  );

  const getLayoutComponent = () => {
    switch (layout) {
      case 'horizontal':
        return renderHorizontalLayout();
      case 'vertical':
        return renderVerticalLayout();
      case 'flow':
        return renderFlowLayout();
      default:
        return renderHorizontalLayout();
    }
  };

  return (
    <div className={className}>
      {getLayoutComponent()}
    </div>
  );
};

export default ActionSection;