const mongoose  = require('mongoose');
const cfg       = require('../config.json');

mongoose.connect(cfg.server.database_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

module.exports = mongoose;