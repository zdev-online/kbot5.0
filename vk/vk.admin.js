const { hm, cfg, logger, players, io, vk, Keyboard, settings, keys, battles, utils } = require('./vk.index');
const fs = require('fs');
const os = require('os');

const time = require('moment');
time.locale('ru');

hm.hear(/^\/ad( )?([\w\W]+)?/i, async (ctx) => {
    if(!ctx.isAdmin){ return ctx.send(`❗ Недостаточно прав!`); }
    try {
        let chatMembers = await vk.api.messages.getConversationMembers({ peer_id: cfg.vk.peerId });
        let message = ``;
        let online = 0;
        for(let i = 0; i < chatMembers.profiles.length; i++){
            message += `[id${chatMembers.profiles[i].id}|&#8203;]`;
            online += (chatMembers.profiles[i].online) ? 1 : 0;
        }
        message += `👥 Онлайн: ${online}\n`;
        message += (ctx.$match[2]) ? `⚠ Объявление: ${ctx.$match[2]}` : '⚠ Объявление';
        return ctx.send(message);
    } catch(error) {
        logger.error.vk(`VK: /ad: ${error.message}`);
        return ctx.send(`❗ Произошла ошибка!`);
    }
});

hm.hear(/^\/rob/i, async (ctx) => {
    if(!ctx.isAdmin){ return ctx.send(`❗ Недостаточно прав!`); }
    try {
        let message = ``;
        let members = await vk.api.messages.getConversationMembers({ peer_id: cfg.vk.peerId });
        let online = 0;
        for(let i = 0; i < members.profiles.length; i++){
            message += `[${members.profiles[i].screen_name}|&#8203;]`;
            online += (members.profiles[i].online) ? 1 : 0;
        }
        message += `👥 Онлайн: ${online}\n`;
        message += `💰 Закупаемся на ограбление!`;
        return ctx.send(message, {
            keyboard: Keyboard.keyboard([
                Keyboard.textButton({label: 'Предметы', color: "positive"})
            ]).inline(true)
        });
    } catch(error) {
        logger.error.vk(`VK: /rob: ${error.message}`);
        return ctx.send(`❗ Произошла ошибка!`);
    }
});

hm.hear(/^\/war/i, async (ctx) => {
    if(!ctx.isAdmin){ return ctx.send(`❗ Недостаточно прав!`); }
    try {
        let message = ``;
        let members = await vk.api.messages.getConversationMembers({ peer_id: cfg.vk.peerId });
        let online = 0;
        for(let i = 0; i < members.profiles.length; i++){
            message += `[${members.profiles[i].screen_name}|&#8203;]`;
            online += (members.profiles[i].online) ? 1 : 0;
        }
        message += `👥 Онлайн: ${online}\n`;
        message += `💰 Участвуем в боях!`;
        return ctx.send(message, {
            keyboard: Keyboard.keyboard([
                Keyboard.textButton({label: 'Бой', color: "positive"})
            ]).inline(true)
        });
    } catch(error) {
        logger.error.vk(`[/war]: ${error.message}`);
        return ctx.send(`❗ Произошла ошибка!\n❗ Отправьте разработчику код: admin_war`);
    }
});

hm.hear(/^\/stuff( )(add|delete)( )?([0-4]+)?/i, async (ctx) => {
    if(!ctx.isAdmin || ctx.isAdmin < 4){ return ctx.send(`❗ Недостаточно прав!`);}
    if(!ctx.hasReplyMessage){ return ctx.send(`❗ Использовать: /stuff [*add|delete] [*0-4] с ответом на сообщение пользователя, которого хотите добавить!`);}
    if(ctx.replyMessage.senderId < 0){ return ctx.send(`❗ Зачем боту админка?`); }
    if(ctx.replyMessage.senderId == ctx.senderId){ return ctx.send(`❗ Нельзя изменять самому себе уровень!`);}
    try {
        switch(ctx.$match[2]){
            case 'add': { 
                if(!ctx.$match[4]){ return ctx.send(`❗ Укажите уровень для пользователя!`); }
                if(Number(ctx.$match[4]) > 5 || Number(ctx.$match[4]) < 0){return ctx.send(`❗ Уровень не может быть меньшь 0 и больше 5!`);}
                let user = await players.changeLevel(ctx.replyMessage.senderId, ctx.$match[4]);
                if(user.error){ return ctx.send(`❗ Ошибка: ${user.message}!`);}
                let info = await vk.api.users.get({ user_ids: user.user.vkId });
                return ctx.send(`🌌 Пользователю [id${user.user.vkId}|${info[0].first_name} ${info[0].last_name}] выдан ${ctx.$match[4]} уровень!`);
            }
            case 'delete': {
                let user = await players.changeLevel(ctx.replyMessage.senderId, 0);
                if(user.error){ return ctx.send(`❗ Ошибка: ${user.message}!`); }
                let info = await vk.api.users.get({ user_ids: user.user.vkId });
                return ctx.send(`🌌 У пользователя [id${user.user.vkId}|${info[0].first_name} ${info[0].last_name}] снят доступ!`);
                break; 
            }
        }
    } catch(error){
        logger.error.vk(`VK: /stuff: ${error.message}`);
        return ctx.send(`❗ Произошла ошибка! Отправьте разработчику код: vk_reg`);
    }
});

