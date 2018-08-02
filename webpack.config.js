const { resolve } = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const paths = {
  dist: resolve(__dirname, 'dist'),
  build: resolve(__dirname, 'build'),
  src: resolve(__dirname, 'src'),
  static: resolve(__dirname, 'static'),
};

module.exports = (env = {}) => {
  const { dev } = env;

  const copyPlugin = new CopyWebpackPlugin([
    { from: paths.static, to: paths.build },
  ]);

  const base = {
    context: paths.src,
    module: {
      rules: [
        {
          test: /.jsx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                cacheDirectory: true,
              },
            },
          ],
        },
        {
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader',
          ],
        },
        // {
        //   test: /\.worker\.js$/,
        //   use: [
        //     'worker-loader',
        //     'babel-loader',
        //   ],
        // },
      ],
    },
    resolve: {
      alias: {
        react: resolve(__dirname, 'node_modules', 'react'),
        'with-styles': resolve(__dirname, 'src/withStyles.js'),
      },
      extensions: ['.js', '.jsx'],
    },
  };

  const devConfig = {
    entry: [
      'webpack-dev-server/client?http://localhost:3210',
      'webpack/hot/only-dev-server',
      './index.dev.js',
    ],
    output: {
      filename: 'bundle.js',
      path: paths.dist,
      publicPath: '/',
      // globalObject necessary for attempted global access that hot reloading does w/ web workers
      globalObject: 'this',
    },
    devServer: {
      hot: true,
      contentBase: paths.dist,
      publicPath: '/',
      historyApiFallback: true,
      port: 3211,
    },
    devtool: 'inline-source-map',
    plugins: [
      copyPlugin,
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('development'),
        },
      }),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NamedModulesPlugin(),
    ],
    mode: 'development',
  };

  const prodConfig = {
    entry: [
      './index.prod.js',
    ],
    output: {
      filename: 'index.js',
      path: paths.build,
      library: 'react-tuner',
      libraryTarget: 'commonjs2',
    },
    plugins: [
      copyPlugin,
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production'),
        },
      }),
      // new webpack.optimize.UglifyJsPlugin({
      //   compress: {
      //     warnings: false,
      //   },
      // }),
    ],
    mode: 'production',
  };

  return Object.assign(base, dev ? devConfig : prodConfig);
};
