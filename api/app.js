'use strict';

require('dotenv').load({
  silent: true
});

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cors = require('cors');
var expressJwt = require('express-jwt');

var routes = require('./routes');

var app = express();

app.use(function(req, res, next) {
  req.models = app.models;
  req.sockets = app.sockets;
  req.ircClients = {};
  next();
});

app.use('/streamer', expressJwt({
  secret: process.env.SECRET
}));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {}
  });
});


module.exports = app;
