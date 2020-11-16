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
                let date = time().format('DD.MM.YYYY');
                let today = await battles.findOne({date: date});
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
                        today.markModified(`users.${user.index}.battles`);
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
                return ok(false);
            } catch(error){
                return err(error);
            }
        });
    }

    endBattle(nick, result, end){
        return new Promise(async (ok, err) => {
            try {
                let date = time().format('DD.MM.YYYY');
                let today = await battles.findOne({ date });
                if(today){
                    let user = utils.findOBJ(today.users, nick, 'nick');
                    if(user){
                        let length = today.users[user.index].battles.length;
                        if(!today.users[user.index].battles[length-1].result){
                            today.users[user.index].battles[length-1].result = result;
                            today.users[user.index].battles[length-1].end = end;
                            today.users[user.index].all++;
                            today.users[user.index].win += result == 'Победа' ? 1 : 0;
                            today.users[user.index].lose += result == 'Победа' ? 0 : 1;
                            today.all++;
                            today.win += result == 'Победа' ? 1 : 0;
                            today.lose += result == 'Победа' ? 0 : 1;
                            today.markModified(`users`);
                            today.markModified(`users.${user.index}`);
                            today.markModified(`users.${user.index}.battles`);
                            await today.save();
                            return ok({
                                all: today.users[user.index].battles.length,
                                user_norm: (today.norm <= today.users[user.index].battles.length) ? true : false,
                                norm: today.norm
                            });
                        }
                        return ok(false);
                    }
                    return ok(false);
                }
                return ok(false);
            } catch(error){
                return err(error);
            }
        });
    }

    getUser(nick, date){
        return new Promise(async (ok, err) => {
            try {
                if(!nick){
                    return ok({
                        data: false,
                        code: 'USER_NOT_FOUND'
                    });
                }
                let day = date || time().format('DD.MM.YYYY');
                let today = await battles.findOne({ date: day });
                if(today){
                    let user = utils.findOBJ(today.users, nick, 'nick');
                    if(user){
                        return ok({
                            data: user.object
                        });
                    } else {
                        return ok({
                            data: false,
                            code: 'USER_NOT_FOUND'
                        });
                    }
                } else {
                    return ok({
                        data: false,
                        code: 'DATE_NOT_FOUND'
                    });
                }
            } catch (error) {
                return err(error);
            }
        });
    }

    getDay(date){
        return new Promise(async (ok, err) => {
            try {
                let day = date || time().format('DD.MM.YYYY');
                let today = await battles.findOne({ date: day });
                if(today){
                    return ok({ data: today });
                } else {
                    return ok({ data: false, code: 'DATE_NOT_FOUND' });
                }
            } catch (error) {
                return err(error);
            }
        });
    }

    getTop(date){
        return new Promise(async (ok, err) => {
            try {
                let day = date || time().format('DD.MM.YYYY');
                let battle = await battles.findOne({ date: day });
                if(battle){
                    battle.users = battle.users.sort((a, b) => {
                        return b.all - a.all;
                    });
                    for(let i = 0; i < battle.users.length; i++){
                        delete battle.users[i].battles;
                    }
                    battle.users.splice(5, battle.users.length);
                    return ok(battle);
                }
                return ok(false);
            } catch (error) {
                return err(error);
            }
        });
    }
}