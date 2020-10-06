const { http, app, io, cfg, vk } = require('../index');

http.listen(cfg.server.port, () => {});
vk.updates.start()
    .then(() => {

    }).catch(() => {

    });