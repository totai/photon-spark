angular.module('SparkCore', [
      'ionic',
      'SparkCore.services',
      'SparkCore.controllers',
//      'SparkCore.auth',
//      'SparkCore.user',
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
         $http.defaults.headers.common.Authorization = 'Bearer 67bef8e96e9a68644ed539609dac64451c90bec8';
         var newToken = '67bef8e96e9a68644ed539609dac64451c90bec8'
      });
   })
   .config(function ($sceProvider) {
      $sceProvider.enabled(false);
   })

   .config(function ($stateProvider, $urlRouterProvider) {
      $stateProvider
         .state('signin', {
            url: "/sign-in",
            templateUrl: "sign-in.html",
            controller: 'SignInCtrl'
         })
         .state('forgotpassword', {
            url: "/forgot-password",
            templateUrl: "forgot-password.html"
         })
         .state('tabs', {
            url: "/tab",
            abstract: true,
            templateUrl: "templates/tabs.html"
         })
         .state('tabs.home', {
            url: "/home",
            views: {
               'home-tab': {
                  templateUrl: "templates/home.html",
                  controller: 'HomeTabCtrl'
               }
            }
         })
         .state('tabs.facts', {
            url: "/facts",
            views: {
               'home-tab': {
                  templateUrl: "templates/facts.html"
               }
            }
         })
         .state('tabs.facts2', {
            url: "/facts2",
            views: {
               'home-tab': {
                  templateUrl: "facts2.html"
               }
            }
         })
         .state('tabs.about', {
            url: "/about",
            views: {
               'about-tab': {
                  templateUrl: "about.html"
               }
            }
         })
         .state('tabs.navstack', {
            url: "/navstack",
            views: {
               'about-tab': {
                  templateUrl: "nav-stack.html"
               }
            }
         })
         .state('tabs.contact', {
            url: "/contact",
            views: {
               'contact-tab': {
                  templateUrl: "templates/contact.html"
               }
            }
         });
      $urlRouterProvider.otherwise("/sign-in");
   })
