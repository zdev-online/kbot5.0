const db = require('../database');
const Schema = db.Schema;
const time = require('moment');
time.locale('ru');
const utils = require('../../modules/utils');
const PromoSchema = new Schema({
    from: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true,
    },
    time: {
        required: false,
        type: String,
        default: time().format('HH.mm.ss, DD.MM.YYYY')
    }
});
const Promocode = db.model('promos', PromoSchema);
module.exports = class Promo {
    constructor(){}

    add(from, text){
        return new Promise(async (ok, err) => {
            try {
                let check = await Promocode.find({ text: text });
                if(check.length){return ok(false)}
                let promo = new Promocode({ from: from, text: text});
                await promo.save();
                return ok(true);
            } catch (error) {
                return err(error);
            }
        })
    }

    getAll(){
        return new Promise(async (ok, err) => {
            try {
                let promos = await Promocode.find();
                return ok(promos.length ? promos : false)
            } catch (error) {
                return err(error);
            }
        })
    }
} 

