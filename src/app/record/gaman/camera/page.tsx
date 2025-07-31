'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CameraCapturePage from '@/components/pages/CameraCapturePage';

export default function GamanCameraPage() {
  const router = useRouter();

  const handleCapture = (imageData: string) => {
    // 画像データをセッションストレージに保存
    sessionStorage.setItem('cameraImage', imageData);
    
    // 結果画面に遷移
    router.push('/record/gaman/camera/result');
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <CameraCapturePage
      type="gaman"
      onCapture={handleCapture}
      onCancel={handleCancel}
    />
  );
}