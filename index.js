const path                                      = require('path');
const express                                   = require('express');
const { VK, Keyboard }                          = require('vk-io');
const { HearManager }                           = require('@vk-io/hear');
const app           = module.exports.app        = express();
const http          = module.exports.http       = require('http').createServer(app);
const io            = module.exports.io         = require('socket.io')(http);
const cfg           = module.exports.cfg        = require('./config.json');
const vk            = module.exports.vk         = new VK({ token: cfg.vk.token});
const hm            = module.exports.hm         = new HearManager();
const creator       = module.exports.creator    = require('./vk/users/creator');
const premium       = module.exports.premium    = require('./vk/users/premium');
const keys          = module.exports.keys       = require('./modules/keyboard');
const logger        = module.exports.logger     = new (require('./database/models/logger'))(__filename);
const players       = module.exports.players    = new (require('./database/models/user'))();
const settings      = module.exports.settings   = new (require('./database/models/settings'))();
const battles       = module.exports.battles    = new (require('./database/models/battles'))();
const promo         = module.exports.promo      = new (require('./database/models/promo'))();
const wars          = module.exports.wars       = new (require('./database/models/wars'))();
const localtunnel   = module.exports.lt         = require('localtunnel');
const utils         = module.exports.utils      = require('./modules/utils');
const countdown     = module.exports.countdown  = require('countdown');
const game          = module.exports.game       = require('gamedig');
const time                                      = require('moment');
time.locale('ru');
module.exports.time                             = time;
module.exports.Keyboard                         = Keyboard;

// const { Nuxt, Builder } = require('nuxt');
// const NuxtConfig        = module.exports.NuxtConfig = require('./nuxt.config');
// NuxtConfig.dev          = !cfg.isProduction;
// const nuxt              = new Nuxt(NuxtConfig);

// if(NuxtConfig.dev){
//     new Builder(nuxt).build();
// }

// Settings
app.set('view engine', 'ejs');
app.set('views', 'views');

// Middlewares
app.use((req, res, next) => {
    logger.info.http(`${req.ip} | ${req.path} | ${req.method}`);
    return next();
});
// app.use(nuxt.render);


require('./vk/vk.index');
require('./io/io.index');