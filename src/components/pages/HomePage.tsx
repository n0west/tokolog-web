import React from 'react';
import StatsSection from '../sections/StatsSection';
import ActionSection from '../sections/ActionSection';
import HistorySection from '../sections/HistorySection';
import SettingsIcon from '../icons/SettingsIcon';
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
    <div className="min-h-screen bg-home">
      {/* ヘッダー */}
      <div className="bg-home">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-lg font-bold text-primary">ホーム</h1>
          <button 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="設定"
            onClick={onSettingsClick}
          >
            <SettingsIcon width={24} height={24} color="#374151" />
          </button>
        </div>
      </div>
      
      {/* メインコンテンツ */}
      <div className="px-4 space-y-2">
        <StatsSection
          className="w-full"
          otokuAmount={statsData?.otokuTotal || 0}
          gamanAmount={statsData?.gamanTotal || 0}
          otokuComparison={statsData?.otokuComparison || 0}
          gamanComparison={statsData?.gamanComparison || 0}
          showComparison={false} // 先月比は後で実装
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
      </div>
    </div>
  );
};

export default HomePage;