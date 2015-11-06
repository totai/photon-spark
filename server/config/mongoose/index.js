'use strict';


var mongoose = require('mongoose');
var config = require('../environment');
//var globalConnection = require('./global');
var localConnection = require('./local');


function MongooseConnection() {
  this.connections = [];
}

MongooseConnection._init = function () {
  this.globalConnection = mongoose.createConnection(config.mongo.global.url, null, function () {
    console.log('global connection established');
  });

  this.localConnection = mongoose.createConnection(config.mongo.local.url, config.mongo.options, function () {
    console.log('local connection established');
  });
};


MongooseConnection.use = function (db) {
  var self = this;

  if (!self.localConnection || !self.globalConnection) {
    self._init();
  }
  else {
    switch (db) {
      case 'local':
        return self.localConnection;

      case 'global':
        return self.globalConnection;
    }
  }
};

MongooseConnection._init();

module.exports = MongooseConnection;
