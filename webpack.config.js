const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({template: './src/app.html', filename: 'index.html', inject: 'body'});
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');

module.exports = function (env, args) {

  const isProd = process
    .argv
    .indexOf('-p') !== -1;

  return {
    entry: './src/app.js',
    devtool: isProd
      ? ''
      : 'eval-source-map',
    output: {
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
      new UglifyJSPlugin({compress: isProd})
    ]
  };
}