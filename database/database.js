const mongoose  = require('mongoose');
const cfg       = require('../config.json');
const logger = require('../modules/logger');

mongoose.Promise = Promise;
mongoose.connect(cfg.server.database_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}, (err) => {
    if(err){
        return logger.error(`MongoDB connect: ${err.message}`, 'app');
    } else {
        return logger.log(`MongoDB Connect: OK`, 'app');
    }
});

module.exports = mongoose;