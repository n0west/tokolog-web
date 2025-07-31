import React, { useState } from 'react';
import CameraResultItem from '../cards/CameraResultItem';
import { CameraResultList } from '../ui/List';

interface CameraResultData {
  id: string;
  amount: number;
  productName: string;
}

interface CameraResultSectionProps {
  type: 'otoku' | 'gaman';
  imageData: string;
  extractedData: CameraResultData[];
  onDataChange?: (data: CameraResultData[]) => void;
  className?: string;
}

const CameraResultSection: React.FC<CameraResultSectionProps> = ({
  type,
  imageData,
  extractedData,
  onDataChange,
  className = ''
}) => {
  const [results, setResults] = useState<CameraResultData[]>(extractedData);
  const [editingId, setEditingId] = useState<string | null>(null);

  const currentDate = new Date().toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleEdit = (id: string) => {
    setEditingId(id);
  };

  const handleSave = (id: string, newData: { amount: number; productName: string }) => {
    const updatedResults = results.map(item => 
      item.id === id 
        ? { ...item, amount: newData.amount, productName: newData.productName }
        : item
    );
    setResults(updatedResults);
    setEditingId(null);
    onDataChange?.(updatedResults);
  };

  const handleCancel = (id: string) => {
    setEditingId(null);
  };

  return (
    <div className={`bg-white rounded-3xl p-6 border border-sub-border ${className}`}>
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
      <CameraResultList>
        {results.map((item) => (
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
          />
        ))}
      </CameraResultList>

      {/* 結果が空の場合 */}
      {results.length === 0 && (
        <div className="text-center py-8 text-secondary">
          読み取り結果がありません
        </div>
      )}
    </div>
  );
};

export default CameraResultSection;