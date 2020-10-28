const { vk, cfg, logger, utils, hm, promo, battles, wars } = require('../vk.index');
const { VK, Keyboard } = require('vk-io');
const { HearManager } = require('@vk-io/hear');
const user = new VK({ token: cfg.vk.users.creator.token });
const countdown = require('countdown');
const cmd = new HearManager();
const time = require('moment');
time.locale('ru');

user.updates.start();
user.updates.on('message_new', async (ctx, next) => {
	if(ctx.peerId != cfg.vk.users.creator.peerId){return 1;}
	if(ctx.senderId == cfg.vk.lesyaId){
		try {
			if(/К сожалению, Ваш клан проиграл в этой войне!/gim.test(ctx.text)){
				let end = time(ctx.createdAt*1000).format('HH:mm:ss, DD.MM.YYYY');
				let top = await battles.getTop();
				if(top){
					let message = `🌌 Война завершена!\n😥 Мы проиграли!\n\n`;
					message += `⚔ Боёв: ${top.all}\n`;
					message += `😎 Побед: ${top.win}\n`;
					message += `😥 Поражений: ${top.lose}\n\n`;
					for(let i = 0; i < top.users.length; i++){
						message += `${i+1}. ${top.users[i].nick} - ${top.users[i].all}\n`;
					}
					let post = await user.api.wall.post({
						message: message,
						owner_id: -cfg.vk.id
					});
					let war = await wars.endWar(end, 'Проигрыш', post.post_id);
					return vk.api.messages.send({
						message: '🌌 Результаты КВ', 
						attachment: `wall${-cfg.vk.id}_${post.post_id}`,
						random_id: Math.floor(Math.random() * 10000000),
						peer_id: cfg.vk.peerId
					});
				}
				return 1;
			}
			if(/Ура! Ваш клан одержал победу в этой войне!/gim.test(ctx.text)){
				let end = time(ctx.createdAt*1000).format('HH:mm:ss, DD.MM.YYYY');
				let top = await battles.getTop();
				if(top){
					let message = `🌌 Война завершена!\n😎 Мы победили!\n\n`;
					message += `⚔ Боёв: ${top.all}\n`;
					message += `😎 Побед: ${top.win}\n`;
					message += `😥 Поражений: ${top.lose}\n\n`;
					for(let i = 0; i < top.users.length; i++){
						message += `${i+1}. ${top.users[i].nick} - ${top.users[i].all}\n`;
					}
					let post = await user.api.wall.post({
						message: message,
						owner_id: -cfg.vk.id
					});
					let war = await wars.endWar(end, 'Проигрыш', post.post_id);
					return vk.api.messages.send({
						message: '🌌 Результаты КВ', 
						attachment: `wall${-cfg.vk.id}_${post.post_id}`,
						random_id: Math.floor(Math.random() * 10000000),
						peer_id: cfg.vk.peerId
					});
				}
				return 1;
			}
		} catch(error){
			logger.error.vk(`Конец войны: ${error.message}`);
			return ctx.send(`Ошибка! Отправьте код разрабтчику: war_end_error`);
		}
	}
	try {
		let check = await utils.msg.matchGroupOrUser(ctx.text, vk);
		if(check){
			ctx.deleteMessage({ delete_for_all: true }).catch((error) => {
				return logger.warn.vk(`Не удалось удалить сообщение для всех!`);
			});
			return logger.info.vk(`1) Запрещенное выражение: ${ctx.text}`);
		}
		if(!utils.msg.isInBlackList(ctx.text)){
			ctx.deleteMessage({ delete_for_all: true }).catch((error) => {
				return logger.warn.vk(`Не удалось удалить сообщение для всех!`);
			});
			return logger.info.vk(`2) Запрещенное выражение: ${ctx.text}`);
		}
		if(ctx.hasForwards){
			for(let i = 0; i < ctx.forwards.length; i++){
				if(!utils.msg.isInBlackList(ctx.forwards[i].text || '')){
					ctx.deleteMessage({ delete_for_all: true }).catch((error) => {
						return logger.warn.vk(`Не удалось удалить сообщение для всех!`);
					});
					return logger.info.vk(`3) Запрещенное выражение: ${ctx.text}`);
				}
			}
		}
		return next();
	} catch(error){
		return  logger.error.vk(`[CREATOR] : ${error.message}`);
	}
});
user.updates.on('message_new', cmd.middleware);

