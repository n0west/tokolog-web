import React from 'react';
import DropdownField from '../forms/DropdownField';

interface FilterSectionProps {
  typeFilter: string;
  periodFilter: string;
  onTypeFilterChange: (value: string) => void;
  onPeriodFilterChange: (value: string) => void;
  records?: any[]; // 最古のデータを計算するために追加
  className?: string;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  typeFilter,
  periodFilter,
  onTypeFilterChange,
  onPeriodFilterChange,
  records = [],
  className = ''
}) => {
  const typeOptions = [
    { value: 'all', label: 'おトク&ガマン' },
    { value: 'otoku', label: 'おトクのみ' },
    { value: 'gaman', label: 'ガマンのみ' }
  ];

  // 動的に期間オプションを生成（最古のデータから現在まで）
  const generatePeriodOptions = () => {
    const options = [
      { value: 'all', label: '全期間' },
      { value: 'this_year', label: '今年' }
    ];
    
    if (records.length === 0) {
      return options;
    }
    
    // 最古の日付を取得
    const oldestDate = records.reduce((oldest, record) => {
      const recordDate = new Date(record.date);
      return recordDate < oldest ? recordDate : oldest;
    }, new Date(records[0].date));
    
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-11
    
    const oldestYear = oldestDate.getFullYear();
    const oldestMonth = oldestDate.getMonth(); // 0-11
    
    // 最古のデータから現在まで月単位で生成
    let year = currentYear;
    let month = currentMonth;
    
    while (year > oldestYear || (year === oldestYear && month >= oldestMonth)) {
      const monthStr = String(month + 1).padStart(2, '0');
      const value = `${year}-${monthStr}`;
      const label = `${year}/${monthStr}`;
      
      options.push({ value, label });
      
      // 前の月に移動
      month--;
      if (month < 0) {
        month = 11;
        year--;
      }
    }
    
    return options;
  };
  
  const periodOptions = generatePeriodOptions();

  return (
    <div className={`flex space-x-4 ${className}`}>
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
  );
};

export default FilterSection;