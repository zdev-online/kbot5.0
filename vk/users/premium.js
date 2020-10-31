const cfg = require('../../config.json');
const { VK } = require('vk-io');
const premium = module.exports = new VK({ token: cfg.vk.users.premium.token });


