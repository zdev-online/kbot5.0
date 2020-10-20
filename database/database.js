const db = require('mongoose');
const cfg = require('../config.json');
const time = require('moment');

time.locale('ru');
db.connect(cfg.server.db_url, (error) => {
    console.error(`[${time().format('HH:mm:ss, DD.MM.YYYY')}] [MongoDB] | Ошибка подключения: ${error.code}`);
    console.error(`[${time().format('HH:mm:ss, DD.MM.YYYY')}] [MongoDB] | Ошибка подключения: ${error.message}`);
    return process.exit(-1);
});

module.exports = db;