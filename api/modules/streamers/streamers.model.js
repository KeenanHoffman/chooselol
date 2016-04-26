'use strict';

const Waterline = require('waterline');

module.exports = Waterline.Collection.extend({
  identity: 'streamer',
  connection: 'myLocalPostgres',
  attributes: {
    username: 'string',
    email: 'string',
    password: 'string',
    summoner_name: 'string',
    twitch_name: 'string',
    twitch_chat_password: 'string'
  }
});
