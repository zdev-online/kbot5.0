const { http, app, io, cfg, vk, logger, lt } = require('../index');
const cluster = require('cluster');
const fs = require('fs');

fs.writeFileSync(`${__dirname}/site-url.txt`, '', { encoding: "utf-8" });

(async() => {
    if(process.env.NODE_ENV == 'production' && cluster.isMaster){
        try {
            let site = await lt({ port: cfg.server.port, local_host: 'localhost', subdomain: cfg.server.subdomain });
            fs.writeFileSync(`${__dirname}/site-url.txt`, site.url, { encoding: "utf-8" });
            for(let i = 0; i < 2; i++){
                let worker = cluster.fork(process.env.NODE_ENV);
                logger.info.app(`Worker: ${worker.id} Started`);
                worker.on('error', (error) => {
                    logger.error.app(`Worker Error: ${error.message}`);
                });
            }
            return 1;
        } catch(error){
            logger.error.app(`Worker init: Error: ${error.message}`);
            return 1;
        }
    }
    
    http.listen(cfg.server.port, cfg.server.ip, () => {
        logger.info.app(`localhost: https://localhost:${cfg.server.port}/`);
        logger.info.app(`Network: https://localhost:${cfg.server.port}/`);
    });

    vk.updates.start().then(() => {
        logger.info.vk(`VK: Started!`);
    }).catch((error) => {
        logger.error.vk(`VK: Not Started: ${error.message}`);
    });
})();