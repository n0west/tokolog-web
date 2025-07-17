'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import RecordMethodPage from '@/components/pages/RecordMethodPage';

export default function GamanRecordPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push('/');
  };

  const handleCameraClick = () => {
    console.log('カメラ撮影が選択されました（ガマン）');
    // 将来的に実装予定
  };

  const handleGalleryClick = () => {
    console.log('カメラロールが選択されました（ガマン）');
    // 将来的に実装予定
  };

  const handleManualClick = () => {
    console.log('手動入力が選択されました（ガマン）');
    router.push('/record/gaman/manual');
  };

  return (
    <RecordMethodPage
      type="gaman"
      onBack={handleBack}
      onCameraClick={handleCameraClick}
      onGalleryClick={handleGalleryClick}
      onManualClick={handleManualClick}
    />
  );
}