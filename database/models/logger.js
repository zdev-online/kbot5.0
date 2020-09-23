const mongoose  = require('../database');
const moment    = require('moment');
const Schema    = new mongoose.Schema({
    date: {
        required: true,
        type: Number
    },
    text: {
        required: true,
        type: String
    },
    type: {
        required: true,
        type: String
    },
    from: {
        required: true,
        type: String
    }
});
const Log       = module.exports = mongoose.model('logs', Schema);

Log.find((err, doc) => {
    if(err){
        return console.log(`Ошибка чистки логов 1!`);
    } else {
        doc.forEach((value, i, doc) =>{
            if((value.date + 604800000) <= moment().utc(true)){
                doc[i].deleteOne((err, doc) => {
                    if(err){
                        return console.log(`Ошибка чистки логов 2!`);
                    }
                });
            }
        })
    }
})