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
  const [isVideoReady, setIsVideoReady] = useState(false);

  const instructionText = type === 'otoku' ? 'レシートを撮影してください' : 'レシートを撮影してください';

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // ストリーム取得後の追加処理
  useEffect(() => {
    if (stream && videoRef.current) {
      console.log('Stream tracks:', stream.getTracks().length);
      
      // ストリームの状態をログ
      stream.getTracks().forEach((track, index) => {
        console.log(`Track ${index}:`, {
          kind: track.kind,
          enabled: track.enabled,
          readyState: track.readyState,
          settings: track.getSettings()
        });
      });
    }
  }, [stream]);

  const startCamera = async () => {
    try {
      // カメラへのアクセス権限をチェック
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('カメラAPIがサポートされていません');
      }

      let mediaStream;
      
      // まず理想的な設定で試行
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        });
        console.log('High quality stream obtained');
      } catch (err) {
        console.warn('High quality failed, trying basic settings:', err);
        
        // フォールバック: 基本設定
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true
        });
        console.log('Basic stream obtained');
      }
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        
        // タイムアウト設定（5秒後にフォールバック）
        const timeoutId = setTimeout(() => {
          console.warn('Video loading timeout, forcing load completion');
          setIsLoading(false);
        }, 5000);
        
        // ビデオが再生可能になったらロード完了
        videoRef.current.onloadedmetadata = () => {
          console.log('Video metadata loaded');
          clearTimeout(timeoutId);
          setIsLoading(false);
        };
        
        videoRef.current.oncanplay = () => {
          console.log('Video can start playing');
          setIsVideoReady(true);
        };
        
        videoRef.current.onplaying = () => {
          console.log('Video is now playing');
          setIsVideoReady(true);
        };
        
        videoRef.current.onerror = (e) => {
          console.error('Video error:', e);
          clearTimeout(timeoutId);
          setError('ビデオの表示に問題が発生しました');
        };
        
        // 手動でplay()を実行
        videoRef.current.play().catch(err => {
          console.log('Autoplay prevented, but that\'s OK:', err);
        });
      }
    } catch (err) {
      console.error('カメラの起動に失敗しました:', err);
      
      let errorMessage = 'カメラにアクセスできません。';
      if (err instanceof DOMException) {
        switch (err.name) {
          case 'NotAllowedError':
            errorMessage = 'カメラの使用が許可されていません。ブラウザ設定からカメラアクセスを有効にしてください。';
            break;
          case 'NotFoundError':
            errorMessage = 'カメラが見つかりません。デバイスにカメラが接続されているか確認してください。';
            break;
          case 'NotSupportedError':
            errorMessage = 'HTTPSまたはlocalhost環境でのみカメラアクセスが可能です。';
            break;
          default:
            errorMessage = `カメラアクセスエラー: ${err.message}`;
        }
      }
      
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) {
      console.error('Video or canvas ref is null');
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) {
      console.error('Canvas context is null');
      return;
    }

    // ビデオの準備状況をチェック
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      console.error('Video dimensions are 0', { 
        videoWidth: video.videoWidth, 
        videoHeight: video.videoHeight,
        readyState: video.readyState
      });
      alert('カメラの映像が準備できていません。しばらくお待ちください。');
      return;
    }

    console.log('Capturing photo', {
      videoWidth: video.videoWidth,
      videoHeight: video.videoHeight,
      readyState: video.readyState
    });

    // キャンバスのサイズをビデオに合わせる
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // ビデオフレームをキャンバスに描画
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // 画像データを取得（base64形式）
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    console.log('Image data length:', imageData.length);
    onCapture(imageData);
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
      <div className="h-screen bg-black flex flex-col overflow-hidden">
        {/* 指示テキスト */}
        <div className="text-center py-6">
          <h1 className="text-white text-lg font-medium">{instructionText}</h1>
        </div>

      {/* カメラビューエリア */}
      <div className="flex-1 relative overflow-hidden">
        {isLoading ? (
          <div className="absolute inset-0 bg-gray-500 flex items-center justify-center">
            <div className="text-white">カメラを起動中...</div>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              style={{
                transform: 'scale(1)',
                background: 'black'
              }}
            />
            {/* デバッグ情報 */}
            {!isVideoReady && (
              <div className="absolute top-4 left-4 text-white text-sm bg-black bg-opacity-50 p-2 rounded">
                ビデオ準備中...
              </div>
            )}
          </>
        )}
        
        {/* カメラフレーム用のオーバーレイ */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-x-4 inset-y-8 border-2 border-white border-opacity-50 rounded-lg"></div>
        </div>
      </div>

      {/* コントロールエリア */}
      <div className="p-6 flex items-center justify-center">
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