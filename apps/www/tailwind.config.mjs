import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const fpPreset = require('@fp/config/tailwind-preset');

/** @type {import('tailwindcss').Config} */
export default {
  presets: [fpPreset],
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    '../../packages/ui/src/**/*.{astro,ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
