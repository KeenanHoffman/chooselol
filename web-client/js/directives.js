'use strict';

angular.module('heartOfGoldApp')
  .directive('createMasteriesPage', [createMasteriesPageLogic]);

  function createMasteriesPageLogic() {
    return {
      templateUrl: '../templates/masteries.html',
      scope: {
        page: '='
      }
    };
  }
