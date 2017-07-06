const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({template: './src/app.html', filename: 'index.html', inject: 'body'});
const webpack = require('webpack')

module.exports = {
  entry: './src/app.js',
  output: {
    path: path.resolve(__dirname, './build'),
    publicPath: '/Workout',
    filename: 'lib.bundle.js'
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
  plugins: [HtmlWebpackPluginConfig]
}

new webpack.SourceMapDevToolPlugin({test: 'js|jsx|scss', filename: '[name].js.map', exclude: ['vendor.js']});
