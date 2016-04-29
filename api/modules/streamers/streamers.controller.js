'use strict';

var ircClients = {};

function createBuildLobby(req, res, next) {

  //open a new build lobby under the streamers Twitch name
  if(!ircClients[req.body.twitch_name])
  {
    //set up IRC client for the user
    require('../../irc-client')(req.body, ircClients, req.sockets[req.body.twitch_name])
    .then(function(newBuild) {
      console.log('============ ' + req.body.twitch_name + ' Opened a New Lobby ============');

      //respond with an new build
      res.json(newBuild);
    });
  } else {

    //respond with the current build
    res.json(ircClients[req.body.twitch_name].build);
  }
}

function acceptBuild(req, res, next) {

  //store ircClients[config.twitch_name].build;

  //remove the build lobby if it exists
  if(ircClients[req.body.twitch_name]) {

    //Let chat know voting has ended
    ircClients[req.body.twitch_name].say(['#' + req.body.twitch_name], 'HeartOfGold.lol Voting Has Ended!!!');

    //disconnect from chat
    ircClients[req.body.twitch_name].disconnect(function() {
      res.json(ircClients[req.body.twitch_name].build);
      ircClients[req.body.twitch_name].build = {
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
