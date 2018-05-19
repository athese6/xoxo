const Promise = require("bluebird");
const models = require("../models");
// const file = require("./file");
const thinky = require("../../lib/thinky");
const ioredis = require("../../lib/ioredis");
const r = thinky.r;

// const getTeamIds = userId => models.TeamMember
//     .filter({userId: userId})
//     .map(r.row("teamId"))
//     .execute();
//
// const getConversationsIds = userId => models.ConversationMember
//     .filter({userId: userId})
//     .map(r.row("conversationId"))
//     .execute();
//
const getUser = userId => models.User
    .get(userId)
    // .getJoin({friends: {friend: true}})
    .run();
//
// const getTeamMember = (teamId, userId) => models.TeamMember
//     .filter({teamId: teamId, userId: userId})
//     .run()
//     .then(member => member[0]);

const service = {
    // getConversationsIds: userId => new Promise((resolve, reject) => {
    //     if (ioredis.enabled) {
    //         const client = ioredis.getClient("conversationsIds");
    //         client.get(userId, (error, data) => {
    //             if (data) {
    //                 const ids = JSON.parse(data);
    //                 resolve(ids);
    //             } else {
    //                 getConversationsIds(userId).then(ids => {
    //                     // add to cache
    //                     if (ioredis.enabled) {
    //                         client.set(userId, JSON.stringify(ids));
    //                         return ids;
    //                     }
    //                 }).then(resolve).catch(reject);
    //             }
    //         });
    //     } else {
    //         return getConversationsIds(userId).then(resolve).catch(reject);
    //     }
    // }),
    // deleteConversationsIds: userId => {
    //     if (ioredis.enabled) {
    //         const client = ioredis.getClient("conversationsIds");
    //         client.del(userId);
    //     }
    // },
    // getTeamIds: userId => new Promise((resolve, reject) => {
    //     if (ioredis.enabled) {
    //         const client = ioredis.getClient("teamsIds");
    //         client.get(userId, (error, data) => {
    //             if (data) {
    //                 const ids = JSON.parse(data);
    //                 resolve(ids);
    //             } else {
    //                 getTeamIds(userId).then(ids => {
    //                     // add to cache
    //                     client.set(userId, JSON.stringify(ids));
    //                     return ids;
    //                 }).then(resolve).catch(reject);
    //             }
    //         });
    //     } else {
    //         return getTeamIds(userId).then(resolve).catch(reject);
    //     }
    // }),
    // deleteTeamIds: userId => {
    //     if (ioredis.enabled) {
    //         const client = ioredis.getClient("teamsIds");
    //         client.del(userId);
    //     }
    // },
    getUser: userId => new Promise((resolve, reject) => {
        if (ioredis.enabled) {
            let users = ioredis.getClient("users");
            users.get(userId, (error, data) => {
                if (data) {
                    resolve(new models.User(JSON.parse(data)));
                } else {
                    getUser(userId).then(user => {
                        // set in cache
                        users.set(user.id, JSON.stringify(user));
                        return user;
                    }).then(resolve).catch(reject);
                }
            });
        } else {
            // get from database
            return getUser(userId).then(resolve).catch(reject);
        }
    }),
    deleteUser: userId => {
        if (ioredis.enabled) {
            const users = ioredis.getClient("users");
            users.del(userId);
        }
    },
    // setTeamMember: (teamMember) => new Promise((resolve, reject) => {
    //     if (ioredis.enabled) {
    //         let teamMembers = ioredis.getClient("teamMembers");
    //         teamMembers.set(teamMember.userId + teamMember.teamId, JSON.stringify(teamMember));
    //     }
    // }),
    // getTeamMember: (teamId, userId) => new Promise((resolve, reject) => {
    //     if (ioredis.enabled) {
    //         let teamMembers = ioredis.getClient("teamMembers");
    //         teamMembers.get(teamId, userId, (error, data) => {
    //             if (data) {
    //                 resolve(new models.TeamMember(JSON.parse(data)));
    //             } else {
    //                 getTeamMember(teamId, userId).then(teamMember => {
    //                     // set in cache
    //                     teamMembers.set(userId + teamId, JSON.stringify(teamMember));
    //                     return teamMember;
    //                 }).then(resolve).catch(reject);
    //             }
    //         });
    //     } else {
    //         // get from database
    //         return getTeamMember(teamId, userId).then(resolve).catch(reject);
    //     }
    // }),
    // deleteTeamMember: (userId) => {
    //     if (ioredis.enabled) {
    //         const teamMembers = ioredis.getClient("teamMembers");
    //         teamMembers.keys(`teamMembers:${userId}*`).then(keys => {
    //             keys.forEach(key => {
    //                 teamMembers.del(key.slice(12));
    //             });
    //
    //         });
    //     }
    // },
    // clear: userId => {
    //     service.deleteTeamIds(userId);
    //     service.deleteConversationsIds(userId);
    //     service.deleteUser(userId);
    //     service.deleteTeamMember(userId);
    // }
};

module.exports = service;