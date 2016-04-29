'use strict';

var ircClients = {};

function createBuildLobby(req, res, next) {
  // var config = {
  //   twitch_name: 'koff01',
  //   twitch_chat_password: 'oauth:c4homw8vo8c1g783btkl1dm6yte8sk',
  // 	channels: ["#koff01"],
  // 	botName: "Heart-Of-Gold-Bot",
  //   summoner_name: 'gizmotech'
  // };
  if(!ircClients[req.body.twitch_name]) {
    //set up IRC client for the user
    require('../../irc-client')(req.body, ircClients, req.sockets[req.body.twitch_name]);
    console.log('============ ' + req.body.twitch_name + ' Opened a New Lobby ============');
    res.json('new lobby open!');
  } else {
    res.json('lobby reopened!');
  }
}

function acceptBuild(req, res, next) {
  // var config = {
  //   twitch_name: 'koff01',
  //   twitch_chat_password: 'oauth:c4homw8vo8c1g783btkl1dm6yte8sk',
  // 	channels: ["#koff01"],
  // 	botName: "Choose-Bot",
  //   summoner_name: 'gizmotech'
  // };
  //store ircClients[config.twitch_name].build;

  //remove the game lobby
  if(ircClients[req.body.twitch_name]) {

    //Let chat know voting has ended
    ircClients[req.body.twitch_name].say(['#' + req.body.twitch_name], 'HeartOfGold.lol Voting Has Ended!!!');

    //disconnect from chat
    ircClients[req.body.twitch_name].disconnect(function() {
      res.json(ircClients[req.body.twitch_name].build);
      ircClients[req.body.twitch_name].build = {
        champs: {},
        masteries: {},
        runes: {},
        max: {
          'q': 0,
          'w': 0,
          'e': 0
        }
      };
      console.log('============ ' + req.body.twitch_name + ' Closed the Lobby ============');
      ircClients[req.body.twitch_name] = null;
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
