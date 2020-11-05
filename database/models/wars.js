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
    endWar(end, result){
        return new Promise(async (ok, err) => {
            try {
                let war = await War.findOne({ result: '' });
                if(war){
                    if(!war.result){
                        war.end = end;
                        war.result = result;
                        await war.save();
                        return ok(war);
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
    getWars(){
        return new Promise(async (ok, err) => {
            try {
                let war = await War.find();
                return ok(war ? war : false);
            } catch (error) {
                return err(error);
            }
        });
    }
}