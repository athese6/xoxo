const ora = require("ora");
const webpack = require("webpack");
const {clearDir} = require("./system");
const logMessage = require("./log-message");
const config = require('./config');
const webpackConfig = require('../webpack.config');
const webpackCompiler = webpack(webpackConfig);

/**
 * @private print webpack compile results
 * @param stats webpack stats
 */
const printWebpackResults = stats => {
  stats && process.stdout.write(`${stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  })}\n\n`);
  console.log(logMessage.success(`bundling webpack client success.`));
};

/**
 * Clear webpack output folder as defined in the config file
 * @return {Promise}
 */
const clearWebpackOutputDir = () => clearDir(`${config.getRoot()}/${config.webpack.outputDir}`);

/**
 * bundle webpack client folder
 * @return {Promise}
 */
const bundleWebpackClient = () => new Promise((resolve, reject) => {
  const env = process.env.NODE_ENV;
  console.log(logMessage.info(`creating a bundler`, `process.env.NODE_ENV = ${env}`));
  if (webpackConfig.watch) {
    console.log(logMessage.info("bundleing & watching webpack client"));
    let resolved = false;
    webpackCompiler.watch({}, (error, stats) => {
      printWebpackResults(stats);
      if (!resolved) {
        resolved = true;
        if (error) {
          console.log(logMessage.error(`bundling webpack client failed!`));
          reject(error);
        } else {
          resolve();
        }
      }
    });
  } else {
    console.log(logMessage.info(`bundling webpack client`));
    const spinner = ora();
    spinner.start();
    webpackCompiler.run((error, stats) => {
      printWebpackResults(stats);
      if (error) {
        console.log(logMessage.error(`bundling webpack client failed!`));
        reject(error);
      } else {
        resolve();
      }
    });
  }
});

module.exports = {
  clearWebpackOutputDir,
  bundleWebpackClient,
  webpackCompiler
};
