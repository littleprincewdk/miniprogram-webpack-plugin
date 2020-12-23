# miniprogram-webpack-plugin

为小程序而生的webpack插件

## 使用方法
```bash
yarn add miniprogram-webpack-plugin -D
```
`webpack.config.js`:
```javascript
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const MiniprogramWebpackPlugin = require('miniprogram-webpack-plugin');

module.exports = {
  mode: 'development',
  context: path.resolve(__dirname, 'src'),
  entry: {
    app: './app.js',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.wxml$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
            },
          },
        ],
      },
      {
        test: /\.wxss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              import: false,
              importLoaders: 1,
            },
          },
          'less-loader',
        ],
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
            },
          },
          {
            loader: 'image-webpack-loader',
            options: {},
          },
        ],
      },
    ],
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        common: {
          name: 'common',
          minChunks: 2,
          priority: 1,
        },
        vendors: {
          name: 'vendors',
          minChunks: 2,
          test: module => {
            return /[\\/]node_modules[\\/]/.test(module.resource);
          },
          priority: 10,
        },
      },
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniprogramWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name]',
    }),
  ],
};
```
