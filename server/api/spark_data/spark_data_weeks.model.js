'use strict';
var mongoose = require('mongoose'),
   Schema = mongoose.Schema;

var Spark_dataSchema = new Schema({
   _id: {
      ts: {type: Date},
      T: String,
      SEQ: String
   },
   SEQ: String,
   T: String,
   v1H: Number,
   v1L: Number,
   v1C: Number,
   v2H: Number,
   v2L: Number,
   v2C: Number,
   v3H: Number,
   v3L: Number,
   v3C: Number,
   ct: Number
})

module.exports = mongoose.model('Spark_data_weeks', Spark_dataSchema);
