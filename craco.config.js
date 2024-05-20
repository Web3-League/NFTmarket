const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        assert: require.resolve('assert'),
        fs: false,  // fs ne peut pas être polyfillé dans le navigateur
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        os: require.resolve('os-browserify/browser'),
        stream: require.resolve('stream-browserify'),
        tty: require.resolve('tty-browserify'),
        url: require.resolve('url'),
        zlib: require.resolve('browserify-zlib'),
      };
      webpackConfig.resolve.extensions.push('.ts', '.tsx');
      webpackConfig.plugins = [
        ...webpackConfig.plugins,
        new webpack.ProvidePlugin({
          process: 'process/browser',
          Buffer: ['buffer', 'Buffer'],
        }),
      ];
      webpackConfig.module.rules.push({
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
        exclude: [
          /node_modules\/@chainsafe\/is-ip/,
          /node_modules\/dag-jose/,
        ],
      });
      return webpackConfig;
    },
  },
};




