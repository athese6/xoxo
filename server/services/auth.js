const Promise = require("bluebird");
// const uuid = require("uuid");
const cache = require("./cache");
const models = require("../models");
// const crypt = require("../lib/crypt");
const config = require("../../lib/config");
const thinky = require("../../lib/thinky");
const r = thinky.r;
const querys = require("../querys");
const moment = require("moment");
const utils = require("../../lib/utils");
// const validation = require("../lib/validation");
// const homeService = require("./home");
// const conversationService = require("./conversation");
// const unsubscribe = require('../lib/unsubscribe');

const service = {
  isOnline: userId => models.Browser
    .filter({userId: userId, isOnline: true})
    .limit(1)
    .count()
    .execute()
    .then(num => num > 0),
  getBrowser: (userId, os, platform, clientIp, browser, version, source) => models.Browser
    .filter({
      userId: userId,
      os: os,
      platform: platform,
      ip: clientIp,
      browser: browser,
      version: version,
      source: source
    })
    .orderBy(r.desc("modifiedAt")).limit(1)
    .run()
    .then(browser => {
      if (browser && browser[0]) {
        return browser[0];
      }
      return {};
    }),
  updateBrowser: (userId, useragent, clientIp, sessionId, online, socketId = "", deviceId = "") => {
    const {os, platform, browser, version, source} = useragent;
    return service.getBrowser(userId, os, platform, clientIp, browser, version, source)
      .then(doc => {
        if (!!doc.id) {
          doc.modifiedAt = new Date();
          doc.isOnline = online;
          doc.sessionId = sessionId;
          doc.deviceId = deviceId;
          doc.socketId = socketId;
          return doc.save({conflict: "update"});
        } else {
          const newDoc = {
            modifiedAt: new Date(),
            userId: userId,
            os: os,
            platform: platform,
            ip: clientIp,
            browser: browser,
            version: version,
            source: source,
            sessionId: sessionId,
            deviceId: deviceId,
            isOnline: online,
            socketId: socketId
          };
          return new models.Browser(newDoc).save({conflict: "update"});
        }
      })
  },
  // changeLanguage: user => new Promise((resolve, reject) => {
  //     models.User.get(user.id).run()
  //         .then(getUser => {
  //             if (getUser) {
  //                 return getUser.merge({"lang": user.lang}).save({conflict: "update"})
  //             }
  //             let error = new models.Error();
  //             error.push("user is not registered.", "user");
  //             reject(error);
  //         })
  //         .then(user => {
  //             cache.deleteUser(user.id);
  //             return resolve(user.lang);
  //         })
  //         .catch(reject);
  // }),

  connectFacebook: profile => new Promise((resolve, reject) => {
    let facebook_profile = service.parseFacebookProfile(profile);

    return service.getUser(facebook_profile.email)
      .then(user => {
        if (user) {
          return resolve(user);
        }
        else {
          return querys.User.createNewUser(facebook_profile)
            .then(user => resolve(user))
        }

      })
    // models.User
    //     .filter({facebookId: facebook_profile.id})
    //     .run()
    //     .then(users => {
    //         // if found update else create new one
    //         new models.User({name:facebook_profile.name})
    //
    //         let user = users.length ? users[0] : new models.User();
    //         user.name = facebook_profile.name;
    //         user.email = facebook_profile.email;
    //         user.facebookId = facebook_profile.id + "";
    //         user.lang = lang;
    //         user.photo = facebook_profile.picture;
    //         user.save().then(user => {
    //             if (user) {
    //                 return resolve(user);
    //             }
    //             return reject(new models.Error("Facebook login failed. Please try again."));
    //         }).catch(error => {
    //             console.log(error);
    //             return reject(new models.Error(config.app.default_error_message));
    //         });
    //     }).catch(error => {
    //     console.log(error);
    //     return reject(new models.Error(config.app.default_error_message));
    // });
  }),
  parseFacebookProfile: profile => {
    let data = profile._json;
    if ("string" === typeof data) {
      data = JSON.parse(data);
    }
    data.name = (!!data.name || data.name) || (data.first_name + " " + data.last_name);
    data.photo = "http://graph.facebook.com/" + data.id + "/picture?type=large";
    data.lang = data.locale.split("_")[0];
    return {
      name: data.name,
      gender: data.gender,
      facebookLink: data.link,
      email: data.email,
      photo: data.photo,
      lang: data.lang
    };
  },
  connectKakao: profile => new Promise((resolve, reject) => {
    return resolve(profile);
  }),
  connectGoogle: profile => new Promise((resolve, reject) => {
    return resolve(profile);
  }),
  connectNaver: profile => new Promise((resolve, reject) => {
    return resolve(profile);
  }),
  connectInstagram: profile => new Promise((resolve, reject) => {
    return resolve(profile);
  }),
  isExistEmail: email => querys.User.isExistEmail(email),
  getUser: email => querys.User.getUser(email),
  createNewSubscription: data => {
    return service.getUser(data.email)
      .then(user => {
        if (user) {
          if (user.registered) {
            return user;
          } else {
            delete data.email;
            return user.merge(data).save({conflict: "update"})
          }
        }
        else {
          return querys.User.createNewUser(data)
            .then(user => {
              return user;
            })
        }

      })
  },
  getUsers: filter => Promise.all([
    querys.User.getAllWithRoom(filter),
    querys.Room.getNames(filter),
    querys.Room.getTypes(filter),
    querys.Room.getGenders(filter),
    querys.Room.getHouseNumbers(filter),
  ])
    .then(promises => {
      return {
        users: promises[0].map(user => {
          user.start = utils.changeDateFormat(user.start);
          user.end = utils.changeDateFormat(user.end);
          user.deletedAt = utils.changeDateFormat(user.deletedAt);
          return user;
        }),
        roomNames: promises[1],
        roomTypes: promises[2],
        roomGenders: promises[3],
        roomHouseNumbers: promises[4],
      };
    }),
  addUser: (user) => querys.User.createNewUser(user)
};

module.exports = service;
