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
        // === トクログ専用カラー（メイン） ===
        'otoku': '#4C95E4',           // bg-otoku, text-otoku, border-otoku
        'gaman': '#F08372',           // bg-gaman, text-gaman, border-gaman
        'success': '#22C55E',         // bg-success, text-success
        
        // === トクログ専用カラー（サブ） ===
        'otoku-light': '#EFF6FF',     // bg-otoku-light
        'gaman-light': '#FFF1F0',     // bg-gaman-light
        'otoku-border': '#7FB1EC',    // border-otoku-border
        'gaman-border': '#F5A698',    // border-gaman-border
        
        // === レイアウト用カラー ===
        'card': '#FFFFFF',            // bg-card
        'home': '#F8FAFC',            // bg-home
        'main-border': '#DFDFDF',     // border-main-border
        'sub-border': '#E4E4E4',      // border-sub-border
        
        // === テキスト用カラー ===
        'primary': '#1F2937',       // text-primary
        'secondary': '#64748B',     // text-secondary
        'tertiary': '#94A3B8',      // text-tertiary
        'inverse': '#F7F9FC',       // text-inverse
        'error': '#EF4444',         // text-error
        
      },
    },
  },
  plugins: [],
}