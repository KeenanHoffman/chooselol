'use strict';

const Waterline = require('waterline');
var orm = new Waterline();

// get connection configs
const connectionConfig = require('../configs/connection.js');

// load model definitions
var Streamers = require('../modules/streamers/streamers.model.js');

// load models into orm
orm.loadCollection(Streamers);

// initialize function
function initialize(app, PORT, callback) {
    // Initialize the whole database and store models and connections to app
    orm.initialize(connectionConfig, function(err, models) {
      if(err) throw err;
      // pass the collections (models) and connections created to app
      callback(models.collections, models.connections);
    });
}
module.exports = {
  initialize
};
