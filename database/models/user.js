const mongoose = require('../database');
const Schema = new mongoose.Schema({
    vkId: {
        type: Number,
        required: true
    },
    first: {
        type: String,
        required: true
    },
    last: {
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
    }
});
module.exports = mongoose.model('users', Schema);