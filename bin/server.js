const { http, app, io, cfg, vk } = require('../index');

http.listen(cfg.server.port, cfg.server.ip, () => {
    console.log(`localhost: https://localhost:${cfg.server.port}/`);
    console.log(`Network: https://localhost:${cfg.server.port}/`);
});
vk.updates.start()
    .then(() => {

    }).catch(() => {

    });