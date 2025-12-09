'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import CameraResultPage from '@/components/pages/CameraResultPage';
import MultiItemModalSection from '@/components/sections/MultiItemModalSection';
import { 
  processImageWithOCR, 
  convertOCRToCameraData, 
  getErrorMessage,
  type CameraResultData,
  type OCRProcessingState
} from '@/lib/ocr-utils';

function OtokuCameraResultPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [imageData, setImageData] = useState<string>('');
  const [extractedData, setExtractedData] = useState<CameraResultData[]>([]);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isTestMode, setIsTestMode] = useState(false);
  const [rawOCRData, setRawOCRData] = useState<any>(null);
  const [isDiscountMode, setIsDiscountMode] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registeredItems, setRegisteredItems] = useState<CameraResultData[]>([]);
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
    
    // 既存の処理済みデータがあるかチェック、ただし編集処理中はスキップ
    const fromEdit = new URLSearchParams(window.location.search).get('fromEdit');
    const savedResultData = sessionStorage.getItem('cameraResultData');
    
    if (savedResultData && fromEdit !== 'true') {
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
        console.log('既存の処理結果を復元しました（編集処理中ではない）');
        return;
      } catch (error) {
        console.error('保存されたデータの読み込みに失敗:', error);
      }
    }
    
    // 新規の場合のみOCR処理を実行（編集処理中はスキップ）
    if (fromEdit !== 'true') {
      console.log('新規OCR処理を開始します');
      
      // 新規OCR処理開始時に前回の結果データをクリア
      sessionStorage.removeItem('cameraResultData');
      console.log('🧹 前回のカメラ結果データをクリアしました');
      
      performOCR(savedImage, isTestMode, isDiscountMode);
    }
  }, [router, isTestMode, isDiscountMode]);

  // 編集画面から戻った際の処理
  useEffect(() => {
    // URLパラメータから編集完了フラグをチェック
    const fromEdit = searchParams.get('fromEdit');
    const updatedItemId = searchParams.get('updatedItemId');
    const deletedItemId = searchParams.get('deletedItemId');
    
    // React Strict Modeによる二重実行防止のため、既に処理済みの場合はスキップ
    if (fromEdit === 'true' && (updatedItemId || deletedItemId)) {
      const processedKey = `processed_${updatedItemId || deletedItemId}`;
      if (sessionStorage.getItem(processedKey)) {
        console.log('⚠️ 既に処理済みです - スキップ:', updatedItemId || deletedItemId);
        return;
      }
      // 処理開始マーク
      sessionStorage.setItem(processedKey, 'true');
      // 5秒後にクリーンアップ
      setTimeout(() => sessionStorage.removeItem(processedKey), 5000);
    }
    
    console.log('🔍 useEffect triggered - URLパラメータ確認:', {
      fromEdit,
      updatedItemId,
      deletedItemId,
      allParams: Object.fromEntries(searchParams.entries())
    });
    
    if (fromEdit === 'true' && updatedItemId) {
      // 編集完了後のデータを反映
      const cameraEditData = sessionStorage.getItem('cameraEditData');
      console.log('📦 セッションストレージの cameraEditData:', cameraEditData);
      
      if (cameraEditData) {
        try {
          const editedData = JSON.parse(cameraEditData);
          console.log('✅ 編集データを反映します:', editedData);
          console.log('🎯 更新対象ID:', updatedItemId);
          
          // 既存データを更新（セッションストレージから最新データを取得）
          const currentSessionData = sessionStorage.getItem('cameraResultData');
          let baseData = extractedData; // 現在のReact状態をベースに
          
          // セッションストレージに最新データがある場合はそれを使用
          if (currentSessionData) {
            try {
              const sessionParsed = JSON.parse(currentSessionData);
              if (sessionParsed.extractedData && Array.isArray(sessionParsed.extractedData)) {
                baseData = sessionParsed.extractedData;
                console.log('💾 セッションストレージから最新データを取得:', baseData.length, '項目');
              }
            } catch (error) {
              console.error('セッションデータのパースに失敗:', error);
            }
          }
          
          setExtractedData(prev => {
            console.log('更新前のデータ:', prev.length, '項目');
            console.log('ベースデータ:', baseData.length, '項目');
            
            // 新規項目か既存項目かを判定（camera-で始まる場合は元IDを確認）
            let originalId = updatedItemId;
            let isNewItem = false;
            
            if (updatedItemId.includes('camera-')) {
              // camera-timestamp-xxx の形式から元IDを抽出
              const idParts = updatedItemId.split('-');
              if (idParts.length >= 3) {
                originalId = idParts.slice(2).join('-'); // camera-timestamp-new-xxx → new-xxx
              }
            }
            
            // 新規項目判定：isNewItemフラグまたは元IDがnew-で始まる場合
            isNewItem = editedData.isNewItem || originalId.startsWith('new-');
            
            console.log('🔍 項目タイプ判定:', {
              isNewItem,
              updatedItemId,
              originalId,
              editedDataIsNewItem: editedData.isNewItem
            });
            
            let updated;
            
            if (isNewItem) {
              // 新規項目の追加または更新（元IDで検索）
              const existingIndex = baseData.findIndex(item => item.id === originalId);
              
              if (existingIndex === -1) {
                // 新規追加
                updated = [...baseData, {
                  id: originalId,
                  productName: editedData.description || '新規項目',
                  amount: editedData.discount_amount || 0,
                  memo: editedData.memo || '',
                  confidence: 1.0,
                  source: 'manual' as const,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                }];
                console.log('➕ 新規項目を追加しました:', editedData.description);
              } else {
                // 既存の新規項目を更新
                updated = baseData.map((item, index) => 
                  index === existingIndex 
                    ? {
                        ...item,
                        productName: editedData.description || item.productName,
                        amount: editedData.discount_amount || item.amount,
                        memo: editedData.memo || item.memo || '',
                        updatedAt: new Date().toISOString(),
                      }
                    : item
                );
                console.log('✅ 新規項目を更新しました:', editedData.description);
              }
            } else {
              // 既存項目の更新（OCR項目）
              console.log('🔄 既存項目更新 - 元ID:', originalId, '更新ID:', updatedItemId);
              
              updated = baseData.map(item => 
                item.id === originalId 
                  ? {
                      ...item,
                      productName: editedData.description || item.productName,
                      amount: editedData.discount_amount || item.amount,
                      memo: editedData.memo || item.memo || '',
                      updatedAt: new Date().toISOString(),
                    }
                  : item
              );
              
              const foundItem = baseData.find(item => item.id === originalId);
              if (foundItem) {
                console.log('✅ 既存項目を更新しました:', editedData.description);
              } else {
                console.log('⚠️ 更新対象の項目が見つかりません:', originalId);
              }
            }
            
            console.log('更新後のデータ:', updated);
            
            // セッションストレージを直接更新（循環参照回避）
            const resultData = {
              extractedData: updated,
              rawOCRData: rawOCRData,
              processedAt: new Date().toISOString()
            };
            sessionStorage.setItem('cameraResultData', JSON.stringify(resultData));
            console.log('💾 セッションストレージ更新完了 - アイテム数:', updated.length);
            
            return updated;
          });
          
          // 編集用データをクリア
          sessionStorage.removeItem('cameraEditData');
          
          // URLパラメータをクリア（ページリフレッシュなしで）
          const newUrl = window.location.pathname;
          window.history.replaceState({}, '', newUrl);
          
          console.log('✅ 編集処理完了 - データ更新、セッションクリア、URLクリア完了');
          
          // セッションストレージから最新データを強制的に反映
          setTimeout(() => {
            console.log('🔄 最新データをReact状態に強制反映します');
            const latestData = sessionStorage.getItem('cameraResultData');
            if (latestData) {
              try {
                const parsed = JSON.parse(latestData);
                if (parsed.extractedData) {
                  setExtractedData(parsed.extractedData);
                  console.log('✅ 最新データをUIに反映完了 - アイテム数:', parsed.extractedData.length);
                }
              } catch (error) {
                console.error('最新データの反映に失敗:', error);
              }
            }
          }, 100); // 編集処理完了後に実行
          
        } catch (error) {
          console.error('編集データの反映に失敗:', error);
          alert('編集内容の反映に失敗しました。画面を再読み込みしてください。');
          // エラー時は画面をリフレッシュして最新状態に戻す
          window.location.reload();
        }
      } else {
        console.warn('編集データが見つかりません:', updatedItemId);
      }
    }
    
    // 削除処理
    if (fromEdit === 'true' && deletedItemId) {
      console.log('🗑️ 削除処理開始:', deletedItemId);
      const cameraEditData = sessionStorage.getItem('cameraEditData');
      console.log('📦 削除用セッションデータ:', cameraEditData);
      
      if (cameraEditData) {
        try {
          const editedData = JSON.parse(cameraEditData);
          console.log('✅ 削除データ解析:', editedData);
          
          if (editedData.isDeleted) {
            // 削除対象のIDを元のIDにマッピング
            let originalId = deletedItemId;
            
            if (deletedItemId.includes('camera-')) {
              // camera-timestamp-xxx の形式から元IDを抽出
              const idParts = deletedItemId.split('-');
              if (idParts.length >= 3) {
                originalId = idParts.slice(2).join('-'); // camera-timestamp-new-xxx → new-xxx
              } else {
                originalId = idParts.pop() || deletedItemId; // camera-timestamp-1 → 1
              }
            }
            
            console.log('🔄 削除IDマッピング - 元ID:', originalId, '削除ID:', deletedItemId);
            
            // セッションストレージから最新データを直接取得して削除処理
            const currentSessionData = sessionStorage.getItem('cameraResultData');
            let sourceData = extractedData; // フォールバック
            
            if (currentSessionData) {
              try {
                const sessionParsed = JSON.parse(currentSessionData);
                if (sessionParsed.extractedData && Array.isArray(sessionParsed.extractedData)) {
                  sourceData = sessionParsed.extractedData;
                  console.log('💾 削除用データ取得元: セッションストレージ (', sourceData.length, '項目)');
                } else {
                  console.log('💾 削除用データ取得元: React状態 (', sourceData.length, '項目)');
                }
              } catch (error) {
                console.error('セッションデータパース失敗、React状態を使用:', error);
              }
            } else {
              console.log('💾 削除用データ取得元: React状態のみ (', sourceData.length, '項目)');
            }
            
            // 削除処理実行
            const beforeCount = sourceData.length;
            const updated = sourceData.filter(item => item.id !== originalId);
            const afterCount = updated.length;
            
            console.log('🔢 削除処理 - 削除前:', beforeCount, '項目 → 削除後:', afterCount, '項目');
            console.log('🎯 削除対象ID:', originalId, '削除成功:', beforeCount > afterCount);
            
            // React状態を更新
            setExtractedData(updated);
            
            // セッションストレージを更新
            const resultData = {
              extractedData: updated,
              rawOCRData: rawOCRData,
              processedAt: new Date().toISOString()
            };
            sessionStorage.setItem('cameraResultData', JSON.stringify(resultData));
            
            console.log(`✅ アイテム ${deletedItemId} を削除しました`);
          }
          
          // 編集用データをクリア
          sessionStorage.removeItem('cameraEditData');
          
          // URLパラメータをクリア
          const newUrl = window.location.pathname;
          window.history.replaceState({}, '', newUrl);
          
        } catch (error) {
          console.error('削除データの反映に失敗:', error);
          alert('削除の反映に失敗しました。画面を再読み込みしてください。');
          // エラー時は画面をリフレッシュして最新状態に戻す
          window.location.reload();
        }
      } else {
        console.warn('削除データが見つかりません:', deletedItemId);
      }
    }
  }, [searchParams]);

  const handleBack = () => {
    console.log('⬅️ カメラ結果画面からカメラ画面に戻ります');
    
    // セッションストレージをクリア
    sessionStorage.removeItem('cameraImage');
    sessionStorage.removeItem('cameraResultData');
    sessionStorage.removeItem('cameraEditData');
    
    // おトクのカメラ画面に直接遷移
    router.push('/record/otoku/camera');
  };

  // 中央データ管理: extractedDataの更新とセッションストレージ同期
  const updateExtractedData = (updatedData: CameraResultData[]) => {
    // 1. React状態を更新
    setExtractedData(updatedData);
    
    // 2. セッションストレージに永続化
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
    
    console.log('➕ 新規項目追加開始 - ID:', tempId);
    
    // 1. 即座にUIに空の項目を追加表示
    const newItem = {
      id: tempId,
      productName: '新規項目（編集中）',
      amount: 0,
      memo: '',
      confidence: 1.0,
      source: 'manual' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // React状態を更新
    setExtractedData(prev => {
      const updated = [...prev, newItem];
      
      // セッションストレージも同期更新
      const resultData = {
        extractedData: updated,
        rawOCRData: rawOCRData,
        processedAt: new Date().toISOString()
      };
      sessionStorage.setItem('cameraResultData', JSON.stringify(resultData));
      
      console.log('✅ UIに空の新規項目を追加表示しました');
      return updated;
    });
    
    // 2. 編集ページ用のデータをセッションストレージに保存
    const editData = {
      id: tempId,
      description: '',
      amount: 0,
      discount_amount: 0,
      passed_amount: 0,
      memo: '',
      category_id: 1,
      expense_date: new Date().toISOString().split('T')[0],
      isFromCamera: true,
      isNewItem: true,
    };
    
    sessionStorage.setItem('cameraEditData', JSON.stringify(editData));
    
    // 3. 編集ページに遷移
    router.push(`/edit-camera/${tempId}?type=otoku`);
  };

  // 個別編集ページへの遷移
  const handleNavigateToEdit = (id: string, data: { amount: number; productName: string; type: string }) => {
    // 一時的なレコードIDを生成（カメラ結果用）
    const tempId = `camera-${Date.now()}-${id}`;
    
    // 既存データからメモを取得
    const existingItem = extractedData.find(item => item.id === id);
    const currentMemo = existingItem?.memo || '';
    
    console.log('📝 編集データ初期化 - 既存メモ:', currentMemo);
    
    // 編集ページに必要なデータをセッションストレージに保存
    const editData = {
      id: tempId,
      description: data.productName,
      amount: data.amount,
      discount_amount: data.amount, // おトクの場合は値引き額
      passed_amount: 0,
      memo: currentMemo,  // 既存のメモを保持
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
      
      // モーダル表示用にデータを保存
      setRegisteredItems(data);
      setShowSuccessModal(true);
      
    } catch (error) {
      console.error('登録処理でエラーが発生しました:', error);
      alert(`データの保存に失敗しました: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsRegistering(false);
    }
  };

  // モーダル閉じた後の処理
  const handleModalClose = () => {
    setShowSuccessModal(false);
    
    // セッションストレージをクリア
    sessionStorage.removeItem('cameraImage');
    sessionStorage.removeItem('cameraResultData');
    sessionStorage.removeItem('cameraEditData');
    
    // ホーム画面に戻る
    router.push('/');
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
    <>
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
      
      {/* 登録完了モーダル */}
      <MultiItemModalSection
        isOpen={showSuccessModal}
        onClose={handleModalClose}
        type="otoku"
        items={registeredItems.map(item => ({
          id: item.id,
          productName: item.productName,
          amount: item.amount
        }))}
      />
    </>
  );
}

export default function OtokuCameraResultPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OtokuCameraResultPageContent />
    </Suspense>
  );
}