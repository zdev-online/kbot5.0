const cfg = require('../../config.json');
const { VK } = require('vk-io');
const creator = module.exports = new VK({ token: cfg.vk.users.creator.token });
