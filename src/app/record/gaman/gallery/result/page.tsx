'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import CameraResultPage from '@/components/pages/CameraResultPage';

interface CameraResultData {
  id: string;
  amount: number;
  productName: string;
}

export default function GamanGalleryResultPage() {
  const router = useRouter();
  const [imageData, setImageData] = useState<string>('');
  const [extractedData, setExtractedData] = useState<CameraResultData[]>([]);
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    const savedImage = sessionStorage.getItem('galleryImage');
    if (!savedImage) {
      router.back();
      return;
    }
    
    setImageData(savedImage);
    
    // OCR処理の代わりにダミーデータを設定
    // 実際の実装では、ここでOCR APIを呼び出します
    const mockExtractedData: CameraResultData[] = [
      {
        id: '1',
        amount: 1580,
        productName: 'スニーカー'
      },
      {
        id: '2', 
        amount: 2980,
        productName: 'ジャケット'
      }
    ];
    
    setExtractedData(mockExtractedData);
  }, [router]);

  const handleBack = () => {
    sessionStorage.removeItem('galleryImage');
    router.back();
  };

  const handleRegisterAll = async (data: CameraResultData[]) => {
    setIsRegistering(true);
    
    try {
      // 実際のユーザー認証を取得
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        console.error('認証エラー:', authError);
        console.warn('未認証ユーザーのため、匿名IDを使用します');
      }

      const userId = user?.id || 'anonymous-user';

      // 各データをデータベースに保存
      const insertPromises = data.map(async (item) => {
        const insertData = {
          user_id: userId,
          description: item.productName,
          amount: 0, // ガマンの場合は0
          discount_amount: 0,
          passed_amount: item.amount, // ガマンの場合はpassed_amountに設定
          category_id: 1,
          expense_date: new Date().toISOString().split('T')[0],
        };

        console.log('ガマン登録データ（ギャラリー）:', insertData);

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
      sessionStorage.removeItem('galleryImage');
      
      // ホーム画面に戻る
      router.push('/');
      
    } catch (error) {
      console.error('登録処理でエラーが発生しました:', error);
      alert(`データの保存に失敗しました: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsRegistering(false);
    }
  };

  if (!imageData) {
    return <div>画像データが見つかりません...</div>;
  }

  return (
    <CameraResultPage
      type="gaman"
      imageData={imageData}
      extractedData={extractedData}
      onBack={handleBack}
      onRegisterAll={handleRegisterAll}
      isRegistering={isRegistering}
    />
  );
}