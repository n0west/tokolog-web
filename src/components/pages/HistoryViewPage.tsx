import React, { useState, useMemo } from 'react';
import BackIcon from '../icons/BackIcon';
import FilterSection from '../sections/FilterSection';
import TotalCard from '../cards/TotalCard';
import HistoryItem from '../cards/HistoryItem';
import { RecordData } from '@/types/database';

interface HistoryViewPageProps {
  records: RecordData[];
  onBack?: () => void;
  onEdit?: (id: string) => void;
  className?: string;
}

const HistoryViewPage: React.FC<HistoryViewPageProps> = ({
  records,
  onBack,
  onEdit,
  className = ''
}) => {
  const [typeFilter, setTypeFilter] = useState('all');
  const [periodFilter, setPeriodFilter] = useState('all');

  // フィルタリングされたデータ
  const filteredRecords = useMemo(() => {
    let filtered = [...records];

    // タイプフィルター
    if (typeFilter !== 'all') {
      filtered = filtered.filter(record => record.type === typeFilter);
    }

    // 期間フィルター
    if (periodFilter !== 'all') {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();

      filtered = filtered.filter(record => {
        const recordDate = new Date(record.date);
        const recordYear = recordDate.getFullYear();
        const recordMonth = recordDate.getMonth();

        switch (periodFilter) {
          case 'this_month':
            return recordYear === currentYear && recordMonth === currentMonth;
          case 'last_month':
            const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
            const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
            return recordYear === lastMonthYear && recordMonth === lastMonth;
          case 'this_year':
            return recordYear === currentYear;
          case 'last_year':
            return recordYear === currentYear - 1;
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [records, typeFilter, periodFilter]);

  // 月別グループ化
  const groupedRecords = useMemo(() => {
    const groups: { [key: string]: RecordData[] } = {};

    filteredRecords.forEach(record => {
      const date = new Date(record.date);
      const key = `${date.getFullYear()}年${date.getMonth() + 1}月`;
      
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(record);
    });

    // 月順にソート
    const sortedKeys = Object.keys(groups).sort((a, b) => {
      const [yearA, monthA] = a.replace('年', '-').replace('月', '').split('-').map(Number);
      const [yearB, monthB] = b.replace('年', '-').replace('月', '').split('-').map(Number);
      
      if (yearA !== yearB) return yearB - yearA; // 新しい年から
      return monthB - monthA; // 新しい月から
    });

    return sortedKeys.map(key => ({
      period: key,
      records: groups[key].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    }));
  }, [filteredRecords]);

  // 合計金額計算
  const totalAmount = useMemo(() => {
    return filteredRecords.reduce((sum, record) => sum + record.amount, 0);
  }, [filteredRecords]);

  // 先月比計算（簡易版）
  const comparisonAmount = useMemo(() => {
    // 実際の実装では前期間との比較を行う
    return Math.floor(Math.random() * 10000) - 5000; // ダミーデータ
  }, [filteredRecords]);

  return (
    <div className={`min-h-screen bg-home ${className}`}>
      {/* ヘッダー */}
      <div className="bg-home">
        <div className="flex items-center justify-between p-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="戻る"
          >
            <BackIcon width={24} height={24} color="#374151" />
          </button>
          <h1 className="text-lg font-bold text-primary">あなたのデータ</h1>
          <div className="w-8"></div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="p-4 space-y-4">
        {/* フィルターセクション */}
        <FilterSection
          typeFilter={typeFilter}
          periodFilter={periodFilter}
          onTypeFilterChange={setTypeFilter}
          onPeriodFilterChange={setPeriodFilter}
        />

        {/* 合計カード */}
        <TotalCard
          totalAmount={totalAmount}
          comparisonAmount={comparisonAmount}
          comparisonLabel="先月比"
        />

        {/* 履歴セクション */}
        <div className="bg-white rounded-3xl border border-sub-border">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-primary">履歴</h3>
              <span className="text-sm text-secondary">項目をタップして編集できます</span>
            </div>

            {/* 履歴リスト */}
            <div className="space-y-0">
              {groupedRecords.length === 0 ? (
                <div className="text-center py-8 text-secondary">
                  {typeFilter === 'all' && periodFilter === 'all' 
                    ? '記録がありません' 
                    : '条件に一致する記録がありません'
                  }
                </div>
              ) : (
                groupedRecords.map(group => (
                  <div key={group.period}>
                    {/* 月ヘッダー */}
                    <div className="text-right text-sm text-tertiary py-2 border-b border-gray-100">
                      {group.period}
                    </div>
                    
                    {/* 月の記録 */}
                    <div className="space-y-0">
                      {group.records.map((record, index) => (
                        <HistoryItem
                          key={record.id}
                          id={record.id}
                          type={record.type}
                          amount={record.amount}
                          date={record.date}
                          productName={record.productName}
                          onEdit={onEdit}
                          className={index < group.records.length - 1 ? 'border-b border-gray-100' : ''}
                        />
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryViewPage;