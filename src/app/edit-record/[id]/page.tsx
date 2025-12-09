'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import EditRecordPage from '@/components/pages/EditRecordPage';
import { RecordData, FormData } from '@/types/database';

interface EditRecordPageWrapperProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditRecordPageWrapper({ params }: EditRecordPageWrapperProps) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [recordData, setRecordData] = useState<RecordData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recordId, setRecordId] = useState<string>('');

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setRecordId(resolvedParams.id);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && recordId) {
      fetchRecord();
    }
  }, [user, recordId]);

  const fetchRecord = async () => {
    if (!user) return;

    setIsLoading(true);
    
    try {
      // カメラ結果からの一時データをチェック
      const cameraEditData = sessionStorage.getItem('cameraEditData');
      if (cameraEditData && recordId.startsWith('camera-')) {
        const tempData = JSON.parse(cameraEditData);
        setRecordData({
          id: recordId, // カメラ結果用の一時ID
          type: tempData.discount_amount > 0 ? 'otoku' : 'gaman',
          amount: tempData.discount_amount > 0 ? tempData.discount_amount : tempData.passed_amount,
          date: tempData.expense_date,
          productName: tempData.description,
          created_at: new Date().toISOString(),
        } as RecordData);
        setIsLoading(false);
        return;
      }

      // 通常の記録データを取得
      const { data: expense, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('id', parseInt(recordId))
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('記録の取得に失敗しました:', error);
        router.push('/history');
        return;
      }

      if (!expense) {
        console.error('記録が見つかりませんでした');
        router.push('/history');
        return;
      }

      // RecordData形式に変換
      const recordData: RecordData = {
        id: String(expense.id),
        type: expense.discount_amount > 0 ? 'otoku' : 'gaman',
        amount: expense.discount_amount > 0 ? expense.discount_amount : expense.passed_amount,
        date: expense.expense_date,
        productName: expense.description,
        created_at: expense.created_at,
      };

      setRecordData(recordData);
    } catch (error) {
      console.error('データの取得中にエラーが発生しました:', error);
      router.push('/history');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (formData: FormData) => {
    if (!user || !recordData) return;
    
    setIsSubmitting(true);
    try {
      const updateData: any = {
        description: formData.productName,
      };

      // おトク・ガマンに応じて適切なフィールドを更新
      if (recordData.type === 'otoku') {
        updateData.discount_amount = formData.amount;
      } else {
        updateData.passed_amount = formData.amount;
      }

      const { error } = await supabase
        .from('expenses')
        .update(updateData)
        .eq('id', parseInt(recordId))
        .eq('user_id', user.id);

      if (error) {
        console.error('保存に失敗しました:', error);
        alert('保存に失敗しました。もう一度お試しください。');
        return;
      }
      
      // 成功時は履歴画面に戻る（更新成功フラグ付き）
      router.push('/history?updated=true');
    } catch (error) {
      console.error('保存に失敗しました:', error);
      alert('保存に失敗しました。もう一度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (recordId: string) => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', parseInt(recordId))
        .eq('user_id', user.id);

      if (error) {
        console.error('削除に失敗しました:', error);
        alert('削除に失敗しました。もう一度お試しください。');
        return;
      }
      
      // 成功時は履歴画面に戻る（削除成功フラグ付き）
      router.push('/history?deleted=true');
    } catch (error) {
      console.error('削除に失敗しました:', error);
      alert('削除に失敗しました。もう一度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/history');
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

  if (!user) {
    return null; // リダイレクト中
  }

  if (!recordData) {
    return (
      <div className="min-h-screen bg-home flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">記録が見つかりませんでした</p>
          <button 
            onClick={handleCancel}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <EditRecordPage
      recordId={recordId}
      initialData={recordData}
      onSave={handleSave}
      onDelete={handleDelete}
      onCancel={handleCancel}
      isSubmitting={isSubmitting}
    />
  );
}