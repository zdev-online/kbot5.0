const route     = require('express').Router();
const jwt       = require('jsonwebtoken');
const cfg       = require('../config.json');
const User      = require('../database/models/user');
const logger    = require('../modules/logger');
const authCheck = require('../middlewares/authCheck');

// Запрет залогиненым делать сюда запрос
route.use((req, res, next) => {
    if(req.user){
        return res.status(403).json({
            error: true,
            message: 'Вы уже зарегистрованны!'
        });
    } else {
        return next();
    }
});

// Авторизация
route.post('/signin', async (req, res) => {
    if(!req.body || !req.body.login || !req.body.password){
        return res.status(404).json({
            error: true,
            message: "Не указан логин или пароль!"
        });
    } else {
        try{
            let user = await User.findOne({login: req.body.login});
            if(!user){
                return res.status(404).json({
                    error: true,
                    message: 'Пользователь не найден!'
                });
            } else {
                if(!user.checkPassword(req.body.password)){
                    return res.status(401).json({
                        error: true,
                        message: 'Логин или пароль неверный!'
                    });
                } else {
                    let token = jwt.sign({
                        id: user._id,
                        login: user.login
                    }, cfg.server.jwt_secret_key);
                    return res.status(200).json({
                        token: `Bearer ${token}`
                    });
                }
            }
        } catch (error) {
            logger.error(`[API] [SIGNIN] Error: ${error}`, 'http');
            return res.status(500).json({
                error: true,
                message: error.message
            });
        }
    }
});

// Регистрация
route.post('/signup', async (req, res) => {
    if(!req.body || !req.body.login || !req.body.password || !req.body.lesyaId || !req.body.lesyaNick || !req.body.vkId){
        return res.status(403).json({
            error: true,
            message: 'Пожалуйста заполните все поля!'
        });
    } else if(req.body.login.length < 8 || req.body.login.length > 24){
        return res.status(401).json({
            error: true,
            message: 'Длина логина должна быть 8 - 24 символа!'
        });
    } else if(req.body.password.length < 8 || req.body.password.length > 50){
        return res.status(401).json({
            error: true,
            message: 'Длина пароля должна быть 8 - 50 символов!'
        });
    } else {   
        try {
            let isLoginExist = await User.findOne({ login: req.body.login });
            if(isLoginExist){
                return res.status(403).json({
                    error: true,
                    message: 'Данный логин уже зарегистрован!'
                });
            } else {
                let user = await new User({
                    login: req.body.login,
                    password: req.body.password,
                    vkId: req.body.vkId,
                    lesyaId: req.body.lesyaId,
                    nick: req.body.lesyaNick
                }).save();
                let token = jwt.sign({
                    id: user._id,
                    login: user.login
                }, cfg.server.jwt_secret_key);
                return res.status(200).json({
                    token: `Bearer ${token}`
                });
            }
        } catch(error) {
            logger.error(`[API] [SIGNUP] Error: ${error}`, 'http');
            return res.status(500).json({
                error: true,
                message: error.message
            });
        }
    }
});

module.exports = route;