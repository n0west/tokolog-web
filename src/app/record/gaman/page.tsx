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
    router.push('/record/gaman/camera');
  };

  const handleGalleryClick = () => {
    router.push('/record/gaman/gallery');
  };

  const handleManualClick = () => {
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