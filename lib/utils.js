const moment = require("moment");

const lib = {
  isEmail: email => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  },
  changeDateFormat: (date, format) => {
    if (!!date && !!format)
      return moment(date).format(format);
    if (!!date) {
      return moment(date).format("YYYY/MM/DD");
    }
    return "";
  }

};
module.exports = lib;
