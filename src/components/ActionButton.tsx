import React from 'react';
import OtokuIcon from './OtokuIcon';
import GamanIcon from './GamanIcon';
import CameraIcon from './CameraIcon';
import SettingsIcon from './SettingsIcon';

interface ActionButtonProps {
  type: 'otoku' | 'gaman' | 'neutral';
  variant?: 'record' | 'camera' | 'manual' | 'gallery' | 'settings' | 'default';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  subtitle?: string; // デフォルトボタン用にサブタイトルを任意に
}

const ActionButton: React.FC<ActionButtonProps> = ({ 
  type, 
  variant = 'record',
  onClick, 
  disabled = false,
  className = "",
  subtitle
}) => {
  // バリアント別の基本クラス
  const getBaseClasses = () => {
    const common = "transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
    
    switch (variant) {
      case 'camera':
      case 'manual':
      case 'gallery':
        return `${common} w-full py-4 px-6 rounded-2xl shadow-sm hover:shadow-md flex items-center space-x-4`;
      case 'default':
        return `${common} w-full py-4 px-6 rounded-2xl shadow-md hover:shadow-lg`;
      case 'record':
      case 'settings':
      default:
        return `${common} w-full py-5 px-6 rounded-3xl shadow-md hover:shadow-lg`;
    }
  };
  
  // タイプ別のスタイリング
  const getTypeClasses = () => {
    switch (variant) {
      case 'camera':
      case 'manual':
      case 'gallery':
        switch (type) {
          case 'otoku':
            return "bg-otoku-light border-2 border-otoku hover:bg-blue-50 text-otoku";
          case 'gaman':
            return "bg-gaman-light border-2 border-gaman hover:bg-red-50 text-gaman";
          case 'neutral':
            return "bg-gray-50 border-2 border-gray-300 hover:bg-gray-100 text-gray-700";
          default:
            return "bg-gray-50 border-2 border-gray-300 hover:bg-gray-100 text-gray-700";
        }
      
      case 'default':
        switch (type) {
          case 'otoku':
            return "bg-otoku border-2 border-otoku-border hover:opacity-90 text-white";
          case 'gaman':
            return "bg-gaman border-2 border-gaman-border hover:opacity-90 text-white";
          case 'neutral':
            return "bg-gray-600 border-2 border-gray-500 hover:bg-gray-700 text-white";
          default:
            return "bg-gray-600 border-2 border-gray-500 hover:bg-gray-700 text-white";
        }
      
      case 'record':
      default:
        switch (type) {
          case 'otoku':
            return "bg-otoku border-2 border-otoku-border hover:opacity-90 text-white";
          case 'gaman':
            return "bg-gaman border-2 border-gaman-border hover:opacity-90 text-white";
          case 'neutral':
            return "bg-gray-600 border-2 border-gray-500 hover:bg-gray-700 text-white";
          default:
            return "bg-gray-600 border-2 border-gray-500 hover:bg-gray-700 text-white";
        }
    }
  };

  // アイコンのサイズをバリアント別に調整
  const getIconSize = () => {
    switch (variant) {
      case 'camera':
      case 'manual':
      case 'gallery':
        return 24;
      case 'settings':
        return 24;
      case 'default':
      case 'record':
      default:
        return 32;
    }
  };

  // アイコンの色をtype + variantで決定
  const getIconColor = () => {
    switch (variant) {
      case 'camera':
      case 'manual':
      case 'gallery':
        switch (type) {
          case 'otoku':
            return '#4C95E4';
          case 'gaman':
            return '#F08372';
          case 'neutral':
            return '#6B7280';
          default:
            return '#6B7280';
        }
      case 'default':
      case 'record':
      default:
        switch (type) {
          case 'otoku':
            return '#4C95E4';
          case 'gaman':
            return '#F08372';
          case 'neutral':
            return '#6B7280';
          default:
            return '#6B7280';
        }
    }
  };

  // アイコンの選択
  const getIcon = () => {
    const iconSize = getIconSize();
    const iconColor = getIconColor();
    
    switch (variant) {
      case 'camera':
        return <CameraIcon width={iconSize} height={iconSize} color={iconColor} />;
      case 'manual':
        // 手入力アイコン（指のアイコンなど）- 現在はCameraIconで代用
        return <CameraIcon width={iconSize} height={iconSize} color={iconColor} />;
      case 'gallery':
        // ギャラリーアイコン（画像アイコンなど）- 現在はCameraIconで代用
        return <CameraIcon width={iconSize} height={iconSize} color={iconColor} />;
      case 'settings':
        return <SettingsIcon width={iconSize} height={iconSize} color={iconColor} />;
      case 'default':
      case 'record':
      default:
        switch (type) {
          case 'otoku':
            return <OtokuIcon width={iconSize} height={iconSize} color={iconColor} />;
          case 'gaman':
            return <GamanIcon width={iconSize} height={iconSize} color={iconColor} />;
          case 'neutral':
            return <CameraIcon width={iconSize} height={iconSize} color={iconColor} />;
          default:
            return <CameraIcon width={iconSize} height={iconSize} color={iconColor} />;
        }
    }
  };

  // タイトルテキスト
  const getTitle = () => {
    switch (variant) {
      case 'camera':
        return '撮影';
      case 'manual':
        return '手入力';
      case 'gallery':
        return 'カメラロール';
      case 'settings':
        return '設定';
      case 'default':
        return '次に進む';
      case 'record':
      default:
        switch (type) {
          case 'otoku':
            return 'おトク';
          case 'gaman':
            return 'ガマン';
          case 'neutral':
            return '選択';
          default:
            return '選択';
        }
    }
  };

  // サブタイトルテキスト
  const getSubtitle = () => {
    // subtitleプロパティが指定されている場合はそれを優先
    if (subtitle !== undefined) {
      return subtitle;
    }
    
    switch (variant) {
      case 'camera':
        return 'レシートをカメラで撮影';
      case 'manual':
        return '商品名や値段を自分で入力';
      case 'gallery':
        return '写真の一覧から選択';
      case 'default':
        return 'レシートをカメラで撮影';
      case 'record':
      default:
        switch (type) {
          case 'otoku':
            return '値引き額の記録';
          case 'gaman':
            return '見送り額の記録';
          case 'neutral':
            return '項目を選択してください';
          default:
            return '項目を選択してください';
        }
    }
  };

  // バリアント別のレイアウト
  const renderContent = () => {
    switch (variant) {
      case 'camera':
      case 'manual':
      case 'gallery':
        return (
          <>
            {/* アイコン部分 */}
            <div className="bg-white rounded-full p-2 shadow-sm border border-gray-200 flex-shrink-0">
              {getIcon()}
            </div>
            
            {/* テキスト部分 */}
            <div className="flex flex-col text-left">
              <span className="text-lg font-bold">
                {getTitle()}
              </span>
              <span className="text-sm opacity-75">
                {getSubtitle()}
              </span>
            </div>
          </>
        );
      
      case 'default':
        return (
          <div className="flex flex-col items-center space-y-2">
            {/* メインタイトル */}
            <span className="text-lg font-bold">
              {getTitle()}
            </span>
            
            {/* サブタイトル（条件付き表示） */}
            {getSubtitle() && (
              <span className="text-sm opacity-90">
                {getSubtitle()}
              </span>
            )}
          </div>
        );
      
      case 'record':
      default:
        return (
          <div className="flex flex-col items-center space-y-2">
            {/* アイコン */}
            <div className="bg-white rounded-full p-3 shadow-sm border border-gray-200">
              {getIcon()}
            </div>
            
            {/* メインタイトル */}
            <span className="text-xl font-bold">
              {getTitle()}
            </span>
            
            {/* サブタイトル */}
            <span className="text-sm opacity-90">
              {getSubtitle()}
            </span>
          </div>
        );
    }
  };

  return (
    <button
      className={`${getBaseClasses()} ${getTypeClasses()} ${className}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={`${getTitle()}ボタン${getSubtitle() ? ` - ${getSubtitle()}` : ''}`}
    >
      {renderContent()}
    </button>
  );
};

export default ActionButton;