'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import CameraResultPage from '@/components/pages/CameraResultPage';
import { 
  processImageWithOCR, 
  convertOCRToCameraData, 
  getErrorMessage,
  type CameraResultData,
  type OCRProcessingState
} from '@/lib/ocr-utils';

export default function OtokuCameraResultPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [imageData, setImageData] = useState<string>('');
  const [extractedData, setExtractedData] = useState<CameraResultData[]>([]);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isTestMode, setIsTestMode] = useState(false);
  const [rawOCRData, setRawOCRData] = useState<any>(null);
  const [isDiscountMode, setIsDiscountMode] = useState(true);
  const [ocrState, setOcrState] = useState<OCRProcessingState>({
    isProcessing: false,
    progress: 0,
    stage: 'idle',
    error: null,
  });

  // OCR処理を実行する関数
  const performOCR = async (imageDataUrl: string, testModeEnabled: boolean = false, discountModeEnabled: boolean = false) => {
    setOcrState({
      isProcessing: true,
      progress: 10,
      stage: 'uploading',
      error: null,
    });

    try {
      // アップロード段階
      setOcrState(prev => ({ ...prev, progress: 30, stage: 'analyzing' }));
      
      // OCR処理を実行（テストモードと値引きモードを含む）
      const ocrResponse = await processImageWithOCR(imageDataUrl, testModeEnabled, discountModeEnabled);
      
      setOcrState(prev => ({ ...prev, progress: 70, stage: 'processing' }));
      
      if (ocrResponse.success) {
        // テストモードの場合
        if (testModeEnabled && (ocrResponse as any).testMode) {
          setRawOCRData(ocrResponse);
          setExtractedData([]);
          
          // テストモード結果をセッションストレージに保存
          const resultData = {
            extractedData: [],
            rawOCRData: ocrResponse,
            processedAt: new Date().toISOString()
          };
          sessionStorage.setItem('cameraResultData', JSON.stringify(resultData));
        } else {
          // 通常モード：OCR結果をCameraResultData形式に変換
          const convertedData = convertOCRToCameraData(ocrResponse, 'otoku');
          setExtractedData(convertedData);
          
          // 処理結果をセッションストレージに保存
          const resultData = {
            extractedData: convertedData,
            rawOCRData: null,
            processedAt: new Date().toISOString()
          };
          sessionStorage.setItem('cameraResultData', JSON.stringify(resultData));
        }
        
        setOcrState({
          isProcessing: false,
          progress: 100,
          stage: 'complete',
          error: null,
        });
      } else {
        throw new Error(ocrResponse.error || 'OCR処理に失敗しました');
      }
      
    } catch (error) {
      console.error('OCR処理エラー:', error);
      const errorMessage = getErrorMessage(error instanceof Error ? error.message : String(error));
      
      setOcrState({
        isProcessing: false,
        progress: 0,
        stage: 'error',
        error: errorMessage,
      });
      
      // エラー時はフォールバックデータを設定
      if (!testModeEnabled) {
        setExtractedData([
          {
            id: '1',
            amount: 0,
            productName: '商品名を入力してください',
            confidence: 0,
          }
        ]);
      }
    }
  };

  // 再試行機能
  const retryOCR = () => {
    if (imageData) {
      performOCR(imageData, isTestMode, isDiscountMode);
    }
  };

  // テストモード切り替え
  const handleTestModeToggle = () => {
    const newTestMode = !isTestMode;
    setIsTestMode(newTestMode);
    setRawOCRData(null);
    
    // 画像データがある場合は自動的に再実行
    if (imageData) {
      performOCR(imageData, newTestMode, isDiscountMode);
    }
  };

  // 値引きモード切り替え
  const handleDiscountModeToggle = () => {
    const newDiscountMode = !isDiscountMode;
    setIsDiscountMode(newDiscountMode);
    setRawOCRData(null);
    
    // 画像データがある場合は自動的に再実行
    if (imageData) {
      performOCR(imageData, isTestMode, newDiscountMode);
    }
  };

  useEffect(() => {
    const savedImage = sessionStorage.getItem('cameraImage');
    if (!savedImage) {
      router.back();
      return;
    }
    
    setImageData(savedImage);
    
    // 既存の処理済みデータがあるかチェック
    const savedResultData = sessionStorage.getItem('cameraResultData');
    if (savedResultData) {
      try {
        const parsedData = JSON.parse(savedResultData);
        setExtractedData(parsedData.extractedData || []);
        setRawOCRData(parsedData.rawOCRData || null);
        setOcrState({
          isProcessing: false,
          progress: 100,
          stage: 'complete',
          error: null,
        });
        console.log('既存の処理結果を復元しました');
        return;
      } catch (error) {
        console.error('保存されたデータの読み込みに失敗:', error);
      }
    }
    
    // 新規の場合のみOCR処理を実行
    console.log('新規OCR処理を開始します');
    performOCR(savedImage, isTestMode, isDiscountMode);
  }, [router, isTestMode, isDiscountMode]);

  // 編集画面から戻った際の処理
  useEffect(() => {
    // URLパラメータから編集完了フラグをチェック
    const fromEdit = searchParams.get('fromEdit');
    const updatedItemId = searchParams.get('updatedItemId');
    const deletedItemId = searchParams.get('deletedItemId');
    
    if (fromEdit === 'true' && updatedItemId) {
      // 編集完了後のデータを反映
      const cameraEditData = sessionStorage.getItem('cameraEditData');
      if (cameraEditData) {
        try {
          const editedData = JSON.parse(cameraEditData);
          console.log('編集データを反映します:', editedData);
          console.log('更新対象ID:', updatedItemId);
          
          // 既存データを更新
          setExtractedData(prev => {
            console.log('更新前のデータ:', prev);
            const updated = prev.map(item => 
              item.id === updatedItemId 
                ? {
                    ...item,
                    productName: editedData.description || item.productName,
                    amount: editedData.discount_amount || item.amount
                  }
                : item
            );
            
            // 新規項目の場合は追加
            if (editedData.isNewItem && !prev.find(item => item.id === updatedItemId)) {
              updated.push({
                id: updatedItemId,
                productName: editedData.description || '新規項目',
                amount: editedData.discount_amount || 0,
                confidence: 1.0 // 手入力の場合は高信頼度
              });
            }
            
            console.log('更新後のデータ:', updated);
            
            // セッションストレージを更新
            updateExtractedData(updated);
            
            return updated;
          });
          
          // 編集用データをクリア
          sessionStorage.removeItem('cameraEditData');
          
          // URLパラメータをクリア（ページリフレッシュなしで）
          const newUrl = window.location.pathname;
          window.history.replaceState({}, '', newUrl);
          
        } catch (error) {
          console.error('編集データの反映に失敗:', error);
          alert('編集内容の反映に失敗しました。画面を再読み込みしてください。');
        }
      } else {
        console.warn('編集データが見つかりません:', updatedItemId);
      }
    }
    
    // 削除処理
    if (fromEdit === 'true' && deletedItemId) {
      const cameraEditData = sessionStorage.getItem('cameraEditData');
      if (cameraEditData) {
        try {
          const editedData = JSON.parse(cameraEditData);
          
          if (editedData.isDeleted) {
            // 指定されたアイテムを配列から削除
            setExtractedData(prev => {
              const updated = prev.filter(item => item.id !== deletedItemId);
              
              // セッションストレージを更新
              updateExtractedData(updated);
              
              return updated;
            });
            
            console.log(`アイテム ${deletedItemId} を削除しました`);
          }
          
          // 編集用データをクリア
          sessionStorage.removeItem('cameraEditData');
          
          // URLパラメータをクリア
          const newUrl = window.location.pathname;
          window.history.replaceState({}, '', newUrl);
          
        } catch (error) {
          console.error('削除データの反映に失敗:', error);
          alert('削除の反映に失敗しました。画面を再読み込みしてください。');
        }
      } else {
        console.warn('削除データが見つかりません:', deletedItemId);
      }
    }
  }, [searchParams]);

  const handleBack = () => {
    sessionStorage.removeItem('cameraImage');
    sessionStorage.removeItem('cameraResultData');
    sessionStorage.removeItem('cameraEditData');
    router.back();
  };

  // データを更新する関数（編集画面から戻った時に呼ばれる）
  const updateExtractedData = (updatedData: CameraResultData[]) => {
    setExtractedData(updatedData);
    
    // 更新されたデータをセッションストレージに保存
    const resultData = {
      extractedData: updatedData,
      rawOCRData: rawOCRData,
      processedAt: new Date().toISOString()
    };
    sessionStorage.setItem('cameraResultData', JSON.stringify(resultData));
  };

  // 新しい項目を追加
  const handleAddNewItem = () => {
    const tempId = `new-${Date.now()}`;
    
    // 新規項目用のデータをセッションストレージに保存
    const editData = {
      id: tempId,
      description: '',
      amount: 0,
      discount_amount: 0,
      passed_amount: 0,
      category_id: 1,
      expense_date: new Date().toISOString().split('T')[0],
      isFromCamera: true,
      isNewItem: true,
    };
    
    sessionStorage.setItem('cameraEditData', JSON.stringify(editData));
    router.push(`/edit-camera/${tempId}?type=otoku`);
  };

  // 個別編集ページへの遷移
  const handleNavigateToEdit = (id: string, data: { amount: number; productName: string; type: string }) => {
    // 一時的なレコードIDを生成（カメラ結果用）
    const tempId = `camera-${Date.now()}-${id}`;
    
    // 編集ページに必要なデータをセッションストレージに保存
    const editData = {
      id: tempId,
      description: data.productName,
      amount: data.amount,
      discount_amount: data.amount, // おトクの場合は値引き額
      passed_amount: 0,
      category_id: 1,
      expense_date: new Date().toISOString().split('T')[0],
      isFromCamera: true, // カメラ結果からの編集であることを示すフラグ
      originalData: data,
    };
    
    sessionStorage.setItem('cameraEditData', JSON.stringify(editData));
    router.push(`/edit-camera/${tempId}?type=otoku`);
  };

  const handleRegisterAll = async (data: CameraResultData[]) => {
    setIsRegistering(true);
    
    try {
      // 実際のユーザー認証を取得
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        console.error('認証エラー:', authError);
        // 認証されていない場合は、匿名ユーザーとして処理
        // または適切なデフォルトユーザーIDを使用
        console.warn('未認証ユーザーのため、匿名IDを使用します');
      }

      const userId = user?.id || 'anonymous-user';

      // 各データをデータベースに保存
      const insertPromises = data.map(async (item) => {
        const insertData = {
          user_id: userId,
          description: item.productName,
          amount: item.amount,
          discount_amount: item.amount,
          passed_amount: 0, // おトクの場合は0
          category_id: 1,
          expense_date: new Date().toISOString().split('T')[0],
        };

        console.log('おトク登録データ:', insertData);

        const { data: insertResult, error } = await supabase
          .from('expenses')
          .insert(insertData)
          .select();

        if (error) {
          console.error('データ保存エラー:', error);
          console.error('エラー詳細:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          });
          throw error;
        }

        console.log('保存成功:', insertResult);
        return insertResult;
      });

      const results = await Promise.all(insertPromises);
      
      console.log('すべてのデータの保存が完了しました:', results);
      
      // セッションストレージをクリア
      sessionStorage.removeItem('cameraImage');
      
      // ホーム画面に戻る
      router.push('/');
      
    } catch (error) {
      console.error('登録処理でエラーが発生しました:', error);
      alert(`データの保存に失敗しました: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsRegistering(false);
    }
  };

  // ローディング状態の表示
  if (!imageData) {
    return <div>画像データが見つかりません...</div>;
  }

  // OCR処理中の表示
  if (ocrState.isProcessing) {
    return (
      <div className="min-h-screen bg-home flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 border border-sub-border max-w-sm w-full text-center">
          <div className="mb-4">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-lg font-bold text-primary mb-2">画像を解析中...</h2>
            <p className="text-sm text-secondary mb-4">
              {ocrState.stage === 'uploading' && '画像をアップロード中'}
              {ocrState.stage === 'analyzing' && 'レシートを解析中'}
              {ocrState.stage === 'processing' && 'データを処理中'}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${ocrState.progress}%` }}
              ></div>
            </div>
            <p className="text-xs text-secondary mt-2">{ocrState.progress}%</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <CameraResultPage
      type="otoku"
      imageData={imageData}
      extractedData={extractedData}
      onBack={handleBack}
      onRegisterAll={handleRegisterAll}
      isRegistering={isRegistering}
      ocrState={ocrState}
      onRetryOCR={retryOCR}
      onTestModeToggle={handleTestModeToggle}
      isTestMode={isTestMode}
      rawOCRData={rawOCRData}
      onNavigateToEdit={handleNavigateToEdit}
      onAddNewItem={handleAddNewItem}
    />
  );
}