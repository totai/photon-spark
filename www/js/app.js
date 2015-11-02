angular.module('SparkCore', [
      'ionic',
      'SparkCore.services',
      'SparkCore.controllers',
      'SparkCore.auth',
      'SparkCore.user',
      'tc.chartjs',
      'MONITOR',
      'highcharts-ng'
   ])
   .run(function ($ionicPlatform, $http) {
      $ionicPlatform.ready(function () {
         // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
         // for form inputs)
         if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
         }
         if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
         }
         $http.defaults.headers.common.Authorization = 'Bearer 67bef8e96e9a68644ed539609dac64451c90bec8'
         var newToken = '67bef8e96e9a68644ed539609dac64451c90bec8'
      });
   })
   .config(function ($sceProvider) {
      $sceProvider.enabled(false);
   })

   .config(function ($stateProvider, $urlRouterProvider) {
      $stateProvider
         .state('signin', {
            url: '/sign-in',
            templateUrl: 'templates/sign-in.html',
            controller: 'SignInCtrl'
         })
         .state('forgotpassword', {
            url: '/forgot-password',
            templateUrl: 'templates/forgot-password.html'
         })
         .state('tab', {
            url: "/tab",
            abstract: true,
            templateUrl: "templates/tabs.html"
         })

         // Each tab has its own nav history stack:
         .state('tab.dash', {
            url: '/dash',
            views: {
               'tab-dash': {
                  templateUrl: 'templates/tab-dash.html',
                  controller: 'DashCtrl'
               }
            }
         })
         .state('tab.config', {
            url: '/config',
            views: {
               'tab-config': {
                  templateUrl: 'templates/tab-config.html',
                  controller: 'ConfigCtrl'
               }
            }
         })
         .state('tab.friends', {
            url: '/friends',
            views: {
               'tab-friends': {
                  templateUrl: 'templates/tab-friends.html',
                  controller: 'FriendsCtrl'
               }
            }
         })
         .state('tab.friend-detail', {
            url: '/friend/:friendId',
            views: {
               'tab-friends': {
                  templateUrl: 'templates/friend-detail.html',
                  controller: 'FriendDetailCtrl'
               }
            }
         })
         .state('tab.account', {
            url: '/account',
            views: {
               'tab-account': {
                  templateUrl: 'templates/tab-account.html',
                  controller: 'AccountCtrl'
               }
            }
         });

      $urlRouterProvider.otherwise('/sign-in');
   });