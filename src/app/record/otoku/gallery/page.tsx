'use client';

import { useRouter } from 'next/navigation';
import GallerySelectPage from '@/components/pages/GallerySelectPage';

export default function OtokuGalleryPage() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleImageSelect = (imageData: string) => {
    // 画像データをセッションストレージに保存
    sessionStorage.setItem('galleryImage', imageData);
    
    // 結果画面に遷移
    router.push('/record/otoku/gallery/result');
  };

  return (
    <GallerySelectPage
      type="otoku"
      onBack={handleBack}
      onImageSelect={handleImageSelect}
    />
  );
}