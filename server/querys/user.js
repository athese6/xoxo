const Promise = require("bluebird");
const models = require("../models");
const thinky = require("../../lib/thinky");
const r = thinky.r;
const util = require("./util");

const query = {
  getAll: filter => models.User
    .filter(!filter ? {} : filter)
    .orderBy(r.asc("name"))
    .execute(),
  getAllWithRoom: filter => models.User
    .filter(util.userFilter(filter))
    .getJoin({
      asset: true,
      room: true,
      price: true
    })
    .filter(util.roomFilter(filter, true))
    .orderBy(r.asc("name"))
    .execute(),
  isExistEmail: email => models.User.filter({email: email})
    .execute()
    .then(user => user && user.length > 0)
    .catch(error => false),
  getUser: email => models.User.filter({email: email})
    .execute()
    .then(user => user && user.length > 0 ? user[0] : undefined),
  createNewUser: user => new models.User(user).saveAll(),
};

module.exports = query;
