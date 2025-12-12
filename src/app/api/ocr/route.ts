// src/app/api/ocr/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ImageAnnotatorClient } from '@google-cloud/vision';

// Google Cloud Vision APIクライアントの初期化（設定チェック付き）
let vision: ImageAnnotatorClient | null = null;
const hasValidConfig = process.env.GOOGLE_CLOUD_PROJECT_ID && 
                      process.env.GOOGLE_CLOUD_CLIENT_EMAIL && 
                      process.env.GOOGLE_CLOUD_PRIVATE_KEY;

if (hasValidConfig) {
  try {
    vision = new ImageAnnotatorClient({
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
      credentials: {
        client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
    });
  } catch (error) {
    console.warn('Google Cloud Vision API初期化に失敗しました:', error);
    vision = null;
  }
}

// レシートデータの型定義
interface ExtractedReceiptData {
  totalAmount: number | null;        // 合計金額
  discountAmount: number | null;     // 割引額
  productName: string | null;        // 代表商品名
  storeName: string | null;          // 店舗名
  date: string | null;               // 日付
  confidence: number;                // 抽出精度（0-1）
}

// 拡張されたOCRレスポンス構造
interface EnhancedOCRResponse {
  success: boolean;
  items: Array<{
    id: string;
    productName: string;
    amount: number;
    confidence: number;
  }>;
  metadata: {
    storeName: string | null;
    date: string | null;
    totalAmount: number | null;
    overallConfidence: number;
  };
  rawText: string;
  processingTime: number;
  error?: string;
}

// 拡張された正規表現パターン定義
const receiptPatterns = {
  // 合計金額抽出（優先度：高）
  totalAmount: [
    /(?:合計|計|総額|total|お会計)[：:\s]*[¥￥]?\s*(\d{1,3}(?:,\d{3})*)\s*円?/i,
    /(?:小計|subtotal)[：:\s]*[¥￥]?\s*(\d{1,3}(?:,\d{3})*)\s*円?/i,
    /(?:税込み?)[：:\s]*[¥￥]?\s*(\d{1,3}(?:,\d{3})*)\s*円?/i,
    /[¥￥]\s*(\d{1,3}(?:,\d{3})*)/g
  ],
  
  // 割引額抽出
  discountAmount: [
    /(?:割引|値引き|discount|off|セール価格)[：:\s]*[¥￥]?\s*(\d{1,3}(?:,\d{3})*)\s*円?/i,
    /(?:特価|sale|セール)[：:\s]*[¥￥]?\s*(\d{1,3}(?:,\d{3})*)\s*円?/i,
    /(?:キャンペーン|cp)[：:\s]*[¥￥]?\s*(\d{1,3}(?:,\d{3})*)\s*円?/i
  ],
  
  // 商品名抽出（拡張パターン）
  productName: [
    // 商品名 + 金額のパターン
    /^([^\d\n]{2,30})[\s\t]+[¥￥]?(\d{1,3}(?:,\d{3})*)円?/m,
    // 商品名のみ（日本語）
    /^([ぁ-んァ-ン一-龯]{2,20})$/m,
    // 商品名のみ（英数字含む）
    /^([a-zA-Z0-9\s\-．・]{3,25})$/m,
    // カタカナ商品名
    /^([ァ-ヶー]{2,20})$/m
  ],
  
  // 店舗名抽出（チェーン店対応）
  storeName: [
    // 一般的な店舗名
    /^([^0-9\n]{2,30})(?:店|支店|本店|営業所)$/m,
    // コンビニ
    /^(セブンイレブン|ファミリーマート|ローソン|ミニストップ)/m,
    // スーパー
    /^(イオン|ダイエー|西友|ライフ|サミット|オーケー)/m,
    // ドラッグストア
    /^(マツキヨ|ツルハ|ウエルシア|スギ薬局|サンドラッグ)/m,
    // 英語店舗名
    /^([A-Za-z\s&]{3,25})$/m
  ],
  
  // 日付抽出（和暦対応）
  date: [
    // 西暦パターン
    /(\d{4})[\/\-年](\d{1,2})[\/\-月](\d{1,2})[日号]?/,
    // 和暦パターン
    /(?:令和|平成|昭和)(\d{1,2})[\/\-年](\d{1,2})[\/\-月](\d{1,2})[日号]?/,
    // 短縮パターン
    /(\d{2})[\/\-](\d{1,2})[\/\-](\d{1,2})/,
    // 時刻付きパターン
    /(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})\s+(\d{1,2}):(\d{1,2})/
  ],

  // 複数商品抽出パターン（レシート行解析用）
  receiptLines: [
    // 商品名 + 金額の基本パターン（￥マーク付き）
    /^(.+?)\s+[¥￥](\d{1,3}(?:,\d{3})*)$/gm,
    // 商品名 + 金額の基本パターン（円マーク付き）
    /^(.+?)\s+(\d{1,3}(?:,\d{3})*)円$/gm,
    // 商品名 + スペース + 金額（数字のみ）
    /^(.+?)\s{2,}(\d{1,3}(?:,\d{3})*)$/gm,
    // より複雑なパターン: 商品名 数量 単価 金額
    /^(.+?)\s+\d+[個点]\s+\d+[円]?\s+[¥￥]?(\d{1,3}(?:,\d{3})*)円?$/gm,
  ],

  // 税込み・税抜き識別
  taxInfo: [
    /税込み?/i,
    /税抜き?/i,
    /(?:消費税|tax)\s*(\d+)%/i
  ],

  // 除外すべき項目（小計、合計、税金など）
  excludePatterns: [
    /^(?:小計|合計|総計|計|税込み?計|税抜き?計|subtotal|total)$/i,
    /小計.*[¥￥]?\d{1,3}(?:,\d{3})*/i,  // "小計 ¥1,000" のようなパターン
    /^(?:消費税|税額|税|tax)$/i,
    /^(?:割引|値引き|discount)$/i,
    /^(?:お釣り|おつり|お預り|預り)$/i,
    /^(?:クレジット|現金|カード|visa|master)$/i,
    /^(?:点数|個数|点|個)$/i,
    /^(?:レシート|receipt|領収書)$/i,
    /^(?:ポイント|point|pt)$/i,
    /^\d+点$/i,  // "3点" のような点数表記
    /^[¥￥]\d/,  // "¥2,680" のような金額のみ
    /^\d+円$/,   // "2680円" のような金額のみ
    /^(?:内税|外税|税別|税込)$/i,  // 税関連の表記
    /^(?:返金|refund|change)$/i,  // 返金・釣り関連
    // 高額商品（合計金額の可能性が高い）を除外
    /^[¥￥]?\s*[3-9],?\d{3}$/i,    // 3,000円以上の金額
    /^お買上計$/i,                 // お買上計
    /^お預り$/i,                  // お預り
    /PayPay|paypay/i,             // 決済方法
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

// 除外すべき商品名かどうかをチェック
function shouldExcludeProduct(productName: string): boolean {
  if (!productName || productName.trim().length === 0) return true;
  
  const cleanName = productName.trim();
  
  // 除外パターンと照合
  for (const pattern of receiptPatterns.excludePatterns) {
    if (pattern.test(cleanName)) {
      return true;
    }
  }
  
  // その他の除外条件
  // 2文字以下の商品名は除外（例: "税", "計"）
  if (cleanName.length <= 2) return true;
  
  // 数字のみの商品名は除外
  if (/^\d+$/.test(cleanName)) return true;
  
  // 小計や合計を含む行は除外
  if (/(?:小計|合計|総計|計|subtotal|total)/i.test(cleanName)) return true;
  
  // 税関連の用語を含む行は除外
  if (/(?:消費税|税額|税込|税抜|内税|外税|tax)/i.test(cleanName)) return true;
  
  return false;
}

// 小計・合計行を検出する関数
function isSubTotalOrTotalLine(line: string): boolean {
  // 小計・合計を示すキーワードパターン
  const subTotalPatterns = [
    /小計/i,
    /合計/i,
    /総計/i,
    /subtotal/i,
    /total/i,
    /税込/i,
    /税抜/i,
    /消費税/i,
    /値引/i,
    /割引/i,
    /ポイント/i,
    /お預り/i,
    /お釣り/i,
    /現金/i,
    /カード/i,
    /クレジット/i
  ];
  
  return subTotalPatterns.some(pattern => pattern.test(line));
}

// 値引き商品を検出する専用関数
function detectDiscountItems(text: string): Array<{id: string, productName: string, amount: number, confidence: number, type: 'discount'}> {
  const discountItems: Array<{id: string, productName: string, amount: number, confidence: number, type: 'discount'}> = [];
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  console.log('値引き商品検出開始:', lines.length, '行');
  
  let itemId = 1;
  
  // 値引きパターンを検索
  for (let i = 0; i < lines.length; i++) {
    const currentLine = lines[i];
    
    // 値引き表記を検出
    const discountPatterns = [
      /▲値引\s*(\d+)%/i,           // ▲値引10%
      /値引\s*(\d+)%/i,            // 値引 10%
      /値引/i                      // 値引（単体）
    ];
    
    let isDiscountLine = false;
    let discountPercentage = null;
    
    for (const pattern of discountPatterns) {
      const match = currentLine.match(pattern);
      if (match) {
        isDiscountLine = true;
        discountPercentage = match[1] ? parseInt(match[1]) : null;
        console.log(`値引き行検出: ${currentLine}, パーセント: ${discountPercentage}`);
        break;
      }
    }
    
    if (isDiscountLine) {
      // 値引き額を次の行または次の2行で探す
      let discountAmount = null;
      for (let k = i + 1; k < Math.min(i + 3, lines.length); k++) {
        const nextLine = lines[k];
        const amountMatch = nextLine.match(/^-(\d+)$/);
        if (amountMatch) {
          discountAmount = parseInt(amountMatch[1]);
          console.log(`値引き額検出: ${discountAmount}円 (${k - i}行後)`);
          break;
        }
      }
      
      if (discountAmount && discountAmount > 0) {
        // 商品情報を前の行から検索（最大3行前まで）
        let productName = null;
        let originalPrice = null;
        
        for (let j = i - 1; j >= Math.max(0, i - 3); j--) {
          const prevLine = lines[j];
          
          // 商品名パターン（商品コード + 商品名、および通常の商品名）
          const productPatterns = [
            /^(\d{3}[_\s]+.+)$/,                    // 553 国産若鶏もも肉
            /^(\d{3}\s.+)$/,                       // 561 すいか
            /^(\d+[_\s]+[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\u3400-\u4DBF\s]+)$/,  // 数字_日本語商品名
            /^([^\d\*\-][^*\-]+)$/,                 // 通常の商品名（数字、*、-で始まらない）
            /^([\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\u3400-\u4DBF\s\w]+)$/  // 日本語・英数字混在商品名
          ];
          
          for (const pattern of productPatterns) {
            const productMatch = prevLine.match(pattern);
            if (productMatch && !shouldExcludeProduct(productMatch[1])) {
              // 商品コードを除いた商品名を抽出
              const rawProductName = productMatch[1];
              const cleanProductName = rawProductName.replace(/^\d{3}[_\s]+/, '').trim();
              
              // 商品名の追加検証
              if (cleanProductName && cleanProductName.length > 1) {
                // 高額金額や合計に関連する用語を除外
                const excludeProductPatterns = [
                  /^[¥￥]?\s*\d{1,3}[,.]?\d{3}$/,  // 金額のみの行
                  /お買上計|小計|合計|総計/i,        // 計算関連
                  /PayPay|paypay|現金|カード/i,     // 決済関連
                  /お預り|お釣り|おつり/i,          // 釣り関連
                  /^\d+点$/,                       // 点数のみ
                ];
                
                let shouldExcludeThisProduct = false;
                for (const excludePattern of excludeProductPatterns) {
                  if (excludePattern.test(cleanProductName)) {
                    console.log(`商品名を除外: ${cleanProductName} (理由: ${excludePattern})`);
                    shouldExcludeThisProduct = true;
                    break;
                  }
                }
                
                if (!shouldExcludeThisProduct) {
                  productName = cleanProductName;
                  console.log(`商品名検出: ${productName} (元行: ${prevLine})`);
                  
                  // 通常価格を次の行で探す
                  if (j + 1 < lines.length) {
                    const priceLineMatch = lines[j + 1].match(/^\*(\d+)$/);
                    if (priceLineMatch) {
                      originalPrice = parseInt(priceLineMatch[1]);
                      console.log(`通常価格検出: ${originalPrice}円`);
                    }
                  }
                  break;
                }
              }
            }
          }
          
          if (productName) break;
        }
        
        // 商品名と値引き額が両方取得できた場合
        if (productName && discountAmount) {
          // 明らかに異常な場合のみ除外（非常に限定的）
          if (discountAmount <= 0) {
            console.log(`値引き額が無効: ${discountAmount}円 (0以下)`);
            continue; // この値引きをスキップ
          }
          
          // 通常価格の3倍を超える値引き（明らかに異常）のみ除外
          if (originalPrice && discountAmount > originalPrice * 3) {
            console.log(`明らかに異常な値引き額: ${discountAmount}円 > ${originalPrice * 3}円 (通常価格の3倍超)`);
            continue; // この値引きをスキップ
          }
          
          // 極端に高額な値引き（100万円以上）は除外
          if (discountAmount >= 1000000) {
            console.log(`極端に高額な値引き: ${discountAmount}円 (100万円以上)`);
            continue; // この値引きをスキップ
          }
          
          // 信頼度計算
          let confidence = 0.7; // 基本信頼度
          
          // 値引き額による段階的な信頼度調整
          if (discountAmount >= 50000) {
            confidence = Math.max(confidence - 0.4, 0.2); // 5万円以上は大幅減
            console.log(`超高額値引き (${discountAmount}円): 信頼度を大幅調整`);
          } else if (discountAmount >= 10000) {
            confidence = Math.max(confidence - 0.3, 0.3); // 1万円以上は大幅減
            console.log(`高額値引き (${discountAmount}円): 信頼度を調整`);
          } else if (discountAmount >= 5000) {
            confidence = Math.max(confidence - 0.2, 0.4); // 5千円以上は中程度減
            console.log(`中額値引き (${discountAmount}円): 信頼度を軽微調整`);
          } else if (discountAmount >= 1000) {
            confidence = Math.max(confidence - 0.1, 0.5); // 1千円以上は軽微減
            console.log(`やや高額値引き (${discountAmount}円): 信頼度を軽微調整`);
          }
          
          // 通常価格との整合性チェック
          if (originalPrice && discountPercentage) {
            const expectedDiscount = Math.round(originalPrice * discountPercentage / 100);
            const discountDifference = Math.abs(expectedDiscount - discountAmount);
            
            if (discountDifference <= 2) {
              confidence = 0.9; // 高信頼度
              console.log(`価格整合性チェック OK: 期待値${expectedDiscount}円 vs 実際${discountAmount}円`);
            } else if (discountDifference <= 5) {
              confidence = 0.8; // 中信頼度
              console.log(`価格整合性チェック 許容範囲: 期待値${expectedDiscount}円 vs 実際${discountAmount}円`);
            } else {
              confidence = 0.6; // 低信頼度
              console.log(`価格整合性チェック NG: 期待値${expectedDiscount}円 vs 実際${discountAmount}円`);
            }
            
            // 整合性が大幅に外れている場合は信頼度を下げる（除外はしない）
            if (discountDifference > originalPrice * 0.8) {
              console.log(`値引き額が非常に大きい: ${discountAmount}円 (通常価格: ${originalPrice}円)`);
              confidence = Math.max(confidence - 0.4, 0.2); // 大幅に信頼度を下げる
            } else if (discountDifference > originalPrice * 0.5) {
              console.log(`値引き額がやや大きい: ${discountAmount}円 (通常価格: ${originalPrice}円)`);
              confidence = Math.max(confidence - 0.2, 0.3); // 信頼度を下げる
            }
          }
          
          // 値引き率による段階的な信頼度調整（通常価格がある場合）
          if (originalPrice) {
            const actualDiscountRate = (discountAmount / originalPrice) * 100;
            
            if (actualDiscountRate >= 90) {
              confidence = Math.max(confidence - 0.4, 0.2); // 90%以上は大幅減
              console.log(`極端な値引き率: ${actualDiscountRate.toFixed(1)}% - 信頼度を大幅調整`);
            } else if (actualDiscountRate >= 80) {
              confidence = Math.max(confidence - 0.3, 0.3); // 80%以上は大幅減
              console.log(`非常に高い値引き率: ${actualDiscountRate.toFixed(1)}% - 信頼度を調整`);
            } else if (actualDiscountRate >= 70) {
              confidence = Math.max(confidence - 0.2, 0.4); // 70%以上は中程度減
              console.log(`高い値引き率: ${actualDiscountRate.toFixed(1)}% - 信頼度を軽微調整`);
            } else if (actualDiscountRate >= 50) {
              confidence = Math.max(confidence - 0.1, 0.5); // 50%以上は軽微減
              console.log(`やや高い値引き率: ${actualDiscountRate.toFixed(1)}% - 信頼度を軽微調整`);
            }
          }
          
          // 重複チェック
          const isDuplicate = discountItems.some(item => 
            item.productName === productName && item.amount === discountAmount
          );
          
          if (!isDuplicate) {
            discountItems.push({
              id: itemId.toString(),
              productName,
              amount: discountAmount,
              confidence: Math.min(confidence, 1.0), // 1.0を上限
              type: 'discount'
            });
            itemId++;
            console.log(`値引き商品登録: ${productName} ${discountAmount}円 (信頼度: ${Math.round(confidence * 100)}%)`);
          }
        }
      }
    }
  }
  
  console.log(`値引き商品検出完了: ${discountItems.length}件`);
  return discountItems;
}

// レシート行を解析して商品を抽出（改良版）
function extractReceiptItems(text: string): Array<{id: string, productName: string, amount: number, confidence: number}> {
  const items: Array<{id: string, productName: string, amount: number, confidence: number}> = [];
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  let itemId = 1;
  let foundSubTotal = false;
  
  for (const line of lines) {
    // 小計・合計行を検出
    if (isSubTotalOrTotalLine(line)) {
      console.log(`小計・合計行を検出してスキップ: ${line}`);
      foundSubTotal = true;
      break;
    }
    
    // 既に小計以降を検出した場合は処理を停止
    if (foundSubTotal) {
      break;
    }
    
    // 除外すべき行はスキップ
    if (shouldExcludeProduct(line)) {
      console.log(`除外対象行をスキップ: ${line}`);
      continue;
    }
    
    // 各パターンで商品名と金額を抽出
    for (const pattern of receiptPatterns.receiptLines) {
      pattern.lastIndex = 0; // リセット
      const match = pattern.exec(line);
      
      if (match && match.length >= 3) {
        const rawProductName = match[1]?.trim();
        const rawAmount = match[2]?.replace(/,/g, '');
        
        if (!rawProductName || !rawAmount) continue;
        
        // 商品名の除外チェック
        if (shouldExcludeProduct(rawProductName)) continue;
        
        const amount = parseInt(rawAmount);
        if (isNaN(amount) || amount <= 0) continue;
        
        // 信頼度の計算
        let confidence = 0.6; // 基本信頼度
        
        // ￥マーク付きは信頼度高
        if (line.includes('￥') || line.includes('¥')) {
          confidence = 0.8;
        }
        // 円マーク付きも信頼度高
        else if (line.includes('円')) {
          confidence = 0.7;
        }
        // 商品名が長めなら信頼度向上
        if (rawProductName.length >= 4) {
          confidence += 0.1;
        }
        
        // 重複チェック
        const isDuplicate = items.some(item => 
          item.productName === rawProductName && item.amount === amount
        );
        
        if (!isDuplicate) {
          items.push({
            id: itemId.toString(),
            productName: rawProductName,
            amount,
            confidence: Math.min(confidence, 1.0) // 1.0を上限
          });
          itemId++;
          break; // この行の解析は完了
        }
      }
    }
  }
  
  return items;
}

// 従来の複数商品抽出（フォールバック用）
function extractMultipleItems(text: string, prioritizeDiscounts: boolean = false): Array<{id: string, productName: string, amount: number, confidence: number}> {
  // 値引き商品を優先する場合
  if (prioritizeDiscounts) {
    console.log('値引き商品検出モードで処理開始');
    const discountItems = detectDiscountItems(text);
    if (discountItems.length > 0) {
      console.log(`値引き商品が見つかりました: ${discountItems.length}件`);
      return discountItems.map(item => ({
        id: item.id,
        productName: item.productName,
        amount: item.amount,
        confidence: item.confidence
      }));
    } else {
      console.log('値引き商品が見つからなかったため、通常商品検出にフォールバック');
    }
  }
  
  // まず新しい行解析方式を試行
  const receiptItems = extractReceiptItems(text);
  if (receiptItems.length > 0) {
    return receiptItems;
  }
  
  // フォールバック: 従来方式
  const items: Array<{id: string, productName: string, amount: number, confidence: number}> = [];
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  let itemId = 1;
  
  // 従来のパターンマッチング（後方互換性）
  const legacyPatterns = [
    /^([^\d\n]{2,30})\s+(\d+)個?\s+[¥￥]?(\d{1,3}(?:,\d{3})*)\s+[¥￥]?(\d{1,3}(?:,\d{3})*)円?/gm,
    /^([^\d\n]{2,30})\s+[¥￥]?(\d{1,3}(?:,\d{3})*)円?$/gm
  ];
  
  for (const pattern of legacyPatterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const productName = match[1]?.trim();
      let amount = 0;
      let confidence = 0.6;
      
      if (shouldExcludeProduct(productName)) {
        continue;
      }
      
      if (match.length === 3) {
        amount = parseInt(match[2].replace(/,/g, ''));
        confidence = 0.7;
      } else if (match.length === 5) {
        amount = parseInt(match[4].replace(/,/g, ''));
        confidence = 0.8;
      }
      
      if (productName && amount > 0) {
        const isDuplicate = items.some(item => 
          item.productName === productName && item.amount === amount
        );
        
        if (!isDuplicate) {
          items.push({
            id: itemId.toString(),
            productName,
            amount,
            confidence
          });
          itemId++;
        }
      }
    }
  }
  
  return items;
}

// 画像品質チェック（基本的なチェック）
function checkImageQuality(buffer: Buffer): {isValid: boolean, issues: string[]} {
  const issues: string[] = [];
  
  // ファイルサイズチェック（最小: 1KB, 最大: 10MB）
  if (buffer.length < 1000) {
    issues.push('画像ファイルが小さすぎます');
  }
  if (buffer.length > 10 * 1024 * 1024) {
    issues.push('画像ファイルが大きすぎます（10MB以下にしてください）');
  }
  
  // 画像ヘッダーの簡単なチェック
  const header = buffer.subarray(0, 4);
  const isJPEG = header[0] === 0xFF && header[1] === 0xD8;
  const isPNG = header[0] === 0x89 && header[1] === 0x50 && header[2] === 0x4E && header[3] === 0x47;
  const isWebP = buffer.subarray(8, 12).toString() === 'WEBP';
  
  if (!isJPEG && !isPNG && !isWebP) {
    issues.push('サポートされていない画像形式です（JPEG、PNG、WebPのみ対応）');
  }
  
  return {
    isValid: issues.length === 0,
    issues
  };
}

// レシートデータを解析
function parseReceiptText(text: string): ExtractedReceiptData {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  // 各項目を抽出
  const totalAmount = extractAmount(text, receiptPatterns.totalAmount);
  const discountAmount = extractAmount(text, receiptPatterns.discountAmount);
  const rawProductName = extractString(text, receiptPatterns.productName);
  const storeName = extractString(text, receiptPatterns.storeName);
  const dateMatch = extractString(text, receiptPatterns.date);
  
  // 商品名の除外フィルタを適用
  const productName = rawProductName && !shouldExcludeProduct(rawProductName) 
    ? rawProductName 
    : null;
  
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
  const startTime = Date.now();
  
  try {
    console.log('OCR API呼び出し開始');
    
    // フォームデータを取得
    const formData = await request.formData();
    const file = formData.get('image') as File;
    const testMode = formData.get('testMode') === 'true';
    const prioritizeDiscounts = formData.get('prioritizeDiscounts') === 'true';
    
    if (!file) {
      return NextResponse.json(
        { error: '画像ファイルが提供されていません' },
        { status: 400 }
      );
    }
    
    console.log('受信したファイル:', file.name, file.type, file.size);
    console.log('テストモード:', testMode);
    console.log('値引き商品検出優先:', prioritizeDiscounts);
    
    // ファイルをBufferに変換
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // 画像品質チェック
    const qualityCheck = checkImageQuality(buffer);
    if (!qualityCheck.isValid) {
      return NextResponse.json(
        { 
          error: '画像品質に問題があります',
          details: qualityCheck.issues,
          extractedData: {
            totalAmount: null,
            discountAmount: null,
            productName: null,
            storeName: null,
            date: null,
            confidence: 0
          }
        },
        { status: 400 }
      );
    }
    
    // OCR処理を実行（Vision API または モック）
    let fullText = '';
    let allTextAnnotations: any[] = [];
    
    if (vision && hasValidConfig) {
      // 実際のGoogle Cloud Vision APIを使用
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
      
      fullText = detections[0]?.description || '';
      allTextAnnotations = detections.map((detection, index) => ({
        id: index.toString(),
        text: detection.description || '',
        confidence: detection.confidence || 0,
        boundingBox: detection.boundingPoly?.vertices || []
      }));
      
      console.log('検出されたテキスト:', fullText);
    } else {
      // モックレスポンスを使用（API設定がない場合）
      console.log('Vision API設定がないため、モックデータを使用');
      fullText = `セブンイレブン 渋谷店
2024/12/11 14:30

おにぎり(鮭)    ￥150
サラダチキン   ￥298
コーヒー        ￥100

小計           ￥548
消費税          ￥54
合計           ￥602

現金           ￥1000
お釣り         ￥398`;
      
      allTextAnnotations = [
        { id: '0', text: fullText, confidence: 0.95, boundingBox: [] },
        { id: '1', text: 'セブンイレブン 渋谷店', confidence: 0.98, boundingBox: [] },
        { id: '2', text: 'おにぎり(鮭)', confidence: 0.85, boundingBox: [] },
        { id: '3', text: '￥150', confidence: 0.92, boundingBox: [] },
        { id: '4', text: 'サラダチキン', confidence: 0.87, boundingBox: [] },
        { id: '5', text: '￥298', confidence: 0.94, boundingBox: [] },
        { id: '6', text: 'コーヒー', confidence: 0.89, boundingBox: [] },
        { id: '7', text: '￥100', confidence: 0.93, boundingBox: [] },
        { id: '8', text: '合計', confidence: 0.96, boundingBox: [] },
        { id: '9', text: '￥602', confidence: 0.97, boundingBox: [] }
      ];
    }
    
    // テストモードの場合は全てのテキスト情報を返す
    if (testMode) {
      console.log('テストモード: 全データを返却');
      
      // 行ごとの分割
      const lines = fullText.split('\n').map((line, index) => ({
        id: index.toString(),
        text: line.trim(),
        length: line.trim().length
      })).filter(line => line.text.length > 0);
      
      return NextResponse.json({
        success: true,
        testMode: true,
        rawText: fullText,
        fullTextLength: fullText.length,
        lineCount: lines.length,
        allTextAnnotations,
        lines,
        processingTime: Date.now() - startTime,
        message: `テストモード: ${allTextAnnotations.length}個のテキスト要素と${lines.length}行を検出しました`
      });
    }
    
    // 通常モード: 既存の処理を継続
    const multipleItems = extractMultipleItems(fullText, prioritizeDiscounts);
    
    // 従来の単一抽出もフォールバックとして実行
    const extractedData = parseReceiptText(fullText);
    console.log('抽出されたデータ:', extractedData);
    
    // 拡張レスポンスの生成
    const processingTime = Date.now() - startTime;
    let finalItems = multipleItems;
    
    // 複数商品が抽出できなかった場合のフォールバック
    if (finalItems.length === 0 && (extractedData.productName || extractedData.totalAmount)) {
      const fallbackAmount = extractedData.discountAmount || extractedData.totalAmount || 0;
      const fallbackProductName = extractedData.productName || extractedData.storeName || '商品名を確認してください';
      
      finalItems = [{
        id: '1',
        productName: fallbackProductName,
        amount: fallbackAmount,
        confidence: extractedData.confidence
      }];
    }
    
    const overallConfidence = finalItems.length > 0 
      ? finalItems.reduce((sum, item) => sum + item.confidence, 0) / finalItems.length
      : extractedData.confidence;
    
    // 従来形式との互換性を保つためのレスポンス
    return NextResponse.json({
      success: true,
      rawText: fullText,
      extractedData: {
        totalAmount: extractedData.totalAmount,
        discountAmount: extractedData.discountAmount,
        productName: finalItems[0]?.productName || extractedData.productName,
        storeName: extractedData.storeName,
        date: extractedData.date,
        confidence: overallConfidence
      },
      // 拡張データ（将来の使用のため）
      enhanced: {
        items: finalItems,
        metadata: {
          storeName: extractedData.storeName,
          date: extractedData.date,
          totalAmount: extractedData.totalAmount,
          overallConfidence
        },
        processingTime
      },
      message: overallConfidence > 0.5 
        ? `${finalItems.length}件の商品を正常に解析しました` 
        : '一部の情報が抽出できませんでした。手動で確認してください。'
    });
    
  } catch (error) {
    console.error('OCR処理エラー:', error);
    
    const processingTime = Date.now() - startTime;
    let errorMessage = 'OCR処理中にエラーが発生しました';
    let statusCode = 500;
    
    // エラータイプ別の処理
    if (error instanceof Error) {
      if (error.message.includes('timeout')) {
        errorMessage = 'OCR処理がタイムアウトしました。画像を小さくするか、再試行してください。';
        statusCode = 408;
      } else if (error.message.includes('rate limit') || error.message.includes('429')) {
        errorMessage = 'API利用制限に達しました。しばらく待ってから再試行してください。';
        statusCode = 429;
      } else if (error.message.includes('invalid image')) {
        errorMessage = '画像形式が無効です。JPEG、PNG、WebP形式の画像を使用してください。';
        statusCode = 400;
      }
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: error instanceof Error ? error.message : 'Unknown error',
        processingTime,
        extractedData: {
          totalAmount: null,
          discountAmount: null,
          productName: null,
          storeName: null,
          date: null,
          confidence: 0
        }
      },
      { status: statusCode }
    );
  }
}