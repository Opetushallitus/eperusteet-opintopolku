const eperusteetServicePort = process.env.YLOPS_SERVICE_PORT || 8080;
const eperusteetYlopsServicePort = process.env.YLOPS_SERVICE_PORT || 8081;
const amosaaYlopsServicePort = process.env.YLOPS_SERVICE_PORT || 8082;
const webpack = require('webpack');

module.exports = {
  lintOnSave: false,
  publicPath: process.env.NODE_ENV === 'production' ? '/eperusteet-opintopolku-app/v2/' : '/',
  configureWebpack: {
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
    proxy: {
      '/eperusteet-service': {
        target: process.env.NODE_ENV === 'e2e' ? 'http://app:8080' : 'http://localhost:' + eperusteetServicePort,
        secure: false,
      },
      '/eperusteet-ylops-service': {
        target: process.env.NODE_ENV === 'e2e' ? 'http://app:8080' : 'http://localhost:' + eperusteetYlopsServicePort,
        secure: false,
      },
      '/eperusteet-amosaa-service': {
        target: process.env.NODE_ENV === 'e2e' ? 'http://app:8080' : 'http://localhost:' + amosaaYlopsServicePort,
        secure: false,
      },
    },
  },
};
