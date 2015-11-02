'use strict';

angular.module('SparkCore.services', [])

   .factory('Friends', function () {

      var friends = [
         {id: 0, name: 'Google Graphs', icon: 'ion-email'},
         {id: 1, name: 'HighChart', icon: 'ion-person-stalker'},
         {id: 2, name: 'Movement', icon: 'ion-chatbubble-working'},
         {id: 3, name: 'Temperatures', icon: 'ion-person-stalker'},
         {id: 4, name: 'Configure Spark Cores', icon: 'ion-mic-a'}
      ];
      return {
         all: function () {
            return friends;
         },
         get: function (friendId) {
            // Simple index lookup
            return friends[friendId];
         }
      }
   })

   .factory('SparkData_MIN', function ($rootScope, $resource) {
      return $resource($rootScope.DB_URL + 'despacho/:SEQ', {}, {
            getAll: {method: 'GET', isArray: true},
            getOne: {method: 'GET', params: {SEQ: '@SEQ'}},
            update: {method: 'POST', params: {SEQ: '@SEQ'}},
            new: {method: 'POST'},
            delete: {method: 'DELETE', params: {SEQ: '@SEQ'}}
         }
      )
   })
