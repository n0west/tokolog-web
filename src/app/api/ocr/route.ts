// src/app/api/ocr/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ImageAnnotatorClient } from '@google-cloud/vision';

// Google Cloud Vision APIクライアントの初期化
const vision = new ImageAnnotatorClient({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  credentials: {
    client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
});

// レシートデータの型定義
interface ExtractedReceiptData {
  totalAmount: number | null;        // 合計金額
  discountAmount: number | null;     // 割引額
  productName: string | null;        // 代表商品名
  storeName: string | null;          // 店舗名
  date: string | null;               // 日付
  confidence: number;                // 抽出精度（0-1）
}

// 正規表現パターン定義
const receiptPatterns = {
  // 金額抽出（優先度：高）
  totalAmount: [
    /(?:合計|計|総額|total)[：:\s]*[¥￥]?\s*(\d{1,3}(?:,\d{3})*)\s*円?/i,
    /(?:小計|subtotal)[：:\s]*[¥￥]?\s*(\d{1,3}(?:,\d{3})*)\s*円?/i,
    /[¥￥]\s*(\d{1,3}(?:,\d{3})*)/g // 一般的な金額表記
  ],
  
  // 割引額抽出
  discountAmount: [
    /(?:割引|値引き|discount|off)[：:\s]*[¥￥]?\s*(\d{1,3}(?:,\d{3})*)\s*円?/i,
    /(?:sale|セール)[：:\s]*[¥￥]?\s*(\d{1,3}(?:,\d{3})*)\s*円?/i
  ],
  
  // 商品名抽出
  productName: [
    /^([^\d\s]{2,20})(?:\s+\d+円|\s+¥\d+)/m,
    /^([^\d]{3,25})$/m
  ],
  
  // 店舗名抽出
  storeName: [
    /^([^0-9]{2,30})(?:店|支店|本店)$/m,
    /^([A-Za-z\s]{3,20})$/m
  ],
  
  // 日付抽出
  date: [
    /(\d{4})[\/\-年](\d{1,2})[\/\-月](\d{1,2})[日号]?/,
    /(\d{2})[\/\-](\d{1,2})[\/\-](\d{1,2})/
  ]
};

// テキストから金額を抽出
function extractAmount(text: string, patterns: RegExp[]): number | null {
  for (const pattern of patterns) {
    const matches = text.match(pattern);
    if (matches && matches[1]) {
      const amount = parseInt(matches[1].replace(/,/g, ''));
      if (!isNaN(amount) && amount > 0) {
        return amount;
      }
    }
  }
  return null;
}

// テキストから文字列を抽出
function extractString(text: string, patterns: RegExp[]): string | null {
  for (const pattern of patterns) {
    const matches = text.match(pattern);
    if (matches && matches[1]) {
      return matches[1].trim();
    }
  }
  return null;
}

// レシートデータを解析
function parseReceiptText(text: string): ExtractedReceiptData {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  // 各項目を抽出
  const totalAmount = extractAmount(text, receiptPatterns.totalAmount);
  const discountAmount = extractAmount(text, receiptPatterns.discountAmount);
  const productName = extractString(text, receiptPatterns.productName);
  const storeName = extractString(text, receiptPatterns.storeName);
  const dateMatch = extractString(text, receiptPatterns.date);
  
  // 信頼度スコアを計算（抽出できた項目数に基づく）
  let confidence = 0;
  if (totalAmount) confidence += 0.4;
  if (discountAmount) confidence += 0.2;
  if (productName) confidence += 0.2;
  if (storeName) confidence += 0.1;
  if (dateMatch) confidence += 0.1;
  
  return {
    totalAmount,
    discountAmount,
    productName,
    storeName,
    date: dateMatch,
    confidence: Math.round(confidence * 100) / 100
  };
}

export async function POST(request: NextRequest) {
  try {
    console.log('OCR API呼び出し開始');
    
    // フォームデータを取得
    const formData = await request.formData();
    const file = formData.get('image') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: '画像ファイルが提供されていません' },
        { status: 400 }
      );
    }
    
    console.log('受信したファイル:', file.name, file.type, file.size);
    
    // ファイルをBufferに変換
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Google Cloud Vision APIでOCR実行
    console.log('Vision APIでOCR処理を実行中...');
    const [result] = await vision.textDetection({
      image: { content: buffer },
    });
    
    const detections = result.textAnnotations;
    if (!detections || detections.length === 0) {
      return NextResponse.json(
        { 
          error: 'テキストが検出されませんでした',
          extractedData: {
            totalAmount: null,
            discountAmount: null,
            productName: null,
            storeName: null,
            date: null,
            confidence: 0
          }
        },
        { status: 200 }
      );
    }
    
    // 検出されたテキスト全体を取得
    const fullText = detections[0]?.description || '';
    console.log('検出されたテキスト:', fullText);
    
    // レシートデータを解析
    const extractedData = parseReceiptText(fullText);
    console.log('抽出されたデータ:', extractedData);
    
    return NextResponse.json({
      success: true,
      rawText: fullText,
      extractedData,
      message: extractedData.confidence > 0.5 
        ? '正常に解析されました' 
        : '一部の情報が抽出できませんでした。手動で確認してください。'
    });
    
  } catch (error) {
    console.error('OCR処理エラー:', error);
    
    return NextResponse.json(
      { 
        error: 'OCR処理中にエラーが発生しました',
        details: error instanceof Error ? error.message : 'Unknown error',
        extractedData: {
          totalAmount: null,
          discountAmount: null,
          productName: null,
          storeName: null,
          date: null,
          confidence: 0
        }
      },
      { status: 500 }
    );
  }
}