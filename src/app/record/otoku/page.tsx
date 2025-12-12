'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import RecordMethodPage from '@/components/pages/RecordMethodPage';

export default function OtokuRecordPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push('/');
  };

  const handleCameraClick = () => {
    router.push('/record/otoku/camera');
  };

  const handleGalleryClick = () => {
    // カメラロールから画像を選択
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // 画像ファイルを処理してOCR結果ページに遷移
        const formData = new FormData();
        formData.append('image', file);
        
        // 一時的にローカルストレージに保存して結果ページに渡す
        const reader = new FileReader();
        reader.onload = () => {
          sessionStorage.setItem('selectedImage', reader.result as string);
          router.push('/record/otoku/camera/result');
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleManualClick = () => {
    // 手動入力の処理
    console.log('手動入力が選択されました');
    router.push('/record/otoku/manual');
  };

  return (
    <RecordMethodPage
      type="otoku"
      onBack={handleBack}
      onCameraClick={handleCameraClick}
      onGalleryClick={handleGalleryClick}
      onManualClick={handleManualClick}
    />
  );
}