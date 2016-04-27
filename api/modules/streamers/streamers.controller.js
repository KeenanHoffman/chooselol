'use strict';

var ircClients = {};

function createBuildLobby(req, res, next) {
  var config = {
    twitch_name: 'koff01',
    twitch_chat_password: 'oauth:c4homw8vo8c1g783btkl1dm6yte8sk',
  	channels: ["#koff01"],
  	botName: "Choose-Bot",
    summoner_name: 'gizmotech'
  };


  //check for an existing lobby
  if(!ircClients[config.twitch_name]) {

    //set up IRC client for the user
    require('../../irc-client')(config, ircClients, req.io);
    console.log('============ ' + config.twitch_name + ' Opened a New Lobby ============');
    res.json('new lobby open!');
  } else {
    res.json('lobby reopened!');
  }
}

function acceptBuild(req, res, next) {
  var config = {
    twitch_name: 'koff01',
    twitch_chat_password: 'oauth:c4homw8vo8c1g783btkl1dm6yte8sk',
  	channels: ["#koff01"],
  	botName: "Choose-Bot",
    summoner_name: 'gizmotech'
  };
  //store ircClients[config.twitch_name].build;

  //remove the game lobby
  if(ircClients[config.twitch_name]) {

    //Let chat know voting has ended
    ircClients[config.twitch_name].say(config.channels[0], 'HeartOfGold.lol Voting Has Ended!!!');

    //disconnect from chat
    ircClients[config.twitch_name].disconnect(function() {
      res.json(ircClients[config.twitch_name].build);
      ircClients[config.twitch_name].build = {
        champs: {},
        masteries: {},
        runes: {},
        max: {
          'q': 0,
          'w': 0,
          'e': 0
        }
      };
      console.log('============ ' + config.twitch_name + ' Closed the Lobby ============');
      ircClients[config.twitch_name] = null;
    });

  } else {
    res.json('no lobby to diconnect from');
  }
}

function removeBuild(req, res, next) {

}

function getPrefs(req, res, next) {

}

function updatePrefs(req, res, next) {

}

module.exports = {
  createBuildLobby,
  acceptBuild,
  removeBuild,
  getPrefs,
  updatePrefs
};
