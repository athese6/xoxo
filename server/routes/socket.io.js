const thinky = require("../../lib/thinky");
const r = thinky.r;
const services = require("../services");
const querys = require("../querys");
const models = require("../models");
const constants = require("../models/constants");
const Cache = services.Cache;
const {DBActionStatus, TeamMemberStatus, TransferType} = constants;

const getAction = doc => {
    if (doc.isSaved() === false) {
        return DBActionStatus.delete;
    } else if (doc.getOldValue() == null) {
        return DBActionStatus.new;
    } else {
        return DBActionStatus.update;
    }
};

module.exports = io => {
    // on user connect

    io.sockets.on("connection", socket => {
        socket.setMaxListeners(0);
        const {request} = socket;
        const {user} = request;
        if (user && user.id) {
            // messages
            // models.Message
            //     .filter(doc => r.and(doc("ready").eq(true), r.or(doc("receiverId").eq("all"), doc("receiverId").eq(user.id))))
            //     .changes()
            //     .then(feed => {
            //         socket.on('disconnect', () => feed.close());
            //         feed.each((error, message) => {
            //             if (!error) {
            //                 Cache.getConversationsIds(user.id).then(conversationsIds => {
            //                     if (conversationsIds.includes(message.conversationId)) {
            //                         if (getAction(message) === DBActionStatus.delete) {
            //                             socket.emit("conversation-delete-message", message);
            //                         } else {
            //                             let showMessage = true;
            //                             if (message.senderDeviceId.startsWith("bot")) {
            //                                 if (message.senderDeviceId === models.Constants.MessageNotificationType.leftTeam.id) {
            //                                     showMessage = !(message.text === user.id);
            //                                 }
            //                             }
            //
            //                             if (showMessage) {
            //                                 querys.Message.getMessage(message.id)
            //                                     .then(message => {
            //                                         socket.emit("conversation-message", message)
            //                                     });
            //                             }
            //                         }
            //                     }
            //                 });
            //             }
            //         });
            //     });
            // models.User.changes().then(feed => {
            //     socket.on('disconnect', () => feed.close());
            //     feed.each((error, doc) => {
            //         if (!error) {
            //             services.Auth.isOnline(user.id)
            //                 .then(isOnline => {
            //                     doc.isOnline = isOnline;
            //                     if (user.id === doc.id) {
            //                         socket.emit("user", doc.getView());
            //                     } else {
            //                         Cache.getConversationsIds(user.id).then(conversationsIds => {
            //                             Cache.getConversationsIds(doc.id).then(ids => {
            //                                 const id = conversationsIds.find(convId => ids.includes(convId));
            //                                 id && socket.emit("user", doc.getFriendView());
            //                             });
            //                         });
            //                     }
            //                 });
            //         }
            //     });
            // });
            //
            // models.Browser.changes().then(feed => {
            //     socket.on('disconnect', () => feed.close());
            //     feed.each((error, doc) => {
            //         if (!error) {
            //             models.User.filter({id: doc.userId}).run()
            //                 .then(getUser => {
            //                     return getUser[0] || {};
            //                 })
            //                 .then(getUser => {
            //                     if (!getUser)
            //                         return;
            //                     services.Auth.isOnline(getUser.id)
            //                         .then(isOnline => {
            //                             getUser.isOnline = isOnline;
            //                             if (user.id === getUser.id) {
            //                                 socket.emit("user", getUser.getView());
            //                             } else {
            //                                 Cache.getConversationsIds(user.id).then(conversationsIds => {
            //                                     Cache.getConversationsIds(getUser.id).then(ids => {
            //                                         const id = conversationsIds.find(convId => ids.includes(convId));
            //                                         id && socket.emit("user", getUser.getFriendView());
            //                                     });
            //                                 });
            //                             }
            //                         });
            //                 })
            //
            //         }
            //     });
            // });
            //
            //
            // models.Team.changes().then(feed => {
            //     socket.on('disconnect', () => feed.close());
            //     feed.each((error, team) => {
            //         if (!error) {
            //             if (getAction(team) === DBActionStatus.update) {
            //                 Cache.getTeamIds(user.id).then(teamsIds => {
            //                     if (teamsIds.includes(team.id)) {
            //                         socket.emit("onupdate-team", team);
            //                     }
            //                 });
            //             }
            //         }
            //     });
            // });
            //
            // models.TeamMember.changes().then(feed => {
            //     socket.on('disconnect', () => feed.close());
            //     feed.each((error, member) => {
            //         if (!error) {
            //
            //             Cache.getTeamIds(user.id).then(teamsIds => {
            //                 if (teamsIds.includes(member.teamId)) {
            //                     services.Home.getHome(user.id).then(home => {
            //                         services.Team.getTeam(user.id, member.teamId).then(team => socket.emit("home", {
            //                             home: home,
            //                             team: team,
            //                             member: member,
            //                             isJoin: member.getOldValue() && member.getOldValue().status === TeamMemberStatus.pending && member.status === TeamMemberStatus.accepted
            //                         }))
            //                     });
            //                 }
            //             });
            //
            //         }
            //     });
            // });
            // /*
            //  models.UserFriend.changes().then(feed => {
            //  socket.on('disconnect', () => feed.close());
            //  feed.each((error, doc) => {
            //  if (!error) {
            //  if (doc.userId === user.id) {
            //  models.UserFriend
            //  .get(doc.id)
            //  .getJoin({friend: {_apply: seq => seq.getFriendView()}})
            //  .then(userFriend => {
            //  userFriend.email = userFriend.friend.email;
            //  userFriend.name = userFriend.friend.name || userFriend.friend.email;
            //  userFriend.photo = userFriend.friend.photo;
            //  userFriend.id = userFriend.friend.id;
            //  delete userFriend.userId;
            //  delete userFriend.friendId;
            //  delete userFriend.friend;
            //  return userFriend;
            //  })
            //  .then(friend => socket.emit("friend", friend));
            //  }
            //  }
            //  });
            //  });
            //  */
            //
            // models.Conversation.changes().then(feed => {
            //     socket.on('disconnect', () => feed.close());
            //     feed.each((error, conversation) => {
            //         if (!error) {
            //             if (getAction(conversation) === DBActionStatus.update) {
            //                 if (conversation.getOldValue.updatedMemberAt !== conversation.updatedMemberAt) {
            //
            //                     Cache.getConversationsIds(user.id).then(conversationsIds => {
            //                         if (conversationsIds.includes(conversation.id)) {
            //                             models.Conversation.get(conversation.id).then(conversation => {
            //                                 services.Team.getTeam(user.id, conversation.teamId).then(team => {
            //                                     conversation = team.conversations.find(conv => conv.id === conversation.id);
            //                                     conversation && socket.emit("team-conversation", conversation);
            //                                 });
            //                             });
            //                             services.Conversation.getConversation(user.id, conversation.teamId, conversation.id).then(conv => {
            //                                 socket.emit("onchange-conversation", conv);
            //                             });
            //                         }
            //                     });
            //
            //                 } else {
            //                     Cache.getConversationsIds(user.id).then(conversationsIds => {
            //                         if (conversationsIds.includes(conversation.id)) {
            //                             socket.emit("onupdate-conversation", conversation);
            //                             // services.Conversation.getConversation(user.id, conversation.teamId, conversation.id)
            //                             //     .then(conversation => socket.emit("onupdate-conversation", conversation))
            //                         }
            //                     });
            //                 }
            //             }
            //         }
            //     });
            // });
            //
            // models.ConversationMember.changes().then(feed => {
            //     socket.on('disconnect', () => feed.close());
            //     feed.each((error, member) => {
            //         if (!error) {
            //             //when add friend or add new conversation (direct message)
            //             const conversationId = member.conversationId;
            //             const userId = member.userId;
            //             if (user.id === userId) {
            //                 const action = getAction(member);
            //                 if (action === DBActionStatus.new) {
            //                     //TODO: improve speed (make 1 query)
            //                     models.Conversation.get(conversationId).then(conversation => {
            //                         services.Team.getTeam(user.id, conversation.teamId).then(team => {
            //                             conversation = team.conversations.find(conv => conv.id === conversation.id);
            //                             conversation && socket.emit("team-conversation", conversation);
            //                         });
            //                     });
            //                 }
            //                 else if (action === DBActionStatus.update) {
            //                     if (member.getOldValue().unread !== member.unread) {
            //                         socket.emit("update-unread", {newValue: member, oldValue: member.getOldValue()});
            //                     }
            //                 }
            //                 else if (action === DBActionStatus.delete) {
            //                     socket.emit("delete-conversation", member);
            //                     querys.ConversationMember.getAllUnreadCounts(user.id)
            //                         .then(doc => {
            //                             socket.emit("update-unread-all", {userId: user.id, unread: doc});
            //                         })
            //                 }
            //
            //             }
            //         }
            //     });
            // });
            //
            // models.Device.changes().then(feed => {
            //     socket.on('disconnect', () => feed.close());
            //     feed.each((error, doc) => {
            //         if (!error) {
            //             if (doc.isOnline) {
            //                 console.log(doc.name + " connected (" + doc.id + ")");
            //             } else {
            //                 console.log(doc.name + " disconnected (" + doc.id + ")");
            //             }
            //             if (user.id === doc.userId) {
            //                 socket.emit("device", doc);
            //             } else {
            //                 Cache.getConversationsIds(user.id).then(conversationsIds => {
            //                     Cache.getConversationsIds(doc.userId).then(ids => {
            //                         const id = conversationsIds.find(convId => ids.includes(convId));
            //                         id && socket.emit("device", doc);
            //                     });
            //                 });
            //             }
            //         }
            //     });
            // });
            //
            // models.TeamTransmission.changes().then(feed => {
            //     socket.on('disconnect', () => feed.close());
            //     feed.each((error, doc) => {
            //         if (!error) {
            //             if (doc.transferType === TransferType.upload) {
            //
            //             } else {
            //                 Cache.getTeamIds(user.id).then(teamsIds => {
            //                     if (teamsIds.includes(doc.teamId)) {
            //                         services.Team.getTeam(user.id, doc.teamId)
            //                             .then(team => {
            //                                 socket.emit("onupdate-team-transmission", team);
            //                             });
            //                     }
            //                 });
            //             }
            //
            //         }
            //     })
            // });

            socket.on('disconnect', () => {
                // clear any cache
                // Cache.clear(user.id);
                // console.log(`user ${user.email} disconnected :(`);
                // console.log(request);
                services.Auth.updateBrowser(user.id, request.useragent, request.clientIp, request.sessionID, false, "", "")
                    .catch(error => {
                        // console.log(error);
                    });
            });

            // console.log(`user ${user.email} connected :)`);
            // querys.ConversationMember.getAllUnreadCounts(user.id)
            //     .then(doc => {
            //         socket.emit("update-unread-all", {userId: user.id, unread: doc});
            //     })
            //     .catch(error => {
            //         // console.log(error);
            //     });
            services.Auth.updateBrowser(user.id, request.useragent, request.clientIp, request.sessionID, true, socket.id, "")
                .catch(error => {
                    // console.log(error);
                });
        }
    });
};