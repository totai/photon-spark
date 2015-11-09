'use strict';

var _ = require('lodash');
var Spark_core_type = require('./spark_core_type.model.js');

// Get list of Spark_core_type
exports.index = function (req, res) {
   Spark_core_type.find(function (err, domains) {
      if (err) {
         return handleError(res, err);
      }
      return res.status(status).json(domains)
   });
};

// Get a single Spark_core_type
exports.show = function (req, res) {
   Spark_core_type.find({name: req.params.domain}, function (err, domain) {
      if (err) {
         return handleError(res, err);
      }
      if (!domain) {
         return res.send(404);
      }
      return res.json(domain);
   });
};

// Creates a new Spark_core_type in the DB.
exports.create = function (req, res) {
   Spark_core_type.create(req.body, function (err, domain) {
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

// Updates an existing Spark_core_type in the DB.
exports.update = function (req, res) {
   if (req.body._id) {
      delete req.body._id;
   }
   Spark_core_type.findById(req.params.id, function (err, domain) {
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

// Deletes a Spark_core_type from the DB.
exports.destroy = function (req, res) {
   Spark_core_type.findById(req.params.id, function (err, domain) {
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
