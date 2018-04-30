const config = require("./config");
const request = require('request');
const Promise = require("bluebird");
const urlencode = require('urlencode');

module.exports = {
  getRecentMedia: (tag, max = 3) => new Promise((resolve, rejected) => {
    const url = "https://api.instagram.com/v1/tags/" + urlencode(tag) + "/media/recent?access_token=" + config.instagram.accessToken;
    request.get(url, (error, response, body) => {
      if (error) {
        rejected(error);
      }
      const dd = JSON.parse(body);
      try {
        let shortData;
        if (dd.data.length > max) {
          shortData = dd.data.slice(0, max);
        }
        else {
          shortData = dd.data;
        }
        const doc = shortData.map(data => {
          let text = data.caption.text;
          const pos = text.indexOf("#");
          if (pos > 0) {
            text = text.substr(0, pos);
          }

          if (text.length > 18) {
            text = text.substr(0, 18) + "...";
          }
          // text = text.replace(/\n/gi, "<br/>");

          let tags = "";
          for (tag in data.tags) {
            if (!!data.tags[tag]) {
              tags += "#" + data.tags[tag];
            }

          }
          if (tags.length > 18) {
            tags = tags.substr(0, 18) + "...";
          }
          return {
            image: data.images.low_resolution,
            text: text,
            tags: tags,
            link: data.link,
            username: data.user.username,
            userphoto: data.user.profile_picture
          };
        });
        resolve(doc);
      }
      catch (err) {
        resolve({});
      }

    })

  }),
  getAccessCode: () => new Promise((resolve, rejected) => {
    //step1
    //https://api.instagram.com/oauth/authorize/?client_id=4f10083715174017aa174c78fe91eb29&redirect_uri=https://hapoom.co&response_type=code&scope=basic+public_content+follower_list+comments+relationships+likes

    const url = "https://api.instagram.com/oauth/access_token";
    const form = {
      client_id: "4f10083715174017aa174c78fe91eb29",
      client_secret: "d313fc5ff0624e5585fc4090d418abb7",
      grant_type: "authorization_code",
      redirect_uri: "https://hapoom.co",
      code: "cde25eae6e2e4ab4aedb60b29ca5be41", //step2 code here
    };
    request.post({url: url, form: form}, (error, response, body) => {
      if (error) {
        rejected(error);
      }

      /*
      {
      "access_token": "fb2e77d.47a0479900504cb3ab4a1f626d174d2d",
      "user": {
        "id": "1574083",
        "username": "snoopdogg",
        "full_name": "Snoop Dogg",
        "profile_picture": "..."
        }
      }
       */
      const dd = JSON.parse(body);
      resolve(dd.access_token);
    })
  })
};
