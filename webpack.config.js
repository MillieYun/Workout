const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({template: './src/app.html', filename: 'index.html', inject: 'body'});
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');

module.exports = function (env, args) {

  var isProd = process.env.NODE_ENV === 'production';

  return {
    entry: './src/app.js',
    devtool: isProd
      ? ''
      : 'eval-source-map',
    output: {
      //publicPath: '/Workout',
      filename: 'lib.bundle.js',
      path: path.resolve(__dirname, 'dist')
    },
    module: {
      loaders: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: /node_modules/
        }, {
          test: /\.jsx$/,
          loader: 'babel-loader',
          exclude: /node_modules/
        }, {
          test: /\.scss$/,
          loader: 'style-loader!css-loader!sass-loader', //!autoprefixer
          exclude: /node_modules/
        }, {
          test: /\.css$/,
          loader: 'style-loader!css-loader',
          exclude: /node_modules/
        }
      ]
    },
    plugins: [
      HtmlWebpackPluginConfig,
      // new UglifyJSPlugin({   compress: args['optimize-minimize'] // 只有传入 -p 或
      // --optimize-minimize })
    ]
  };
}

new webpack.SourceMapDevToolPlugin({test: 'js|jsx|scss', filename: '[name].js.map', exclude: ['vendor.js']});
