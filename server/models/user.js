const uuid = require("uuid");
const {Payment, Limitations, Prefix, UserRole, Gender, Subscription} = require("./constants");
const config = require("../../lib/config");
const thinky = require("../../lib/thinky");
const type = thinky.type;
const r = thinky.r;

const User = thinky.createModel("User", {
  id: type.string().default(function () {
    return Prefix.User + uuid.v1().toLowerCase();
  }),
  modifiedAt: type.date().default(function () {
    return new Date();
  }),
  createdAt: type.date().default(function () {
    return new Date();
  }),
  persnalNo: type.string(),
  registered: type.boolean().default(false),
  email: type.string().email().max(35),
  name: type.string().min(2).max(30),
  gender: type.string().enum(Object.keys(Gender)).default(Gender.male),
  subscription: type.string().enum(Object.keys(Subscription)).default(Subscription.all),
  facebookLink: type.string().default(""),
  instagramLink: type.string().default(""),
  lang: type.string().default("ko"),
  role: type.string().enum(Object.keys(UserRole)).default(function () {
    if (config.admins.includes(this.email)) {
      return UserRole.admin;
    }
    return UserRole.guest;
  }),
  photo: type.string().default(""),
  phone: type.string().default(""),
  deletedAt: type.date(),
  start: type.date(),
  end: type.date(),
  memo: type.string(),
  deposit: type.number(),
  discount_with_deposit: type.number(),
  monthly_fees: type.number(),
  isExist: type.virtual(),
  isOnline: type.virtual()
});

User.defineStatic("getView", function () {
  return this.without("password");
});

User.define("getView", function () {
  let user = Object.assign({}, this);
  delete user.password;
  return user;
});
//
const friendViewFields = ['id', 'createdAt', 'name', 'email', 'photo', 'gender', 'confirmedAt', 'registered', 'isOnline', "role"];
// User.defineStatic("getFriendView", function () {
//     return this.pluck(...friendViewFields);
// });

// User.define("getFriendView", function () {
//     let user = {};
//     friendViewFields.forEach(key => user[key] = this[key]);
//     return user;
// });

// User.define("getEmail", function () {
//     return {email: this.email};
// });
//
// User.define("getSmall", function () {
//     return {id: this.id, email: this.email};
// });

User.table = function () {
  return r.table(this.getTableName());
};

module.exports = User;
