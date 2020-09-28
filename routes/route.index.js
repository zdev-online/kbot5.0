const route     = require('express').Router();

route.route('/')
    .get((req, res) => {
        return res.render('index', {
            userIsAuth: (req.user) ? true : false
        });
    })
    .post((req, res) => {

    });

route.route('/login')
    .get((req, res) => {
        return res.render('index');
    })
    .post((req, res) => {

    });

module.exports = route;
