const webpack = require('webpack');
const path = require('path');

const eperusteetService = process.env.EPERUSTEET_SERVICE || 'http://localhost:8080';
const eperusteetYlopsService = process.env.EPERUSTEET_YLOPS_SERVICE || 'http://localhost:8081';
const eperusteetAmosaaService = process.env.EPERUSTEET_AMOSAA_SERVICE || 'http://localhost:8082';

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
    target: eperusteetService,
    secure: !!eperusteetService,
    onProxyReq: function(proxyReq, req, res) {
      proxyReq.setHeader('Caller-Id', '1.2.246.562.10.00000000001.eperusteet');
    },
  },
  '/eperusteet-ylops-service': {
    target: eperusteetYlopsService,
    secure: !!eperusteetYlopsService,
    onProxyReq: function(proxyReq, req, res) {
      proxyReq.setHeader('Caller-Id', '1.2.246.562.10.00000000001.eperusteet-ylops');
    },
  },
  '/eperusteet-amosaa-service': {
    target: eperusteetAmosaaService,
    secure: !!eperusteetAmosaaService,
    onProxyReq: function(proxyReq, req, res) {
      proxyReq.setHeader('Caller-Id', '1.2.246.562.10.00000000001.eperusteet-amosaa');
    },
  },
};

module.exports = {
  lintOnSave: false,
  publicPath: '/',
  configureWebpack: {
    resolve: {
      alias: {
        'vue$': 'vue/dist/vue.esm.js',
        '@shared': path.resolve(__dirname, 'eperusteet-frontend-utils/vue/src'),
        '@assets': path.resolve(__dirname, 'eperusteet-frontend-utils/vue/public'),
      },
    },
    plugins: [
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    ],
  },
  chainWebpack: config => {
    // enabloidaan sourcemap ja nimetään "oikeat" vuen scirpti-tiedostot uudelleen, jotta löytyy selaimen devtoolsissa helpommin
    // esim. RouteRoot.vue?bf9d -> RouteRoot.vue?script
    if (process.env.USE_SOURCEMAP) {
      config.devtool('source-map');
      config.output.devtoolModuleFilenameTemplate(info => {
        if (info.resourcePath.endsWith('.vue')) {
          if (info.query.startsWith('?vue&type=script') && !info.allLoaders.includes('babel')) {
            return `src://${info.resourcePath}?script`;
          }
        }
      });
    }
    // config.optimization.minimizer([
    //   new TerserPlugin({
    //     terserOptions: {
    //       output: {
    //         comments: /^\**!|@preserve|@license|@cc_on/i
    //       },
    //       parallel: true,
    //       keep_classnames: true,
    //       compress: {
    //         arrows: false,
    //         booleans: true,
    //         collapse_vars: false,
    //         comparisons: false,
    //         computed_props: false,
    //         conditionals: true,
    //         dead_code: true,
    //         evaluate: true,
    //         hoist_funs: false,
    //         hoist_props: false,
    //         hoist_vars: false,
    //         if_return: true,
    //         inline: false,
    //         loops: false,
    //         negate_iife: false,
    //         properties: false,
    //         reduce_funcs: false,
    //         reduce_vars: false,
    //         sequences: true,
    //         switches: false,
    //         toplevel: false,
    //         typeofs: false,
    //         unused: true,
    //       },
    //       mangle: {
    //         safari10: true,
    //       },
    //     },
    //   }),
    // ]);
  },
  devServer: {
    overlay: {
      warnings: false,
      errors: true,
    },
    clientLogLevel: 'none',
    port: 9020,
    proxy,
  },
};
