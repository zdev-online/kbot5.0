const db = require('../database');
const time = require('moment');
const utils = require('../../modules/utils');
time.locale('ru');
const Schema = db.Schema;
const BattleSchema = new Schema({
    date: {
        required: false,
        type: String,
        default: time().format('DD.MM.YYYY')
    },
    users: {
        required: true,
        type: Array
    },
    norm: {
        required: true,
        type: Number
    }, 
    all: {
        required: true,
        type: Number
    },
    win: {
        required: true,
        type: Number
    },
    lose: {
        required: true,
        type: Number
    }
});
const battles = db.model('battles', BattleSchema);

module.exports = class Battles {
    constructor(){}
    
    addBattleDayOrChangeNorm(new_battle_norm){
        return new Promise(async (ok, err) => {
            try {
                let today = await battles.findOne({date: time().format('DD.MM.YYYY')});
                if(today){
                    today.norm = new_battle_norm;
                    await today.save();
                    return ok({ isNewDay: false });
                } else {
                    let battle = new battles({
                        users: [],
                        norm: new_battle_norm,
                        all: 0,
                        win: 0,
                        lose: 0
                    });
                    await battle.save();
                    return ok({ isNewDay: true });
                }
            } catch(error){
                return err(error);
            }
        });
    }

    startBattle(nick, enemy, start){
        return new Promise(async (ok, err) => {
            try {
                let date = time().format('DD.MM.YYYY');
                let today = await battles.findOne({ date });
                if(today){
                    let user = utils.findOBJ(today.users, nick, 'nick');
                    if(user){
                        today.users[user.index].battles.push({
                            enemy, start, result: '', end: '' 
                        });
                        await today.save();
                        return ok(true);
                    } else {
                        today.users.push({
                            nick,
                            all: 0,
                            win: 0,
                            lose: 0,
                            battles: [{ enemy, start, result: '', end: '' }]
                        });
                        await today.save();
                        return ok(true);
                    }
                }
            } catch(error){
                return err(error);
            }
        });
    }

    endBattle(){
        return new Promise((ok, err) => {
            try {

            } catch(error){
                return err(error);
            }
        });
    }
}