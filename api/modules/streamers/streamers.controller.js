'use strict';

var ircClients = {};

function getBuild(req, res, next) {
  var config = {
    twitch_name: 'koff01',
    twitch_chat_password: 'oauth:c4homw8vo8c1g783btkl1dm6yte8sk',
  	channels: ["#koff01"],
  	botName: "Choose-Bot",
    summoner_name: 'gizmotech'
  };
  if(!ircClients[config.twitch_name]) {
    //set up IRC client for the user
    require('../../irc-client')(config, ircClients);
  }
}

function getPrefs(req, res, next) {

}

function updatePrefs(req, res, next) {

}

module.exports = {
  getBuild,
  getPrefs,
  updatePrefs
};
