/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
      "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
      "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
      extend: {
        colors: {
          // テキストカラー
          'tx-default': '#1F2937',
          'tx-secondary': '#64748B',
          'tx-tertiary': '#94A3B8',
          'tx-inverse': '#F7F9FC',
          'tx-error': '#EF4444',
          
          // 背景カラー（メイン）
          'bg-card': '#FFFFFF',
          'bg-home': '#F8FAFC',
          'bg-otoku': '#4C95E4',
          'bg-otoku-sub': '#EFF6FF',
          'bg-gaman': '#F08372',
          'bg-gaman-sub': '#FFF1F0',
          
          // 背景カラー（サブ）
          'bg-success': '#22C55E',
          
          // ボーダーカラー
          'bdr-main': '#DFDFDF',
          'bdr-otoku': '#7FB1EC',
          'bdr-gaman': '#F5A698',
          'bdr-sub': '#E4E4E4',
          
          // ボタンカラー
          'btn-main': '#3B82F6',
          'btn-sub': '#94A3B8',
          
          // トクログ専用カラー（使いやすい名前）
          'tokolog': {
            'otoku': '#4C95E4',
            'gaman': '#F08372',
            'success': '#22C55E',
            'card': '#FFFFFF',
            'background': '#F8FAFC',
          }
        },
      },
    },
    plugins: [],
  }