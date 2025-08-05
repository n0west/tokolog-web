import React from 'react';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'page' | 'section' | 'content';
}

const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  className = '',
  variant = 'page'
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'page':
        // ページ全体のレイアウト - フル高さ
        return 'min-h-screen mx-auto max-w-md w-full';
      case 'section':
        // セクション用 - 上下の余白は各セクションで管理
        return 'mx-auto max-w-md w-full';
      case 'content':
        // コンテンツ用 - パディング含む
        return 'mx-auto max-w-md w-full px-4';
      default:
        return 'mx-auto max-w-md w-full';
    }
  };

  return (
    <div className={`${getVariantClasses()} ${className}`}>
      {children}
    </div>
  );
};

export default ResponsiveContainer;