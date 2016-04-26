'use strict';

const router = require('express').Router();

const streamersRoutes = require('./modules/streamers/streamers.routes');

router.use('/streamer', streamersRoutes);

module.exports = router;
