'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import HomePage from '@/components/pages/HomePage';
import { StatsData, RecordData } from '@/types/database';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [statsData, setStatsData] = useState<StatsData | null>(null);
  const [recentRecords, setRecentRecords] = useState<RecordData[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    setDataLoading(true);
    
    try {
      // 今月の統計データを取得
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      
      const { data: expenses, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id)
        .gte('expense_date', `${currentYear}-${currentMonth.toString().padStart(2, '0')}-01`)
        .order('expense_date', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('データの取得に失敗しました:', error);
        return;
      }

      // 統計データを計算
      const otokuTotal = expenses?.reduce((sum, expense) => sum + (expense.discount_amount || 0), 0) || 0;
      const gamanTotal = expenses?.reduce((sum, expense) => sum + (expense.passed_amount || 0), 0) || 0;

      setStatsData({
        otokuTotal,
        gamanTotal,
        otokuComparison: 0, // 先月比は後で実装
        gamanComparison: 0, // 先月比は後で実装
      });

      // 最新の記録を取得（最大3件）
      const records: RecordData[] = expenses?.slice(0, 3).map(expense => ({
        id: expense.id.toString(),
        type: expense.discount_amount > 0 ? 'otoku' : 'gaman',
        amount: expense.discount_amount > 0 ? expense.discount_amount : expense.passed_amount,
        date: new Date(expense.expense_date).toLocaleDateString('ja-JP'),
        productName: expense.description,
        created_at: expense.created_at,
      })) || [];

      setRecentRecords(records);

    } catch (error) {
      console.error('データの取得中にエラーが発生しました:', error);
    } finally {
      setDataLoading(false);
    }
  };

  const handleOtokuClick = () => {
    router.push('/record/otoku');
  };

  const handleGamanClick = () => {
    router.push('/record/gaman');
  };

  const handleViewAllClick = () => {
    router.push('/history');
  };

  const handleSettingsClick = () => {
    // 設定画面は後で実装
    console.log('設定画面（未実装）');
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
    <HomePage
      statsData={statsData}
      recentRecords={recentRecords}
      onOtokuClick={handleOtokuClick}
      onGamanClick={handleGamanClick}
      onViewAllClick={handleViewAllClick}
      onSettingsClick={handleSettingsClick}
    />
  );
}