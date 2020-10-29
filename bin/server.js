const { http, app, io, cfg, vk, logger, lt } = require('../index');
const cluster = require('cluster');
const fs = require('fs');

fs.writeFileSync(`${__dirname}/site-url.txt`, '', { encoding: "utf-8" });

(async() => {
    if(cfg.env.mode == 'production'){
        try {
            for(let i = 0; i < 3; i++){
                let worker = cluster.fork();
                worker.on("error", (error) => {
                    worker.kill(-1);
                    return logger.error.app(`Worker ${worker.id} Error: ${error.message}`);
                });
            }
            if(cluster.isWorker){
                http.listen(cfg.server.port, cfg.server.ip, () => {
                    return logger.info.http(`HTTP Started: ${cluster.worker.id}!`);
                });
                return 1;
            } else {
                vk.updates.start().then(() => {
                    logger.info.vk(`VK: Started!`);
                }).catch((error) => {
                    logger.error.vk(`VK: Not Started: ${error.message}`);
                });
                await siteTunnelStart();
                return 1;
            }
        } catch(error){
            return logger.error.app(`Kosmos Panel Error: ${error.message}`);
        }
    } else {
        if(cluster.isMaster){
            vk.updates.start().then(() => {
                logger.info.vk(`VK: Started!`);
            }).catch((error) => {
                logger.error.vk(`VK: Not Started: ${error.message}`);
            });
        }
        http.listen(cfg.server.port, cfg.server.ip);
        return 1;
    }
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