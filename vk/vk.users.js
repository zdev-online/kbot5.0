const { 
    hm, cfg, logger, players, io,
    time, vk, settings, battles, 
    creator 
} = require('./vk.index');
const fs = require('fs');

// 👥 - 1 Уровень
// 🔥 - 2 Уровень
// 🌀 - 3 Уровень
// 🌌 - 4 Уровень
// ⚙ - Разработчик
const LEVELS = ['👥', '🔥', '🌀', '🌌', '⚙'];
let CMD = JSON.parse(fs.readFileSync(`./commands.json`, { encoding: "utf-8"}));
CMD = CMD.sort((a, b) => {
    return a.level - b.level;
});
let CMDS = `❗ Команды бота [${CMD.length}]:\n`;
for(let item of CMD){
    CMDS += `[${LEVELS[item.level]}] ${item.for_reg ? '@ ' : ''}`;
    CMDS += `${item.text} `;
    CMDS += (item.argv) ? `[${item.argv}] ` : '';
    CMDS += `- ${item.desc}\n`;
}
CMDS += `\n$ - Необяз.аргумент\n`;
CMDS += `* - Обяз.аргумент\n`;
CMDS += `@ - Требуется регистрация\n\n`;
CMDS += `👥 - Участники и выше\n`;
CMDS += `🔥 - Уровень 2 и выше\n`;
CMDS += `🌀 - Уровень 3 и выше\n`;
CMDS += `🌌 - Уровень 4 и выше\n`;
CMDS += `⚙ - Разработчик\n`;

hm.hear(/@(all|online|онлайн|все)/gim, async (ctx) => {
	try {
		// await creaor.deleteMessage({delete_for_all: true});
		return ctx.send(`🌌 Используйте: /ad | /rob | /war`);
	} catch(error) {
		logger.error.vk(`[@all @online] >> ${error.message}`);
		return ctx.send(`❗ Произошла ошибка! Отправьте код разработчику: notify_delete`);
	}
});

hm.hear(/^\/cmd/i, (ctx) => {
    return ctx.send(CMDS);
});

hm.hear(/^\/register( )?([0-9]+)?( )?([\w\W]+)?/i, async (ctx) => {
    try {
        if(ctx.peerType != 'user'){ return ctx.send(`❗ Регистрация доступна в [club${ctx.$groupId}|ЛС Боту]`); }
        if(ctx.info){return ctx.send(`❗ Вы уже зарегистрированны в боте!`);}
        if(!ctx.$match[2]){ return ctx.send(`❗ Укажите ID из Lesya!`); }
        if(!ctx.$match[4]){ return ctx.send(`❗ Укажите ник из Lesya!`);}
        let password = Math.random().toString(36).replace('.','') + Math.random().toString(36).replace('.','');
        await players.addNew({
            vkId: ctx.senderId,
            password: password,
            lesya: ctx.$match[2],
            nick: ctx.$match[4]
        });
        let message = `🌌 ${ctx.vk.first_name} ${ctx.vk.last_name} вы успешно зарегистрировались в боте!\n`;
        message += `⚙ Логин: ${ctx.senderId}\n`;
        message += `⚙ Пароль: ${password}\n\n`;
        message += `⚙ LesyaID: ${ctx.$match[2]}\n`;
        message += `⚙ LesyaNick: ${ctx.$match[4]}\n\n`;
        message += `❗ Никому не сообщайте эти данные!\n`;
        message += `❗ Используйте эти данные для входа на сайте!`;
        logger.info.app(`Пользователь ${ctx.vk.first_name} ${ctx.vk.last_name} зарегистровался в боте!`);
        return ctx.send(message);
    } catch (error) {
        logger.error.vk(`VK: /register: ${error.message}`);
        return ctx.send(`❗ Что-то пошло не так! Отправьте код разработчику: vk_reg_error`);
    }
});

hm.hear(/^\/stuff( )?/i, async (ctx) => {
    if(ctx.$match[1]){return 1;}
    try {
        let admins = await players.getAdmins();
        if(!admins){ return ctx.send(`❗ Управляющих не найдено!`); }
        let message = `[🌌] Управляющие беседы:\n\n`;
        for(let i = 0; i < admins.length; i++){
            let user = await vk.api.users.get({ user_ids: admins[i].vkId });
            message += `${LEVELS[admins[i].level]} ${user[0].first_name} ${user[0].last_name}\n`;
        }
        return ctx.send(message);
    } catch(error){
        logger.error.vk(`VK: UsersCMD: /stuff: ${error.message}`);
        return ctx.send(`❗ Что-то пошло не так! Отправьте код разработчику: vk_stuff_error`);
    }
});

