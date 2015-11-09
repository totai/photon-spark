angular.module('coreTypes.controller', [])

  .controller ('CoreTypesCtrl', function($scope, $http) {

    $scope.searchInput = '';

    $http.get('/api/spark_core_type/').success(function (results) {
      $scope.coreTypes = results;
    });

     $http.get('/api/spark_core/').success(function (results) {
        $scope.cores = results;
     });

  })
