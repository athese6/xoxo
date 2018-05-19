const Promise = require("bluebird");
const models = require("../models");
const thinky = require("../../lib/thinky");
const r = thinky.r;

const query = {
    getAll: () => models.Browser.run(),
    getSocketId: (userId, deviceId) => models.Browser
        .filter(doc => r.and(doc("deviceId").eq(deviceId), doc("userId").eq(userId)))
        .orderBy(r.desc("modifiedAt"))
        .limit(1)
        .then(browsers => {
            if (browsers.length > 0) {
                return browsers[0].socketId;
            } else {
                return "";
            }
        })
    ,
};

module.exports = query;