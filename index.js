const path = require('path');
const express = require('express');
const { VK } = require('vk-io');
const { Nuxt, Builder } = require('nuxt');
const { HearManager } = require('@vk-io/hear');
const app = module.exports.app = express();
const http = module.exports.http = require('http').createServer(app);
const io = module.exports.io = require('socket.io')(http);
const cfg = module.exports.cfg = require('./config.json');
const vk = module.exports.vk = new VK({ token: ""});
const hm = module.exports.hm = new HearManager();
const logger = module.exports.logger = new (require('./database/models/logger'))(__filename);

const nuxtCfg = module.exports.nuxtCfg = require('./nuxt.config');
nuxtCfg.dev = process.env.NODE_ENV !== 'production';
const nuxt = new Nuxt(nuxtCfg);

if(nuxtCfg.dev){
    const builder = new Builder(nuxt);
    builder.build();
}

// Settings
app.set('view engine', 'ejs');
app.set('views', 'views');

// Middlewares
app.use(logger.serverMiddleware);
app.use(nuxt.render);