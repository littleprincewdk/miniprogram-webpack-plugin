const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniprogramWebpackPlugin = require('../src');

function fileLoader(name = '[path][name].[ext]') {
  return {
    loader: 'file-loader',
    options: {
      name,
    },
  };
}

function extractLoader() {
  return {
    loader: 'extract-loader',
    options: {
      publicPath: context => {
        return '../'.repeat(
          path.relative(path.join(__dirname, 'src'), context.context).split('/').length,
        );
      },
      // publicPath: 'https://example.com/',
    },
  };
}

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
    // publicPath: 'https://example.com/',
    globalObject: 'wx',
  },
  devtool: 'source-map',
  module: {
    rules: [
      // {
      //   test: /\.wxml\.ts$/,
      //   use: [
      //     fileLoader(),
      //     extractLoader(),
      //     {
      //       loader: 'babel-loader',
      //       options: {
      //         presets: ['@babel/preset-env', '@babel/preset-typescript'],
      //       },
      //     },
      //   ],
      //   exclude: /node_modules/,
      // },
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-typescript'],
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.wxml$/,
        use: [
          fileLoader(),
          extractLoader(),
          {
            loader: 'html-loader',
            options: {
              attributes: {
                list: ['wxs', 'image', 'audio', 'video']
                  .map(tag => ({
                    tag,
                    attribute: 'src',
                    type: 'src',
                  }))
                  .concat([
                    {
                      tag: 'video',
                      attribute: 'poster',
                      type: 'src',
                    },
                  ]),
              },
            },
          },
        ],
      },
      {
        test: /\.wxss$/,
        use: [
          fileLoader(),
          'extract-loader',
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
          fileLoader(),
          'extract-loader',
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
        test: /\.wxs$/,
        use: [fileLoader()],
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        use: [
          fileLoader(),
          // name: 'images/[name]-[contenthash:16].[ext]',
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
        // template: ['.wxml.ts', '.wxml'],
      },
    }),
  ],
};
