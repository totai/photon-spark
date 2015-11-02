'use strict';

var mongoose = require('mongoose'),
   Schema = mongoose.Schema;

var Spark_core_typeSchema = new Schema({
   _id: String,
   name : String,
   ct: Number,
   v1: Number,
   v2:  Number,
   v3:  Number,
   tx: String
});

module.exports = mongoose.model('Spark_core_type', Spark_core_typeSchema);
