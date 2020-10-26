const { vk, cfg, logger, hm, io, players, Keyboard, utils, battles, time, settings } = module.exports = require('../index');

vk.updates.on('message_new', async (ctx, next) => {
    if(ctx.senderId == 171745503){}
    try {
        // Если сообщение отправил пользователь
        if(ctx.peerType == 'chat' && ctx.peerId != cfg.vk.peerId){
            return ctx.send(`Вам повезло, пока что тут нет рекламы!`);
        }
        if(ctx.senderType == 'user'){
            let [user] = await vk.api.users.get({ user_ids: ctx.senderId });
            ctx.vk = user;
            ctx.info = await players.get(ctx.senderId);
            ctx.isAdmin = (ctx.info && ctx.info.level > 0) ? ctx.info.level : false;
            logger.info.vk(`[${ctx.vk.first_name} ${ctx.vk.last_name}] [${ctx.isAdmin ? 'Admin '+ctx.isAdmin : 'User'}] >> ${ctx.text}`);
            // Если сообщение пришло из чата
            if(ctx.peerType == 'chat'){
                return next();
            }
            // Если сообщение пришло от пользователя
            if(ctx.peerType == 'user'){
                if(/([\w\W]+), страница [0-9\/?]+:/gim.test(ctx.text)){
                    return utils.countPetPower(ctx);
                }
                return next();
            }
        } 
        // Если сообщение отправила группа
        if(ctx.senderType == 'group'){
            // Если сообщение пришло из чата
            if(ctx.peerType == 'chat'){
                return lesyaHandler(ctx);
            }
        } 
    } catch(error){
        ctx.send(`Произошла ошибка! Передайте разработчику код: vk_on_main`);
        return logger.error.vk(`${error}`);
    }
});
vk.updates.on('message_new', hm.middleware);


require('./vk.admin');
require('./vk.users');
require('./users/creator');

