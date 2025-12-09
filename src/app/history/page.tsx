'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import HistoryViewPage from '@/components/pages/HistoryViewPage';
import { RecordData } from '@/types/database';

function HistoryPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();
  const [records, setRecords] = useState<RecordData[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchAllRecords();
    }
  }, [user]);

  // ページがフォーカスされた時にデータを再取得
  useEffect(() => {
    const handleFocus = () => {
      if (user) {
        fetchAllRecords();
      }
    };

    const handleVisibilityChange = () => {
      if (!document.hidden && user) {
        fetchAllRecords();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user]);

  // URLパラメータから成功メッセージを表示
  useEffect(() => {
    const updated = searchParams.get('updated');
    const deleted = searchParams.get('deleted');
    
    if (updated === 'true') {
      setSuccessMessage('記録を更新しました');
      setShowSuccessMessage(true);
      // URLパラメータをクリア
      router.replace('/history');
      // 3秒後にメッセージを非表示
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } else if (deleted === 'true') {
      setSuccessMessage('記録を削除しました');
      setShowSuccessMessage(true);
      // URLパラメータをクリア
      router.replace('/history');
      // 3秒後にメッセージを非表示
      setTimeout(() => setShowSuccessMessage(false), 3000);
    }
  }, [searchParams, router]);

  const fetchAllRecords = async () => {
    if (!user) return;

    setDataLoading(true);
    
    try {
      const { data: expenses, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id)
        .order('expense_date', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('データの取得に失敗しました:', error);
        return;
      }

      // RecordData形式に変換
      const formattedRecords: RecordData[] = expenses?.map(expense => {
        const expenseData = expense as any; // 型アサーション
        return {
          id: String(expenseData.id || ''),
          type: (expenseData.discount_amount || 0) > 0 ? 'otoku' : 'gaman',
          amount: (expenseData.discount_amount || 0) > 0 ? (expenseData.discount_amount || 0) : (expenseData.passed_amount || 0),
          date: expenseData.expense_date || '',
          productName: expenseData.description || '',
          created_at: expenseData.created_at || '',
        };
      }) || [];

      setRecords(formattedRecords);

    } catch (error) {
      console.error('データの取得中にエラーが発生しました:', error);
    } finally {
      setDataLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/');
  };

  const handleNavigateToEdit = (id: string) => {
    router.push(`/edit-record/${id}`);
  };

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen bg-home flex items-center justify-center">
        <div className="text-lg text-primary">読み込み中...</div>
      </div>
    );
  }

  if (!user) {
    return null; // リダイレクト中
  }

  return (
    <>
      <HistoryViewPage
        records={records}
        onBack={handleBack}
        onNavigateToEdit={handleNavigateToEdit}
      />
      
      {/* 成功メッセージ */}
      {showSuccessMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2">
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
            <span>{successMessage}</span>
          </div>
        </div>
      )}
    </>
  );
}

export default function HistoryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-home flex items-center justify-center">
      <div className="text-lg text-primary">読み込み中...</div>
    </div>}>
      <HistoryPageContent />
    </Suspense>
  );
}