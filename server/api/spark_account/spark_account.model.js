'use strict';

var mongoose = require('mongoose'),
   Schema = mongoose.Schema,
   SEQ_ID = require("../../config/SEQ_ID");

var Spark_accountSchema = new Schema({
   name: {type: String, unique: true},
   e_mail: String,
   created: {type: Date, default: Date.now}
});

Spark_accountSchema.plugin(SEQ_ID.plugin, {counterID: 'core', prefix: 'S0'});

module.exports = mongoose.model('Spark_account', Spark_accountSchema);
