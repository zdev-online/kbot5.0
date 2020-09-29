// "token": "215b570e5872647320ab441b1f998213b9f125537cc761ed87c0f6ac515b18cfdb397720cb55256dd43e7"

const express   = module.exports.express = require('express');
const SocketIO  = require('socket.io');
const http      = require('http');
const tunnel    = require('localtunnel');
const { VK, Keyboard }      = require('vk-io');
const { HearManager }       = require('@vk-io/hear');
const bodyParser            = require('body-parser');
const path      = require('path');

const logger    = module.exports.logger =  require('./modules/logger');
const User      = module.exports.User   =  require('./database/models/user');
const cfg       = module.exports.cfg    =  require('./config.json');
const utils     = module.exports.utils  =  require('./modules/utils');
const app       = module.exports.app    =  express();
const server    = module.exports.server =  http.createServer(app);
const io        = module.exports.io     =  SocketIO(server);
const vk        = module.exports.vk     =  new VK(cfg.vk);
const cmd       = module.exports.cmd    =  new HearManager();
const lt        = module.exports.lt     =  tunnel;

const cookieParser  = require('cookie-parser'); 
const ROUTER        = require('./routes/route.index');
const API           = require('./api/api.index');
const authCheck     = require('./middlewares/authCheck');
// Express values
// Express переменные
app.set('view engine', 'ejs');

// Middlewares 
// Промежуточные обработчики
app.use((req, res, next) => {
    res.removeHeader('X-Powered-By');
    res.setHeader('Developed-By', 'https://vk.com/id171745503');
    logger.log(`[${req.method}] ${req.ip} | ${req.path}`, 'http');
    return next();
});
app.use('/public', express.static(path.resolve(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(authCheck);
app.use(ROUTER);
app.use('/api', API);

// Modules
// Модули
require('./vk/vk.index');
require('./io/io.index');
