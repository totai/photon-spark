'use strict';

var mongoose = require('mongoose'),
   Schema = mongoose.Schema,
   SEQ_ID = require("../../config/SEQ_ID");

var Spark_coreSchema = new Schema({
   ownerSEQ: String,
   coreid: String,
   name: {type: String, unique: true},
   created: {type: Date, default: Date.now}
});

Spark_coreSchema.plugin(SEQ_ID.plugin, {counterID: 'core', prefix: 'C0'});

module.exports = mongoose.model('Spark_core', Spark_coreSchema);
