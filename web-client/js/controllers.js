'use strict';

angular.module('heartOfGoldApp')
  .controller('LoginController', ['$scope', '$http', '$window', 'userService', loginController])
  .controller('SignupController', ['$scope', '$http', '$window', signupController])
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

function signupController($scope, $http, $window) {
  $(document).ready(function() {
    $.material.init();
    $('.dropdown-toggle').dropdown();
  });
  var vm = this;

  vm.signup = function() {
    $http.post('http://localhost:3000/signup', vm.newUser)
      .then(function(response) {
        console.log(response);
      })
      .catch(function(error) {
        console.log(error);
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

  //Check if the streamer is the on thier own page
  if ($routeParams.twitchName === userService.getUser().twitch_name) {

    //used to show buttons for only the streamer on thier own page
    vm.isStreamer = true;

    //Open a new Twitch IRC lobby
    vm.openLobby = function() {
      $http.post('http://localhost:3000/streamer/build', userService.getUser())
        .then(function(response) {
          console.log(response);
        });
    };

    //Close the Twitch IRC lobby
    vm.closeLobby = function() {
      $http.post('http://localhost:3000/streamer/accept-build', userService.getUser())
        .then(function(response) {
          console.log(response);
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
