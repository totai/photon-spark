'use strict';

var mongoose = require('mongoose'),
   timestamps = require('mongoose-timestamp'),
   Schema = mongoose.Schema;

var Spark_coreSchema = new Schema({
   name: String,
   ownerSEQ: String,
   coreid: String,
   location: String,
   comment: String,
   types: [],
});

UserSchema.plugin(timestamps, {
   createdAt: 'tsCreate',
   updatedAt: 'tsUpdate'
});

module.exports = mongoose.model('Spark_core', Spark_coreSchema);
