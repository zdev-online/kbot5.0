const { vk, cfg, logger, utils, players, hm } = require('../vk.index');
const { VK } = require('vk-io');
const { HearManager } = require('@vk-io/hear');
const user = new VK({ token: cfg.vk.users.premium.token });
const cmd = new HearManager();

logger.info.app(`Premium Started!`);

let timer = 0;

hm.hear(/\/get( )?([\w\W]+)?/i, async (ctx) => {
    if(timer >= new Date().getTime()){
        let time_to_write = (timer - new Date().getTime())/1000;
        return vk.api.messages.send({
            message :`❗ Использовать премиум команды можно раз в 10 сек!\n❗ Осталось: ${time_to_write > 0 ? time_to_write : 0} сек`,
            peer_id: cfg.vk.peerId,
            random_id: Math.floor(Math.random()*100000000)
        });
    }
    if(!ctx.isAdmin || ctx.isAdmin < 3){return vk.api.messages.send({
        message :`❗ Недостаточно прав!`,
        peer_id: cfg.vk.peerId,
        random_id: Math.floor(Math.random()*100000000)
    });}
    if(!ctx.$match[2]){return vk.api.messages.send({
        message :`❗ Укажите ID или ссылку!`,
        peer_id: cfg.vk.peerId,
        random_id: Math.floor(Math.random()*100000000)
    });}
    timer = new Date().getTime() + 10 * 1000;
    return user.api.messages.send({
        message :   `/гет ${ctx.$match[2]}`,
        peer_id: cfg.vk.users.premium.peerId,
        random_id: Math.floor(Math.random()*100000000)
    });
});
