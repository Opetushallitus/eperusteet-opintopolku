const webpack = require('webpack');
const path = require('path');

const
  eperusteetService = process.env.EPERUSTEET_SERVICE,
  eperusteetServicePort = process.env.EPERUSTEET_SERVICE_PORT || 8080,
  eperusteetYlopsService = process.env.EPERUSTEET_YLOPS_SERVICE,
  eperusteetYlopsServicePort = process.env.EPERUSTEET_SERVICE_PORT || 8081,
  eperusteetAmosaaService = process.env.EPERUSTEET_AMOSAA_SERVICE,
  eperusteetAmosaaServicePort = process.env.EPERUSTEET_SERVICE_PORT || 8082;

const proxy = {
  '/eperusteet-service': {
    target: eperusteetService || 'http://localhost:' + eperusteetServicePort,
    secure: !!eperusteetService,
  },
  '/eperusteet-ylops-service': {
    target: eperusteetYlopsService || 'http://localhost:' + eperusteetYlopsServicePort,
    secure: !!eperusteetYlopsService,
  },
  '/eperusteet-amosaa-service': {
    target: eperusteetAmosaaService || 'http://localhost:' + eperusteetAmosaaServicePort,
    secure: !!eperusteetAmosaaService,
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
    proxy
  },
};
