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
  vm.changeActiveMasteryPage = function(page) {
    if (vm.active === page) {
      vm.active = null;
    } else {
      vm.active = page;
    }
  };

  //check if a lobby is currently open
  $http.post('http://localhost:3000/streamer/get-lobby-status', $routeParams)
    .then(function(response) {
      console.log(response);
      if (response.data === 'lobby closed') {
        vm.lobbyIsOpen = false;
      } else {
        vm.lobbyIsOpen = true;
        vm.masteryPages = response.data.masteryPages;
        vm.runePages = response.data.runePages;
        vm.build = response.data.votes;
      }
    })
    .catch(function(error) {
      console.log(error);
    });
  //Check if the streamer is the on thier own page
  if ($routeParams.twitchName === userService.getUser().twitch_name) {

    //used to show buttons for only the streamer on thier own page
    vm.isStreamer = true;

    //Open a new Twitch IRC lobby
    vm.openLobby = function() {
      $http.post('http://localhost:3000/streamer/build', userService.getUser())
        .then(function(response) {
          vm.lobbyIsOpen = response.data.lobbyIsOpen;
          vm.masteryPages = response.data.masteryPages;
          vm.runePages = response.data.runePages;
          vm.build = response.data.votes;
        })
        .catch(function(error) {
          console.log(error);
        });
    };

    //Close the Twitch IRC lobby
    vm.closeLobby = function() {
      $http.post('http://localhost:3000/streamer/accept-build', userService.getUser())
        .then(function(response) {
          console.log(response);
        })
        .catch(function(error) {
          console.log(error);
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
      vm.lobbyIsOpen = updatedBuild.lobbyIsOpen;
      if (updatedBuild.lobbyIsOpen) {
        vm.build = updatedBuild.votes;
        vm.masteryPages = updatedBuild.masteryPages;
        vm.runePages = updatedBuild.runePages;
      } else {
        vm.finalBuild = updatedBuild.votes;

        var votes = 0;
        for(var champ in vm.finalBuild.champs) {
          if(vm.finalBuild.champs[champ] > votes) {
            vm.firstChamp = [champ];
            votes = vm.finalBuild.champs[champ];
          } else if(vm.finalBuild.champs[champ] === votes) {
            vm.firstChamp.push(champ);
          }
        }

        var votes = 0;
        for(var masteryPage in vm.finalBuild.masteries) {
          if(vm.finalBuild.masteries[masteryPage] > votes) {
            vm.firstMasteryPage = [masteryPage];
            votes = vm.finalBuild.masteries[masteryPage];
          } else if(vm.finalBuild.masteries[masteryPage] === votes) {
            vm.firstChamp.push(masteryPage);
          }
        }

        var votes = 0;
        for(var runePage in vm.finalBuild.runes) {
          if(vm.finalBuild.runes[runePage] > votes) {
            vm.firstRunePage = [runePage];
            votes = vm.finalBuild.runes[runePage];
          } else if(vm.finalBuild.runes[runePage] === votes) {
            vm.firstRunePage.push(runePage);
          }
        }
      }
    });
  });
}
