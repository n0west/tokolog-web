'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import CameraEditPage, { CameraEditItem } from '@/components/pages/CameraEditPage';

interface EditCameraPageWrapperProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditCameraPageWrapper({ params }: EditCameraPageWrapperProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();
  const [item, setItem] = useState<CameraEditItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tempId, setTempId] = useState<string>('');
  const [type, setType] = useState<'otoku' | 'gaman'>('otoku');

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setTempId(resolvedParams.id);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && tempId) {
      loadCameraData();
    }
  }, [user, tempId]);

  const loadCameraData = async () => {
    setIsLoading(true);
    
    try {
      // URLパラメータからタイプを取得
      const typeParam = searchParams.get('type') as 'otoku' | 'gaman';
      if (typeParam) {
        setType(typeParam);
      }

      // セッションストレージからカメラデータを取得
      const cameraEditData = sessionStorage.getItem('cameraEditData');
      if (cameraEditData) {
        const tempData = JSON.parse(cameraEditData);
        
        // 単一項目データを設定
        const itemData: CameraEditItem = {
          id: tempData.id || tempId,
          productName: tempData.description || '',
          amount: tempData.discount_amount > 0 ? tempData.discount_amount : tempData.passed_amount || 0,
          memo: tempData.memo || '',  // メモフィールド追加
        };
        
        setItem(itemData);
      } else {
        // セッションデータがない場合は空の項目を作成
        setItem({
          id: `new-${Date.now()}`,
          productName: '',
          amount: 0,
          memo: '',  // メモフィールド追加
        });
      }
    } catch (error) {
      console.error('カメラデータの読み込みに失敗しました:', error);
      setItem({
        id: `new-${Date.now()}`,
        productName: '',
        amount: 0,
        memo: '',  // メモフィールド追加
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (itemToSave: CameraEditItem) => {
    setIsSubmitting(true);
    try {
      // Phase 2: 中央データ管理への更新（データベース保存は後のフェーズで実装）
      // セッションストレージに編集結果を保存して、中央データ管理に反映させる
      // 新規項目かどうかを判定
      let isNewItem = false;
      
      // 1. IDがnew-で始まる場合
      if (itemToSave.id.startsWith('new-')) {
        isNewItem = true;
      }
      // 2. camera-timestamp-new-xxx の形式の場合
      else if (itemToSave.id.includes('camera-') && itemToSave.id.includes('new-')) {
        isNewItem = true;
      }
      // 3. セッションデータでisNewItemフラグが設定されている場合
      else {
        const sessionData = sessionStorage.getItem('cameraEditData');
        if (sessionData) {
          try {
            const parsedSession = JSON.parse(sessionData);
            isNewItem = parsedSession.isNewItem || false;
          } catch (error) {
            console.error('セッションデータの解析に失敗:', error);
          }
        }
      }
      
      const updatedEditData = {
        id: itemToSave.id,
        description: itemToSave.productName,
        amount: itemToSave.amount,
        memo: itemToSave.memo || '',  // メモフィールド追加
        discount_amount: type === 'otoku' ? itemToSave.amount : 0,
        passed_amount: type === 'gaman' ? itemToSave.amount : 0,
        category_id: 1,
        expense_date: new Date().toISOString().split('T')[0],
        isFromCamera: true,
        isNewItem: isNewItem,  // 新規項目フラグを追加
        isUpdated: true,
        // データベース保存はすべて登録時に実行するため、ここでは保存しない
        savedToDatabase: false
      };
      
      console.log('✅ handleSave - isNewItem判定:', isNewItem, '、ID:', itemToSave.id);
      
      sessionStorage.setItem('cameraEditData', JSON.stringify(updatedEditData));
      
      // 画像読み取り結果画面に戻る（編集完了フラグ付き）
      const typeParam = searchParams.get('type') || type;
      router.push(`/record/${typeParam}/camera/result?fromEdit=true&updatedItemId=${itemToSave.id}`);
      
    } catch (error) {
      console.error('編集データの保存に失敗しました:', error);
      alert('編集データの保存に失敗しました。もう一度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (itemId: string) => {
    // 削除フラグをセッションストレージに保存
    const deleteData = {
      id: itemId,
      isDeleted: true,
      deletedAt: new Date().toISOString()
    };
    
    sessionStorage.setItem('cameraEditData', JSON.stringify(deleteData));
    
    // 削除完了フラグ付きで画像読み取り結果画面に戻る
    const typeParam = searchParams.get('type') || type;
    router.push(`/record/${typeParam}/camera/result?fromEdit=true&deletedItemId=${itemId}`);
  };

  const handleBack = () => {
    // URLパラメータからタイプを取得して適切な画像読み取り結果画面に戻る
    const typeParam = searchParams.get('type') || type;
    router.push(`/record/${typeParam}/camera/result`);
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-home flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!user || !item) {
    return null; // リダイレクト中
  }

  return (
    <CameraEditPage
      type={type}
      item={item}
      onSave={handleSave}
      onDelete={handleDelete}
      onBack={handleBack}
      isSubmitting={isSubmitting}
    />
  );
}