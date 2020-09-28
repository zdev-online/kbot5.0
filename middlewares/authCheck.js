const jwt       = require('jsonwebtoken');
const cfg       = require('../config.json');
const User      = require('../database/models/user');
const logger    = require('../modules/logger');

module.exports = (req, res, next) => {
    let userToken = req.headers.authorization.split(' ')[1];
    jwt.verify(userToken, cfg.server.jwt_secret_key, (err, payload) => {
        if(err){
            logger.error(`[AuthCheck] [JWT] >> ${err.message}`);
            return next();
        } else {
            User.findById(payload.id, (error, user) => {
                if(err){
                    logger.error(`[AuthCheck][Model] >> ${error.message}`, 'http');
                    return next();
                } else if(!user){
                    return next();
                } else {
                    req.user = user;
                    return next();
                }
            });
            return next();
        }
    });
}