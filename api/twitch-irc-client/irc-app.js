'use strict';

var irc = require('irc');

var chatBot = new irc.Client(config.server, config.botName, {
	nick: 'koff01',
  password: 'oauth:c4homw8vo8c1g783btkl1dm6yte8sk',
	channels: config.channels
});

chatBot.addListener("message", function(from, to, text, message) {
	console.log(text);
});

chatBot.addListener("join", function(channel, who) {
	chatBot.say(channel, 'Welcome');
});
