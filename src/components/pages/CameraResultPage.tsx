import React, { useState } from 'react';
import BackIcon from '../icons/BackIcon';
import CameraResultItem from '../cards/CameraResultItem';
import ActionButton from '../ui/ActionButton';

interface CameraResultData {
  id: string;
  amount: number;
  productName: string;
}

interface CameraResultPageProps {
  type: 'otoku' | 'gaman';
  imageData: string;
  extractedData: CameraResultData[];
  onBack: () => void;
  onRegisterAll: (data: CameraResultData[]) => void;
  isRegistering?: boolean;
  className?: string;
}

const CameraResultPage: React.FC<CameraResultPageProps> = ({
  type,
  imageData,
  extractedData,
  onBack,
  onRegisterAll,
  isRegistering = false,
  className = ''
}) => {
  const [results, setResults] = useState<CameraResultData[]>(extractedData);
  const [editingId, setEditingId] = useState<string | null>(null);

  const pageTitle = type === 'otoku' ? 'おトクを記録する' : 'ガマンを記録する';
  const currentDate = new Date().toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleEdit = (id: string) => {
    setEditingId(id);
  };

  const handleSave = (id: string, newData: { amount: number; productName: string }) => {
    setResults(prev => prev.map(item => 
      item.id === id 
        ? { ...item, amount: newData.amount, productName: newData.productName }
        : item
    ));
    setEditingId(null);
  };

  const handleCancel = (id: string) => {
    setEditingId(null);
  };

  const handleRegisterAll = () => {
    onRegisterAll(results);
  };

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
          <div className="w-8"></div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="p-4 space-y-4">
        {/* 結果表示カード */}
        <div className="bg-white rounded-3xl p-6 border border-sub-border">
          {/* 撮影画像 */}
          <div className="flex justify-center mb-6">
            <div className="w-32 h-40 bg-gray-300 rounded-lg overflow-hidden">
              <img 
                src={imageData} 
                alt="撮影画像" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* 読み取り結果ヘッダー */}
          <div className="text-center mb-4">
            <h2 className="text-lg font-bold text-primary mb-2">
              以下の内容を読み取りました
            </h2>
            <p className="text-sm text-secondary">
              タップして編集・スワイプで削除できます
            </p>
          </div>

          {/* 読み取り結果リスト */}
          <div className="space-y-0">
            {results.map((item, index) => (
              <CameraResultItem
                key={item.id}
                id={item.id}
                type={type}
                amount={item.amount}
                productName={item.productName}
                date={currentDate}
                isEditing={editingId === item.id}
                onEdit={handleEdit}
                onSave={handleSave}
                onCancel={handleCancel}
                className={index < results.length - 1 ? 'border-b border-gray-100' : ''}
              />
            ))}
          </div>

          {/* 結果が空の場合 */}
          {results.length === 0 && (
            <div className="text-center py-8 text-secondary">
              読み取り結果がありません
            </div>
          )}
        </div>

        {/* 登録ボタン */}
        {results.length > 0 && (
          <ActionButton
            type={type}
            variant="default"
            title={isRegistering ? "登録中..." : "すべて登録"}
            subtitle=""
            onClick={handleRegisterAll}
            disabled={isRegistering || editingId !== null}
            className="w-full"
          />
        )}
      </div>
    </div>
  );
};

export default CameraResultPage;