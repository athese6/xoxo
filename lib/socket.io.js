const socket_io = require("socket.io");
const io_events = require("../server/routes/socket.io");
let io, middleware = [];

const lib = {
    io: () => io,
    init: server => {
        // init server
        io = socket_io(server);
        // attach middleware
        middleware.forEach(fun => io.use(fun));
        // save socket id inside session (redis)
        io.sockets.on("connection", socket => {
            socket.request.session.ioId = socket.id;
            socket.request.session.save();
        });
        // attach events
        io_events(io);
    },
    // create socket io middleware from express middleware
    use: fun => middleware.push((socket, next) => {
        if (socket.request.res && !socket.request.res.locals) {
            socket.request.res.locals = {};
        }
        return fun(socket.request, socket.request.res, next)
    }),
    socket: ioId => io ? io.sockets.sockets[ioId] : undefined
};

module.exports = lib;