'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import ManualInputPage from '@/components/pages/ManualInputPage';
import ModalSection from '@/components/sections/ModalSection';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

export default function GamanManualPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submittedData, setSubmittedData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleSubmit = async (data: any) => {
    if (!user) {
      router.push('/login');
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log('保存データ:', data);
      console.log('ユーザー情報:', user);
      
      // データ検証
      if (!data.productName || !data.amount) {
        throw new Error('必須項目が入力されていません');
      }
      
      if (!user.id) {
        throw new Error('ユーザーIDが取得できません');
      }
      
      // データを準備
      const insertData = {
        user_id: user.id,
        description: data.productName,
        amount: Number(data.amount),
        discount_amount: 0, // ガマンの場合は0
        passed_amount: Number(data.amount),
        category_id: 1, // デフォルトカテゴリ
        expense_date: new Date().toISOString().split('T')[0], // YYYY-MM-DD形式
      };
      
      console.log('挿入データ:', insertData);
      
      // Supabase接続テスト
      const { data: testConnection } = await supabase.from('expenses').select('count').limit(1);
      console.log('接続テスト結果:', testConnection);
      
      // Supabaseにデータを保存
      const { data: result, error } = await supabase
        .from('expenses')
        .insert([insertData])
        .select();

      if (error) {
        console.error('Supabaseエラー詳細:', error);
        throw new Error(`データベースエラー: ${error.message}`);
      }

      console.log('保存成功:', result);

      // モーダル表示用のデータを準備
      setSubmittedData({
        type: 'gaman',
        amount: data.amount,
        date: new Date().toLocaleDateString('ja-JP', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        productName: data.productName,
      });
      
      setIsModalOpen(true);
    } catch (error) {
      console.error('データの保存に失敗しました:', error);
      console.error('エラー詳細:', JSON.stringify(error, null, 2));
      alert(`データの保存に失敗しました。\n\nエラー詳細: ${error instanceof Error ? error.message : JSON.stringify(error)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    router.push('/');
  };

  return (
    <>
      <ManualInputPage
        type="gaman"
        onBack={handleBack}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
      
      {submittedData && (
        <ModalSection
          isOpen={isModalOpen}
          onClose={handleModalClose}
          type={submittedData.type}
          amount={submittedData.amount}
          date={submittedData.date}
          productName={submittedData.productName}
        />
      )}
    </>
  );
}