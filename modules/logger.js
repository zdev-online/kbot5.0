const Logs      = require('../database/models/logger');
const colors    = require('colors');
const moment    = require('moment');

module.exports.warn   = async function(text, type){
    if(!isValidType(type)){
        return console.error(`WARN -> ${text}`);
    }
    let data = {
        date: moment().utc(true),
        text: text,
        type: "warn",
        from: type
    }
    let warn = new Logs(data);
    warn.save((err, doc) => {
        if(err){
            console.error(`Ошибка записи логов -> [WARN]: ${err}`);
        } else {
            return console.warn(colors.yellow(`[${moment().format("HH:mm:ss, DD.MM.YYYY")}] [WARN] [${String(type).toUpperCase()}]: ${text}`));
        }
    });
} 
module.exports.log    = function(text, type){
    if(!isValidType(type)){
        return console.error(`LOG -> ${text}`);
    }
    let data = {
        date: moment().utc(true),
        text: text,
        type: "log",
        from: type
    }
    let log = new Logs(data);
    log.save((err, doc) => {
        if(err){
            console.error(`Ошибка записи логов -> [LOG]: ${err}`);
        } else {
            return console.log(colors.green(`[${moment().format("HH:mm:ss, DD.MM.YYYY")}] [LOG] [${String(type).toUpperCase()}]: ${text}`));
        }
    });
}    
module.exports.error  = function(text, type){
    if(!isValidType(type)){
        return console.error(`ERROR -> ${text}`);
    }
    let data = {
        date: moment().utc(true),
        text: text,
        type: "error",
        from: type
    }
    let error = new Logs(data);
    error.save((err, doc) => {
        if(err){
            console.error(`Ошибка записи логов -> [ERROR]: ${err}`);
        } else {
            return console.error(colors.red(`[${moment().format("HH:mm:ss, DD.MM.YYYY")}] [ERROR] [${String(type).toUpperCase()}]: ${text}`));
        }
    });
}     
module.exports.debug  = function(text, type){
    return console.debug(colors.white.bgBlack(`[DEBUG] [${String(type).toUpperCase()}]: ${text}`));
}  

function isValidType(type){
    switch (type){
        case 'vk': return 1;
        case 'message': return 1;
        case 'app': return 1;
        case 'http': return 1;
        default: return 0;
    }
}