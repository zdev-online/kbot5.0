const mongoose      = require('../database');
const crypto        = require('crypto');
const findOrCreate  = require('mongoose-findorcreate');
const Schema        = new mongoose.Schema({
    vkId: {
        type: Number,
        required: true
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    lesyaId: {
        type: Number,
        required: true
    },
    nick: {
        type: String,
        required: true
    },
    war: {
        type: Object,
        require: false,
        default: {
            all: 0,
            win: 0,
            lose: 0,
            todayAll: 0,
            todayWin: 0,
            todayLose: 0
        }
    },
    isAdmin: {
        type: Boolean,
        required: false,
        default: false
    }
});
Schema.plugin(findOrCreate);
module.exports  = mongoose.model('users', Schema);