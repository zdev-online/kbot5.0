const passport  = require('passport'); 
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy   = require('passport-jwt').Strategy;
const ExtractJWT    = require('passport-jwt').ExtractJwt;
const jwt           = require('jsonwebtoken');
const cfg           = require('../config.json');

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: cfg.server.jwt_secret
}, function(payload, done){
    User.findOne({_id: payload.id}, function(err, user){
        if(err){
            return done(err, false);
        }
        if(user){
            return done(null, user);
        }
        return done(null, false);
    });
}));
passport.use(new LocalStrategy(function(username, password, done){
    user.findOne({login: username}, function(err, user){
        if(err) return done(err, false);
        if(!user || !user.checkPassword(password)) return done(null, false);
        return done(null, user);
    });
}));

module.exports = {
    passport
}