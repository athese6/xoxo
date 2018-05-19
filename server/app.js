// import express from 'express';
const express = require('express');
const session = require('express-session');
const useragent = require('express-useragent');
const compression = require('compression');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const moment = require('moment');
const proxy = require('proxy-middleware');
const override = require('json-override');
const requestIp = require('request-ip');
const minifyHTML = require("express-minify-html");
const gzipStatic = require("connect-gzip-static");
const webpackHot = require('webpack-hot-middleware');
// const cookieSession = require('cookie-session');
const services = require('./services');
const routes = require('./routes');
const passport = services.Passport();
const config = require('../lib/config');
const ioredis = require('../lib/ioredis');
const i18n = require('../lib/i18n');
const {webpackCompiler} = require("../lib/bundler");
const app = express();

// application settings
config.express(app);

// logger
app.use(logger(config.app.logger));

// static files
app.use(`/${config.app.public}`, gzipStatic(path.normalize(config.webpack.outputDir), {maxAge: 2592000000}));
// app.use("/", gzipStatic(path.normalize(path.join(config.webpack.outputDir, "root"))));

// force ssl
if (config.ssl.enable) {
    app.use((req, res, next) => {
        if (!req.secure) {
            return res.redirect(301, ['https://', req.get('Host'), req.url].join(''));
        }
        next();
    });
}

app.use((req, res, next) => {
    const host = req.get('Host');
    if (host === 'www.hapoom.co') {
        if (config.ssl.enable) {
            return res.redirect(301, 'https://hapoom.co' + req.url);
        } else {
            return res.redirect(301, 'http://hapoom.co' + req.url);
        }
    }
    next();
});

if (config.webpack.optimize) {
    app.use(minifyHTML({
        override: true,
        exception_url: false,
        htmlMinifier: {
            removeComments: true,
            collapseWhitespace: true,
            collapseBooleanAttributes: true,
            removeAttributeQuotes: true,
            removeEmptyAttributes: true,
            minifyJS: true,
            minifyCSS: true,
            useShortDoctype: true
        }
    }));
    app.use(compression());
}

// fav icon
// app.use(favicon(path.normalize(config.app.favicon)));

// hot reload middleware
config.webpack.hotReload && app.use(webpackHot(webpackCompiler));
// request body parser
app.use(bodyParser.json({limit: config.app.requestLimit}));
// request params parser
app.use(bodyParser.urlencoded({limit: config.app.requestLimit, extended: true}));
// cookies parser
const cookie_parser = cookieParser();
app.use(cookie_parser);
// i18n init parses req for language headers, cookies, etc.
const requestIp_init = requestIp.mw();
app.use(requestIp_init);
const useragent_init = useragent.express();
app.use(useragent_init);
app.use(i18n.init);
i18n.configure();

// session
let user_session = override(config.session, {}, true);
delete user_session.cookie.rememberMe; // set only if remember me
if (ioredis.enabled) {
    user_session.store = ioredis.getSessionStore(session);
}
const user_session_init = session(user_session);
app.use(user_session_init);
// passport
const passport_initialize = passport.initialize();
app.use(passport_initialize);
// passport session
const passport_session = passport.session();
app.use(passport_session);

// force current locale to user locale if this locale is available
const rethinkdb = proxy('http://localhost:8080/');
const rethinkdb_path = "/rethinkdb";
app.use(rethinkdb_path, (req, res, next) => {
    if (req.originalUrl === rethinkdb_path) return res.redirect(301, rethinkdb_path + "/");
    // add your own security here ;)
    // if (req.isAuthenticated() && (req.user.role === models.Constants.UserRole.admin || config.admins.includes(req.user.email))) {
    if (!req.isAuthenticated()) {
        return rethinkdb(req, res, next);
    }
    next();
});

// app.use((req, res, next) => {
//   let lang;
//   if (req.isAuthenticated()) {
//     lang = req.user.lang;
//   } else {
//     lang = req.cookies[config.i18n.cookie] || req.session.lang || config.i18n.defaultLocale;
//   }
//
//   const user_locale = config.i18n.locales.find((locale) => (locale.code === lang && locale.available));
//   if (user_locale) {
//     req.setLocale(user_locale.code);
//   } else {
//     req.setLocale(config.i18n.defaultLocale);
//   }
//   next();
// });


// routers
app.use("/api", require('./routes/api'));
app.use(routes);

/****** error handlers ******/
// catch 404 and forward to error handler or redirect
app.use((req, res, next) => {
    if (req.xhr) {
        return next();
    }
    res.status(404);
    res.render("error");
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    console.log(err);
    res.send(err.message);
});

// ajax error handler
app.use((err, req, res, next) => {
    console.log(err);
    if (req.xhr) {
        return res.json({"error": err});
    }
    next(err);
});

// html error handler
app.use((err, req, res, next) => {
    if (config.isProduction()) {
        res.redirect("/");
        res.status(404);
        res.send(err.message);
    } else {
        // res.send();
        res.status(404);
        res.send(err.message);
    }
});


module.exports = app;


