const express = require('express');
const router = express.Router();
const i18n = require('../../../../lib/i18n');
// const services = require("../../../services");
const passport = require('passport');


router.get('/kakao', passport.authenticate('kakao'));

router.get('/kakao/callback',
  passport.authenticate('kakao', {
    successRedirect: '/',
    failureRedirect: '/',
  })
);


router.get('/facebook', passport.authenticate('facebook', {
  authType: 'rerequest',
  scope: ['email', 'public_profile']
}));

router.get('/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/',
  })
);

// router.get('/facebook/callback', function (req, res, next) {
//         passport.authenticate('facebook', function (err, user, info) {
//             if (err) {
//                 return next(err);
//             }
//             if (!user) {
//                 return res.redirect('/login');
//             }
//             req.logIn(user, function (err) {
//                 if (err) {
//                     return next(err);
//                 }
//                 return res.redirect('/login');
//             });
//         })(req, res, next);
//     }
// );

// router.get('/facebook/callback',
//     passport.authenticate('facebook', {
//         successRedirect: '/login',
//         failureRedirect: '/login',
//     }, (error, user) => {
//
//         console.log(user);
//     })
// );

router.get('/naver', passport.authenticate('naver'));

router.get('/naver/callback',
  passport.authenticate('naver', {
    successRedirect: '/',
    failureRedirect: '/',
  })
);

router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'openid', 'email']
}));

router.get('/google/callback',
  passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/',
  })
);


router.get('/instagram', passport.authenticate('instagram'));

router.get('/instagram/callback',
  passport.authenticate('instagram', {
    successRedirect: '/',
    failureRedirect: '/',
  })
);
module.exports = router;