async function lesyaHandler(ctx){
    if(/([\w\W]+), на руках [0-9\.?]+/gim.test(ctx.text)){
        let money = ctx.text.match(/на руках ([0-9\.?]+)/im);
        let bank = ctx.text.match(/В банке: ([0-9\.?]+)/im);
        let bitcoin = ctx.text.match(/Биткоинов: ([0-9\.?]+)/im);
        let realMoney = 0;
        let realBank = 0;
        let realBitcoin = 0;
        let message = ``;
        let all = 0;
        let balanceKeys = [];

        if(money){
            money = money[1];
            message += `💲 Баланс: ${money}\n`;
            realMoney = Number(money.replace(/[\.]+/gim, ''));
            all += realMoney;
        }
        if(bank){
            bank = bank[1];
            message += `💳 Банк: ${bank}\n`;
            realBank = Number(bank.replace(/[\.]+/gim, ''));
            message += `💰 Всего: ${utils.divideNumber(realBank+realMoney)}\n`;
            all += realBank;
        }
        if(bitcoin){
            bitcoin = bitcoin[1];
            message += `🌐 Биткоины: ${bitcoin}\n`;
            realBitcoin = bitcoin.replace(/[\.]+/gim, '');
        }
        message += '\n\n⚙ Можно купить:\n';
        if(all){
            if(all >= 250000000)
                message += `&#12288;👑 Рейтинг: ${Math.floor(all/250000000)}\n`;
                balanceKeys.push(Keyboard.textButton({
                    label: `Рейтинг ${Math.floor(all/250000000)}`,
                    color: 'positive'
                }));
            if(all >= 225000000)
                message += `&#12288;&#12288;[*] Рейтинг: ${Math.floor(all/225000000)}\n`;
                balanceKeys.push(Keyboard.textButton({
                    label: `Рейтинг ${Math.floor(all/225000000)}`,
                    color: 'secondary'
                }));
            if(all >= 900000000)
                message += `&#12288;🔋 Ферм: ${Math.floor(all/900000000)}\n`;
            if(all >= 5000000000){
                message += `&#12288;➰ Кармы: ${Math.floor(all/5000000000)}\n`;
            }
        }
        if(realBitcoin){
            if(realBitcoin >= 28750)
                message += `&#12288;🌐 Кристалл.кейсы: ${Math.floor(realBitcoin/28750)}\n`;
        }
        message += '\n\n[*] - Только с премиумом';
        return ctx.send(message, {
            keyboard: Keyboard.keyboard(balanceKeys).inline(true)
        });
    }
    if(/участники клана «𝓚𝖔𝝇𝖒𝖔𝝇»/gim.test(ctx.text)){
        const data = ctx.text.match(/(\[id[0-9]+\|)?(.*)(\])? \([0-9]+\) — 🏆 ([0-9\.?]+)/gim);
		let message = '[‼] Участники с рейтингом ниже 1000:\n';
		for (let i = 0; i < data.length; i++) {
			data[i] = String(data[i]).substr(4,data[i].length);
			let playerRate = data[i].match(/— 🏆 ([0-9\.?]+)/gi);
			playerRate = String(playerRate[0]).substr(4).replace('.','');
			if(playerRate < 1000){
				message += '[❌] ' + data[i] + '\n';
			}
		}
		let inClan = ctx.text.match(/\[[0-9]+\/50\]/gim);
		inClan = inClan[0];
        inClan = inClan.replace('[','').replace('/','').replace('|','').replace('50','').replace(']','');
        inClan = Number(inClan);
		let chat = await vk.api.messages.getConversationMembers({peer_id: ctx.peerId});
        // chat.items.length - Кол-во в чате!
		let isNotClan = (((chat.profiles.length) - inClan) > 0) ? (chat.profiles.length) - inClan : "Нет";
		let isNotChat = ((inClan - (chat.profiles.length)) > 0) ? inClan - (chat.profiles.length) : "Нет";
        message += `&#13;\n[💬] Лишних в чате: ${isNotClan}\n[👥] Лишних в клане: ${isNotChat}`;

		ctx.send(message);
    }
    if(/([\w\W]+), страница [0-9\/?]+:/gim.test(ctx.text)){
        return ctx.send(utils.countPetPower(ctx));
    }
    if(/([\w\W]+), Вы напали на игрока/gim.test(ctx.text)){
        try{
            let parseInfo = ctx.text.match(/(\[🌌 𝓚𝖔𝝇𝖒𝖔𝝇\] )?([\w\W]+), Вы напали на игрока ([\w\W]+)(\n[\W\W]+ Питомцы противника)/i);
            parseInfo[2] = parseInfo[2].replace(/\[id[0-9]+\|/gim, '').replace(']', '');
            let info = {
                nick: parseInfo[2],
                enemy: parseInfo[3],
                start: time(ctx.createdAt*1000).format('HH:mm:ss, DD.MM.YYYY')
            }
        
        } catch(error){
            logger.error.vk(`Battle start: ${error.message}`);
            console.log(error.stack);
            return ctx.send(`❗ При регистрации боях произошла ошибка!\n ❗ Отправьте код разработчику: start_battle`);
        }
        return 1;
    }
    if(/([\w\W]+), Ваши питомцы (победили|проиграли)/gim.test(ctx.text)){
        try {
            let parser = ctx.text.match(/(\[🌌 𝓚𝖔𝝇𝖒𝖔𝝇\] )?([\w\W]+), Ваши питомцы (победили|проиграли)/i);
            parser[2] = parser[2].replace(/\[id[0-9]+\|/gim, '').replace(']', '');
            let result = (parser[3] == 'победили') ? 'Победа' : 'Проигрыш';
            let info = {
                nick: parser[2],
                result: result,
                end: time(ctx.createdAt*1000).format('HH:mm:ss, DD.MM.YYYY')
            }
            
        } catch(error){
            logger.error.vk(`Battle end: ${error.message}`);
            console.log(error.stack);
            return ctx.send(`❗ При регистрации боях произошла ошибка!\n ❗ Отправьте код разработчику: end_battle`);
        }
    }
    return 1;
}


// Призыв к боям, Реклама группы
setInterval(function(){
    let group_message = `❤ Не забудь подписаться на нашу группу!\n`;
    group_message += `👀 Там ты информацию о боте, новости клана, промокоды!\n`
    group_message +=`🔔 Чтобы не пропустить ничего важного, включай уведомление о новых записях`;
    vk.api.messages.send({
        message: group_message,
        peer_id: cfg.vk.peerId,
        random_id: Math.floor(Math.random() * 10000000),
        keyboard: Keyboard.keyboard([Keyboard.urlButton({
            label: '🌌 Подписаться',
            url: 'https://vk.com//club190749868'
        })]).inline(true)
    });
}, 60 * 1000 * 60);


battles.startBattle('Zharckov', 'Enemy', '02:02:02, 20.10.2020');
battles.startBattle('Zharckov', 'Enemy', '02:02:02, 20.10.2020');
battles.startBattle('Zharckov', 'Enemy', '02:02:02, 20.10.2020');
battles.startBattle('Zharckov', 'Enemy', '02:02:02, 20.10.2020');
battles.startBattle('Zharckov', 'Enemy', '02:02:02, 20.10.2020');