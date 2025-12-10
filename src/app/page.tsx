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
      const otokuTotal = expenses?.reduce((sum, expense) => {
        const expenseData = expense as any;
        return sum + Number(expenseData.discount_amount || 0);
      }, 0) || 0;
      const gamanTotal = expenses?.reduce((sum, expense) => {
        const expenseData = expense as any;
        return sum + Number(expenseData.passed_amount || 0);
      }, 0) || 0;

      // 先月比の計算
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth();
      
      // 前月の範囲
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      const lastMonthStart = new Date(lastMonthYear, lastMonth, 1);
      const lastMonthEnd = new Date(currentYear, currentMonth, 0);
      
      // 今月の開始日
      const thisMonthStart = new Date(currentYear, currentMonth, 1);
      
      // 前月のデータを抽出
      const lastMonthData = expenses?.filter(expense => {
        const expenseData = expense as any;
        const expenseDate = new Date(expenseData.expense_date || '');
        return expenseDate >= lastMonthStart && expenseDate <= lastMonthEnd;
      }) || [];
      
      // 今月のデータを抽出  
      const thisMonthData = expenses?.filter(expense => {
        const expenseData = expense as any;
        const expenseDate = new Date(expenseData.expense_date || '');
        return expenseDate >= thisMonthStart;
      }) || [];
      
      // 前月の合計
      const lastMonthOtoku = lastMonthData.reduce((sum, expense) => {
        const expenseData = expense as any;
        return sum + Number(expenseData.discount_amount || 0);
      }, 0);
      
      const lastMonthGaman = lastMonthData.reduce((sum, expense) => {
        const expenseData = expense as any;
        return sum + Number(expenseData.passed_amount || 0);
      }, 0);
      
      // 今月の合計
      const thisMonthOtoku = thisMonthData.reduce((sum, expense) => {
        const expenseData = expense as any;
        return sum + Number(expenseData.discount_amount || 0);
      }, 0);
      
      const thisMonthGaman = thisMonthData.reduce((sum, expense) => {
        const expenseData = expense as any;
        return sum + Number(expenseData.passed_amount || 0);
      }, 0);

      setStatsData({
        otokuTotal,
        gamanTotal,
        otokuComparison: thisMonthOtoku - lastMonthOtoku,
        gamanComparison: thisMonthGaman - lastMonthGaman,
      });

      // 最新の記録を取得（最大3件）
      const records: RecordData[] = expenses?.slice(0, 3).map(expense => {
        const expenseData = expense as any;
        return {
          id: String(expenseData.id || ''),
          type: (expenseData.discount_amount || 0) > 0 ? 'otoku' : 'gaman',
          amount: (expenseData.discount_amount || 0) > 0 ? Number(expenseData.discount_amount || 0) : Number(expenseData.passed_amount || 0),
          date: new Date(expenseData.expense_date || '').toLocaleDateString('ja-JP'),
          productName: expenseData.description || '',
          created_at: expenseData.created_at || '',
        };
      }) || [];

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