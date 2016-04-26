'use strict';

var router = require('express').Router();

var streamersController = require('./streamers.controller');

router.get('/build', streamersController.getBuild);
router.get('/prefs', streamersController.getPrefs);
router.put('/prefs', streamersController.updatePrefs);

module.exports = router;
