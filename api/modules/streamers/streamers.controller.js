'use strict';

var ircClients = {};

function createBuildLobby(req, res, next) {

  //open a new build lobby under the streamers Twitch name
  if (!ircClients[req.body.twitch_name]) {

    //set up IRC client for the user
    require('../../irc-client')(req.body, ircClients, req.sockets[req.body.twitch_name])
      .then(function(newBuild) {

        //let clients know voting is open
        req.sockets[req.body.twitch_name].in(req.body.twitch_name).emit('build update', ircClients[req.body.twitch_name].build);
        req.sockets[req.body.twitch_name].emit('build update', ircClients[req.body.twitch_name].build);

        console.log('============ ' + req.body.twitch_name + ' Opened a New Lobby ============');

        //respond with an new build
        res.json(newBuild);
      });
  } else {
    res.status(401).json({
      status: 'lobby already open'
    });
  }
}

function getLobbyStatus(req, res, next) {
  if (ircClients[req.body.twitchName]) {
    res.json(ircClients[req.body.twitchName].build);
  } else {
    res.json('lobby closed');
  }
}

function getCurrentBuild(req, res, next) {
  if (ircClients[req.body.twitch_name]) {
    res.json(ircClients[req.body.twitch_name].build);
  } else {
    res.json({
      lobbyIsOpen: false,
      summoner_id: '',
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
    });
  }
}

function acceptBuild(req, res, next) {

  //store ircClients[config.twitch_name].build;

  //remove the build lobby if it exists
  if (ircClients[req.body.twitch_name]) {

    //Let chat know voting has ended
    ircClients[req.body.twitch_name].say(['#' + req.body.twitch_name], 'HeartOfGold.lol Voting Has Ended!!!');

    //disconnect from chat
    ircClients[req.body.twitch_name].disconnect(function() {

      //let clients know the lobby is closed
      ircClients[req.body.twitch_name].build.lobbyIsOpen = false;

      //emit the final build to clients
      req.sockets[req.body.twitch_name].in(req.body.twitch_name).emit('build update', ircClients[req.body.twitch_name].build);
      req.sockets[req.body.twitch_name].emit('build update', ircClients[req.body.twitch_name].build);

      //clear the build object
      // ircClients[req.body.twitch_name].build = {
      //   lobbyIsOpen: false,
      //   summoner_id: '',
      //   masteryPages: '',
      //   runePages: '',
      //   votes: {
      //     champs: {},
      //     masteries: {},
      //     runes: {},
      //     max: {
      //       'q': 0,
      //       'w': 0,
      //       'e': 0
      //     }
      //   }
      // };

      console.log('============ ' + req.body.twitch_name + ' Closed the Lobby ============');
      ircClients[req.body.twitch_name] = null;

      //send response that lobby is closed
      res.json('lobby closed');
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
  getLobbyStatus,
  getCurrentBuild,
  acceptBuild,
  removeBuild,
  getPrefs,
  updatePrefs
};
