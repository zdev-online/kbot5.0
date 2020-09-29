const route     = require('express').Router();
const ejs       = require('ejs');

route.route('/')
    .get((req, res) => {
        return res.render('index');
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
