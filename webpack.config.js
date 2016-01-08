var path = require('path');
var webpack = require('webpack');
var node_modules_dir = path.resolve(__dirname, 'node_modules');
//var CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');

module.exports = {
  entry: {
    entry: './entry.js',
    //vendor: './vendor.js',
  },
  output: {
    path: __dirname + '/js',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      //load and compile js
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      },
      //load and compile scss
      {
        test: /\.scss$/,
        loaders: ['style', 'css', 'sass']
      },
      // inline base64 URLs for <=8k images, direct URLs for the rest
      {
        test: /\.(png|jpg)$/,
        loader: 'url-loader?limit=8192'
      }
    ]
  },
  resolve: {
    // you can now require('file') instead of require('file.coffee')
    extensions: ['', '.js', '.json', '.scss', ',css']
  },
  plugins: [
    //new webpack.optimize.CommonsChunkPlugin(/* chunkName= */'vendor', /* filename= */'vendor.bundle.js')
  ]
};
