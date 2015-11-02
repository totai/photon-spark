'use strict';
var _ = require('lodash');
var Spark_data_mins = require('./Spark_data_mins.model.js');

// Get list of Spark_data_mins
exports.index = function (req, res) {
   Spark_data_mins.find(function (err, domains) {
    if (err) {
      return handleError(res, err);
    }
    return res.json(200, domains);
  });
};
// Get a single Spark_data_mins
exports.show = function (req, res) {
   Spark_data_mins.find({name: req.params.domain}, function (err, domain) {
    if (err) {
      return handleError(res, err);
    }
    if (!domain) {
      return res.send(404);
    }
    return res.json(domain);
  });
};
// Creates a new Spark_data_mins in the DB.
exports.create = function (req, res) {
   Spark_data_mins.create(req.body, function (err, domain) {
    if (err) {
      return handleError(res, err);
    }
    var updated = _.merge(domain, req.body);
    updated.save(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.json(200, domain);
    });
  });
};
// Updates an existing Spark_data_mins in the DB.
exports.update = function (req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
   Spark_data_mins.findById(req.params.id, function (err, domain) {
    if (err) {
      return handleError(res, err);
    }
    if (!domain) {
      return res.send(404);
    }
    var updated = _.merge(domain, req.body);
    updated.save(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.json(200, domain);
    });
  });
};
// Deletes a Spark_data_mins from the DB.
exports.destroy = function (req, res) {
   Spark_data_mins.findById(req.params.id, function (err, domain) {
    if (err) {
      return handleError(res, err);
    }
    if (!domain) {
      return res.send(404);
    }
     domain.remove(function (err) {
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
