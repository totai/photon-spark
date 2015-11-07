'use strict';

var mongoose = require('mongoose'),
   Schema = mongoose.Schema;

var Spark_coreSchema = new Schema({
   _id: String,
   name: String,
   ownerSEQ: String,
   coreid: String,
   location: String,
   comment: String,
   types: [],
   created: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Spark_core', Spark_coreSchema);
