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
    router.push('/record/otoku/gallery');
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