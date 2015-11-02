angular.module("MONITOR", [])
   .controller("MONITOR", function ($scope, $http) {

      // CORE = '55ff69065075555354381887')

      $scope.MonitorMessages = []
      $scope.DebugMessages = []

      $http.defaults.headers.common.Authorization = 'Bearer 2e6a52cadb9358905737c5b5c2b2c3a4a9355c5b'

      var eventSourceInit = {
         headers: {Authorization: "Bearer 2e6a52cadb9358905737c5b5c2b2c3a4a9355c5b"}
      };
      var MotionEvents = new EventSource('https://api.spark.io/v1/devices/events/?access_token=2e6a52cadb9358905737c5b5c2b2c3a4a9355c5b', eventSourceInit);

      MotionEvents.addEventListener("open", function () {
         console.log("SparkMonitor: OPEN")
      });

      MotionEvents.addEventListener('MONITOR', function (event) {
         var eventClean = JSON.parse(event.data)
         // {ct:%d,v1:22.4,v2:45.5,v3:7899,tx:text-here}
         var dataClean = eventClean.data.replace(/{/g,'{"').replace(/}/g,'"}').replace(/,/g,'","').replace(/:/g,'":"')
         var req_body = {}
         // need to convert coreid to SEQ
         req_body.SEQ = eventClean.coreid
         req_body.ts = moment(eventClean.published_at).format("YYYY-MMM-DD HH:mm");
         req_body = _.merge(req_body, JSON.parse(dataClean));
         $scope.$apply(function () {
            $scope.MonitorMessages.unshift(req_body);
         })
         console.log("SparkMonitor: " + JSON.stringify(JSON.parse(dataClean)))
      });

      MotionEvents.addEventListener('DEBUG', function (event) {
         var eventClean = JSON.parse(event.data)
         // {ct:%d,v1:22.4,v2:45.5,v3:7899,tx:text-here}
         var dataClean = eventClean.data.replace(/{/g,'{"').replace(/}/g,'"}').replace(/,/g,'","').replace(/:/g,'":"')
         var req_body = {}
         // need to convert coreid to SEQ
         req_body.SEQ = eventClean.coreid
         req_body.ts = moment(eventClean.published_at).format("YYYY-MMM-DD HH:mm");
         req_body = _.merge(req_body, JSON.parse(dataClean));
         $scope.$apply(function () {
            $scope.DebugMessages.unshift(req_body);
         })
         console.log("SparkMonitor: " + JSON.stringify(JSON.parse(dataClean)))
      });

   })