hm.hear(/^\/gcheck/i, async (ctx) => {
	if(!ctx.isAdmin || ctx.isAdmin < 4){return ctx.send(`❗ Недостаточно прав!`);}
	try {
		let kicked = [];
		let group = await vk.api.groups.getMembers({offset: 0, count: 1000, group_id: cfg.vk.id});
		let chat = await vk.api.messages.getConversationMembers({peer_id: cfg.vk.peerId});
		for(let i = 0; i < group.items.length; i++){
			let check = utils.findOBJ(chat.profiles, group.items[i], 'id');
			if(!check){
				kicked.push(group.items[i]);
				user.api.groups.ban({
					group_id: cfg.vk.id,
					owner_id: group.items[i],
					comment: `Ты не в беседе клана! Пиши: vk.com/id171745503`,
					comment_visible: true
				});
			}
		}
		let message = `🚫 Кикнуты из группы: ${kicked.length}\n`;
		for(let i = 0; i < kicked.length; i++){
			let [user] = await vk.api.users.get({user_ids: kicked[i]});
			message += `> [id${user.id}|${user.first_name} ${user.last_name}]\n`;
		}
		logger.info.vk(`Из группы кикнуто ${kicked.length} человек!`);
		return ctx.send(message);
	} catch(error){
		logger.error.vk(`[/gcheck] ${error.message}`);
		return ctx.send(`❗ Произошла ошибка!`);
	}
});

cmd.hear(/@(all|online|онлайн|все)/gim, async (ctx) => {
	try {
		await ctx.deleteMessage({delete_for_all: true});
		return vk.api.messages.send({
			peer_id: cfg.vk.peerId,
			message: `🌌 Используйте: /ad | /rob | /war`,
			random_id: Math.floor(Math.random() * 1000000)
		});
	} catch(error) {
		logger.error.vk(`[@all @online] >> ${error.message}`);
		return vk.api.messages.send({
			peer_id: cfg.vk.peerId,
			message: `❗ Произошла ошибка`,
			random_id: Math.floor(Math.random() * 1000000)
		});
	}
});

hm.hear(/\/postpromo( )?(1kkk(_|-)[\w\W]+)?/i, async (ctx) => {
	if(!ctx.isAdmin || ctx.isAdmin < 2){return ctx.send(`❗ Недостаточно прав!`);}
	if(ctx.peerType != 'user'){return ctx.send(`❗ Использовать команду можно только в ЛС Боту`);}
	if(!ctx.$match[2]){return ctx.send(`❗ Укажите промокод!`);}
	try {
		let check = await promo.add(`${ctx.vk.first_name} ${ctx.vk.last_name}`, ctx.$match[2]);
		if(!check){return ctx.send(`❗ Промокод уже существует!`);}
		let post = await user.api.call('wall.post', {
			owner_id: -cfg.vk.id,
			message: 'Новый промокод! Смотрим комменты!',
			poster_bkg_id: utils.randomInteger(1, 30)
		});
		await vk.api.wall.createComment({
			post_id: post.post_id,
			owner_id: -cfg.vk.id,
			message: ctx.$match[2]
		});
		return vk.api.messages.send({
			message: `❗ Новый промокод`, 
			peer_id: cfg.vk.peerId,
			random_id: Math.floor(Math.random() * 100000000),
			keyboard: Keyboard.keyboard([ Keyboard.textButton({ label: `Промо ${ctx.$match[2]}`,color: "positive" }) ]).inline(true)
		});
	} catch (error) {
		logger.error.vk(`[/postpromo] : ${error.message}`);
		return ctx.send(`❗ Произошла ошибка!\n❗ Отправьте разработчику код: post_promo`);
	}
});

setInterval(()=>{
	let downTime = countdown(new Date('2019/10/08'), 'now');
	let status = `❤ Начало: 08.10.2019 | ⌚ Прошло: ${downTime.years} год. ${downTime.months} мес. ${downTime.days} дн. | 🚫 Конец: Никогда`;
	user.api.status.set({
		text: status
	}).catch((e)=>{
		logger.warn.vk(`Ошибка установки статуса: ${e.message}`, 'vk');
	});
}, 1000 * 60 * 10);