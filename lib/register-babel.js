const config = require("./config");
// enable babel in server side
const {plugins, presets} = config.webpack.babel;
require('babel-core/register')({
  // Ignore everything in node_modules except node_modules/styled-components.
  plugins,
  presets,
  ignore: /node_modules\/(?!styled-components)/
});
require('babel-polyfill');
// ignore extensions
require.extensions['.svg'] = require.extensions['.css'] = require.extensions['.scss'] = () => null;
