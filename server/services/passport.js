const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const KakaoStrategy = require('passport-kakao').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const NaverStrategy = require('passport-naver').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const InstagramStrategy = require('passport-instagram').Strategy;
// const TwitterStrategy = require('passport-twitter').Strategy;
// const SlackStrategy = require('passport-slack').Strategy;
const cache = require("./cache");
const AuthService = require("./auth");
// const models = require("../models/index");
// const crypt = require('../lib/crypt');
const config = require('../../lib/config');

module.exports = function () {
    passport.serializeUser(function (user, done) {
        return done(null, user.id);
    });

    passport.deserializeUser(function (userId, done) {
        return cache.getUser(userId)
            .then(function (user) {
                return done(null, user);
            })
            .catch(function (error) {
                console.log(error);
                return done(null, false);
            });
    });

    // passport.serializeUser(function (user, cb) {
    //     cb(null, user);
    // });
    //
    // passport.deserializeUser(function (obj, cb) {
    //     cb(null, obj);
    // });

    // passport.use(new LocalStrategy(config.passport.local, function (phone, password, done) {
    //     return done("테스트");
    //     // AuthService.login({phone: phone, password: password}).then(function (user) {
    //     //     return done(null, user);
    //     // }).catch(function (error) {
    //     //     return done(error, false);
    //     // });
    // }));

    passport.use(new KakaoStrategy({
            clientID: config.passport.kakao.clientID,
            clientSecret: config.passport.kakao.clientSecret,
            callbackURL: config.getContextName() + config.passport.kakao.callbackURL
        },
        function (accessToken, refreshToken, profile, done) {
            AuthService.connectKakao(profile).then(function (user) {
                return done(false, user);
            }).catch(function (error) {
                return done(error, false);
            });
        }
    ));

    passport.use(new FacebookStrategy({
            clientID: config.passport.facebook.clientID,
            clientSecret: config.passport.facebook.clientSecret,
            callbackURL: config.getContextName() + config.passport.facebook.callbackURL,
            profileFields: config.passport.facebook.profileFields
        },
        function (accessToken, refreshToken, profile, done) {
            AuthService.connectFacebook(profile)
                .then(function (user) {
                    return done(false, user);
                })
                .catch(function (error) {
                    return done(error, false);
                });
        }
    ));

    passport.use(new NaverStrategy({
            clientID: config.passport.naver.clientID,
            clientSecret: config.passport.naver.clientSecret,
            callbackURL: config.getContextName() + config.passport.naver.callbackURL,
            svcType: 0,
            authType: 'reauthenticate'
        },
        function (accessToken, refreshToken, profile, done) {
            AuthService.connectNaver(profile).then(function (user) {
                return done(false, user);
            }).catch(function (error) {
                return done(error, false);
            });
        }
    ));


    passport.use(new GoogleStrategy({
            clientID: config.passport.google.clientID,
            clientSecret: config.passport.google.clientSecret,
            callbackURL: config.getContextName() + config.passport.google.callbackURL
        },
        function (accessToken, refreshToken, profile, done) {
            AuthService.connectGoogle(profile).then(function (user) {
                return done(false, user);
            }).catch(function (error) {
                return done(error, false);
            });
        }
    ));

    passport.use(new InstagramStrategy({
            clientID: config.passport.instagram.clientID,
            clientSecret: config.passport.instagram.clientSecret,
            callbackURL: config.getContextName() + config.passport.instagram.callbackURL
        },
        function (accessToken, refreshToken, profile, done) {
            AuthService.connectInstagram(profile).then(function (user) {
                return done(false, user);
            }).catch(function (error) {
                return done(error, false);
            });
        }
    ));

    //
    // passport.use(new TwitterStrategy({
    //         consumerKey: config.passport.twitter.consumerKey,
    //         consumerSecret: config.passport.twitter.consumerSecret,
    //         callbackURL: config.getContextName() + config.passport.twitter.callbackURL
    //     },
    //     function (accessToken, refreshToken, profile, done) {
    //         AuthService.connectTwitter(profile).then(function (user) {
    //             return done(false, user);
    //         }).catch(function (error) {
    //             return done(error, false);
    //         });
    //     }
    // ));
    //
    // passport.use(new SlackStrategy({
    //         clientID: config.passport.slack.clientID,
    //         clientSecret: config.passport.slack.clientSecret,
    //         callbackURL: config.getContextName() + config.passport.slack.callbackURL,
    //         scope: "users:read"
    //     },
    //     function (accessToken, refreshToken, profile, done) {
    //         AuthService.connectSlack(profile).then(function (user) {
    //             return done(false, user);
    //         }).catch(function (error) {
    //             return done(error, false);
    //         });
    //     }
    // ));

    return passport;
};