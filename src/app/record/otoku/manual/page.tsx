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
      console.log('ユーザー情報:', user);
      
      // 現在のセッション状態を確認
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      console.log('現在のセッション:', sessionData);
      console.log('セッションエラー:', sessionError);
      
      // セッションとユーザー情報をダブルチェック
      const { data: userData, error: userError } = await supabase.auth.getUser();
      console.log('現在のユーザー:', userData);
      console.log('ユーザーエラー:', userError);
      
      if (!sessionData.session && !userData.user) {
        throw new Error('認証が必要です。再ログインしてください。');
      }
      
      // 有効な認証情報を使用
      const authenticatedUserId = sessionData.session?.user?.id || userData.user?.id || user.id;
      
      if (!authenticatedUserId) {
        throw new Error('ユーザーIDが取得できません');
      }
      
      // データ検証
      if (!data.productName || !data.amount) {
        throw new Error('必須項目が入力されていません');
      }
      
      
      // データを準備
      const insertData = {
        user_id: authenticatedUserId,
        description: data.productName,
        amount: Number(data.originalAmount || data.amount),
        discount_amount: Number(data.discountAmount || data.amount),
        passed_amount: 0, // おトクの場合は0
        category_id: 1, // デフォルトカテゴリ
        expense_date: new Date().toISOString().split('T')[0], // YYYY-MM-DD形式
      };
      
      console.log('挿入データ:', insertData);
      
      // 認証されたクライアントでデータを保存
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