import React, { useState, useMemo } from 'react';
import BackIcon from '../icons/BackIcon';
import FilterSection from '../sections/FilterSection';
import TotalCard from '../cards/TotalCard';
import HistoryItem from '../cards/HistoryItem';
import ResponsiveContainer from '../layout/ResponsiveContainer';
import { RecordData } from '@/types/database';

interface HistoryViewPageProps {
  records: RecordData[];
  onBack?: () => void;
  onNavigateToEdit?: (id: string) => void;
  className?: string;
}

const HistoryViewPage: React.FC<HistoryViewPageProps> = ({
  records,
  onBack,
  onNavigateToEdit,
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
          case 'this_year':
            return recordYear === currentYear;
          default:
            // yyyy-mm 形式の場合
            if (periodFilter.includes('-')) {
              const [filterYear, filterMonth] = periodFilter.split('-').map(Number);
              return recordYear === filterYear && recordMonth === filterMonth - 1; // monthは0ベース
            }
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
      records: groups[key].sort((a, b) => {
        // まず日付で比較
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        
        if (dateA !== dateB) {
          return dateB - dateA; // 新しい日付が上
        }
        
        // 同じ日付の場合は作成日時で比較（後に登録されたものが上）
        if (a.created_at && b.created_at) {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
        
        return 0;
      })
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
    <ResponsiveContainer variant="page" className={className}>
      <div className="min-h-screen bg-home">
        {/* ヘッダー */}
        <ResponsiveContainer variant="content" className="py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="戻る"
            >
              <BackIcon width={24} height={24} color="#374151" />
            </button>
            <h1 className="text-lg font-bold text-primary">履歴</h1>
            <div className="w-8"></div>
          </div>
        </ResponsiveContainer>

        {/* メインコンテンツ - 1枚の統合カード */}
        <ResponsiveContainer variant="content" className="pb-4">
          <div className="bg-white rounded-3xl border border-sub-border p-6 space-y-6">
            {/* フィルターセクション */}
            <FilterSection
              typeFilter={typeFilter}
              periodFilter={periodFilter}
              onTypeFilterChange={setTypeFilter}
              onPeriodFilterChange={setPeriodFilter}
              records={records}
            />

            {/* 合計カード */}
            <TotalCard
              totalAmount={totalAmount}
              comparisonAmount={comparisonAmount}
              comparisonLabel="先月比"
            />

            {/* 履歴リスト */}
            <div className="space-y-2">

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
                            onNavigateToEdit={onNavigateToEdit}
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
        </ResponsiveContainer>
      </div>
    </ResponsiveContainer>
  );
};

export default HistoryViewPage;