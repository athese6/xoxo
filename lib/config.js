// config module not working from shell
const override = require("json-override");
const path = require('path');
const config = require("../config/default.json");
const env = process.env.NODE_ENV;
const clientType = process.env.CLIENT_TYPE;

// try to override
if (env) {
    try {
        const env_config = require(path.normalize("../config/" + env + ".json"));
        env_config && override(config, env_config);
    } catch (e) {
        // never mind
    }
}

config.isProduction = () => env === "production";

config.debug = undefined;
if (env !== "production") {
    try {
        config.debug = require("./debug");
    } catch (e) {
        // never mind
    }
}

config.express = app => {
    const settings = config.app;
    for (const prop in settings) {
        const val = settings[prop];
        app.set(prop, val);
    }
    return env === "production";
};

config.getContextName = (isBrowser = true) => {
    if (isBrowser) {
        const port = config.ssl.enabled ? config.ssl.port : config.app.port;
        const portUrl = (port === 80 || port === 443) ? "" : ":" + port;
        return config.app.contextName + portUrl;
    } else {
        // return config.deeplink.protocol + ":/";
    }
};

config.getRoot = () => path.normalize(__dirname + "/..");

config.getEnv = () => env;
config.getClientType = () => clientType;

module.exports = config;
