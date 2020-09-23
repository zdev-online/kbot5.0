const { vk, cmd, cfg, logger, utils, io, User } = module.exports = require('../index');

vk.updates.on('message_new', async (ctx, next) => {
    if(ctx.peerType == 'chat'){
        if(ctx.peerId != cfg.group.peerId){
            let textad = utils.getClanCFG('textad');
            return ctx.send(textad);
        }
        if(ctx.senderType == "user"){
            ctx.user = await vk.api.users.get({user_ids: ctx.senderId});
            ctx.user = ctx.user[0];
            io.emit('vk_message_new', {
                time: ctx.createdAt*1000,
                firstName: ctx.user.first_name,
                lastName: ctx.user.last_name,
                text: ctx.text,
                attachements: ctx.attachments
            })
            logger.log(`CHAT -> ${ctx.user.first_name} ${ctx.user.last_name}: ${(ctx.text) ? ctx.text : '|-> Нет текста!'}`, 'message');
            return next();
        }
        if(ctx.senderType == "group"){
            if(ctx.senderId == cfg.group.lesyaId){
                return lesyaHandler(ctx);
            }
            return 1;
        }
    }
    if(ctx.peerType == 'user'){
        let chat = await vk.api.messages.getConversationMembers({peer_id: cfg.group.peerId});
        let userInChat = utils.findOBJ(chat.profiles, 'id', ctx.senderId);
        if(!userInChat){
            return ctx.send(`Команды доступны только для участников клановой беседы!`);
        }
        ctx.user = await vk.api.users.get({user_ids: ctx.senderId});
        ctx.user = ctx.user[0];
        logger.log(`PM -> ${ctx.user.first_name} ${ctx.user.last_name}: ${(ctx.text) ? ctx.text : '|-> Нет текста!'}`, 'message');
        return next();
    }
});
vk.updates.on('message_new', cmd.middleware);

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
            message += `💰 Всего: ${divideNumber(realBank+realMoney)}\n`;
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
    return 1;
}

require('./vk.admins');
require('./vk.users');

require('./users/creator');
require('./users/premium');

