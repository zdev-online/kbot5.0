const route     = require('express').Router();
const AUTH_API  = require('./api.auth');

route.use(AUTH_API);

module.exports = route;