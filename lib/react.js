// enable Es6 (React/Redux Server Rendering)
require('./register-babel');
const React = require('react');
const {renderToString} = require('react-dom/server');
const {createMemoryHistory} = require('history');
const {ServerStyleSheet} = require("styled-components");
const {replace} = require('react-router-redux');
const {App} = require('../client/app');
const configureStore = require("../client/configureStore").default;
const theme = require("../client/theme").default;
const config = require("../lib/config");
const ssrCache = {};
const manifest = require(`${config.getRoot()}/${config.webpack.outputDir}/manifest.json`);
/**
 * default page
 * @param req
 * @param res
 * @param next
 * @param options
 */
const reactServerRender = (req, res, next, options) => {
  // create props
  const history = createMemoryHistory();
  const store = configureStore(options.state, history);
  // set store routing state
  store.dispatch(replace(req.url));
  // get html and styled components css
  const cacheKey = `${req.url}`;
  // get cache only for not logged in user
  if (config.webpack.optimize && req.isUnauthenticated() && ssrCache[cacheKey]) {
    return res.send(ssrCache[cacheKey]);
  }
  const sheet = new ServerStyleSheet();
  options.html = renderToString(
    sheet.collectStyles(React.createElement(App, {store, theme, history}))
  );
  options.css = sheet.getStyleTags();
  options.manifest = manifest;
  // Now, since we have a functional react-router-redux on server, can check that state
  return res.render("default", options, (err, html) => {
    if (err) return next(err);
    // don't cache logged in user
    if (config.webpack.optimize && req.isUnauthenticated()) {
      ssrCache[cacheKey] = html;
    }
    res.send(html);
  });
};

module.exports = {
  reactServerRender
};
