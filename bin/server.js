const { http, app, io, cfg, vk, logger, lt, creator } = require('../index');
const fs = require('fs');

fs.writeFileSync(`${__dirname}/site-url.txt`, '', { encoding: "utf-8" });

(async() => {
    http.listen(cfg.server.port, cfg.server.ip, () => {
        return logger.info.http(`HTTP Running: ${cfg.server.ip}:${cfg.server.port}!`);
    });
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
    
    if(cfg.isProduction){
        siteTunnelStart();
    }
    return logger.info.app(`Init complete!`);
})();


async function siteTunnelStart(){
    try {
        let site = await lt({ 
            port: cfg.server.port, 
            local_host: 'localhost', 
            subdomain: cfg.server.subdomain 
        });
        fs.writeFileSync(`${__dirname}/site-url.txt`, site.url, { encoding: "utf-8" });
        site.on('error', (error) => {
            logger.error.app(`Kosmos Panel Error: ${error.message}`);
        });
        return site;
    } catch(error){
        logger.error.app(`Kosmos Panel Error: ${error.message}`);
        return 0;
    } 
}