'use strict';

angular.module('heartOfGoldApp')
  .controller('LoginController', ['$scope', '$http', '$window', 'userService', loginController])
  .controller('BuildLobbyController', ['$scope', '$http', '$window', '$routeParams', 'userService', buildLobbyController]);

function loginController($scope, $http, $window, userService) {
  $(document).ready(function() {
    $.material.init();
    $('.dropdown-toggle').dropdown();
  });
  var vm = this;

  vm.login = function() {
    $http.post('http://localhost:3000/login', vm.user)
      .then(function(data) {
        $window.sessionStorage.token = data.data.token;
        $window.location.href = '#/build/' + userService.getUser().twitch_name;
      });
  };
}

function buildLobbyController($scope, $http, $window, $routeParams, userService) {
  $(document).ready(function() {
    $.material.init();
    $('.dropdown-toggle').dropdown();
  });
  var vm = this;
  vm.build = null;

  if ($routeParams.twitchName === userService.getUser().twitch_name) {
    vm.isStreamer = true;
    vm.openLobby = function() {
      $http.post('http://localhost:3000/streamer/build', userService.getUser())
        .then(function() {

        });
    };
    vm.closeLobby = function() {
      $http.post('http://localhost:3000/streamer/accept-build', userService.getUser())
        .then(function() {

        });
    };
  }
  var socket;
  if (userService.getUser().id === 'none') {
    socket = io.connect('http://localhost:3000');
  } else {
    socket = io.connect('http://localhost:3000', {
      query: 'twitchName=' + $routeParams.twitchName
    });
  }

  socket.on('connect', function() {
    // Connected, let's sign-up for to receive messages for this room
    socket.emit('room', $routeParams.twitchName);
  });
  socket.on('build update', function(updatedBuild) {
    $scope.$apply(function() {
      console.log(updatedBuild);
      vm.build = updatedBuild;
    });
  });
}
