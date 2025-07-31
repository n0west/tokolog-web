'use client';

import { useRouter } from 'next/navigation';
import GallerySelectPage from '@/components/pages/GallerySelectPage';

export default function GamanGalleryPage() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleImageSelect = (imageData: string) => {
    // 画像データをセッションストレージに保存
    sessionStorage.setItem('galleryImage', imageData);
    
    // 結果画面に遷移
    router.push('/record/gaman/gallery/result');
  };

  return (
    <GallerySelectPage
      type="gaman"
      onBack={handleBack}
      onImageSelect={handleImageSelect}
    />
  );
}