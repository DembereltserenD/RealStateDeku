const webpack = require('@nativescript/webpack');
const webpackCore = require('webpack');
const path = require('path');

class UtilInheritsPlugin {
  apply(compiler) {
    compiler.hooks.normalModuleFactory.tap('UtilInheritsPlugin', factory => {
      factory.hooks.parser.for('javascript/auto').tap('UtilInheritsPlugin', parser => {
        parser.hooks.call.for('util.inherits').tap('UtilInheritsPlugin', expression => {
          parser.state.current.addDependency({
            module: require.resolve('inherits'),
            expression,
            range: expression.range,
            loc: expression.loc
          });
          return true;
        });
      });
    });
  }
}

module.exports = (env) => {
  webpack.init(env);

  webpack.chainWebpack((config) => {
    // Add process and Buffer polyfills first
    config.plugin('provide')
      .use(webpackCore.ProvidePlugin, [{
        process: [require.resolve('process/browser')],
        Buffer: [require.resolve('buffer/'), 'Buffer'],
        util: [require.resolve('util/')],
        inherits: [require.resolve('inherits')]
      }]);

    // Add custom util.inherits plugin
    config.plugin('util-inherits')
      .use(UtilInheritsPlugin);

    // Define process.env
    config.plugin('define')
      .use(webpackCore.DefinePlugin, [{
        'process.env': JSON.stringify(process.env),
        'process.browser': true,
        'process.version': JSON.stringify(process.version),
        'util.inherits': [require.resolve('inherits')]
      }]);

    // Initialize resolve configuration
    config.resolve
      .merge({
        fallback: {
          "assert": require.resolve("assert/"),
          "buffer": require.resolve("buffer/"),
          "console": false,
          "constants": false,
          "crypto": require.resolve("crypto-browserify"),
          "domain": false,
          "events": require.resolve("events/"),
          "http": require.resolve("stream-http"),
          "https": require.resolve("https-browserify"),
          "os": require.resolve("os-browserify"),
          "path": require.resolve("path-browserify"),
          "punycode": false,
          "process": require.resolve("process/browser"),
          "querystring": false,
          "stream": require.resolve("stream-browserify"),
          "string_decoder": require.resolve("string_decoder/"),
          "sys": false,
          "timers": require.resolve("timers-browserify"),
          "tty": false,
          "url": require.resolve("url/"),
          "util": require.resolve("util/"),
          "vm": false,
          "zlib": require.resolve("browserify-zlib"),
          "fs": false,
          "net": false,
          "tls": false,
          "child_process": false
        },
        mainFields: ['browser', 'module', 'main'],
        alias: {
          process: 'process/browser',
          util: require.resolve('util/'),
          inherits: require.resolve('inherits')
        }
      });

    // Ignore optional dependencies of ws
    config.module
      .rule('noop')
      .test(/bufferutil|utf-8-validate/)
      .use('noop')
      .loader('noop-loader')
      .end();

    // Add optimization settings
    config.optimization
      .splitChunks({
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            chunks: 'all'
          }
        }
      });

    // Add resolve aliases for better module resolution
    config.resolve.alias
      .set('global', require.resolve('global/window'));

    // Enable source maps for better debugging
    config.devtool('source-map');
  });

  return webpack.resolveConfig();
};