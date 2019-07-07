const path = require('path');
const HtmlWebpack = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const DotEnv = require('dotenv-webpack');

const developmentMode = process.env.BUILD_MODE != 'production';

const config = {
  mode: developmentMode ? 'development' : 'production',
  entry: './src/index.js',
  output: {
    publicPath: '/',
    path: path.resolve(__dirname, '../public'),
    filename: developmentMode ? 'dist/js/[name].js' :
      'dist/js/[name].[hash].js',
    chunkFilename: developmentMode ? 'dist/js/[name].js' :
      'dist/js/[name].[hash].js',
  },
  resolve: {
    modules: [
      path.resolve(__dirname, './src'),
      path.resolve(__dirname, './node_modules'),
    ],
    extensions: ['.vue', '.js', '.jsx', '.json'],
  },
  plugins: [
    new DotEnv(),
    new HtmlWebpack({
      template: './src/index.html',
      filename: './index.html',
    }),
    new StyleLintPlugin({
      files: ['**/*.{vue,htm,html,css,sss,less,scss,sass}'],
      fix: true,
    }),
    new MiniCssExtractPlugin({
      filename: developmentMode ? 'dist/css/[name].css' :
        'dist/css/[name].[hash].css',
      chunkFilename: developmentMode ? 'dist/css/[name].css' :
        'dist/css/[name].[hash].css',
    }),
    new VueLoaderPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          },
          {
            loader: 'eslint-loader',
            options: {
              failOnError: false,
              fix: true,
            },
          },
        ],
      },
      {
        test: /\.vue$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'vue-loader',
          },
          {
            loader: 'eslint-loader',
            options: {
              failOnError: false,
              fix: true,
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: developmentMode ? 'vue-style-loader' :
              MiniCssExtractPlugin.loader,
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          'resolve-url-loader',
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: developmentMode ? 'vue-style-loader' :
              MiniCssExtractPlugin.loader,
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.(jpg|png|svg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1000,
              name: 'dist/img/[hash].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(ttf|eot|woff(2)?)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1000,
              name: 'dist/fonts/[hash].[ext]',
            },
          },
        ],
      },
    ],
  },
  devServer: {
    compress: true,
    publicPath: '/',
    historyApiFallback: true,
    port: 8081,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        ignorePath: false,
        secure: false,
      },
    },
  },
  devtool: developmentMode ? 'source-map' : 'none',
  optimization: developmentMode ?
    {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /node_modules/,
            chunks: 'all',
            name: 'vendor',
            enforce: true,
          },
        },
      },
    } :
    {
      minimizer: [
        new UglifyJsPlugin({
          test: /\.js(\?.*)?$/i,
          sourceMap: true,
          uglifyOptions: {
            warnings: false,
            drop_console: true,
            dead_code: true,
          },
        }),
      ],
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /node_modules/,
            chunks: 'all',
            name: 'vendor',
            enforce: true,
          },
        },
      },
    },
};

module.exports = config;
