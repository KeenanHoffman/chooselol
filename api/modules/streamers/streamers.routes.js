'use strict';

var router = require('express').Router();

var streamersController = require('./streamers.controller');

router.post('/build', streamersController.createBuildLobby);
router.post('/get-build', streamersController.getCurrentBuild);
router.post('/get-lobby-status', streamersController.getLobbyStatus);
router.post('/accept-build', streamersController.acceptBuild);
router.get('/remove-build', streamersController.removeBuild);
router.get('/prefs', streamersController.getPrefs);
router.put('/prefs', streamersController.updatePrefs);

module.exports = router;
