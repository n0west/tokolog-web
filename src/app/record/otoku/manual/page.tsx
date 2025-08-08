'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import ManualInputPage from '@/components/pages/ManualInputPage';
import ModalSection from '@/components/sections/ModalSection';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

export default function OtokuManualPage() {
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
      console.log('ユーザーID:', user.id);
      
      // データを準備
      const insertData = {
        user_id: user.id,
        description: data.productName,
        amount: data.originalAmount || data.amount,
        discount_amount: data.discountAmount || data.amount,
        passed_amount: 0, // おトクの場合は0
        category_id: 1, // デフォルトカテゴリ
        expense_date: new Date().toISOString().split('T')[0], // YYYY-MM-DD形式
      };
      
      console.log('挿入データ:', insertData);
      
      // Supabaseにデータを保存
      const { data: result, error } = await supabase
        .from('expenses')
        .insert([insertData]);

      if (error) {
        console.error('Supabaseエラー詳細:', error);
        throw error;
      }

      console.log('保存成功:', result);

      // モーダル表示用のデータを準備
      setSubmittedData({
        type: 'otoku',
        amount: data.discountAmount || data.amount,
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
        type="otoku"
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