'use strict';
var mongoose = require('mongoose'),
   Schema = mongoose.Schema;

var Spark_apiSchema = new Schema({
   core: String,
   ts: {type: Date, default: Date.now},
   ct: Number,
   v1: Number,
   v2: Number,
   v3: Number,
   tx: String
});

module.exports = mongoose.model('Spark_api', Spark_apiSchema);
