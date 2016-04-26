'use strict';

var irc = require('irc');
var request = require('request-promise');

module.exports = function(config, clients) {

  //add a new irc client for the current user
  clients[config.twitch_name] = new irc.Client("irc.chat.twitch.tv", config.botName, {
    nick: config.twitch_name,
    password: config.twitch_chat_password,
    channels: config.channels
  });

  //add a build object for updating the front end
  clients[config.twitch_name].build = {};

  var getSumName = request('https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/' + config.summoner_name + '?api_key=1ea122ac-f547-4936-a798-641813065ade');

  getSumName.then(function(data) {
    var sumId = JSON.parse(data)[config.summoner_name].id;

    var getCurrentChamps = request('https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion?api_key=1ea122ac-f547-4936-a798-641813065ade');
    var getMast = request('https://na.api.pvp.net/api/lol/na/v1.4/summoner/' + sumId + '/masteries?api_key=1ea122ac-f547-4936-a798-641813065ade');

    Promise.all([getCurrentChamps, getMast]).then(function(values) {

      //get current champions for validation of chat input
      var champs = {};
      var masteryPages = [];

      //set up our champ validation object
      var champData = JSON.parse(values[0]).data;
      for (var name in champData) {
        var nameLower = name.toLowerCase();
        champs[nameLower] = champData[name];
      }
      //set up the mastery pages array
      JSON.parse(values[1])[sumId].pages.forEach(function(page) {
        masteryPages.push(page.name);
      });

      //set an event listener for the twitch chat
      clients[config.twitch_name].addListener("message", function(from, to, text, message) {

        //check for a valid champ input
        if (text.split(':')[0] === '!champ') {
          //create and normalize the user input
          var champName = text.split(':')[1].toLowerCase();
          //trim whitspace
          champName = champName.trim().split(' ').join('');
          //cut out 's and .s
          champName = champName.split("'").join('');
          champName = champName.split('.').join('');

          //validate champ name
          if (champs[champName]) {
            console.log('valid: ' + champName);
          } else {
            console.log('invalid: ' + champName);
          }
        }

        //check for a valid masteries input
        if (text.split(':')[0] === '!mast') {

        }

        //check for a valid rune input
        if (text.split(':')[0] === '!runes') {

        }

        //check for a valid first ability to max input
        if (text.split(':')[0] === '!max') {

          //normalize user max input
          var max = text.split(':')[1].toLowerCase().trim();

          //validate user max input
          if (max === 'q' || max === 'w' || max === 'e') {
            console.log('valid: ' + max);
          } else {
            console.log('invalid: ' + max);
          }
        }

        // if (text.split(':')[0] === '!item') {
        //
        // }
        // if (text.split(':')[0] === '!boots') {
        //
        // }
        // if (text.split(':')[0] === '!ban-champ') {
        //
        // }
      });
    });
  });
  // clients[config.twitch_name].addListener("join", function(channel, who) {
  //   clients[config.twitch_name].say(channel, 'Welcome');
  // });
};
