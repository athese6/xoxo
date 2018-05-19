// default environment
process.env.NODE_ENV = process.env.NODE_ENV || "default";

const {clearWebpackOutputDir, bundleWebpackClient} = require('../../lib/bundler');
const {checkVersions} = require('../../lib/system');
const config = require('../../lib/config');

// run our Promises sequentially
// module.exports = checkVersions()
//   .then(() => config.webpack.clearOutput ? clearWebpackOutputDir() : true)
//   .then(bundleWebpackClient);
module.exports = checkVersions()
  .then(() => config.webpack.clearOutput ? clearWebpackOutputDir() : true)
  .then(bundleWebpackClient);
