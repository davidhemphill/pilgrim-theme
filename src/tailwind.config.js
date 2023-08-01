const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['../**/*.{html,js,vue,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: { gray: colors.slate, blue: colors.sky, primary: colors.sky },
      fontFamily: {
        sans: ['Figtree', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  safelist: ['table-of-contents'],
  plugins: [require('@tailwindcss/typography')],
}
