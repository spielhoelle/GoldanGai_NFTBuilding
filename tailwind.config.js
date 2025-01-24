const flowbite = require('flowbite/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,js,svelte,ts}',
    './node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}',
  ],
  darkMode: 'selector',
  theme: {
    extend: {
      colors: {
        primary: {
          '50': '#f0fdfc',
          '100': '#ccfbf8',
          '200': '#99f6f0',
          '300': '#5eeae1',
          '400': '#2dd4c9',
          '500': '#14b8ad',
          '600': '#0d948b',
          '700': '#0f766f',
          '800': '#115e59',
          '900': '#134e4a',
          '950': '#042f2c',
        },
      },
      borderRadius: {
        '4xl': '2rem',
      }
    },
  },
  plugins: [flowbite, require('@tailwindcss/forms')],
};
