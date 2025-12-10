import React from 'react';
import StatsSection from '../sections/StatsSection';
import ActionSection from '../sections/ActionSection';
import HistorySection from '../sections/HistorySection';
import SettingsIcon from '../icons/SettingsIcon';
import ResponsiveContainer from '../layout/ResponsiveContainer';
import { StatsData, RecordData } from '@/types/database';

interface HomePageProps {
  statsData: StatsData | null;
  recentRecords: RecordData[];
  onOtokuClick: () => void;
  onGamanClick: () => void;
  onViewAllClick: () => void;
  onSettingsClick: () => void;
}

const HomePage: React.FC<HomePageProps> = ({
  statsData,
  recentRecords,
  onOtokuClick,
  onGamanClick,
  onViewAllClick,
  onSettingsClick,
}) => {
  return (
    <ResponsiveContainer variant="page">
      <div className="min-h-screen bg-home">
        {/* ヘッダー */}
        <ResponsiveContainer variant="content" className="py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold text-primary">ホーム</h1>
            <button 
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="設定"
              onClick={onSettingsClick}
            >
              <SettingsIcon width={24} height={24} color="#374151" />
            </button>
          </div>
        </ResponsiveContainer>
        
        {/* メインコンテンツ */}
        <ResponsiveContainer variant="content" className="space-y-4 pb-4">
          <StatsSection
            className="w-full"
            otokuAmount={statsData?.otokuTotal || 0}
            gamanAmount={statsData?.gamanTotal || 0}
            otokuComparison={statsData?.otokuComparison || 0}
            gamanComparison={statsData?.gamanComparison || 0}
            showComparison={true}
          />
          
          <ActionSection
            className="w-full"
            onOtokuClick={onOtokuClick}
            onGamanClick={onGamanClick}
          />
          
          <HistorySection
            className="w-full"
            records={recentRecords}
            onViewAllClick={onViewAllClick}
          />
        </ResponsiveContainer>
      </div>
    </ResponsiveContainer>
  );
};

export default HomePage;