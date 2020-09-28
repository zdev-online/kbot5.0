const jwt       = require('jsonwebtoken');
const cfg       = require('../config.json');
const User      = require('../database/models/user');
const logger    = require('../modules/logger');

module.exports = function(req, res, next){
    if(!req.headers.authorization){
        return next();
    }
    let userToken = req.headers.authorization.split(' ')[1];
    jwt.verify(userToken, cfg.server.jwt_secret_key, async (err, payload) => {
        if(err){
            logger.error(`[AuthCheck] [JWT] >> ${err.message}`);
            return next();
        } else {
            try {
            let user = await User.findById(payload.id);
                if(!user){return next();}
                req.user = user;
                return next();
            } catch(error){
                logger.error(`[AuthCheck] [Catch]: ${error}`);
                return next();
            }
        }
    });
}
