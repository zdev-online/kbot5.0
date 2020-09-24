const mongoose  = require('../database');
const crypto    = require('crypto');
const Schema    = new mongoose.Schema({
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
    },
    isAdmin: {
        type: Boolean,
        required: false,
        default: false
    },
    login: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: 'Данный E-Mail уже зарегистрован!'
    },
    passwordHash: String,
    salt: String
});
Schema.virtual('password')
    .set(function(password){
        this._plainPassword = password;
        if(password){
            this.salt = crypto.randomBytes(128).toString("base64");
            this.passwordHash = crypto.pbkdf2Sync(password, this.salt, 1, 128, 'sha1');
        } else {
            this.salt = undefined;
            this.passwordHash = undefined;
        }
    })
    .get(function(){
        return this._plainPassword;
    });
Schema.methods.checkPassword = function(password){
    if(!password) return false;
    if(!this.passwordHash) return false;
    return crypto.pbkdf2Sync(password, this.salt, 1, 128, 'sha1') == this.passwordHash;
}
module.exports  = mongoose.model('users', Schema);