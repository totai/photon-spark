'use strict';

var _ = require('lodash');
var Spark_core = require('./spark_core.model.js');

// Get list of spark_cores
exports.index = function (req, res) {
   Spark_core.find(function (err, spark_cores) {
      if (err) {
         return handleError(res, err);
      }
      //return res.json(200, spark_cores);
      return res.status(status).json(spark_cores)
   });
};

// Get a single spark_core
exports.show = function (req, res) {
   Spark_core.find({name: req.params.spark_core}, function (err, spark_core) {
    if (err) {
      return handleError(res, err);
    }
    if (!spark_core) {
      return res.send(404);
    }
    return res.json(spark_core);
  });
};

// Creates a new spark_core in the DB.
exports.create = function (req, res) {
   Spark_core.create(req.body, function (err, spark_core) {
    if (err) {
      return handleError(res, err);
    }
    var updated = _.merge(spark_core, req.body);
    updated.save(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.json(200, spark_core);
    });
  });
};

// Updates an existing spark_core in the DB.
exports.update = function (req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
   Spark_core.findById(req.params.id, function (err, spark_core) {
    if (err) {
      return handleError(res, err);
    }
    if (!spark_core) {
      return res.send(404);
    }
    var updated = _.merge(spark_core, req.body);
    updated.save(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.json(200, spark_core);
    });
  });
};

// Deletes a spark_core from the DB.
exports.destroy = function (req, res) {
   Spark_core.findById(req.params.id, function (err, spark_core) {
    if (err) {
      return handleError(res, err);
    }
    if (!spark_core) {
      return res.send(404);
    }
     spark_core.remove(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
