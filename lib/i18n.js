const i18n = require("i18n");
const config = require("./config");
const i18n_config = Object.assign({}, config.i18n, true);

// i18n_config.locales = i18n_config.locales.filter(locale => locale.available).map(locale => locale.code); // for locales option we need only codes
// i18n.configure(i18n_config);
//
// module.exports = i18n;


module.exports = {
    getCatalog: (req) => {
        return i18n.getCatalog(req);
    },
    configure: () => {
        i18n_config.locales = i18n_config.locales.filter(locale => locale.available).map(locale => locale.code); // for locales option we need only codes
        i18n.configure(i18n_config);
        // app.locals.i18n = config;
        // i18n.configure(config);
    },
    init: i18n.init,
    // init: (req, res, next) => {
    //
    //     const rxLocale = /^\/(\w\w)/i;
    //     if (rxLocale.test(req.url)) {
    //         const locale = rxLocale.exec(req.url)[1];
    //         // if (i18n_config.locales.indexOf(locale) >= 0)
    //         //     req.setLocale(locale);
    //     }
    //     //else // no need to set the already default
    //     next();
    // },
    url: (url) => {
        // const locales = app.locals.i18n.locales;
        // const urls = [];
        // for (let i = 0; i < locales.length; i++)
        //     urls[i] = '/' + locales[i] + url;
        // urls[i] = url;
        return i18n_config.locales.map(locale => '/' + locale + url).concat("/");
    }
};