hm.hear(/^\/sad( )?([\w\W]+)?/i, async (ctx) => {
    if(!ctx.isAdmin || ctx.isAdmin < 2){ return ctx.send(`❗ Недостаточно прав!`); }
    try {
        let admins = await players.getAdmins();
        if(admins){
            let message = ``;
            let online = 0;
            for(let i = 0; i < admins.length; i++){
                let [user] = await vk.api.users.get({ user_ids: admins[i].vkId });
                message += `[id${admins[i].vkId}|&#8203;]`;
                online += (user.online) ? 1 : 0;
            }
            message += `⚙ Объявление для управляющих\n`;
            message += `👥 Управляющие онлайн: ${online}\n`;
            message += (ctx.$match[2]) ? `⚠ Объявление: ${ctx.$match[2]}` : '⚠ Объявление';
            return ctx.send(message);
        } else {
            return ctx.send(`❗ Управляющих нет!`);
        }
    } catch(error) {
        logger.error.vk(`VK: /ad: ${error.message}`);
        return ctx.send(`❗ Произошла ошибка!`);
    }
});

hm.hear(/^\/textad( )([\w\W\n]+)/i, async (ctx) => {
    if(!ctx.isAdmin || ctx.isAdmin < 3){return ctx.send(`❗ Недостаточно прав!`)}
    try{
        await settings.adText(ctx.$match[2]);
        return ctx.send(`⚙ Новый текст рекламы установлен!`);
    } catch(error){
        logger.error.vk(`[/textad] >> ${error.message}`);
        return ctx.send(`❗ Упс... Что-то пошло не так!\n❗ Отправьте код разработчику: set_textad_link`);
    }
});

hm.hear(/^\/lesya( )([\w\W\n]+)/i, async (ctx) => {
    if(!ctx.isAdmin || ctx.isAdmin < 3){return ctx.send(`❗ Недостаточно прав!`)}
    try{
        await settings.lesyaLink(ctx.$match[2]);
        return ctx.send(`⚙ Новая ссылка обсуждения установлена!`);
    } catch(error){
        logger.error.vk(`[/lesya] >> ${error.message}`);
        return ctx.send(`❗ Упс... Что-то пошло не так!\n❗ Отправьте код разработчику: set_lesya_link`);
    }
});

hm.hear(/^\/link( )([\w\W\n]+)/i, async (ctx) => {
    if(!ctx.isAdmin || ctx.isAdmin < 3){return ctx.send(`❗ Недостаточно прав!`)}
    try{
        await settings.chatLink(ctx.$match[2]);
        return ctx.send(`⚙ Новая ссылка на беседу установлена!`);
    } catch(error){
        logger.error.vk(`[/link] >> ${error.message}`);
        return ctx.send(`❗ Упс... Что-то пошло не так!\n❗ Отправьте код разработчику: set_link_chat`);
    }
});

hm.hear(/^\/logs( )?(vk|http|app)?( )?(warn|info|error)?/i, async (ctx) => {
    if(!ctx.isAdmin || ctx.isAdmin < 3){return ctx.send(`❗ Недостаточно прав!`);}
    if(!ctx.$match[2]){ return ctx.send(`❗ Укажите род логов (vk | http | app)`);}
    if(!ctx.$match[4]){ return ctx.send(`❗ Укажите тип логов (warn | info | error)`);}
    try {
        let logs = await logger.getLastTenLogs(ctx.$match[2], ctx.$match[4]);
        logs = logs.reverse();
        let message = `⚙ Последние логи [${ctx.$match[2]} > ${ctx.$match[4]}]:\n`;
        for(let item of logs){
            message += `[${item.date}]: ${item.text}\n`; 
        }
        return ctx.send(message);
    } catch (error) {
        logger.error.vk(`[/logs] >> ${error.message}`);
        return ctx.send(`❗ Упс... Что-то пошло не так!\n❗ Отправьте код разработчику: get_logs`);
    }
});

