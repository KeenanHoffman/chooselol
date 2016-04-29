'use strict';

const bcryptService = require('../services/bcrypt.service');
const userValidation = require('../services/validation.service');
const authService = require('../services/auth.service');
const jwt = require('jsonwebtoken');


function login(req, res, next) {
  authService.authenticateUser({
      username: req.body.username
    }, req.body.password, req.models.streamer)
    .then(function(authenticatedUser) {
      if (authenticatedUser) {
        delete authenticatedUser.password;
        var token = jwt.sign(authenticatedUser, process.env.SECRET, {
          expiresIn: 60 * 60 * 5
        });
        res.json({
          token: token
        });
      } else {
        res.status(401).json({
          status: 'Username and Password Do Not Match'
        });
      }
    }).catch(function(err) {
      next(err);
    });
}

function signup(req, res, next) {
  userValidation.isValidAccount(req.body, req.models.streamer)
    .then(function(result) {
      if (result) {
        bcryptService.hashPassword(req.body.password).then(function(hashedPassword) {
          req.body.password = hashedPassword;
          req.models.streamer.create(req.body, function(err) {
            if (err) {
              next(err);
            } else {
              res.json({
                status: 'account created'
              });
            }
          });
        }).catch(function(err) {
          next(err);
        });
      } else {
        res.status(401).json({
          status: 'invalid account'
        });
      }
    });
}

module.exports = {
  login,
  signup
};
