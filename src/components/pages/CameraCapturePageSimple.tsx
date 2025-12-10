import React, { useRef, useEffect, useState } from 'react';
import ResponsiveContainer from '../layout/ResponsiveContainer';

interface CameraCapturePageProps {
  type: 'otoku' | 'gaman';
  onCapture: (imageData: string) => void;
  onCancel: () => void;
  className?: string;
}

const CameraCapturePageSimple: React.FC<CameraCapturePageProps> = ({
  type,
  onCapture,
  onCancel,
  className = ''
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  const instructionText = 'レシートを撮影してください';

  useEffect(() => {
    startCamera();
  }, []);

  const startCamera = async () => {
    try {
      console.log('Starting camera...');
      
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('カメラAPIがサポートされていません');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 }
        }
      });

      console.log('Stream obtained:', stream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          console.log('Video loaded');
          videoRef.current?.play();
        };
      }
    } catch (err) {
      console.error('Camera error:', err);
      setError('カメラにアクセスできません。権限を確認してください。');
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (!video || !canvas) {
      console.error('Video or canvas not found');
      return;
    }

    const context = canvas.getContext('2d');
    if (!context) {
      console.error('Canvas context not available');
      return;
    }

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    
    console.log('Photo captured, data length:', imageData.length);
    onCapture(imageData);
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    onCancel();
  };

  if (error) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <div className="text-white text-center p-8">
          <div className="text-lg mb-4">{error}</div>
          <button
            onClick={stopCamera}
            className="bg-white text-black px-6 py-3 rounded-lg font-medium"
          >
            戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 bg-black flex flex-col ${className}`}>
      {/* Header */}
      <div className="text-center py-3 flex-shrink-0">
        <h1 className="text-white text-lg font-medium">{instructionText}</h1>
      </div>

      {/* Video Area */}
      <div className="flex-1 relative overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
      </div>

      {/* Controls - Fixed bottom with safe area */}
      <div className="flex-shrink-0 pb-safe">
        <div className="flex justify-center items-center py-4 gap-6 bg-black bg-opacity-50">
          <button
            onClick={stopCamera}
            className="bg-gray-600 text-white px-6 py-3 rounded-full font-medium shadow-lg"
          >
            キャンセル
          </button>
          <button
            onClick={capturePhoto}
            className="bg-white text-black px-8 py-4 rounded-full font-medium text-lg shadow-lg"
          >
            撮影
          </button>
        </div>
      </div>

      {/* Hidden canvas for capture */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default CameraCapturePageSimple;