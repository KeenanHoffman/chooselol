'use strict';

var router = require('express').Router();

var unprotectedController = require('./unprotected.controller');

router.post('/login', unprotectedController.login);
router.post('/signup', unprotectedController.signup);

module.exports = router;
