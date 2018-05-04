#!/usr/bin/env node
/* eslint-disable vars-on-top, func-names */

'use strict';

require('module-alias/register');

var path = require('path');
var webpack = require('webpack');
var pjson = require('../package.json');
var UglifyJsPlugin = require('uglifyjs-webpack-plugin');

var TEST_ENV = (process.env.NODE_ENV === 'test');

var staticDir = path.resolve(path.join(
  __dirname,
  (TEST_ENV) ? '../nested_admin/tests/static' : '../nested_admin/static'));

var srcDir = path.join(staticDir, 'nested_admin/src');
var distDir = path.join(staticDir, 'nested_admin/dist');

function runWebpack(opts) {
  var ext = (opts.min) ? '.min.js' : '.js';
  var filename = 'nested_admin' + ext;

  return new Promise(function(resolve, reject) {
    try {
      var config = {
        entry: path.join(srcDir, 'nested_admin.js'),
        devtool: 'source-map',
        output: {
          path: destDir,
          filename: filename,
          library: 'DJNesting',
          libraryTarget: 'global',
          devtoolModuleFilenameTemplate: function(info) {
            return path.relative(destDir, info.absoluteResourcePath);
          }
        },
        node: {
          process: false,
          setImmediate: false
        },
        module: {
          rules: [{
            test: /nunjucks/,
            exclude: /(node_modules|browser|tests)(?!\.js)/,
            use: {
              loader: 'babel-loader',
              options: {
                plugins: [['module-resolver', {
                  extensions: ['.js'],
                  resolvePath: function(sourcePath) {
                    if (sourcePath.match(/^(fs|path|chokidar)$/)) {
                      return 'node-libs-browser/mock/empty';
                    }
                    return null;
                  },
                }]]
              }
            }
          }]
        },
        plugins: [
          new webpack.BannerPlugin('Browser bundle of django-nested-admin ' + pjson.version),
          new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
          }),
        ]
      };

      if (opts.min) {
        config.plugins.push(
          new UglifyJsPlugin({sourceMap: true}));
      }

      webpack(config).run(function(err, stats) {
        if (err) {
          reject(err);
        } else {
          resolve(stats.toString({cached: false, cachedAssets: false}));
        }
      });
    } catch (err) {
      reject(err);
    }
  });
}

runWebpack({min: false}).then(function(stats) {
  console.log(stats); // eslint-disable-line no-console
  if (!TEST_ENV) {
    runWebpack({min: true}).then(function(statsMin) {
      console.log(statsMin); // eslint-disable-line no-console
    });
  }
}).catch(function(err) { throw err; });
