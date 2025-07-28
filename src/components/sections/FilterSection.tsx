import React from 'react';
import DropdownField from '../forms/DropdownField';

interface FilterSectionProps {
  typeFilter: string;
  periodFilter: string;
  onTypeFilterChange: (value: string) => void;
  onPeriodFilterChange: (value: string) => void;
  className?: string;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  typeFilter,
  periodFilter,
  onTypeFilterChange,
  onPeriodFilterChange,
  className = ''
}) => {
  const typeOptions = [
    { value: 'all', label: 'おトク&ガマン' },
    { value: 'otoku', label: 'おトクのみ' },
    { value: 'gaman', label: 'ガマンのみ' }
  ];

  const periodOptions = [
    { value: 'all', label: '全期間' },
    { value: 'this_month', label: '今月' },
    { value: 'last_month', label: '先月' },
    { value: 'this_year', label: '今年' },
    { value: 'last_year', label: '昨年' }
  ];

  return (
    <div className={`bg-white rounded-3xl p-6 border border-sub-border ${className}`}>
      <div className="flex space-x-4">
        <div className="flex-1">
          <DropdownField
            value={typeFilter}
            onChange={onTypeFilterChange}
            options={typeOptions}
            placeholder="種類を選択"
          />
        </div>
        <div className="flex-1">
          <DropdownField
            value={periodFilter}
            onChange={onPeriodFilterChange}
            options={periodOptions}
            placeholder="期間を選択"
          />
        </div>
      </div>
    </div>
  );
};

export default FilterSection;