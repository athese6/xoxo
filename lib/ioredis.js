const Redis = require('ioredis');
const ConnectRedis = require('connect-redis');
const config = require("./config");
const override = require("json-override");
const clients = {};

function createClient(name, session) {
    let client;
    const redis_config = override({}, config.ioredis, true);
    redis_config.keyPrefix = name + ":";
    client = new Redis(redis_config);
    client.on('error', msg => console.log("Redis Client[" + name + "]: " + msg));
    client.on('connect', () => console.log("Redis Client[" + name + "]: Connected"));
    if (session) {
        const RedisStore = ConnectRedis(session);
        client = new RedisStore({client: client});
    }
    return client;
}

module.exports = {
    enabled: config.ioredis.enable,
    getSessionStore: session => {
        let client = clients["sessions"];
        if (!client) {
            client = clients["sessions"] = createClient("sessions", session);
        }
        return client;
    },
    getClient: name => {
        let client = clients[name];
        if (!client) {
            client = clients[name] = createClient(name);
        }
        return client;
    }
};