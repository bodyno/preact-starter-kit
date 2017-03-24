import webpack from 'webpack'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import autoprefixer from 'autoprefixer'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import ReplacePlugin from 'replace-bundle-webpack-plugin'
import OfflinePlugin from 'offline-plugin'
import path from 'path'
const ENV = process.env.NODE_ENV || 'development'

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
    filename: ENV == 'development' ? `[name].[hash].js` : '[name].[chunkhash].js',
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
      use: ExtractTextPlugin.extract({
        use: [{
          loader: "css-loader",
          options: {
            modules: true,
            importLoaders: 1,
            sourceMap: ENV!=='production'
          }
        }, {
          loader: "postcss-loader"
        }, {
          loader: "less-loader"
        }],
        fallback: "style-loader"
      })
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
      'process.env.NODE_ENV': JSON.stringify(ENV),
      '__PROD__': ENV === 'production'
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
      minimize: true,
      options: {
        postcss: [
          autoprefixer({browsers: ['last 3 version']})
        ]
      }
    })
  ]).concat(ENV==='production' ? [
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
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module) {
        return module.context && module.context.indexOf('node_modules') !== -1;
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest'
    })
  ] : []),

  devtool: ENV==='production' ? '' : 'cheap-module-eval-source-map',


  devServer: {
    publicPath: '/',
    contentBase: './src',
    port: process.env.PORT || 3001,
    historyApiFallback: true,
    compress: true,
    inline: true,
    open: true,
    hot: true
  }
}
