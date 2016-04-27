'use strict';

var router = require('express').Router();

var unprotectedRoutes = require('./modules/unprotected/unprotected.routes');
var streamersRoutes = require('./modules/streamers/streamers.routes');

router.use('/', unprotectedRoutes);
router.use('/streamer', streamersRoutes);

module.exports = router;
