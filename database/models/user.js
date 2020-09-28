const mongoose      = require('../database');
const crypto        = require('crypto');
const findOrCreate  = require('mongoose-findorcreate');
const bcrypt        = require('bcrypt');
const Schema        = new mongoose.Schema({
    vkId: {
        type: Number,
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
    },
    login: {
        required: true,
        type: String
    },
    password: {
        required: true,
        type: String
    }
});
Schema.pre('save', function(next, doc) {
    if(!this.isModified('password')){return next();}
    let salt = bcrypt.genSaltSync();;
    let passwordHash = bcrypt.hashSync(this.password, salt); 
    this.password = passwordHash;
    return next();
});

Schema.methods.checkPassword = function(candidatePassword){
    return bcrypt.compareSync(candidatePassword, this.password);
}
Schema.plugin(findOrCreate);

module.exports  = mongoose.model('users', Schema);
