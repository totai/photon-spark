(function () {
  'use strict';

  angular.module('SparkCore')
    .controller('SparkCore.controller', CoreTypesCtrl)
    .controller('ModalInstanceCtrl', ModalCtrl);

  function CoreTypesCtrl($scope, $rootScope, $http, $state, $modal, socket) {

    $scope.searchInput = '';

    $http.get('/api/spark_core_type/').success(function (results) {
      $scope.coreTypes = results;
    });

    $scope.switchChannel = function (channel) {
     // $state.go('index.channel', {channel: channel.name});
    //  $scope.activeChannel = channel.name;
    };

    $scope.switchIM = function (im) {
   //   $state.transitionTo('index.im', {im: im.username}, {reload: false});
   //   $scope.activeChannel = im.username;
    };

    $scope.openDrawer = function () {
  //    $scope.drawerOpen = $scope.drawerOpen ? false : true;
    };

    $scope.logout = function () {
   //   Auth.logout();
  //    $state.go('login');
    };


    $scope.createNewChannel = function () {
      $scope.modalInstance = $modal.open({
        templateUrl: 'myModalContent.html',
        controller: 'ModalInstanceCtrl',
        size: 'medium',
        scope: $scope,
        resolve: {
          items: function () {
            return $scope.items;
          }
        }
      });

      $scope.modalInstance.result.then(function (channel) {
        $http.post('/api/channels', channel).then(function (success) {
          // console.log(success);
        }, function (error) {
          // console.log(error);
        });
      }, function () {
        console.info('Modal dismissed at: ' + new Date());
      });
    };
  }

  function ModalCtrl($scope, $rootScope) {

    $scope.newChannel = {
      name: '',
      purpose: {
        value: ''
      },
      creator: $rootScope.currentUser._id,
      is_archived: false,
      is_general: false,
      is_member: true,
      created: new Date()
    };

    $scope.ok = function () {
      $scope.modalInstance.close($scope.newChannel);
    };

    $scope.cancel = function () {
      $scope.modalInstance.dismiss('cancel');
    };
  }

})();
