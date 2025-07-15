import React from 'react';
import BackIcon from '../icons/BackIcon';
import ActionButton from '../ui/ActionButton';

interface RecordMethodPageProps {
  type: 'otoku' | 'gaman';
  onBack?: () => void;
  onCameraClick?: () => void;
  onGalleryClick?: () => void;
  onManualClick?: () => void;
  className?: string;
}

const RecordMethodPage: React.FC<RecordMethodPageProps> = ({
  type,
  onBack,
  onCameraClick,
  onGalleryClick,
  onManualClick,
  className = ""
}) => {
  const pageTitle = type === 'otoku' ? 'おトクを記録する' : 'ガマンを記録する';
  const headerBgColor = type === 'otoku' ? 'bg-blue-500' : 'bg-red-500';
  const headerTextColor = 'text-white';
  
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
          <h1 className="text-lg font-bold text-primary">{pageTitle}</h1>
          <div className="w-8"></div> {/* スペーサー */}
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="p-4">
        {/* 記録方法選択セクション */}
        <div className="overflow-hidden">
          {/* タイトルエリア */}
          <div className={`${type === 'otoku' ? 'bg-otoku' : 'bg-gaman'} text-white font-bold text-center py-4 px-6 rounded-t-3xl`}>
            <h2 className="text-lg">記録方法を選択してください</h2>
          </div>
          
          {/* コンテンツエリア */}
          <div className="bg-white rounded-b-3xl p-6 space-y-6">
            {/* 自動入力セクション */}
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-primary">自動入力</h3>
                <p className="text-sm text-secondary">
                  レシートの内容を読み取り、自動で金額と商品名を入力します
                </p>
              </div>
              
              <div className="space-y-3">
                <ActionButton
                  type={type}
                  variant="camera"
                  onClick={onCameraClick}
                  className="w-full"
                />
                <ActionButton
                  type={type}
                  variant="gallery"
                  onClick={onGalleryClick}
                  className="w-full"
                />
              </div>
            </div>

            {/* ディバイダー */}
            <div className="border-t border-sub-border"></div>

            {/* 手動入力セクション */}
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-primary">手動入力</h3>
              </div>
              
              <ActionButton
                type={type}
                variant="manual"
                onClick={onManualClick}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordMethodPage;