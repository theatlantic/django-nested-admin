'use strict';

const path = require('path');
const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const srcDir = 'nested_admin/static/nested_admin/src';
const dstDir = path.join(
  __dirname, 'nested_admin',
  ((process.env.NODE_ENV === 'test') ? 'tests' : ''),
  'static/nested_admin/dist');

const baseConfig = {
  entry: {
    nested_admin: [
      path.join(srcDir, 'nested_admin.scss'),
      path.join(srcDir, 'nested-admin/index.js'),
    ]
  },
  resolve: {
    alias: {
      nested_admin: path.join(__dirname, 'nested_admin'),
    },
  },
  mode: 'development',
  devtool: 'source-map',
  output: {
    path: dstDir,
    library: 'DJNesting',
    libraryTarget: 'window',
    devtoolModuleFilenameTemplate(info) {
      return path.relative(dstDir, info.absoluteResourcePath);
    }
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /(node_modules)/,
      use: { loader: 'babel-loader' }
    }]
  },
  externals: {
    grappelli: 'grappelli',
    grp: 'grp',
    'django/date-time-shortcuts': 'DateTimeShortcuts',
    'django/select-filter': 'SelectFilter'
  },
};

module.exports = [
  merge(baseConfig, {
    mode: 'development',
    output: { filename: '[name].js' },
    module: {
      rules: [{
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              postcssOptions: {
                plugins: [
                  ['postcss-preset-env', {}],
                ],
              },
            },
          },
          'sass-loader',
        ],
      }],
    },
    plugins: [
      new MiniCssExtractPlugin({ filename: '[name].css' })
    ],
  }),
  ...((process.env.NODE_ENV === 'test') ? [] : [
    merge(baseConfig, {
      mode: 'production',
      output: { filename: '[name].min.js' },
      module: {
        rules: [{
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
                postcssOptions: {
                  plugins: [
                    ['postcss-preset-env', {}],
                  ],
                },
              },
            },
            'sass-loader',
          ],
        }]
      },
      plugins: [
        new MiniCssExtractPlugin({ filename: '[name].min.css' })
      ]
    })
  ])
];
