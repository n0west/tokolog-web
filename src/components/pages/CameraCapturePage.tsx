import React, { useRef, useEffect, useState } from 'react';
import ResponsiveContainer from '../layout/ResponsiveContainer';

interface CameraCapturePageProps {
  type: 'otoku' | 'gaman';
  onCapture: (imageData: string) => void;
  onCancel: () => void;
  className?: string;
}

const CameraCapturePage: React.FC<CameraCapturePageProps> = ({
  type,
  onCapture,
  onCancel,
  className = ''
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const instructionText = type === 'otoku' ? 'レシートを撮影してください' : 'レシートを撮影してください';

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', // 背面カメラを優先
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsLoading(false);
    } catch (err) {
      console.error('カメラの起動に失敗しました:', err);
      setError('カメラにアクセスできません。ブラウザの設定を確認してください。');
      setIsLoading(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (context) {
      // キャンバスのサイズをビデオに合わせる
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // ビデオフレームをキャンバスに描画
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // 画像データを取得（base64形式）
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      onCapture(imageData);
    }
  };

  const handleCancel = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    onCancel();
  };

  if (error) {
    return (
      <div className={`min-h-screen bg-black flex flex-col items-center justify-center ${className}`}>
        <div className="text-white text-center p-8">
          <div className="text-lg mb-4">{error}</div>
          <button
            onClick={handleCancel}
            className="bg-white text-black px-6 py-3 rounded-lg font-medium"
          >
            戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <ResponsiveContainer variant="page" className={className}>
      <div className="min-h-screen bg-black flex flex-col">
      {/* ステータスバー風のヘッダー */}
      <div className="flex justify-between items-center p-4 text-white text-sm">
        <span>16:20</span>
        <div className="flex items-center space-x-1">
          <div className="flex space-x-1">
            <div className="w-1 h-3 bg-white rounded-full"></div>
            <div className="w-1 h-3 bg-white rounded-full"></div>
            <div className="w-1 h-3 bg-white rounded-full"></div>
            <div className="w-1 h-3 bg-white rounded-full"></div>
          </div>
          <div className="w-6 h-3 border border-white rounded-sm">
            <div className="w-4 h-1 bg-white rounded-sm m-px"></div>
          </div>
        </div>
      </div>

      {/* 指示テキスト */}
      <div className="text-center py-4">
        <h1 className="text-white text-lg font-medium">{instructionText}</h1>
      </div>

      {/* カメラビューエリア */}
      <div className="flex-1 relative overflow-hidden">
        {isLoading ? (
          <div className="absolute inset-0 bg-gray-500 flex items-center justify-center">
            <div className="text-white">カメラを起動中...</div>
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        )}
        
        {/* カメラフレーム用のオーバーレイ */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-x-4 inset-y-8 border-2 border-white border-opacity-50 rounded-lg"></div>
        </div>
      </div>

      {/* コントロールエリア */}
      <div className="p-8 flex items-center justify-center">
        <div className="flex items-center justify-between w-full max-w-xs">
          {/* キャンセルボタン */}
          <button
            onClick={handleCancel}
            className="text-white text-lg font-medium"
          >
            キャンセル
          </button>

          {/* シャッターボタン */}
          <button
            onClick={capturePhoto}
            disabled={isLoading}
            className="w-20 h-20 bg-white rounded-full border-4 border-gray-300 flex items-center justify-center disabled:opacity-50"
          >
            <div className="w-16 h-16 bg-white rounded-full border-2 border-gray-400"></div>
          </button>

          {/* 空のスペース（レイアウト調整用） */}
          <div className="w-16"></div>
        </div>
      </div>

        {/* 隠しキャンバス（撮影用） */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    </ResponsiveContainer>
  );
};

export default CameraCapturePage;