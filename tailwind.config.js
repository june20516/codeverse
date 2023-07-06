const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  plugins: [],

  theme: {
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
};
