const express = require('express');
const router = express.Router();
const config = require("../../lib/config");
const {reactServerRender} = require("../../lib/react");
const url = require('url');
const resolvePath = (...args) => args.filter(arg => arg).join("/");

// the req.url here should be the full URL path from
// the original request, including the query string.
router.get(["/:lang?", "/:lang?/*"], (req, res, next) => {
  const {user = {}, query} = req;
  const {lang} = req.params;
  const isAuthenticated = req.isAuthenticated();
  const {defaultLocale, locales} = config.i18n;
  // first check if the parameter is actually a language code
  const isLang = lang && locales.some(locale => locale.code === lang);
  const pathname = isLang ? resolvePath(req.params[0]) : resolvePath(lang, req.params[0]);
  if (isLang) {
    // change language
    if (lang !== req.locale) {
      req.setLocale(lang);
      res.cookie(config.i18n.cookie, lang);
    }
    // if default language redirect to the base url
    if (lang === defaultLocale) {
      return res.redirect(url.format({
        pathname: `/${resolvePath(pathname)}`,
        query
      }));
    }
  } else {
    // only default language allowed here, if not redirect to the language url
    if (req.locale !== defaultLocale) {
      return res.redirect(url.format({
        pathname: `/${resolvePath(req.locale, pathname)}`,
        query
      }));
    }
  }
  user.lang = req.locale;
  // theme options
  const options = {
    user,
    publicPath: config.app.public,
    state: {
      auth: {
        isAuthenticated,
        user,
        error: null
      },
      i18n: {
        locales,
        translations: req.getCatalog()
      }
    },
    html: "",
    css: ""
  };
  return reactServerRender(req, res, next, options);
});

module.exports = router;
