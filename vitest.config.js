import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue2';
import commonjs from 'vite-plugin-commonjs';
import { fileURLToPath, URL } from 'node:url';
import { configDefaults } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    base: './',
    plugins: [
      vue(),
      commonjs(),
    ],
    resolve: {
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@shared': fileURLToPath(new URL('./eperusteet-frontend-utils/vue/src', import.meta.url)),
        '@assets': fileURLToPath(new URL('./eperusteet-frontend-utils/vue/public', import.meta.url)),
        '&': fileURLToPath(new URL('./tests', import.meta.url)),
        '~': fileURLToPath(new URL('./node_modules', import.meta.url)),
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      coverage: {
        reporter: ['text', 'json', 'html'],
      },
      exclude: [
        ...configDefaults.exclude,
        'eperusteet-frontend-utils/vue/**/*.spec.ts',
      ],
      alias: [{ find: /^vue$/, replacement: 'vue/dist/vue.runtime.common.js' }],
    },
  };
});
