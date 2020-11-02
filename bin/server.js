const { 
    cfg, vk, logger, creator
} = require('../index');
const fs = require('fs');

fs.writeFileSync(`${__dirname}/site-url.txt`, '', { encoding: "utf-8" });

(async() => {
    vk.updates.start().then(()=>{
        return logger.info.app(`VK Running: group_${cfg.vk.id}!`);
    }).catch((error)=>{
        return logger.error.app(`VK Start-Error: ${error.message}!`);
    });
    creator.updates.start().then(() => {
        return logger.info.app(`Creator Started!`);
    }).catch((error) => {
        return logger.error.app(`User [Creator] Error ${error.message}`);
    });
    return logger.info.app(`Init complete!`);
})();