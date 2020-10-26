const db = require('mongoose');
const cfg = require('../config.json');
const time = require('moment');

time.locale('ru');
db.connect(cfg.server.db_url,{
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true
}, (error) => {
    if(error){
        console.error(`[${time().format('HH:mm:ss, DD.MM.YYYY')}] [MongoDB] | Ошибка подключения: ${error}`);
        return process.exit(-1);
    } else {
        return 1;
    }
});

module.exports = db;