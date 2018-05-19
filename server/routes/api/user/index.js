const express = require('express');
const router = express.Router();
const i18n = require('../../../../lib/i18n');
const services = require("../../../services");
const uuid = require("uuid");
const config = require("../../../../lib/config");

router.post('/change-language', (req, res, next) => {
  let user = {
    id: (req.user && req.user.id) || "",
    lang: (req.body.lang || "").trim(),
  };

  res.setLocale(user.lang);
  res.cookie(config.i18n.cookie, user.lang);
  return res.json({lang: user.lang, translations: i18n.getCatalog(user.lang)});
  // services.Auth
  //     .changeLanguage(user)
  //     .then(lang => {
  //         res.setLocale(lang);
  //         return res.json({lang: lang, translations: i18n.getCatalog(lang)});
  //     })
  //     .catch(next);
});


router.post('/login', (req, res, next) => {
  services.Passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/user/login'
  }, (error, user) => {
    if (error || !user) {
      return next(error);
    }
    return req.logIn(user, err => {
      if (err) {
        return next(err);
      } else {
        // if (data.remember) {
        //     req.session.cookie.maxAge = config.session.cookie.rememberMe; // Cookie expires after 1 year
        // } else {
        //     req.session.cookie.maxAge = config.session.cookie.maxAge; // Cookie expires after 1 day
        // }
        // req.setLocale(req.user.lang);

        return res.json({user: req.user, translations: i18n.getCatalog(req)});
      }
    });
  });
});


router.post('/logout', (req, res, next) => {
  req.session.destroy();
  req.logout();
  return res.send("true");
});

router.post('/subscription', (req, res, next) => {
  let user = {
    email: (req.body.email || "").trim(),
    lang: (req.body.lang || req.language || config.i18n.defaultLocale).trim(),
    subscription: req.body.subscription,
    phone: req.body.phone,
    gender: req.body.gender
  };

  return services.Auth.createNewSubscription(user)
    .then(user => res.json({user: user}))
    .catch(error => {
      return res.json({user: {lang: user.lang}, error: error})
    })
});

router.post('/get-users', (req, res, next) => {
  return services.Auth.getUsers(req.body.filter)
    .then(data => {
      data.uuid = uuid.v1();
      return res.json(data)
    })
    .catch(error => {
      return res.json({error: error})
    })
});

router.post('/add-user', (req, res, next) => {
  return services.Auth.addUser(req.body.data)
    .then(user => res.json({success: true}))
    .catch(error => {
      return res.json({error: error})
    })
});

module.exports = router;
