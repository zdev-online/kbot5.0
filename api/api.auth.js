const route     = require('express').Router();
const jwt       = require('jsonwebtoken');
const cfg       = require('../config.json');
const User      = require('../database/models/user');

route.post('/login', async (req, res) => {
    if(!req.body || !req.body.login || !req.body.password){
        return res.status(404).json({
            error: true,
            message: "Не указан логин или пароль!"
        });
    } else {
        try{
            let user = await User.findOne({login: login});
            if(!user){
                return res.status(404).json({
                    error: true,
                    message: 'Пользователь не найден!'
                });
            } else {
                // Добавить проверку на правильность пароля!!!!!!!!!!
                // Добавить проверку на правильность пароля!!!!!!!!!!
                // Добавить проверку на правильность пароля!!!!!!!!!!
                // Добавить проверку на правильность пароля!!!!!!!!!!
                // Добавить проверку на правильность пароля!!!!!!!!!!
                // Добавить проверку на правильность пароля!!!!!!!!!!
                let token = jwt.sign({
                    id: user._id,
                    login: user.login
                }, cfg.server.jwt_secret_key);
                return res.status(200).json({
                    token: token
                });
            }
        } catch (error) {
            return res.status(404).json({
                error: true,
                message: error.message
            });
        }
    }
});

module.exports = route;