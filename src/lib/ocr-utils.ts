// OCR処理のユーティリティ関数

// OCR APIのレスポンス型定義
export interface OCRResponse {
  success: boolean;
  extractedData: {
    totalAmount: number | null;
    discountAmount: number | null;
    productName: string | null;
    storeName: string | null;
    date: string | null;
    confidence: number;
  };
  rawText?: string;
  error?: string;
  message?: string;
}

// カメラ結果データの型定義
export interface CameraResultData {
  id: string;
  amount: number;
  productName: string;
  memo?: string;          // メモフィールド追加
  confidence?: number;
  source?: 'ocr' | 'manual';  // データソース追加
  createdAt?: string;     // 作成日時
  updatedAt?: string;     // 更新日時
}

// Base64画像データをBlobに変換
export function dataURLToBlob(dataURL: string): Blob {
  const arr = dataURL.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new Blob([u8arr], { type: mime });
}

// OCR API呼び出し
export async function processImageWithOCR(
  imageData: string, 
  testMode: boolean = false, 
  prioritizeDiscounts: boolean = false
): Promise<OCRResponse> {
  try {
    // Base64データをBlobに変換
    const blob = dataURLToBlob(imageData);
    
    // FormDataを作成
    const formData = new FormData();
    formData.append('image', blob, 'receipt.jpg');
    if (testMode) {
      formData.append('testMode', 'true');
    }
    if (prioritizeDiscounts) {
      formData.append('prioritizeDiscounts', 'true');
    }
    
    // OCR APIに送信
    const response = await fetch('/api/ocr', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result: OCRResponse = await response.json();
    return result;
    
  } catch (error) {
    console.error('OCR処理エラー:', error);
    
    return {
      success: false,
      extractedData: {
        totalAmount: null,
        discountAmount: null,
        productName: null,
        storeName: null,
        date: null,
        confidence: 0,
      },
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

// OCRレスポンスをCameraResultData形式に変換
export function convertOCRToCameraData(ocrResponse: OCRResponse, type: 'otoku' | 'gaman'): CameraResultData[] {
  // まず拡張データ（値引き商品）があるかチェック
  if ((ocrResponse as any).enhanced?.items?.length > 0) {
    console.log('拡張データ（値引き商品等）が見つかりました');
    const enhancedItems = (ocrResponse as any).enhanced.items;
    
    // おトクの場合は値引き商品を優先
    if (type === 'otoku') {
      const discountItems = enhancedItems.filter((item: any) => item.type === 'discount');
      if (discountItems.length > 0) {
        console.log(`値引き商品を優先表示: ${discountItems.length}件`);
        return discountItems.map((item: any, index: number) => ({
          id: (index + 1).toString(),
          amount: item.amount,
          productName: item.productName,
          confidence: item.confidence,
        }));
      }
    }
    
    // 値引き商品がない場合や、ガマンの場合は通常の拡張アイテムを使用
    return enhancedItems.map((item: any, index: number) => ({
      id: (index + 1).toString(),
      amount: item.amount,
      productName: item.productName,
      memo: '',  // 空のメモで初期化
      confidence: item.confidence,
      source: 'ocr' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
  }
  
  // 拡張データがない場合は従来の処理
  const { extractedData } = ocrResponse;
  const results: CameraResultData[] = [];
  
  // 基本的な商品情報がある場合
  if (extractedData.productName && (extractedData.totalAmount || extractedData.discountAmount)) {
    let amount = 0;
    
    if (type === 'otoku') {
      // おトクの場合は割引額を優先、なければ合計金額
      amount = extractedData.discountAmount || extractedData.totalAmount || 0;
    } else {
      // ガマンの場合は合計金額を優先、なければ割引額
      amount = extractedData.totalAmount || extractedData.discountAmount || 0;
    }
    
    if (amount > 0) {
      results.push({
        id: '1',
        amount,
        productName: extractedData.productName,
        memo: '',  // 空のメモで初期化
        confidence: extractedData.confidence,
        source: 'ocr',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  }
  
  // データが抽出できなかった場合のフォールバック
  if (results.length === 0) {
    // 店舗名がある場合はそれを商品名として使用
    const fallbackProductName = extractedData.storeName || '商品名を確認してください';
    const fallbackAmount = extractedData.totalAmount || extractedData.discountAmount || 0;
    
    results.push({
      id: '1',
      amount: fallbackAmount,
      productName: fallbackProductName,
      memo: '',  // 空のメモで初期化
      confidence: extractedData.confidence,
      source: 'ocr',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
  
  return results;
}

// 複数の商品データを生成（将来の拡張用）
export function generateMultipleItems(ocrResponse: OCRResponse, type: 'otoku' | 'gaman'): CameraResultData[] {
  // 現在は単一商品のみ対応
  // 将来的には複数商品の抽出に対応
  return convertOCRToCameraData(ocrResponse, type);
}

// OCR処理の状態管理用の型定義
export interface OCRProcessingState {
  isProcessing: boolean;
  progress: number;
  stage: 'idle' | 'uploading' | 'analyzing' | 'processing' | 'complete' | 'error';
  error: string | null;
}

// エラーメッセージの日本語化
export function getErrorMessage(error: string): string {
  const errorMessages: Record<string, string> = {
    'Network error': 'ネットワークエラーが発生しました。接続を確認してください。',
    'HTTP error! status: 429': 'APIの利用制限に達しました。しばらく待ってから再試行してください。',
    'HTTP error! status: 500': 'サーバーエラーが発生しました。しばらく待ってから再試行してください。',
    'Failed to fetch': 'サーバーに接続できませんでした。インターネット接続を確認してください。',
  };
  
  // 部分一致でエラーメッセージを検索
  for (const [key, message] of Object.entries(errorMessages)) {
    if (error.includes(key)) {
      return message;
    }
  }
  
  return 'OCR処理中にエラーが発生しました。再試行してください。';
}