hm.hear(/^\/textad( )?/i, async (ctx) => {
    if(ctx.$match[1]){return 1;}
    try {
        let message = await settings.adText();
        message = message ? message : '❗ Ссылка не установлена';
        return ctx.send(message, { dont_parse_links: true });
    } catch(error){
        logger.error.vk(`[/textad] >> ${error.message}`);
        return ctx.send(`❗ Упс... Что-то пошло не так!\n❗ Отправь разработчику код: get_textad_error`);
    }
});

hm.hear(/^\/lesya( )?/i, async (ctx) => {
    if(ctx.$match[1]){return 1;}
    try {
        let message = `🌌 Кидать рекламу сюда:\n`;
        let lesya = await settings.lesyaLink();
        lesya = lesya ? lesya : '❗ Ссылка не установлена';
        message += lesya;
        return ctx.send(message, { dont_parse_links: true });
    } catch(error){
        logger.error.vk(`[/lesya] >> ${error.message}`);
        return ctx.send(`❗ Упс... Что-то пошло не так!\n❗ Отправь разработчику код: get_lesya_error`);
    }
});

hm.hear(/^\/link( )?/i, async (ctx) => {
    if(ctx.$match[1]){return 1;}
    try {
        let message = `🌌 Приглашай друзей по ссылке:\n`;
        let link = await settings.chatLink();
        link = link ? link : '❗ Ссылка не установлена!';
        message += link;
        return ctx.send(message, { dont_parse_links: true });
    } catch(error){
        logger.error.vk(`[/link] >> ${error.message}`);
        return ctx.send(`❗ Упс... Что-то пошло не так!\n❗ Отправь разработчику код: get_link_error`);
    }
});

hm.hear(/^\/me/, async (ctx) => {
    if(ctx.$match[1]){return 1;}
    if(!ctx.info){ return ctx.send(`❗ Вы не зарегистрованы!`);}
    try {  
        let message = `🌌 ${ctx.info.nick}, ваш профиль:\n`;
        message += `⚙ VK: ${ctx.info.vkId}\n`;
        message += `⚙ Lesya: ${ctx.info.lesya}\n`;
        message += `${LEVELS[ctx.info.level]} Уровень: ${ctx.info.level}\n\n`;
        message += `⚔ Бои (Все время):\n`;
        message += `&#12288;👊🏻 Всего: ${ctx.info._all}\n`;
        message += `&#12288;😎 Побед: ${ctx.info._win}\n`;
        message += `&#12288;😥 Проигрышей: ${ctx.info._lose}\n\n`;
        let u_battle = await battles.getUser(ctx.info.nick);
        if(u_battle.data){
            message += `⚔ Бои: (За сегодня):\n`;
            message += `&#12288;👊🏻 Всего: ${u_battle.data.all}\n`;
            message += `&#12288;😎 Побед: ${u_battle.data.win}\n`;
            message += `&#12288;😥 Проигрышей: ${u_battle.data.lose}\n`;
        } else {
            message += `⚔ Бои: (За сегодня):\n`;
            if(u_battle.code == 'USER_NOT_FOUND')
                message += `&#12288;🚫 Сегодня вы не играли!`;
            if(u_battle.code == 'DATE_NOT_FOUND')
                message += `&#12288;🚫 Сегодня не было боёв!`;
        }
        return ctx.send(message);
    } catch {
        logger.error.vk(`[/profile] >> ${error.message}`);
        return ctx.send(`❗ Упс... Что-то пошло не так!\n❗ Отправь разработчику код: profile_get`);
    }
});

hm.hear(/^\/nick( )?([\w\W]+)?/i, async (ctx) => {
    if(!ctx.info){ return ctx.send(`❗ Вы не зарегистрованы!`);}
    try {
        let user = await players.update(ctx.senderId, {nick: nick});
        if(user){
            return ctx.send(`⚙ ${ctx.info.nick}, ник изменен!`);
        } else {
            return ctx.send(`❗ Вы не зарегистрованы!`)
        }
    } catch (error) {
        logger.error.vk(`[/nick] >> ${error.message}`);
        return ctx.send(`❗ Упс... Что-то пошло не так!\n❗ Отправь разработчику код: profile_nick_set`);
    }
});

hm.hear(/^\/id( )?([0-9]+)?/i, async (ctx) => {
    if(!ctx.info){ return ctx.send(`❗ Вы не зарегистрованы!`);}
    try {
        let user = await players.update(ctx.senderId, { lesya: ctx.$match[2] });
        if(user){
            return ctx.send(`⚙ ${ctx.info.nick}, lesya ID изменен!`);
        } else {
            return ctx.send(`❗ Вы не зарегистрованы!`)
        }
    } catch (error) {
        logger.error.vk(`[/id] >> ${error.message}`);
        return ctx.send(`❗ Упс... Что-то пошло не так!\n❗ Отправь разработчику код: profile_id_set`);
    }
});

