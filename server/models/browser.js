const thinky = require("../../lib/thinky");
const type = thinky.type;
const r = thinky.r;
const uuid = require("uuid");
const {Prefix} = require("./constants");

const Browser = thinky.createModel("Browser", {
    id: type.string().default(function () {
        return Prefix.Browser + uuid.v1().toLowerCase();
    }),
    modifiedAt: type.date().default(function () {
        return new Date();
    }),
    createdAt: type.date().default(function () {
        return new Date();
    }),
    isOnline: type.boolean().default(false),
    userId: type.string().required(),
    os: type.string().required(),
    platform: type.string().required(),
    ip: type.string().required(),
    browser: type.string().required(),
    version: type.string().required(),
    source: type.string().required(),
    sessionId: type.string().default(""),
    deviceId: type.string().default(""),
    socketId: type.string().default(""),
});

const User = require("./user");

Browser.belongsTo(User, "user", "userId", "id");

module.exports = Browser;