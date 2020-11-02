const bcrypt = require('bcrypt');
const utils = require('../../modules/utils');
const SALT_GEN_ROUNDS = 10;
const db = require('../database');
const time = require('moment');
time.locale('ru');
const Schema = db.Schema;
const UserSchema = new Schema({
    vkId: {
        type: Number,
        required: true,
        index: {
            unique: true
        }
    },
    lesya: {
        type: Number,
        required: true
    },
    nick: {
        required: true,
        type: String
    },
    password: {
        type: String,
        required: true
    },
    level: {
        type: Number,
        required: false,
        default: 0
    },
    _all:{
        required: false,
        type: Number,
        default: 0
    },
    _win:{
        required: false,
        type: Number,
        default: 0
    },
    _lose:{
        required: false,
        type: Number,
        default: 0
    },
});
UserSchema.pre('save', function(next){
    if(!this.isModified('password')){return next();}
    let passSalt = bcrypt.genSaltSync(SALT_GEN_ROUNDS);
    this.password = bcrypt.hashSync(this.password, passSalt);
    return next();
});
UserSchema.methods.comparePassword = function(userPass){
    return bcrypt.compareSync(userPass, this.password);
}

const User = db.model('users', UserSchema);
module.exports = class Players {
    addNew(options){
        return new Promise(async (ok, err) => {
            try {
                let user = await new User({
                    vkId: options.vkId,
                    password: options.password,
                    lesya: options.lesya,
                    nick: options.nick
                }).save();
                return ok(user.vkId);
            } catch(error){
                return err(error);
            }
        });
    }
    get(vkId){
        return new Promise(async (res, err) => {
            try{
                let user = await User.findOne({ vkId: vkId });
                return res(user ? user : false);
            } catch(error){
                return err(error);
            }
        });
    }
    delete(vkId){
        return new Promise(async (res, err) => {
            try {
                let user = await User.findOneAndDelete({vkId: vkId});
                return res();
            } catch (error) {
                return err(error);
            }
        });
    }
    changeLevel(vkId, level){
        return new Promise(async (ok, err) => {
            try {
                let user = await this.get(vkId);
                if(!user){
                    return ok({error: true, message: 'Пользователь не зарегистрован в боте!' });
                } 
                user = await this.update(vkId, {level: level});
                return ok({ error: false, user});
            } catch(error){ 
                return err(error);
            }
        });
    }
    update(vkId, options){
        return new Promise(async (ok, err) => {
            try {
                let user = await this.get(vkId);
                if(!user){
                    return ok(false);
                } 
                user = await User.findOneAndUpdate({ vkId: vkId }, options);
                return ok(user);
            } catch(error) {
                return err(error);
            }
        });
    }
    getAdmins(){
        return new Promise(async (ok, err) => {
            try {
                let admins = await User.find({ level: { $gte: 1 }});
                return ok(admins ? admins : false);
            } catch(error){
                return err(error);
            }
        });
    }
    updateBattleStats(options){
        return new Promise(async (ok, err) => {
            try {
                let user = await User.findOne({nick: options.nick});
                if(user){
                    user._all += options.all;
                    user._win += options.win;
                    user._lose += options.lose;
                    await user.save();
                    return ok(user);
                } else {
                    return ok(false);
                }
            } catch(error){
                return err(error);
            }
        });
    }
    getAll(){
        return new Promise(async (ok, err) => {
            try {
                let users = await User.find({});
                return ok(users ? users : false);
            } catch(error){
                return err(error);
            }
        });
    }
}