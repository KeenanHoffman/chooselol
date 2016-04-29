'use strict';

angular.module('heartOfGoldApp').config(function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      templateUrl: '../views/login.html',
      controller: 'LoginController as LC',
      activetab: 'login'
    })
    .when('/build/:twitchName', {
      templateUrl: '../views/build.html',
      controller: 'BuildLobbyController as BLC',
      activetab: 'buildLobby'
    })
    .when('/signup', {
      templateUrl: '../views/signup.html',
      controller: 'SignupController as SC',
      activetab: 'signup'
    })
    .otherwise({
      redirectTo: "/"
    });
});
