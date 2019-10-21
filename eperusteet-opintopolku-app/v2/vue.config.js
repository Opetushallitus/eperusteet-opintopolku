const webpack = require('webpack');
const path = require('path');

const
  eperusteetService = process.env.EPERUSTEET_SERVICE,
  eperusteetServicePort = process.env.EPERUSTEET_SERVICE_PORT || 8080,
  eperusteetYlopsService = process.env.EPERUSTEET_YLOPS_SERVICE,
  eperusteetYlopsServicePort = process.env.EPERUSTEET_SERVICE_PORT || 8081,
  eperusteetAmosaaService = process.env.EPERUSTEET_AMOSAA_SERVICE,
  eperusteetAmosaaServicePort = process.env.EPERUSTEET_SERVICE_PORT || 8082;

if (process.env.EPERUSTEET_SERVICE) {
  console.log('Using eperusteet-service proxy:', process.env.EPERUSTEET_SERVICE);
}
else {
  console.log('EPERUSTEET_SERVICE not defined. Using local eperusteet-service.');
}

if (process.env.EPERUSTEET_YLOPS_SERVICE) {
  console.log('Using eperusteet-ylops-service proxy:', process.env.EPERUSTEET_YLOPS_SERVICE);
}
else {
  console.log('EPERUSTEET_YLOPS_SERVICE not defined. Using local eperusteet-ylops-service.');
}

if (process.env.EPERUSTEET_AMOSAA_SERVICE) {
  console.log('Using eperusteet-amosaa-service proxy:', process.env.EPERUSTEET_AMOSAA_SERVICE);
}
else {
  console.log('EPERUSTEET_AMOSAA_SERVICE not defined. Using local eperusteet-amosaa-service.');
}

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
  publicPath: process.env.NODE_ENV === 'production' ? '/v2/' : '/',
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
