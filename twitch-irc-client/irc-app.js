'use strict';

var chatBot = require('./chat-bot.js');

chatBot.addListener("message", function(from, to, text, message) {
	console.log(text);
});

chatBot.addListener("join", function(channel, who) {
	chatBot.say(channel, 'Welcome');
});
