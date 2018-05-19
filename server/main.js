const webpack = require('webpack');
const debug = require('debug')('hapoom:server');
const http = require('http');
const https = require('https');
const fs = require('fs');
const app = require('./app');
const config = require('../lib/config');
// const app_config = config.app;
// const ssl_config = config.ssl;

// const app = express();


/**
 * Create HTTP server.
 */
let server = http.createServer(app);
server.on('error', onError);

const ssl_config = config.ssl;
let https_server;

if (ssl_config.enable) {
    const key = fs.readFileSync(ssl_config.key, 'utf8');
    const cert = fs.readFileSync(ssl_config.cert, 'utf8');
    const ca1 = fs.readFileSync(ssl_config.ca[0], 'utf8');
    const ca2 = fs.readFileSync(ssl_config.ca[1], 'utf8');
    // const ca3 = fs.readFileSync(ssl_config.ca[2], 'utf8');
    //
    https_server = https.createServer({
        "key": key,
        "cert": cert,
        "ca": [ca1, ca2]
    }, app);
    // https_server = https.createServer({
    //     "passphrase": ssl_config.passphrase,
    //     "key": key,
    //     "cert": cert,
    //     "ca": [ca1, ca2, ca3]
    // }, app);
    https_server.on('error', onError);
    https_server.on('listening', onListening);
}


// if (process.env.NODE_ENV == 'development') {
//     console.log('Server is running on development mode');
//
//     const config = require('../webpack.dev.config');
//     let compiler = webpack(config);
//     let devServer = new WebpackDevServer(compiler, config.devServer);
//     devServer.listen(8001, () => {
//         console.log('webpack-dev-server is listening on port', 8001);
//     });
// }

// setup socket.io server
// socket_io.init(https_server || server);

// start listening
server && server.listen(config.app.port);
https_server && https_server.listen(config.ssl.port);

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const address = this.address ? this.address() : {};
    const bind = address ? (typeof address === 'string' ? 'pipe ' + address : 'port ' + address.port) : "";

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    const address = this.address ? this.address() : {};
    const bind = address ? (typeof address === 'string' ? 'pipe ' + address : 'port ' + address.port) : "";
    debug('Listening on ' + bind);
}


// 경로 '/' 로 들어오는 요청들은 public 폴더로 정적 라우팅합니다.
// app.use('/', express.static(__dirname + '/../public'));

// app.get('/hello', (req, res) => {
//     return res.send('Can you hear me?');
// });

//
// const server = app.listen(app_config.port, () => {
//     console.log('Express listening on port', app_config.port);
// });
