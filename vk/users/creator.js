const { vk, cfg, logger } = require('../vk.index');
const { VK } = require('vk-io');
const user = new VK({ token: cfg.vk.users.creator.token });
const countdown = require('countdown');

user.updates.start();
user.updates.on('message_new', (ctx, next) => {
	if(ctx.peerId != cfg.vk.users.creator.peerId){return 1;}
	try {

	} catch(error){
		
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