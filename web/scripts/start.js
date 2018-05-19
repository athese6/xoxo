// default environment
process.env.NODE_ENV = process.env.NODE_ENV || "default";

const config = require("../../lib/config");

// start
if (config.isProduction()) {
    require("../../server/main");
} else {
    require('./bundle')
        .then(() => require("../../server/main"));
}
