'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CameraCapturePageSimple from '@/components/pages/CameraCapturePageSimple';

export default function OtokuCameraPage() {
  const router = useRouter();

  const handleCapture = (imageData: string) => {
    // 画像データをセッションストレージに保存
    sessionStorage.setItem('cameraImage', imageData);
    
    // 結果画面に遷移
    router.push('/record/otoku/camera/result');
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <CameraCapturePageSimple
      type="otoku"
      onCapture={handleCapture}
      onCancel={handleCancel}
    />
  );
}