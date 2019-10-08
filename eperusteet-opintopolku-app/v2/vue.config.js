const eperusteetServicePort = process.env.YLOPS_SERVICE_PORT || 8080;
const eperusteetYlopsServicePort = process.env.YLOPS_SERVICE_PORT || 8081;
const amosaaYlopsServicePort = process.env.YLOPS_SERVICE_PORT || 8082;
const webpack = require('webpack');
const path = require('path');

const palleroProxy = {
  '/eperusteet-service': {
    target: 'https://eperusteet.testiopintopolku.fi',
    secure: true,
  },
  '/eperusteet-ylops-service': {
    target: 'https://eperusteet.testiopintopolku.fi',
    secure: true,
  },
  '/eperusteet-amosaa-service': {
    target: 'https://eperusteet.testiopintopolku.fi',
    secure: true,
  },
};

module.exports = {
  lintOnSave: false,
  publicPath: process.env.NODE_ENV === 'production' ? '/eperusteet-opintopolku-app/v2/' : '/',
  configureWebpack: {
    resolve: {
      alias: {
        vue: path.resolve(__dirname, 'node_modules/vue'),
        '@shared': path.resolve(__dirname, 'node_modules/eperusteet-frontend-utils/vue/src'),
      },
    },
    plugins: [
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    ],
  },
  devServer: {
    overlay: {
      warnings: false,
      errors: true,
    },
    clientLogLevel: 'none',
    port: 9020,
    proxy: palleroProxy,
    // proxy: {
    //   '/eperusteet-service': {
    //     target: process.env.NODE_ENV === 'e2e' ? 'http://app:8080' : 'http://localhost:' + eperusteetServicePort,
    //     secure: false,
    //   },
    //   '/eperusteet-ylops-service': {
    //     target: process.env.NODE_ENV === 'e2e' ? 'http://app:8080' : 'http://localhost:' + eperusteetYlopsServicePort,
    //     secure: false,
    //   },
    //   '/eperusteet-amosaa-service': {
    //     target: process.env.NODE_ENV === 'e2e' ? 'http://app:8080' : 'http://localhost:' + amosaaYlopsServicePort,
    //     secure: false,
    //   },
    // },
  },
};
