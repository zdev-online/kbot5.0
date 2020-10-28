const db = require('../database');
const Schema = db.Schema;
const time = require('moment');
time.locale('ru');
const utils = require('../../modules/utils');
const settingsSchema = new Schema({
    adText: {
        required: false,
        type: String,
        default: 'Текст рекламы клана!'
    },
    chatLink: {
        required: false,
        type: String,
        default: 'Ссылка на беседу'
    },
    lesyaLink: {
        required: false,
        type: String,
        default: 'Обсуждение, куда кидать рекламу'
    },
    id: {
        required: false,
        default: 1,
        type: Number
    }
});
const settingsModel = db.model('settings', settingsSchema);

settingsModel.find().then(async (settings) => {
    if(!settings.length){
        new settingsModel({
            adText: '',
            chatLink: '',
            lesyaLink: ''
        }).save().then((data) => {
            console.log(`$ База данных инициализиронна!`);
        }).catch((error) => {
            console.log(`$ База данных : ${error.message}`);
            console.log(`$ База данных не инициализиронна!`);
        });
    } else {
        console.log(`$ База данных инициализиронна!`);
    }
}).catch((error) => {
    console.log(`$ База данных : ${error.message}`);
});

module.exports = class Settings {
    constructor(){}
    adText(newText){
        return new Promise(async (ok, err) => {
            try {
                let settings = await settingsModel.findOne({id: 1});
                if(!newText){
                    return ok(settings.adText);
                } else {
                    settings.adText = newText;
                    await settings.save();
                    return ok(newText);
                }
            } catch (error){
                return err(error);
            }
        });
    }
    chatLink(newLink){
        return new Promise(async (ok, err) => {
            try {
                let settings = await settingsModel.findOne({id: 1});
                if(!newLink){
                    return ok(settings.chatLink);
                } else {
                    settings.chatLink = newLink;
                    await settings.save();
                    return ok(newLink);
                }
            } catch (error){
                return err(error);
            }
        });
    }
    lesyaLink(newLink){
        return new Promise(async (ok, err) => {
            try {
                let settings = await settingsModel.findOne({id: 1});
                if(!newLink){
                    return ok(settings.lesyaLink);
                } else {
                    settings.lesyaLink = newLink;
                    await settings.save();
                    return ok(newLink);
                }
            } catch (error){
                return err(error);
            }
        });
    }
} 

