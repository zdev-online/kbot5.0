const { hm, cfg, logger, players, io, time, vk, settings } = require('./vk.index');
const fs = require('fs');
const os = require('os');

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
    CMDS += `[${LEVELS[item.level]}] `;
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

hm.hear(/^\/cmd/i, (ctx) => {
    return ctx.send(CMDS);
});

hm.hear(/^\/check/i, async (ctx) => {
    let uptime = formatUptime(process.uptime());
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

hm.hear(/^\/stuff/i, async (ctx) => {
    try {
        let admins = await players.getAdmins();
        if(!admins){ return ctx.send(`❗ Управляющих не найдено!`); }
        let message = `🌌 Управляющие беседы:\n\n`;
        for(let i = 0; i < admins.length; i++){
            let user = await vk.api.users.get({ user_ids: admins[i].vkId });
            message += `[${LEVELS[admins[i].level]}] ${user[0].first_name} ${user[0].last_name}\n`;
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

function formatUptime (time){
    function pad(s){
        return (s < 10 ? '0' : '') + s;
    }
    let hours = Math.floor(time / (60*60));
    let minutes = Math.floor(time % (60*60) / 60);
    let seconds = Math.floor(time % 60);
    return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
}
