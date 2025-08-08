import React, { useState, useEffect } from 'react';
import BackIcon from '../icons/BackIcon';
import CameraResultItem from '../cards/CameraResultItem';
import ActionButton from '../ui/ActionButton';
import ResponsiveContainer from '../layout/ResponsiveContainer';

interface CameraResultData {
  id: string;
  amount: number;
  productName: string;
  confidence?: number;
}

interface OCRProcessingState {
  isProcessing: boolean;
  progress: number;
  stage: 'idle' | 'uploading' | 'analyzing' | 'processing' | 'complete' | 'error';
  error: string | null;
}

interface CameraResultPageProps {
  type: 'otoku' | 'gaman';
  imageData: string;
  extractedData: CameraResultData[];
  onBack: () => void;
  onRegisterAll: (data: CameraResultData[]) => void;
  isRegistering?: boolean;
  className?: string;
  ocrState?: OCRProcessingState;
  onRetryOCR?: () => void;
  onTestModeToggle?: () => void;
  isTestMode?: boolean;
  rawOCRData?: any;
  onNavigateToEdit?: (id: string, data: { amount: number; productName: string; type: string }) => void;
  onAddNewItem?: () => void;
}

const CameraResultPage: React.FC<CameraResultPageProps> = ({
  type,
  imageData,
  extractedData,
  onBack,
  onRegisterAll,
  isRegistering = false,
  className = '',
  ocrState,
  onRetryOCR,
  onTestModeToggle,
  isTestMode = false,
  rawOCRData,
  onNavigateToEdit,
  onAddNewItem
}) => {
  const [results, setResults] = useState<CameraResultData[]>(extractedData);
  const [editingId, setEditingId] = useState<string | null>(null);

  // extractedDataの変更を監視してresultsを同期
  useEffect(() => {
    setResults(extractedData);
  }, [extractedData]);

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
            <h1 className="text-lg font-bold text-primary">{pageTitle}</h1>
            <div className="flex gap-2">
              {onTestModeToggle && (
                <button
                  onClick={onTestModeToggle}
                  className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                    isTestMode 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  {isTestMode ? 'テスト' : 'TEST'}
                </button>
              )}
              {onRetryOCR && (
                <button
                  onClick={onRetryOCR}
                  className="px-3 py-1 text-xs rounded-lg transition-colors bg-blue-500 text-white hover:bg-blue-600"
                >
                  再読取
                </button>
              )}
              {!onTestModeToggle && !onRetryOCR && <div className="w-8"></div>}
            </div>
          </div>
        </ResponsiveContainer>

        {/* メインコンテンツ */}
        <ResponsiveContainer variant="content" className="space-y-4 pb-4">
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
              {isTestMode 
                ? 'OCRテスト結果（全データ表示）'
                : ocrState?.stage === 'error' ? 'エラーが発生しました' : '以下の内容を読み取りました'
              }
            </h2>
            {ocrState?.stage === 'error' ? (
              <div className="mb-4">
                <p className="text-sm text-red-600 mb-2">
                  {ocrState.error}
                </p>
                {onRetryOCR && (
                  <button
                    onClick={onRetryOCR}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                  >
                    再試行
                  </button>
                )}
                <p className="text-xs text-secondary mt-2">
                  または下記の項目を手動で編集してください
                </p>
              </div>
            ) : (
              <p className="text-sm text-secondary">
                {isTestMode 
                  ? 'Google Vision APIが読み取った全ての内容を表示しています'
                  : 'タップして編集できます'
                }
              </p>
            )}
          </div>

          {/* 読み取り結果リスト */}
          {isTestMode && rawOCRData ? (
            <div className="space-y-4">
              {/* 基本統計情報 */}
              <div className="bg-gray-50 rounded-lg p-3">
                <h3 className="font-semibold text-sm text-gray-700 mb-2">読み取り統計</h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>全文文字数: {rawOCRData.fullTextLength || 0}</div>
                  <div>行数: {rawOCRData.lineCount || 0}</div>
                  <div>テキスト要素数: {rawOCRData.allTextAnnotations?.length || 0}</div>
                  <div>処理時間: {rawOCRData.processingTime || 0}ms</div>
                </div>
              </div>

              {/* 全文表示 */}
              <div className="bg-blue-50 rounded-lg p-3">
                <h3 className="font-semibold text-sm text-blue-700 mb-2">読み取った全文</h3>
                <pre className="text-xs text-blue-900 whitespace-pre-wrap bg-white p-2 rounded border max-h-32 overflow-y-auto">
                  {rawOCRData.rawText || '読み取れませんでした'}
                </pre>
              </div>

              {/* 行別表示 */}
              {rawOCRData.lines && rawOCRData.lines.length > 0 && (
                <div className="bg-green-50 rounded-lg p-3">
                  <h3 className="font-semibold text-sm text-green-700 mb-2">行別データ ({rawOCRData.lines.length}行)</h3>
                  <div className="max-h-48 overflow-y-auto space-y-1">
                    {rawOCRData.lines.map((line: any, index: number) => (
                      <div key={index} className="text-xs bg-white p-2 rounded border">
                        <span className="text-gray-500 font-mono">{index + 1}:</span>
                        <span className="ml-2 text-green-900">
                          {line.text} <span className="text-gray-400">({line.length}文字)</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* テキスト要素別表示 */}
              {rawOCRData.allTextAnnotations && rawOCRData.allTextAnnotations.length > 1 && (
                <div className="bg-orange-50 rounded-lg p-3">
                  <h3 className="font-semibold text-sm text-orange-700 mb-2">
                    テキスト要素別データ ({rawOCRData.allTextAnnotations.length}個)
                  </h3>
                  <div className="max-h-48 overflow-y-auto space-y-1">
                    {rawOCRData.allTextAnnotations.slice(1, 21).map((annotation: any, index: number) => (
                      <div key={index} className="text-xs bg-white p-2 rounded border">
                        <span className="text-gray-500 font-mono">{index + 1}:</span>
                        <span className="ml-2 text-orange-900">
                          {annotation.text} 
                          {annotation.confidence && 
                            <span className="text-gray-400 ml-1">
                              (信頼度: {Math.round(annotation.confidence * 100)}%)
                            </span>
                          }
                        </span>
                      </div>
                    ))}
                    {rawOCRData.allTextAnnotations.length > 21 && (
                      <div className="text-xs text-gray-500 text-center py-2">
                        ...他{rawOCRData.allTextAnnotations.length - 21}個のテキスト要素
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
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
                  onNavigateToEdit={onNavigateToEdit}
                  confidence={item.confidence}
                  className={index < results.length - 1 ? 'mb-2' : ''}
                />
              ))}
              
              {/* 項目追加UI */}
              {onAddNewItem && (
                <button
                  onClick={onAddNewItem}
                  className="w-full p-6 border-2 border-dashed border-sub-border bg-gray-50 rounded-2xl hover:bg-gray-100 hover:border-gray-400 transition-all duration-200 flex items-center justify-center"
                  aria-label="新しい項目を追加"
                >
                  <div className="text-center">
                    <div className="text-gray-400 text-3xl mb-2">＋</div>
                    <span className="text-sm text-gray-500">項目を追加</span>
                  </div>
                </button>
              )}
            </div>
          )}

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
        </ResponsiveContainer>
      </div>
    </ResponsiveContainer>
  );
};

export default CameraResultPage;