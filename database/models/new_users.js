const db = require('../database');
const time = require('moment');
const utils = require('../../modules/utils');
time.locale('ru');
const Schema = db.Schema;
const NewUsersSchema = new Schema({
    vkId: {
        type: Number,
        required: true
    },
    kickTime: {
        type: Number,
        required: true
    }
});
const NewUsersModel = db.model('new_users', NewUsersSchema);

module.exports = class NewUsers {
    constructor(){}
    
    add(vkId){
        return new Promise(async (ok, err) => {
            try {
                let user = new NewUsersModel({
                    vkId, kickTime: new Date().getTime() + 300000
                });
                await user.save();
                return ok(user);
            } catch(error){
                return err(error);
            }
        })
    }
    
    delete(vkId){
        return new Promise(async (ok, err) => {
            try {
                await NewUsersModel.deleteMany({vkId: vkId});
                return ok(true);
            } catch(error) {
                return err(error);
            }
        });
    }

    getAll(){
        return new Promise(async (ok, err) => {
            try {
                let users = await NewUsersModel.find();
                return ok(users.length ? users : false);
            } catch(error) {
                return err(error);
            }
        });
    }

    get(vkId){
        return new Promise(async (ok, err) => {
            try {
                let user = await NewUsersModel.findOne({vkId});
                return ok(user ? user : false);
            } catch(error) {
                return err(error);
            }
        });
    }
}