hm.hear(/^\/norm( )?([0-9]+)?/i, async (ctx) => {
    try {
        if(!ctx.isAdmin || ctx.isAdmin < 1){return ctx.send(`❗ Недостаточно прав!`);}
        if(!ctx.$match[2]){ return ctx.send(`❗ Укажите норму: 10 - 40`);}
        if(Number(ctx.$match[2]) > 40 || Number(ctx.$match[2]) < 10){
            return ctx.send(`❗ Укажите норму: 10 - 40`);
        }
        let day = await battles.addBattleDayOrChangeNorm(Number(ctx.$match[2]))
        if(day.isNewDay){
            return ctx.send(`⚙ Норма боёв установлена: ${ctx.$match[2]}!\n👊🏻 Теперь бои засчитываются!`);
        } else {
            return ctx.send(`⚙ Новая норма боёв установлена: ${ctx.$match[2]}!`);
        }
    } catch(error){
        logger.error.vk(`[/norm] >> ${error.message}`);
        return ctx.send(`❗ Упс... Что-то пошло не так!\n❗ Отправьте код разработчику: set_battle_norm`);
    }
});

hm.hear(/^\/check/i, async (ctx) => {
    if(!ctx.isAdmin || ctx.isAdmin < 2){return ctx.send(`❗ Недостаточно прав!`);}
    let uptime = utils.formatUptime(process.uptime());
    let info = JSON.parse(fs.readFileSync('./package.json'));
    let used = Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100 + ' Мб';
    let total = Math.round(process.memoryUsage().heapTotal / 1024 / 1024 * 100) / 100 + ' Мб';
    let rss = Math.round(process.memoryUsage().rss / 1024 / 1024 * 100) / 100 + ' Мб';
    let ext = Math.round(process.memoryUsage().external / 1024 / 1024 * 100) / 100 + ' Мб';
    let ping = (time() - time(ctx.createdAt*1000))/1000;
    let OSMF = Math.round(os.freemem() / 1024 / 1024 / 1024 * 100) / 100;
    let OSMT = Math.round(os.totalmem() / 1024 / 1024 / 1024 * 100) / 100;
    let message = `⚙ Статистика бота:\n`;
    message += `> Version: ${info.version}\n`;
    message += `> Name: KBot\n\n`;
    message += `> Time: ${time().format('HH:mm:ss')}\n`;
    message += `> Date: ${time().format('DD.MM.YYYY')}\n`;
    message += `> Uptime: ${uptime}\n`;
    message += `> Ping: ${ping} сек\n\n`;
    message += `> Used: ${used}\n`;
    message += `> Total: ${total}\n`;
    message += `> RSS: ${rss}\n`;
    message += `> EXT: ${ext}\n\n`;
    message += `> OSMU: ${(OSMT - OSMF).toFixed(2)} Гб\n`;
    message += `> OSMF: ${OSMF} Гб\n`;
    message += `> OSMT: ${OSMT} Гб\n`;
    return ctx.send(message);
});

hm.hear(/^\/stats( )?([0-9\.?]+)?/i, async (ctx) => {
    if(!ctx.isAdmin || ctx.isAdmin < 1){return ctx.send(`❗ Недостаточно прав!`);}
    try {
        let stats = await battles.getDay(ctx.$match[2] || false);
        let message = ``;
        if(stats.data){
            let battle = stats.data;
            message += `🌌 Статистика боёв за ${ctx.$match[2] || 'сегодня'}:\n`;
            let norm = 0;
            for(let i = 0; i < battle.users.length; i++){
                if(battle.users[i].all >= battle.norm)
                    norm++
            }
            message += `⚙ Норма: ${battle.norm}\n`;
            message += `✅ Выполнили: ${norm}\n\n`;
            message += `⚔ Всего: ${battle.all}\n`;
            message += `😎 Побед: ${battle.win}\n`;
            message += `😥  Поражений: ${battle.lose}\n\n`;
            for(let i = 0; i < battle.users.length; i++){
                message += `> ${battle.users[i].nick} - ${battle.users[i].all}\n`;
            }
        } else {
            if(stats.code == 'DATE_NOT_FOUND')
                message += `❗ Боёв за ${ctx.$match[2] || 'сегодня'} не найдено!`;
        }
        return ctx.send(message);
    } catch(error) {
        logger.error.vk(`[/stats] >> ${error.message}`);
        return ctx.send(`❗ Упс... Что-то пошло не так!\n❗ Отправьте код разработчику: battle_stats_get`);
    }
});

hm.hear(/^\/keys/i, (ctx) => {
    if(!ctx.isAdmin || ctx.isAdmin < 3){return ctx.send(`❗ Недостаточно прав!`)}
    return ctx.send(`⚙ Клавиатура обновлена!`, {
        keyboard: Keyboard.keyboard(keys.chat)
    });
});