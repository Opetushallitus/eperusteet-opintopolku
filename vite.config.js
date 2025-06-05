import { defineConfig, loadEnv } from 'vite';
import createVuePlugin  from '@vitejs/plugin-vue';
import commonjs from 'vite-plugin-commonjs';
import { fileURLToPath, URL } from 'node:url';
import { configDefaults } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {

  const env = loadEnv(mode, process.cwd(), '');
  const eperusteetService = env.EPERUSTEET_SERVICE || 'http://localhost:8080';
  const eperusteetYlopsService = env.EPERUSTEET_YLOPS_SERVICE || 'http://localhost:8081';
  const eperusteetAmosaaService = env.EPERUSTEET_AMOSAA_SERVICE || 'http://localhost:8082';

  return {
    base: './',
    plugins: [
      createVuePlugin({
        template: {
          compilerOptions: {
            compatConfig: {
              MODE: 2,
              COMPONENT_V_MODEL: false,
              COMPILER_V_BIND_OBJECT_ORDER: false,
            },
          },
        },
      }),
      commonjs(),
    ],
    css: {
      preprocessorOptions: {
        scss: {
          silenceDeprecations: ['mixed-decls', 'color-functions', 'global-builtin', 'import', 'abs-percent'],
        },
      },
    },
    define: {
      'process.env.BUILD': JSON.stringify(env.BUILD), // Define the BUILD environment variable
    },
    resolve: {
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@shared': fileURLToPath(new URL('./eperusteet-frontend-utils/vue/src', import.meta.url)),
        '@assets': fileURLToPath(new URL('./eperusteet-frontend-utils/vue/public', import.meta.url)),
        '&': fileURLToPath(new URL('./tests', import.meta.url)),
        '~': fileURLToPath(new URL('./node_modules', import.meta.url)),
        vue: '@vue/compat',
      },
    },
    server: {
      port: 9020,
      proxy: {
        '/eperusteet-service': {
          target: eperusteetService,
          secure: false,
          changeOrigin: true,
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.setHeader('Caller-Id', '1.2.246.562.10.00000000001.eperusteet');
            });
          },
        },
        '/eperusteet-ylops-service': {
          target: eperusteetYlopsService,
          secure: false,
          changeOrigin: true,
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.setHeader('Caller-Id', '1.2.246.562.10.00000000001.eperusteet-ylops');
            });
          },
        },
        '/eperusteet-amosaa-service': {
          target: eperusteetAmosaaService,
          secure: false,
          changeOrigin: true,
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.setHeader('Caller-Id', '1.2.246.562.10.00000000001.eperusteet-amosaa');
            });
          },
        },
      },
    },
    test: {
      globals: true, // Jest-like global functions (describe, it, expect)
      environment: 'jsdom', // Simulates browser environment
      exclude: [...configDefaults.exclude, 'e2e/*'],
      setupFiles: './test/setup.ts',
    },
  };
});
