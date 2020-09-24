const { server, app, io, cfg, vk, lt, logger } = require('../index');

server.listen(cfg.server.port, cfg.server.ip, async () => {
    try{
        logger.log(`HTTP Server: ${cfg.server.ip}:${cfg.server.port}`, 'http');
        await vk.updates.start();
        logger.log(`VK Longpool запущен!`, 'vk');
        let tunnel = await lt(cfg.tunnel);
        logger.log(`Сайт клана запущен: ${tunnel.url}!`, 'app');
    } catch(error) {
        logger.error(`Ошибка в инициализации приложения: ${error.message}`, 'app');
        throw false;
    }
});