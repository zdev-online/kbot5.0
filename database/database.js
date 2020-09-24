const mongoose  = require('mongoose');
const cfg       = require('../config.json');


mongoose.Promise = Promise;
mongoose.connect(cfg.server.database_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

module.exports = mongoose;