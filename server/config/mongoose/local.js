'use strict';

var mongoose = require('mongoose');
var config = require('../environment');
//var Company = require('../../api/company/company.model'); // circular reference !! broken


var globalURL = 'mongodb://admin:passpass@ds061148-a.mongolab.com:61148/global';

// TODO:
// 1. check Company for subdomain that matches company-name
// 2. get DB-url from Company that is found
// 3. create a 'local' connection from the DB-url
// 4. user 'local' connection for all future requests + authentication

