const { types } = require("node-sass");

module.exports.countPetPower = function (ctx){
    if(!ctx.hasForwards){
        let data = ctx.text.split(/\n/gim);
        let page = data[0].match(/страница [0-9\/?]+/i);
        page = page[0].replace('страница ', '');
        data.splice(0, 1);
        let tempPetInfo = [];
        for(let i = 0; i < data.length; i++){
            let tempString = data[i].match(/([\w\W]+) (\[[0-9]+\]) ([\w\W]+) — (❤️ [0-9]+)?( \| 💢 [0-9]+)?( \| 🧿 [0-9]+)?/i);
            tempString[1] = tempString[1].substring(0, tempString[1].length - 1);
            tempPetInfo.push({
                id: tempString[1],
                name: tempString[3],
                level: (tempString[2]) ? parseInt(tempString[2].replace('[', '').replace(']', '')) : 0,
                hp: (tempString[4]) ? parseInt(tempString[4].replace(/(❤️)/i, '')) : 0,
                damage: (tempString[5]) ? parseInt(tempString[5].replace(/( \| 💢)/i, '')) : 0,
                magic: (tempString[6]) ? parseInt(tempString[6].replace(/( \| 🧿)/i, '')) : 0
            });
        }
        let maxLevel = tempPetInfo[0];
        let maxHp = tempPetInfo[0];
        let maxDamage = tempPetInfo[0];
        let maxMagic = tempPetInfo[0];
        for(let i = 0; i < tempPetInfo.length; i++){
            if(maxLevel.level < tempPetInfo[i].level){
                maxLevel = tempPetInfo[i];
            }
            if(maxHp.hp < tempPetInfo[i].hp){
                maxHp = tempPetInfo[i];
            }
            if(maxDamage.damage + maxMagic.magic < tempPetInfo[i].damage + tempPetInfo[i].magic){
                maxDamage = tempPetInfo[i];
            }
        }
        let stats_message = `Статистика питомцев [${page}]:\n`;
        stats_message += `🌀 По Уровню: ${maxLevel.id} ${maxLevel.name} - ${maxLevel.level}\n`;
        stats_message += `❤ По ХП: ${maxHp.id} ${maxHp.name} - ${maxHp.hp}\n`;
        stats_message += `💢 По Урону: ${maxDamage.id} ${maxDamage.name} - ${maxDamage.damage}\n`;

        stats_message += `\n(Тип: Номер. Ник - Кол-Во)\n`;
        stats_message += 'Лайфхак: Перешлите несколько сообщений с питомами мне в ЛС и я посчитаю всех сразу!';
        return stats_message;
    } else {
        let stats_message = '';
        stats_message += `\n(Тип: Номер. Ник - Кол-Во)\n\n`;
        for(let i = 0; i < ctx.forwards.length; i++){
            let message = ctx.forwards[i].text;
            let data = message.split(/\n/gim);
            let page = data[0].match(/страница [0-9\/?]+/i);
            page = page[0].replace('страница ', '');
            data.splice(0, 1);
            let tempPetInfo = [];
            for(let i = 0; i < data.length; i++){
                let tempString = data[i].match(/([\w\W]+) (\[[0-9]+\]) ([\w\W]+) — (❤️ [0-9]+)?( \| 💢 [0-9]+)?( \| 🧿 [0-9]+)?/i);
                tempString[1] = tempString[1].substring(0, tempString[1].length - 1);
                tempPetInfo.push({
                    id: tempString[1],
                    name: tempString[3],
                    level: (tempString[2]) ? parseInt(tempString[2].replace('[', '').replace(']', '')) : 0,
                    hp: (tempString[4]) ? parseInt(tempString[4].replace(/(❤️)/i, '')) : 0,
                    damage: (tempString[5]) ? parseInt(tempString[5].replace(/( \| 💢)/i, '')) : 0,
                    magic: (tempString[6]) ? parseInt(tempString[6].replace(/( \| 🧿)/i, '')) : 0
                });
            }
            let maxLevel = tempPetInfo[0];
            let maxHp = tempPetInfo[0];
            let maxDamage = tempPetInfo[0];
            let maxMagic = tempPetInfo[0];
            for(let i = 0; i < tempPetInfo.length; i++){
                if(maxLevel.level < tempPetInfo[i].level){
                    maxLevel = tempPetInfo[i];
                }
                if(maxHp.hp < tempPetInfo[i].hp){
                    maxHp = tempPetInfo[i];
                }
                if(maxDamage.damage < tempPetInfo[i].damage){
                    maxDamage = tempPetInfo[i];
                }
                if(maxMagic.magic < tempPetInfo[i].magic){
                    maxMagic = tempPetInfo[i];
                }
            }
            stats_message += `Статистика питомцев ${page}:\n`;
            stats_message += `🌀 По Уровню: ${maxLevel.id} ${maxLevel.name} - ${maxLevel.level}\n`;
            stats_message += `❤ По ХП: ${maxHp.id} ${maxHp.name} - ${maxHp.hp}\n`;
            stats_message += `💢 По Урону: ${maxDamage.id} ${maxDamage.name} - ${maxDamage.damage}\n`;
            stats_message += `🧿 По Магии: ${maxMagic.id} ${maxMagic.name} - ${maxMagic.magic}\n`;
            stats_message += `\n=-=-=-=-=-=-=-=-=-=\n`;
        }
        return stats_message;
    }
}

module.exports.divideNumber = function (x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

module.exports.findOBJ = function(array, value, key){
    if(!Array.isArray){ throw new Error(`Передан не массив`); }
    for(let i = 0; i < array.length; i++){
        if(array[i][key] == value){
            return {
                index: i,
                object: array[i]
            }
        }
    }
    return false;
}