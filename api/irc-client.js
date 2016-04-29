'use strict';

var irc = require('irc');
var request = require('request-promise');

module.exports = function(config, clients, io) {
  return new Promise(function(resolve) {
    //add a new irc client for the current user
    clients[config.twitch_name] = new irc.Client("irc.chat.twitch.tv", 'Heart-Of-Gold-Bot', {
      nick: config.twitch_name,
      password: config.twitch_chat_password,
      channels: ['#' + config.twitch_name]
    });

    //add a build object for updating the front end
    clients[config.twitch_name].build = {
      masteryPages: '',
      runePages: '',
      votes: {
        champs: {},
        masteries: {},
        runes: {},
        max: {
          'q': 0,
          'w': 0,
          'e': 0
        }
      }
    };

    var getSumName = request('https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/' + config.summoner_name + '?api_key=' + process.env.LOL_API_KEY);

    getSumName.then(function(data) {
      var sumId = JSON.parse(data)[config.summoner_name].id;
      // console.log(sumId);
      var getCurrentChamps = request('https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion?api_key=' + process.env.LOL_API_KEY);
      var getMast = request('https://na.api.pvp.net/api/lol/na/v1.4/summoner/' + sumId + '/masteries?api_key=' + process.env.LOL_API_KEY);
      var getRunes = request('https://na.api.pvp.net/api/lol/na/v1.4/summoner/' + sumId + '/runes?api_key=' + process.env.LOL_API_KEY);

      Promise.all([getCurrentChamps, getMast, getRunes]).then(function(values) {

          //set up our champ validation of chat input
          var champs = {};
          var champData = JSON.parse(values[0]).data;
          for (var name in champData) {
            var nameLower = name.toLowerCase();
            champs[nameLower] = champData[name];
          }

          //set up the mastery pages array for validation of chat input
          var masteryPages = [];
          clients[config.twitch_name].build.masteryPages = JSON.parse(values[1])[sumId].pages;
          JSON.parse(values[1])[sumId].pages.forEach(function(page) {
            masteryPages.push(page.name);
          });

          //set up rune pages array for validation of chat input
          var runePages = [];
          clients[config.twitch_name].build.runePages = JSON.parse(values[2])[sumId].pages;
          JSON.parse(values[2])[sumId].pages.forEach(function(page) {
            runePages.push(page.name);
          });

          //Let chat know voting is open
          clients[config.twitch_name].say('#' + config.twitch_name, 'HeartOfGold.lol Voting is Open!!!');

          //set an event listener for the twitch chat
          clients[config.twitch_name].addListener("message", function(from, to, text, message) {

            //check for a valid champ name input
            if (text.split(':')[0] === '!champ') {

              //create and normalize the user input
              var champName = text.split(':')[1].toLowerCase();
              //trim whitspace
              champName = champName.trim().split(' ').join('');
              //cut out 's and .s
              champName = champName.split("'").join('');
              champName = champName.split('.').join('');

              //validate champ name input
              if (champs[champName]) {
                console.log('valid: ' + champName);
                if (clients[config.twitch_name].build.votes.champs[champName]) {
                  clients[config.twitch_name].build.votes.champs[champName]++;
                } else {
                  clients[config.twitch_name].build.votes.champs[champName] = 1;
                }
                io.in(config.twitch_name).emit('build update', clients[config.twitch_name].build.votes);
                io.emit('build update', clients[config.twitch_name].build.votes);
              } else {
                console.log('invalid: ' + champName);
              }
              // console.log(clients[config.twitch_name].build);
            }

            //check for a valid masteries input
            if (text.split(':')[0] === '!mast') {

              //normalize mastery page input
              var masteryNumber = text.split(':')[1].trim();

              //check for valid mastery page input
              if (masteryPages[masteryNumber - 1]) {
                console.log('valid: ' + masteryPages[masteryNumber - 1]);
                if (clients[config.twitch_name].build.votes.masteries[(masteryNumber - 1)]) {
                  clients[config.twitch_name].build.votes.masteries[(masteryNumber - 1)]++;
                } else {
                  clients[config.twitch_name].build.votes.masteries[(masteryNumber - 1)] = 1;
                }
                io.in(config.twitch_name).emit('build update', clients[config.twitch_name].build.votes);
                io.emit('build update', clients[config.twitch_name].build.votes);
              } else {
                console.log('invalid: ' + masteryNumber);
              }
              // console.log(clients[config.twitch_name].build);
            }

            //check for a valid rune input
            if (text.split(':')[0] === '!runes') {

              //normalize rune page input
              var runeNumber = text.split(':')[1].trim();

              //check for valid rune page input
              if (runePages[runeNumber - 1]) {
                console.log('valid: ' + runePages[runeNumber - 1]);
                if (clients[config.twitch_name].build.votes.runes[(runeNumber - 1)]) {
                  clients[config.twitch_name].build.votes.runes[(runeNumber - 1)]++;
                } else {
                  clients[config.twitch_name].build.votes.runes[(runeNumber - 1)] = 1;
                }
                io.in(config.twitch_name).emit('build update', clients[config.twitch_name].build.votes);
                io.emit('build update', clients[config.twitch_name].build.votes);
              } else {
                console.log('invalid: ' + runeNumber);
              }
              // console.log(clients[config.twitch_name].build);
            }

            //check for a valid first ability to max input
            if (text.split(':')[0] === '!max') {

              //normalize user max input
              var max = text.split(':')[1].toLowerCase().trim();

              //validate user max input
              if (max === 'q' || max === 'w' || max === 'e') {
                console.log('valid: ' + max);
                clients[config.twitch_name].build.votes.max[max]++;
                io.in(config.twitch_name).emit('build update', clients[config.twitch_name].build.votes);
                io.emit('build update', clients[config.twitch_name].build.votes);
              } else {
                console.log('invalid: ' + max);
              }
              // console.log(clients[config.twitch_name].build);
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
          resolve(clients[config.twitch_name].build);
        })
        .catch(function(err) {
          console.error(err);
        });
    });
  });
  // clients[config.twitch_name].addListener("join", function(channel, who) {
  //   clients[config.twitch_name].say(channel, 'Welcome');
  // });
};
