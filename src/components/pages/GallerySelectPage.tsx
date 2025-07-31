import React, { useRef } from 'react';
import BackIcon from '../icons/BackIcon';
import ActionButton from '../ui/ActionButton';

interface GallerySelectPageProps {
  type: 'otoku' | 'gaman';
  onBack: () => void;
  onImageSelect: (imageData: string) => void;
  className?: string;
}

const GallerySelectPage: React.FC<GallerySelectPageProps> = ({
  type,
  onBack,
  onImageSelect,
  className = ''
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const pageTitle = type === 'otoku' ? 'おトクを記録する' : 'ガマンを記録する';

  const handleSelectFromGallery = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // ファイルタイプをチェック
    if (!file.type.startsWith('image/')) {
      alert('画像ファイルを選択してください。');
      return;
    }

    // ファイルサイズをチェック（10MB制限）
    if (file.size > 10 * 1024 * 1024) {
      alert('ファイルサイズが大きすぎます。10MB以下の画像を選択してください。');
      return;
    }

    // FileReaderで画像をBase64に変換
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      if (imageData) {
        onImageSelect(imageData);
      }
    };
    reader.onerror = () => {
      alert('画像の読み込みに失敗しました。');
    };
    reader.readAsDataURL(file);
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
      <div className="p-4">
        <div className="overflow-hidden">
          {/* タイトルエリア */}
          <div className={`${type === 'otoku' ? 'bg-otoku' : 'bg-gaman'} text-white font-bold text-center py-4 px-6 rounded-t-3xl`}>
            <h2 className="text-lg">画像を選択してください</h2>
          </div>
          
          {/* コンテンツエリア */}
          <div className="bg-white rounded-b-3xl p-6 space-y-6">
            {/* 説明文 */}
            <div className="text-center space-y-3">
              <div className="text-6xl">📱</div>
              <h3 className="text-lg font-bold text-primary">
                カメラロールから選択
              </h3>
              <p className="text-sm text-secondary">
                端末に保存されている画像から、レシートや商品の写真を選択してください。
              </p>
            </div>

            {/* 対応フォーマット */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-bold text-primary mb-2">対応フォーマット</h4>
              <ul className="text-xs text-secondary space-y-1">
                <li>• JPEG, PNG, WebP</li>
                <li>• 最大ファイルサイズ: 10MB</li>
                <li>• レシートや価格タグが鮮明に写った画像</li>
              </ul>
            </div>

            {/* 選択ボタン */}
            <ActionButton
              type={type}
              variant="gallery"
              onClick={handleSelectFromGallery}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* 隠れたファイル入力 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default GallerySelectPage;