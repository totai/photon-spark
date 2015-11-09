'use strict';
var errors = require('./lib/errors');
var serveStatic = require('serve-static');
var path = require('path');

var wwwPath = path.join(__dirname, '..', 'www');
console.log('www path: ' + wwwPath);

module.exports = function (app) {

   // app.use('/api/channel', require('./api/channel'));
   // app.use('/api/spark_raw', require('./api/spark_raw'));

   app.use('/users', require('./api/user'));

   app.use('/api/spark_data', require('./api/spark_data'));

   app.use('/api/spark_core', require('./api/spark_core'));
   app.use('/api/spark_core_type', require('./api/spark_core_type'));

   app.use('/api/spark_account', require('./api/spark_account'));

   app.use('/auth', require('./auth'));

   app.use(serveStatic(wwwPath));

   // All undefined asset or api routes should return a 404
   app.route('/:url(api|auth|lib|app|bower_components|assets)/*')
      .get(errors[404]);

   // All other routes should redirect to the index.html
   app.route('/*')
      .get(function (req, res) {
         res.sendFile(wwwPath + '/index.html');
      });

};
