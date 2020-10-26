const path = require('path');
const express = require('express');
const { VK, Keyboard } = require('vk-io');
const { Nuxt, Builder } = require('nuxt');
const { HearManager } = require('@vk-io/hear');
const app = module.exports.app = express();
const http = module.exports.http = require('http').createServer(app);
const io = module.exports.io = require('socket.io')(http);
const cfg = module.exports.cfg = require('./config.json');
const vk = module.exports.vk = new VK({ token: cfg.vk.token});
const hm = module.exports.hm = new HearManager();
const keys = module.exports.keys = require('./modules/keyboard');
const logger = module.exports.logger = new (require('./database/models/logger'))(__filename);
const players = module.exports.players = new (require('./database/models/user'))();
const settings = module.exports.settings = new (require('./database/models/settings'))();
const battles = module.exports.battles = new (require('./database/models/battles'))();
const localtunnel = module.exports.lt = require('localtunnel');
const nuxtCfg = module.exports.nuxtCfg = require('./nuxt.config');
const utils = module.exports.utils = require('./modules/utils');
const time = require('moment');
time.locale('ru')
module.exports.time = time;
module.exports.Keyboard = Keyboard;
nuxtCfg.dev = process.env.NODE_ENV !== 'production';
// const nuxt = new Nuxt(nuxtCfg);

// Убран Builder не забыть прикрутить обратно
// if(nuxtCfg.dev){
//     const builder = new Builder(nuxt);
//     builder.build();
// }

// Settings
app.set('view engine', 'ejs');
app.set('views', 'views');

// Middlewares
app.use(logger.serverMiddleware);
// app.use(nuxt.render);

require('./vk/vk.index');
