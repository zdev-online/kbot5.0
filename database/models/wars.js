const db = require('../database');
const time = require('moment');
const utils = require('../../modules/utils');
time.locale('ru');
const Schema = db.Schema;
const WarsSchema = new Schema({
    date: {
        type: 'String',
        required: false,
        default: time().format('DD.MM.YYYY')
    },
    start: {
        type: "string",
        required: true
    },
    enemy: {
        type: "string",
        required: true
    },
    result: {
        type: "string",
        required: false
    },
    end: {
        type: "string",
        required: false
    },
    postId: {
        type: Number,
        required: false
    }
});
const War = db.model('wars', WarsSchema);

module.exports = class Wars {
    constructor(){}

    startWar(start, enemy){
        return new Promise(async (ok, err) => {
            try {
                let date = time().format('DD.MM.YYYY');
                let check = await War.find({ date });
                if(check.length){ return ok(false); }
                let today = new War({ start, enemy, result: '', end: '', postId: -1 });
                await today.save();
                return ok(today);
            } catch (error) {
                return err(error);
            }
        });
    }
    endWar(end, result, postId){
        return new Promise(async (ok, err) => {
            try {
                let date = time().format('DD.MM.YYYY');
                let today = await War.findOne({ date });
                if(today){
                    if(!today.result){
                        today.result = result;
                        today.end = end;
                        today.postId = postId;
                        await today.save();
                        return ok(today);
                    } else {
                        return ok(false);
                    }
                } else {
                    return ok(false);
                }
            } catch (error) {
                return err(error);
            }
        });
    }
    getWarsByDate(date=time().format('DD.MM.YYYY')){
        return new Promise(async (ok, err) => {
            try {
                let war = await War.findOne({date});
                return ok(war ? war : false);
            } catch (error) {
                return err(error);
            }
        });
    }
}