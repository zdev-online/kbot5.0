const { 
    vk, cfg, logger, hm,
    players, Keyboard, utils, 
    battles, time, settings, 
    wars, keys, creator, game,
    countdown
} = module.exports = require('../index');

let TOTAL_PING = 0;

vk.updates.on('message_new', async (ctx, next) => {
    try {
        TOTAL_PING = (TOTAL_PING + ((time() - time(ctx.createdAt*1000))/1000))/2;
        // Если сообщение отправил пользователь
        if(ctx.peerType == 'chat' && ctx.peerId != cfg.vk.peerId){
            logger.info.vk(`Отправлена реклама: SID: ${ctx.senderId} PID: ${ctx.peerId}`);
            let textAD = await settings.adText();
            return ctx.send(textAD || '*Реклама*', {
                keyboard: Keyboard.keyboard(keys.ad)
            });
        }
        if(ctx.senderType == 'user'){
            let [user] = await vk.api.users.get({ user_ids: ctx.senderId });
            ctx.vk = user;
            ctx.info = await players.get(ctx.senderId);
            ctx.isAdmin = (ctx.info && ctx.info.level > 0) ? ctx.info.level : false;
            logger.message(`[${ctx.vk.first_name} ${ctx.vk.last_name}] [${ctx.isAdmin ? 'Admin '+ctx.isAdmin : 'User'}] >> ${ctx.text}`);
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
        console.log(error.stack);
        return logger.error.vk(`${error}`);
    }
});
vk.updates.on('message_new', hm.middleware);

creator.updates.on('message_new', async (ctx, next) => {
	if(ctx.senderId == 171745503){
		if(/!(zombie|зомби|гозомби|gozombi|gz|гз)/i.test(ctx.text)){
			let message = `⚙ Статистика GoZombi 2014:\n`;
			let cs = await game.query({
				type: 'cs16',
				host: "146.255.194.18",
				port: "27091"
			});
			cs.players = cs.players.sort((a, b) => { return b.score - a.score});
			message += `⚙ PING: ${cs.ping}\n`;
			message += `⚙ Карта: ${cs.map}\n`;
			message += `⚙ Игроков: [${cs.players.length} \\ ${cs.maxplayers}]\n`;
			cs.players.forEach((item, i) => {
				message += `&#12288;${i+1}. ${item.name} - ${item.score}\n`;
			})
			return ctx.send(message, {
				dont_parse_links: true
			});
		}
	}
	try {
		let check = await utils.msg.matchGroupOrUser(ctx.text, vk);
		if(check){
			ctx.deleteMessage({ delete_for_all: true });
			return logger.info.vk(`1) Запрещенное выражение: ${ctx.text}`);
		}
		if(!utils.msg.isInBlackList(ctx.text)){
			ctx.deleteMessage({ delete_for_all: true });
			return logger.info.vk(`2) Запрещенное выражение: ${ctx.text}`);
		}
		if(ctx.hasForwards){
			for(let i = 0; i < ctx.forwards.length; i++){
				if(!utils.msg.isInBlackList(ctx.forwards[i].text || '')){
					ctx.deleteMessage({ delete_for_all: true });
					return logger.info.vk(`3) Запрещенное выражение: ${ctx.text}`);
				}
			}
		}
		return next();
	} catch(error){
		return  logger.error.vk(`[CREATOR] : ${error.message}`);
	}
});

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
            await battles.startBattle(info.nick, info.enemy, info.start);
            return 1;
        } catch(error){
            logger.error.vk(`Battle start: ${error.message}`);
            console.log(error.stack);
            return ctx.send(`❗ При регистрации боях произошла ошибка!\n ❗ Отправьте код разработчику: start_battle`);
        }
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
            let data = await battles.endBattle(info.nick, info.result, info.end);
            if(data){
                await players.updateBattleStats({
                    nick: info.nick,
                    all: 1,
                    win: (info.result == 'Победа') ? 1 : 0,
                    lose: (info.result == 'Победа') ? 0 : 1
                });
                let message = `🌌 ${info.nick}, бой засчитан!\n`;
                message += `👊🏻 Всего: ${data.all}\n`;
                message += (data.user_norm) ? `✅ Норма [${data.norm}]: Выполнена` : `🚫 Норма [${data.norm}]: Не выполенена!`; 
                return ctx.send(message, {
                    keyboard: Keyboard.keyboard([
                        Keyboard.textButton({label: 'Бой', color: 'positive'})
                    ]).inline(true)
                });
            }
        } catch(error){
            logger.error.vk(`Battle end: ${error.message}`);
            console.log(error.stack);
            return ctx.send(`❗ При регистрации боях произошла ошибка!\n ❗ Отправьте код разработчику: end_battle`);
        }
    }
    if(/Война началась! Противник - «([\w\W]+)»/gim.test(ctx.text)){
        let enemy = ctx.text.match(/Война началась! Противник - «([\w\W]+)»/i);
        enemy = enemy[1];
        let start = time(ctx.createdAt*1000).format('HH:mm:ss, DD.MM.YYYY');
        let war = await wars.startWar(start, enemy);
        if(war){
            return ctx.send(`🌌 Клановая война начата, жду результатов...`);
        } else {
            return 1;
        }
    }
    if(/К сожалению, Ваш клан проиграл в этой войне!/gim.test(ctx.text)){
        let end = time(ctx.createdAt*1000).format('HH:mm:ss, DD.MM.YYYY');
        await wars.endWar(end, 'Проигрыш');
        return vk.api.messages.send({
            message: '🌌 КВ Зарегистровано: Проигрыш', 
            random_id: Math.floor(Math.random() * 10000000),
            peer_id: cfg.vk.peerId
        });
    }
    if(/Ура! Ваш клан одержал победу в этой войне!/gim.test(ctx.text)){
        let end = time(ctx.createdAt*1000).format('HH:mm:ss, DD.MM.YYYY'); 
        await wars.endWar(end, 'Проигрыш');
        return vk.api.messages.send({
            message: '🌌 КВ Зарегистровано: Победа', 
            random_id: Math.floor(Math.random() * 10000000),
            peer_id: cfg.vk.peerId
        });
    }
    return 1;
}

// Призыв к боям, Реклама группы
setInterval(function(){
    let group_message = `❤ Не забудь подписаться на нашу группу!\n`;
    group_message += `👀 Там ты информацию о боте, новости клана, промокоды!\n`
    group_message +=`🔔 Чтобы не пропустить ничего важного, включай уведомление о новых записях\n\n`;
    group_message += `⚙ Общий пинг: ${TOTAL_PING.toFixed(3)} сек`;
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

// Мой статус 
setInterval(()=>{
	let downTime = countdown(new Date('2019/10/08'), 'now');
	let status = `❤ Начало: 08.10.2019 | ⌚ Прошло: ${downTime.years} год. ${downTime.months} мес. ${downTime.days} дн. | 🚫 Конец: Никогда`;
	creator.api.status.set({
		text: status
	}).catch((e)=>{
		logger.warn.vk(`Ошибка установки статуса: ${e.message}`, 'vk');
	});
}, 1000 * 60 * 10);

require('./vk.admin');
require('./vk.users');
