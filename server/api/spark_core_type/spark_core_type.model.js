'use strict';

var mongoose = require('mongoose'),
   Schema = mongoose.Schema;

var Spark_core_typeSchema = new Schema({
   _id: String,
   name : String,
   ct: String,
   v1: String,
   v2:  String,
   v3:  String,
   tx: String,
   created: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Spark_core_type', Spark_core_typeSchema);
