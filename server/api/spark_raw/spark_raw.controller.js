'use strict';

var _ = require('lodash');
var Spark_api = require('./spark_raw.model.js');

// Get list of Spark_apis
exports.index = function (req, res) {
   Spark_api.find(function (err, spark_apis) {
      if (err) {
         return handleError(res, err);
      }
      return res.json(200, spark_apis);
   });
};