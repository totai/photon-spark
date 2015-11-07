'use strict';

angular.module('SparkCore')
  .config(function ($stateProvider) {
    $stateProvider
      .state('index', {
        url: '/',
        views: {
          '': {
            templateUrl: 'www/coreTypes/coreTypes.html',
            controller: 'coreTypes.controller'
          }
        }
      });

  });
