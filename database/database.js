const mongoose  = require('mongoose');
const cfg       = require('../config.json');


mongoose.Promise = Promise;
mongoose.set('debug', true);
mongoose.connect(cfg.server.database_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

module.exports = mongoose;