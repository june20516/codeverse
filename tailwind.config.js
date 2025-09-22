const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // MUI와의 충돌 방지를 위한 important 설정
  important: '#__next',
  safelist: [
    { pattern: /ease-(linear|in|out|in-out)/ },
    'translate-y-[1px]',
    'translate-y-[2px]',
    'translate-y-[3px]',
    'translate-y-[4px]',
    'translate-y-[5px]',
    '-translate-y-[1px]',
    '-translate-y-[2px]',
    '-translate-y-[3px]',
    '-translate-y-[4px]',
    '-translate-y-[5px]',
    'translate-x-[1px]',
    'translate-x-[2px]',
    'translate-x-[3px]',
    'translate-x-[4px]',
    'translate-x-[5px]',
    '-translate-x-[1px]',
    '-translate-x-[2px]',
    '-translate-x-[3px]',
    '-translate-x-[4px]',
    '-translate-x-[5px]',
    ...[...Array(10).keys()].flatMap(i =>
      ['tr', 'tl', 'br', 'bl'].flatMap(d => `rounded-${d}-[${i * 10}%]`),
    ),
  ],
  plugins: [],
  // MUI 컴포넌트와 충돌하지 않도록 prefix 설정 (선택사항)
  // prefix: 'tw-',
  
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      },
      colors: {
        // MUI 테마 색상과 매핑
        'mui-primary': '#B782F4',
        'mui-secondary': '#EF89E1',
        'mui-action': '#F4A261',
        'mui-info': '#5158d9',
        'mui-error': '#EA3786',
        'mui-background': '#080046',
        'mui-text-primary': '#B782F4',
        'mui-text-secondary': '#EF89E1',
        'mui-divider': '#5158d9',
        
        // 기존 색상 유지
        primary: colors.indigo,
        secondary: colors.purple,
        warning: colors.yellow,
        error: colors.orange,
        neutral: colors.teal,
        background: {
          primary: colors.neutral,
          secondary: colors.stone,
        },
      },
    },
  },
};
