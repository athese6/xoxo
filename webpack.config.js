const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const nodeExternals = require('webpack-node-externals');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');
const config = require('./lib/config');
const config_webpack = config.webpack;


// main directories
const env = config.getEnv();
const root = config.getRoot();
const inputDir = path.normalize(`${root}/${config_webpack.inputDir}`);
const outputDir = path.normalize(`${root}/${config_webpack.outputDir}`);
const modulesDir = path.normalize(`${root}/node_modules`);
const initialsEntries = [].concat(config_webpack.polyfills).concat(config_webpack.hotReload ? ['webpack-hot-middleware/client'] : []);

const webpackConfig = {
  watch: config_webpack.hotReload,
  entry: Object // convert entries paths to absolute paths and inject initials entries (initials entries should always be first)
    .keys(config_webpack.entries)
    .reduce((obj, key) => {
      const entry = config_webpack.entries[key];
      if (entry) {
        obj[key] = initialsEntries.concat([].concat(entry).map(item => path.normalize(`${inputDir}/${item}`)));
      }
      return obj;
    }, {}),
  output: {
    path: outputDir,
    filename: "[name].js?v=[hash]",
    chunkFilename: "[id].js?v=[hash]",
    hotUpdateMainFilename: "hot-update.json?v=[hash]",
    hotUpdateChunkFilename: "[id].hot-update.js?v=[hash]",
    publicPath: `/${config.app.public}/`
  },
  resolve: {
    modules: [
      inputDir,
      "node_modules"
    ],
    extensions: ['.js', '.jsx', '.json', '.scss', '.css']
  },
  module: {
    rules: (
      [
        {
          test: /\.(js|jsx)$/,
          loader: 'babel-loader',
          exclude: config_webpack.babel.ignore
        },
        {
          test: /\.json$/,
          loader: 'json-loader'
        },
        {
          test: /\.(png|jpe?g|gif)(\?.*)?$/,
          loader: 'url-loader'
        },
        {
          test: /\.svg$/,
          loader: 'raw-loader'
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          loader: 'url-loader'
        },
        // {
        //   test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        //   use: [
        //     {
        //       loader: 'url-loader',
        //       options: {
        //         limit: 80000,
        //         mimetype: "application/font-woff"
        //       }
        //     }
        //   ]
        // },
      ]
        .concat(
          config_webpack.extractCSS ? [
            {
              test: /\.scss$|\.css$/,
              loader: ExtractTextPlugin.extract({
                use: ['css-loader', 'postcss-loader', 'sass-loader'],
                fallback: 'style-loader'
              })
            }
          ] : []
        )
      // .concat([
      //   {
      //     test: require.resolve('handsontable'),
      //     loader: 'expose-loader?Handsontable'
      //   },
      // ])
    )
  },
  plugins: ([
      // predefined global variables
      new webpack.DefinePlugin({
        "process.window": "window",
        "process.env": {
          // remove warning about react under production, see: https://github.com/facebook/react/issues/6479
          NODE_ENV: JSON.stringify(env)
        },
        // if we need to check if development mode
        __DEV__: JSON.stringify(!config.isProduction())
      }),
      // copy files plugin
      new CopyWebpackPlugin(config_webpack.copy.map(dir => ({
        from: path.normalize(`${inputDir}/${dir}`),
        to: path.normalize(`${outputDir}/${dir}`)
      }))),
      // loaders options
      new webpack.LoaderOptionsPlugin({
        options: {
          postcss: [
            autoprefixer(), // auto prefix css for cross browser compatibility
          ],
          css: {
            minimize: config_webpack.optimize,
            importLoaders: true
          },
          babel: config_webpack.babel
        }
      }),
      // generate manifest.json so we can dynamically include our bundles ;),
      new ManifestPlugin({
        fileName: 'manifest.json',
        publicPath: config_webpack.publicPath
      })
    ].concat(
      // extract css from javascript
      config_webpack.extractCSS ? new ExtractTextPlugin({
        filename: `[name].css?v=[hash]`,
        allChunks: true
      }) : []
    ).concat(
      // split vendor into its own file
      config_webpack.splitVendor ? new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        // split only javascript
        minChunks: ({context, resource}) => resource && (/^.*\.(css|scss)$/).test(resource) ? false : /node_modules/.test(context),
      }) : []
    ).concat(
      // optimization plugins
      config_webpack.optimize ? [
        new ImageminPlugin({test: /\.(jpe?g|png|gif|svg)$/i}),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new OptimizeCssAssetsPlugin({
          assetNameRegExp: /\.scss\?.*$|\.css\?.*$/gi,
          cssProcessorOptions: {discardComments: {removeAll: true}}
        }),
        new webpack.optimize.UglifyJsPlugin({
          mangle: true,
          compress: {
            sequences: true,
            dead_code: true,
            conditionals: true,
            booleans: true,
            unused: true,
            if_return: true,
            join_vars: true,
            drop_console: false,
            warnings: false
          }
        }),
        new CompressionWebpackPlugin({
          asset: '[path].gz',
          algorithm: 'gzip',
          minRatio: 0.8
        })
      ] : []
    ).concat(
      // hot reload plugin
      config_webpack.hotReload ? new webpack.HotModuleReplacementPlugin() : []
    ).concat(
      // webpack analyzer
      config_webpack.analyze ? new BundleAnalyzerPlugin() : []
    ).concat(
      new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, new RegExp(config.i18n.locales
        .filter(({available}) => available)
        .map(({code}) => code)
        .join("|")))
    ).concat(
      new webpack.ProvidePlugin({
        // $: 'jquery',
        // jQuery: 'jquery',
        // 'window.$': 'jquery',
        // 'window.jQuery': 'jquery',
        // "Hammer": "hammerjs/hammer",
        $: 'jquery/dist/jquery',
        jQuery: 'jquery/dist/jquery',
        'window.$': 'jquery/dist/jquery',
        'window.jQuery': 'jquery/dist/jquery',
        "Hammer": "hammerjs/hammer",
        // Materialize: `${inputDir}/lib/materialize-src/js/bin/materialize.js`,
        // M: `${inputDir}/lib/materialize-src/js/bin/materialize.js`,
        // "window.Materialize": `${inputDir}/lib/materialize-src/js/bin/materialize.js`,
      })
    )
  ),
  externals: [
    (context, request, callback) => config_webpack.ignore.includes(request) ? callback(null, "require('" + request + "')") : callback()
  ].concat(
    config_webpack.ignore.includes("node_modules") ? nodeExternals({modulesDir}) : []
  ),
  devtool: config_webpack.optimize ? false : "source-map"
};

module.exports = webpackConfig;
