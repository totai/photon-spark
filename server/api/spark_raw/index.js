var EventSource = require('eventsource'),
   controller = require('./spark_raw.controller.js'),
   express = require('express'),
   router = express.Router(),
   moment = require('moment'),
   _ = require('lodash'),
   Spark_api = require('./spark_raw.model.js');

router.get('/', controller.index);  // use to display all records
module.exports = router;

// eventSource to retreive data via api.spark.io
var eventSourceInit = {
   headers: {Authorization: "Bearer 67bef8e96e9a68644ed539609dac64451c90bec8"}
};
var url = "https://api.spark.io/v1/devices/events/MOTION/";
var SparkPublish = new EventSource(url, eventSourceInit);
SparkPublish.addEventListener("open", function () {
   console.log("Spark_api: OPEN")
});
SparkPublish.addEventListener('MOTION', function (e) {
   var req_body = {
      core: '',
      ts: Date.now(),
      ct: 0,
      v1: 0,
      v2: 0,
      v3: 0,
      tx: ""
   };
   var rawData = JSON.parse(e.data);
   req_body.core = rawData.coreid;
   req_body.ts = moment(rawData.published_at).format("YYYY-MMM-DD HH:mm");
   var dataClean = "{" + rawData.data.replace(/\'/g, '\"') + "}";  // replace ' with "
   req_body = _.merge(req_body, JSON.parse(dataClean));

   Spark_api.create(req_body, function (err, domain) {
      if (err) {
         return handleError(res, err);
      }
      var updated = _.merge(domain, req_body);
      updated.save(function (err) {
         if (err) {
            return handleError(res, err);
         }
      });
   });
   console.log('MOTION: [ ' + req_body.ts + ' - ' + req_body.core + ' - ' + req_body.v1 +' ]');

});

//var es = new EventSource('http://www.w3schools.com/html/demo_sse.php');  // get current time - TEST
//es.onmessage = function (e) {
//console.log("data: " + e.data);
//};
//es.onerror = function () {
// console.log('ERROR!');
//};
// var url = "https://api.spark.io/v1/devices/your_device_id/events/";
//var es = new EventSource('https://api.spark.io/v1/events/MOTION/?access_token=2e6a52cadb9358905737c5b5c2b2c3a4a9355c5b');