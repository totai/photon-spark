angular.module('SparkCore.controllers', [])

   .controller('HomeTabCtrl', function ($scope, $http) {

      $scope.sendFinderEnroll = function () {
         $scope.status = 'sendFinderEnroll'
         $http.post("https://api.spark.io/v1/devices/Spark_I/enroll/")
            .success(function (data, status) {
               $scope.status = status
               $scope.data = data
               $scope.statusError = status
            })
            .error(function (data, status) {
               $scope.statusError = status + ' : ' + angular.toJson(data)
            })
      }

      $scope.sendLedON = function () {
         $scope.status = 'sendLedON'
         $http.post("https://api.spark.io/v1/devices/Spark_I/led/")
            .success(function (data, status) {
               $scope.status = status
               $scope.data = data
               $scope.statusError = status
            })
            .error(function (data, status) {
               $scope.statusError = status + ' : ' + angular.toJson(data)
            })
      }

      $scope.sendTemp_II = function () {
         $scope.status = 'sendTemp_II'
         $http.get("https://api.spark.io/v1/devices/Spark_II/resultX")
            .success(function (data, status) {
               $scope.status = status
               $scope.data = eval('(' + data.result + ')')
               $scope.Spark_C = $scope.data.C_in
               $scope.Spark_H = $scope.data.H_in
               $scope.Spark_Out = $scope.data.C_out
               $scope.statusError = status
            })
            .error(function (data, status) {
               $scope.statusError = status + ' : ' + angular.toJson(data)
            })
      }

      $scope.sendTempErr = function () {
         $scope.status = 'sendTempErr'
         $http.get("https://api.spark.io/v1/devices/Spark_II/errorX")
            .success(function (data, status) {
               $scope.statusError = status + ' : ' + data.result
            })
            .error(function (data, status) {
               $scope.statusError = status + ' : ' + angular.toJson(data)
            })
      }

      $scope.sendTemp_III = function () {
         $scope.status = 'sendTemp_III'
         $http.get("https://api.spark.io/v1/devices/Spark_III/zTemp")
            .success(function (data, status) {
               $scope.status = status
               $scope.data = eval('(' + data.result + ')')
               $scope.Spark_C = $scope.data.C_in
               $scope.Spark_H = $scope.data.H_in
               $scope.Spark_Out = $scope.data.C_out
               $scope.statusError = status
            })
            .error(function (data, status) {
               $scope.statusError = status + ' : ' + angular.toJson(data)
            })
      }

      $scope.logout = function () {
         Auth.logout()
         $state.go('login')
      }
   })

   .controller('FriendsCtrl', function ($scope, Friends) {
      $scope.friends = Friends.all()
   })

   .controller('FriendDetailCtrl', function ($scope, $stateParams, Friends) {
      $scope.friend = Friends.get($stateParams.friendId)

      $scope.iFrameSource = "/d/1mv7l0mbUdJ1qG-CPEMB7T2M4CQkqfJuHGKyD2602tB0/pubchart?oid=50771870&format=interactive"
      $scope.iFrameSource = "https://docs.google.com/spreadsheets/d/1mv7l0mbUdJ1qG-CPEMB7T2M4CQkqfJuHGKyD2602tB0/pubchart?oid=50771870&format=interactive"

      $scope.swapChartType = function () {
         if (this.chartConfig.options.chart.type === 'line') {
            this.chartConfig.options.chart.type = 'bar'
         } else {
            this.chartConfig.options.chart.type = 'line'
            this.chartConfig.options.chart.zoomType = 'x'
         }
      }

      $scope.chartConfig = {
         options: {
            chart: {
               type: 'line'
            }
         },
         series: [{
            data: [10, 15, 12, 8, 7]
         }],
         title: {
            text: 'Hello'
         },
         loading: false
      }
   })

   .controller('AccountCtrl', function ($scope) {
      $scope.myOptions = {
         // Chart.js options can go here.
      };
      $scope.myData = {
         labels: ["January", "February", "March", "April", "May", "June", "July"],
         datasets: [
            {
               label: "First dataset",
               fillColor: "rgba(220,220,220,0.2)",
               strokeColor: "rgba(220,220,220,1)",
               pointColor: "rgba(220,220,220,1)",
               pointStrokeColor: "#fff",
               pointHighlightFill: "#fff",
               pointHighlightStroke: "rgba(220,220,220,1)",
               data: [65, 59, 80, 81, 56, 55, 40]
            },
            {
               label: "Second dataset",
               fillColor: "rgba(151,187,205,0.2)",
               strokeColor: "rgba(151,187,205,1)",
               pointColor: "rgba(151,187,205,1)",
               pointStrokeColor: "#fff",
               pointHighlightFill: "#fff",
               pointHighlightStroke: "rgba(151,187,205,1)",
               data: [28, 48, 40, 19, 86, 27, 90]
            }
         ]
      };
   })

   .controller('ConfigCtrl', function ($scope, $http) {
      $scope.users = [
         {id: 1, fName: 'Hege', lName: "Pege"},
         {id: 2, fName: 'Kim', lName: "Pim"},
         {id: 3, fName: 'Jack', lName: "Jones"},
         {id: 4, fName: 'John', lName: "Doe"},
         {id: 5, fName: 'Peter', lName: "Pan"}
      ];
   })

   .controller('SignInCtrl', function($scope, $state) {
      $scope.signIn = function(user) {
         console.log('Sign-In', user);
         $state.go('tabs.home');
      };
   })

   .controller('userController', function ($scope) {
      $scope.fName = '';
      $scope.lName = '';
      $scope.passw1 = '';
      $scope.passw2 = '';

      $scope.users = [
         {id: 1, fName: 'Hege', lName: "Pege"},
         {id: 2, fName: 'Kim', lName: "Pim"},
         {id: 3, fName: 'Jack', lName: "Jones"},
         {id: 4, fName: 'John', lName: "Doe"},
         {id: 5, fName: 'Peter', lName: "Pan"}
      ];

      $scope.edit = true;
      $scope.error = false;
      $scope.incomplete = false;

      $scope.editUser = function (id) {
         if (id == 'new') {
            $scope.edit = true;
            $scope.incomplete = true;
            $scope.fName = '';
            $scope.lName = '';
         } else {
            $scope.edit = false;
            $scope.fName = $scope.users[id - 1].fName;
            $scope.lName = $scope.users[id - 1].lName;
         }
      };

      $scope.$watch('passw1', function () {
         $scope.test();
      });
      $scope.$watch('passw2', function () {
         $scope.test();
      });
      $scope.$watch('fName', function () {
         $scope.test();
      });
      $scope.$watch('lName', function () {
         $scope.test();
      });
      $scope.test = function () {
         if ($scope.passw1 !== $scope.passw2) {
            $scope.error = true;
         } else {
            $scope.error = false;
         }
         $scope.incomplete = false;
         if ($scope.edit && (!$scope.fName.length || !$scope.lName.length || !$scope.passw1.length || !$scope.passw2.length)) {
            $scope.incomplete = true;
         }
      };

   });