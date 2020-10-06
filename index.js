const express = require('express');
const { VK } = require('vk-io');
const { HearManager } = require('@vk-io/hear');
const app = module.exports.app = express();
const http = module.exports.http = require('http').createServer(app);
const io = module.exports.io = require('socket.io')(http);
const cfg = module.exports.cfg = require('./config.json');
const vk = module.exports.vk = new VK({ token: ""});
const hm = module.exports.hm = new HearManager();
const path = require('path');

// Settings
app.set('view engine', 'ejs');
app.set('views', 'views');

// Middlewares
app.use('/public', express.static(path.resolve(__dirname, 'public')));
app.all('/', (req, res) => {
    return res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});