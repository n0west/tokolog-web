'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import HistoryViewPage from '@/components/pages/HistoryViewPage';
import { RecordData } from '@/types/database';

export default function HistoryPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [records, setRecords] = useState<RecordData[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

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
      const formattedRecords: RecordData[] = expenses?.map(expense => ({
        id: expense.id.toString(),
        type: expense.discount_amount > 0 ? 'otoku' : 'gaman',
        amount: expense.discount_amount > 0 ? expense.discount_amount : expense.passed_amount,
        date: expense.expense_date,
        productName: expense.description,
        created_at: expense.created_at,
      })) || [];

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
    <HistoryViewPage
      records={records}
      onBack={handleBack}
      onNavigateToEdit={handleNavigateToEdit}
    />
  );
}