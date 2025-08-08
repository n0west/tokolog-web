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
        };
        
        setItem(itemData);
      } else {
        // セッションデータがない場合は空の項目を作成
        setItem({
          id: `new-${Date.now()}`,
          productName: '',
          amount: 0,
        });
      }
    } catch (error) {
      console.error('カメラデータの読み込みに失敗しました:', error);
      setItem({
        id: `new-${Date.now()}`,
        productName: '',
        amount: 0,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (itemToSave: CameraEditItem) => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      const insertData = {
        user_id: user.id,
        description: itemToSave.productName,
        amount: itemToSave.amount,
        discount_amount: type === 'otoku' ? itemToSave.amount : 0,
        passed_amount: type === 'gaman' ? itemToSave.amount : 0,
        category_id: 1,
        expense_date: new Date().toISOString().split('T')[0],
      };

      const { data, error } = await supabase
        .from('expenses')
        .insert(insertData)
        .select();

      if (error) {
        throw error;
      }
      
      // 編集データをセッションストレージに更新（削除ではなく更新済みマークを付ける）
      const updatedEditData = {
        id: itemToSave.id,
        description: itemToSave.productName,
        amount: itemToSave.amount,
        discount_amount: type === 'otoku' ? itemToSave.amount : 0,
        passed_amount: type === 'gaman' ? itemToSave.amount : 0,
        category_id: 1,
        expense_date: new Date().toISOString().split('T')[0],
        isFromCamera: true,
        isUpdated: true,
        savedToDatabase: true
      };
      
      sessionStorage.setItem('cameraEditData', JSON.stringify(updatedEditData));
      
      // 画像読み取り結果画面に戻る（編集完了フラグ付き）
      const typeParam = searchParams.get('type') || type;
      router.push(`/record/${typeParam}/camera/result?fromEdit=true&updatedItemId=${itemToSave.id}`);
      
    } catch (error) {
      console.error('保存に失敗しました:', error);
      alert('保存に失敗しました。もう一度お試しください。');
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