'use strict';

var irc = require('irc');
var config = require('./irc-config.js');

module.exports = new irc.Client(config.server, config.botName, {
	nick: 'koff01',
  password: 'oauth:c4homw8vo8c1g783btkl1dm6yte8sk',
	channels: config.channels
});
