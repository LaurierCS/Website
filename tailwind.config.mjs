/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'lcs-dark': 'rgb(14 38 61)',
        'lcs-darker': 'rgb(12 34 56)',
        'lcs-pink': 'rgb(255 159 196)',
        'lcs-orange': 'rgb(255 151 112)',
        'lcs-yellow': 'rgb(255 214 112)',
        'lcs-blue': 'rgb(38 138 249)',
        'lcs-light-blue': 'rgb(177 224 255)',
        'lcs-light-section': 'rgb(243 247 252)',
      },
      fontFamily: {
        'dosis': ['Dosis', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
