let check_words = [
    /(http(s)?:\/\/)?(\.[com|ru|ly|cc|su|io|me])?/gim,
    /vk\.me\/join/gim
]
const cfg = require('../config.json');

module.exports.matchGroupOrUser = async (string, vk) => {
    try {
        let user = string.match(/\[([a-zA-Z0-9]+)\|[\w]+\]/i);
        if(user){
            if(user[1]){
                let check = await vk.api.utils.resolveScreenName({screen_name: user[1]});
                if(!check){return false;}
                if(check.type == 'group' && check.object_id != cfg.vk.id){
                    return true;
                }
            }
        }
        return false;
    } catch {
        return false;
    }
}

module.exports.isInBlackList = (string) => {
    for(let i = 0; i < check_words.length; i++){
        if(check_words[i].test(string)){
            return true;
        }
    }
    return false;
}