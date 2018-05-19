const thinky = require("../../lib/thinky");
const r = thinky.r;

const filter = {
  userFilter: (filter) => {
    if (filter) {
      let filterArray = [];
      if (!!filter.gender) {
        filterArray.push(r.row("gender").eq(filter.gender));
      }
      if (!!filter.email) {
        filterArray.push(r.row("email").match(filter.email));
      }
      if (!!filter.name) {
        filterArray.push(r.row("name").match(filter.name));
      }
      if (filterArray.length > 0)
        return r.and(...filterArray);

      // if (!!filter.gender) {
      //   if (!!filter.email)
      //     return user => r.and(user("name").match(!!filter.name ? filter.name : ""), user("email").match(filter.email), user("gender").eq(filter.gender));
      //   else
      //     return user => r.and(user("name").match(!!filter.name ? filter.name : ""), user("gender").eq(filter.gender));
      // }
      // else {
      //   if (!!filter.email)
      //     return user => r.and(user("name").match(!!filter.name ? filter.name : ""), user("email").match(filter.email));
      //   else
      //     return user => r.and(user("name").match(!!filter.name ? filter.name : ""));
      // }
    }
    return {};
  },
  roomFilter: (filter, isJoined = false) => {
    if (filter) {
      // let room = {};
      // if (!!filter.house_number) {
      //   room.house_number = parseInt(filter.house_number);
      // }
      // if (!!filter.type) {
      //   room.type = parseInt(filter.type);
      // }
      // return {room: room};
      let filterArray = [];
      if (!!filter.house_number) {
        if (isJoined)
          filterArray.push(r.row("room")("house_number").eq(parseInt(filter.house_number)));
        else
          filterArray.push(r.row("house_number").eq(parseInt(filter.house_number)));
      }
      if (!!filter.room_name) {
        if (isJoined)
          filterArray.push(r.row("room")("name").eq(filter.room_name));
        else
          filterArray.push(r.row("name").eq(filter.room_name));
      }
      if (!!filter.type) {
        if (isJoined)
          filterArray.push(r.row("room")("type").eq(parseInt(filter.type)));
        else
          filterArray.push(r.row("type").eq(parseInt(filter.type)));
      }
      if (!!filter.gender) {
        if (isJoined)
          filterArray.push(r.row("room")("gender").eq(filter.gender));
        else
          filterArray.push(r.row("gender").eq(filter.gender));
      }
      if (filterArray.length > 0)
        return r.and(...filterArray);
    }
    return {};
  }
};
module.exports = filter;
