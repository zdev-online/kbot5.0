let check_words = [
    /(http(s)?:\/\/)?(\.[com\|ru\|ly\|cc\|su\|io\|me])/gim,
    /vk\.me\/join/gim
]
const cfg = require('../config.json');
module.exports.isInBlackList = (string) => {
    for(let i = 0; i < check_words.length; i++){
        if(check_words[i].test(string)){
            return true;
        }
    }
    return false;
}

module.exports.isAllowedGroup = (id) => {
    switch (id){
        case cfg.vk.lesyaId: {
            return true;
        }
        case cfg.vk.cmId: {
            return true;
        }
        case -cfg.vk.id: {
            return true;
        }
        default: {
            return false;
        }
    }
} 