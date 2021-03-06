/**
 * Main application file
 */
'use strict';
// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

//var cors = require('cors')
var express = require('express');
var mongoose = require('mongoose');
var config = require('./config/environment');
console.log('PHOTON config -> ' + JSON.stringify(config));

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);

console.log('MONGO config -> '+config.mongo.uri);

// set up SEQ_ID.js
var SEQ_ID = require("./config/SEQ_ID");
SEQ_ID.load_SEQ_ID(mongoose.connection, 'core','last core sequence number');

// set up SEQ_data.js
var SEQ_data = require("./config/SEQ_data");
SEQ_data.init_SEQ_ID_data(mongoose.connection, 'spark_data','project for Spark Core data');

// Populate DB with sample data
if (config.seedDB) {
   require('./config/seed');
}

require('./api/spark_data/spark_data_mins.model');
require('./api/spark_data/spark_data_hours.model');
require('./api/spark_data/spark_data_days.model');

require('./api/spark_core');
require('./api/spark_core_type');
//require('./api/spark_data');
require('./api/spark_raw');  // starts up SSE

require('./api/agenda'); // starts agenda schedule

var app = express();

app.use(express.static('www'));

// CORS (Cross-Origin Resource Sharing) headers support Cross-site HTTP requests
app.all('*', function (req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "X-Requested-With");
   next();
});

// API Routes
require('./config/express')(app);
require('./routes')(app);

app.listen(config.port, '0.0.0.0', function () {
   console.log('Express at PORT : ' + config.port)
});

// Expose app
exports = module.exports = app;
