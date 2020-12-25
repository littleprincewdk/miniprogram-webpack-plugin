const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const MiniprogramWebpackPlugin = require('../src');

// function recursiveIssuer(m) {
//   if (m.issuer) {
//     return recursiveIssuer(m.issuer);
//   }

//   const chunks = m.getChunks();
//   // For webpack@4 chunks = m._chunks

//   for (const chunk of chunks) {
//     return chunk.name;
//   }

//   return false;
// }

module.exports = {
  mode: 'development',
  context: path.resolve(__dirname, 'src'),
  entry: {
    app: './app.ts',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '',
    globalObject: 'wx',
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
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
            },
          },
        ],
      },
      {
        test: /\.less$/,
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
  resolve: {
    extensions: ['.ts', '.js'],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniprogramWebpackPlugin({
      extensions: {
        style: ['.less', '.wxss'],
      },
    }),
    new MiniCssExtractPlugin({
      filename: '[name]',
    }),
  ],
};
