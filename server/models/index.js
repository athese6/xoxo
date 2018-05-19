const thinky = require("../../lib/thinky");

const models = {
  Constants: require("./constants"),
  User: require("./user"),
  Browser: require("./browser"),
  Error: require("./error")
};

// initial data
const Promise = require("bluebird");
const config = require("../../lib/config");
const data = require("../data/default.json");
// const data = config.isProduction() ? require("../../data/production.json") : require("../data/default.json");
const dataPromises = Object.keys(data).map(key => models[key].save(data[key], {conflict: 'update'}));

thinky.dbReady()
  .then(() => Promise.each(dataPromises, results => console.log))
  .catch(console.log);

module.exports = models;


