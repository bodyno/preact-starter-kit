import webpack from 'webpack'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import autoprefixer from 'autoprefixer'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import ReplacePlugin from 'replace-bundle-webpack-plugin'
import OfflinePlugin from 'offline-plugin'
import path from 'path'
import V8LazyParseWebpackPlugin from 'v8-lazy-parse-webpack-plugin'
const ENV = process.env.NODE_ENV || 'development'

const CSS_MAPS = ENV!=='production'

const extractLess = new ExtractTextPlugin({
  filename: "[name].[contenthash].css",
  disable: ENV === "development"
});

module.exports = {
  context: path.resolve(__dirname, "src"),
  entry: {
    app: './index.js',
    vendor: [
      'preact',
      'preact-compat',
      'preact-router',
      'preact-async-route',
      'mobx',
      'mobx-react',
      'autobind-decorator'
    ]
  },

	output: {
		path: path.resolve(__dirname, "dist"),
		publicPath: '/',
    filename:  ENV == 'development' ? `[name].[hash].js` : '[chunkhash].js',
    chunkFilename: '[chunkhash].js'
	},
  resolve: {
    extensions: ['.jsx', '.js', '.json', '.less'],
    modules: [
      'src',
      path.resolve(__dirname, "src/lib"),
      path.resolve(__dirname, "node_modules"),
      'node_modules'
    ],
    alias: {
      'react': 'preact-compat',
      'react-dom': 'preact-compat'
    }
  },

  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    },{
      test: /\.(less|css)$/,
      use: extractLess.extract({
        use: [{
          loader: "css-loader",
          options: {
            modules: true,
            importLoaders: 1,
            sourceMap: CSS_MAPS
          }
        }, {
          loader: "less-loader"
        }],
        fallback: "style-loader"
      })
    },{
      test: /\.json$/,
      loader: 'json-loader'
    },{
      test: /\.(xml|html|txt|md)$/,
      loader: 'raw-loader'
    },
    { test: /\.woff(\?.*)?$/,  loader: 'url?prefix=fonts/&name=[hash:base64:20].[ext]&limit=10000&mimetype=application/font-woff' },
    { test: /\.woff2(\?.*)?$/, loader: 'url?prefix=fonts/&name=[hash:base64:20].[ext]&limit=10000&mimetype=application/font-woff2' },
    { test: /\.otf(\?.*)?$/,   loader: 'file?prefix=fonts/&name=[hash:base64:20].[ext]&limit=10000&mimetype=font/opentype' },
    { test: /\.ttf(\?.*)?$/,   loader: 'url?prefix=fonts/&name=[hash:base64:20].[ext]&limit=10000&mimetype=application/octet-stream' },
    { test: /\.eot(\?.*)?$/,   loader: 'file?prefix=fonts/&name=[hash:base64:20].[ext]' },
    { test: /\.svg(\?.*)?$/,   loader: 'url?prefix=fonts/&name=[hash:base64:20].[ext]&limit=10000&mimetype=image/svg+xml' },
    { test: /\.(png|jpg|gif)$/,    loader: 'url?limit=8192' }
    ]
  },

  plugins: ([
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(ENV)
    }),
    new HtmlWebpackPlugin({
      template: './index.ejs',
      minify: { collapseWhitespace: true }
    }),
    new CopyWebpackPlugin([
      { from: './manifest.json', to: './' },
      { from: './favicon.ico', to: './' }
    ]),
    new ExtractTextPlugin({
      filename: '[contenthash].css',
      allChunks: true,
      disable: ENV!=='production'
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: [
          require('autoprefixer')({browsers: ['last 3 version']})
        ]
      }
    })
  ]).concat(ENV==='production' ? [
    new V8LazyParseWebpackPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      output: {
        comments: false
      },
      compress: {
        warnings: false,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true,
        negate_iife: false
      }
    }),

    // strip out babel-helper invariant checks
    new ReplacePlugin([{
      // this is actually the property name https://github.com/kimhou/replace-bundle-webpack-plugin/issues/1
      partten: /throw\s+(new\s+)?[a-zA-Z]+Error\s*\(/g,
      replacement: () => 'return;('
    }]),
    new OfflinePlugin({
      relativePaths: false,
      AppCache: false,
      excludes: ['_redirects'],
      ServiceWorker: {
        events: true
      },
      cacheMaps: [
        {
          match: /.*/,
          to: '/',
          requestTypes: ['navigate']
        }
      ],
      publicPath: '/'
    })
  ] : []),

	devtool: ENV==='production' ? '' : 'eval',


  devServer: {
    publicPath: '/',
    contentBase: './src',
    port: process.env.PORT || 8080,
    historyApiFallback: true,
    compress: true,
    inline: true,
    open: true,
    hot: true
  }
}
