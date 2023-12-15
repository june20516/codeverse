const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
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

  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      },
      colors: {
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
