'use strict';

var router = require('express').Router();

var streamersController = require('./streamers.controller');

router.get('/', streamersController.getBuild);
router.get('/', streamersController.getPrefs);
router.put('/', streamersController.updatePrefs);

module.exports = router;
