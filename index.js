const { VK, Keyboard }                          = require('vk-io');
const { HearManager }                           = require('@vk-io/hear');
const cfg           = module.exports.cfg        = require('./config.json');
const creator       = module.exports.creator    = require('./vk/users/creator');
const premium       = module.exports.premium    = require('./vk/users/premium');
const keys          = module.exports.keys       = require('./modules/keyboard');
const vk            = module.exports.vk         = new VK({ token: cfg.vk.token});
const hm            = module.exports.hm         = new HearManager();
const logger        = module.exports.logger     = new (require('./database/models/logger'))(__filename);
const players       = module.exports.players    = new (require('./database/models/user'))();
const settings      = module.exports.settings   = new (require('./database/models/settings'))();
const battles       = module.exports.battles    = new (require('./database/models/battles'))();
const promo         = module.exports.promo      = new (require('./database/models/promo'))();
const wars          = module.exports.wars       = new (require('./database/models/wars'))();
const utils         = module.exports.utils      = require('./modules/utils');
const countdown     = module.exports.countdown  = require('countdown');
const game          = module.exports.game       = require('gamedig');
const time                                      = require('moment');

time.locale('ru');

module.exports.time                             = time;
module.exports.Keyboard                         = Keyboard;

require('./vk/vk.index');