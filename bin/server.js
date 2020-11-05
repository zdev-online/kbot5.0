const { cfg, vk, logger, creator } = require('../index');

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