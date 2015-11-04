'use strict';
var config = require('../../config/environment'),
   later = require('later'),
   moment = require('moment'),
   Aggregator = require('../spark_data/aggregator'),
   _ = require('lodash'),
   Agenda = require('agenda'),
   agenda = new (Agenda);

agenda.database(config.mongo.uri, 'spark_schedule');
agenda.name('spark_queue');
agenda.defaultLockLifetime(20000);  // 20 seconds
agenda.processEvery('30 seconds');

agenda.purge(function (err, numRemoved) {
   console.log('Agenda: [ ' + numRemoved + ' ] purged')
});

agenda.define('Spark Aggregate MINS', {concurrency: 1}, function (job, done) {
   Aggregator.aggregate_data('mins');
   console.log('Agenda: Agg MINS', job.attrs.data);
   setTimeout(done, 2000);
});

agenda.define('Spark Aggregate HOURS', function (job, done) {
   Aggregator.aggregate_data_HOUR('hours');
   console.log('Agenda Agg HOURS', job.attrs.data);
   setTimeout(done, 4000);
});

agenda.define('Spark Aggregate DAYS', function (job, done) {
   Aggregator.aggregate_data_HOUR('days');
   console.log('Agenda Agg DAYS', job.attrs.data);
   setTimeout(done, 2000);
});

agenda.define('Spark Aggregate WEEKS', function (job, done) {
   console.log('Agenda Agg WEEKS', job.attrs.data);
   setTimeout(done, 2000);
});

agenda.define('Spark Aggregate MONTHS', function (job, done) {
   console.log('Agenda Agg MONTHS', job.attrs.data);
   setTimeout(done, 2000);
});

// [ */5 * * * *  ]
agenda.every('5 minutes', 'Spark Aggregate MINS', {period: 'MINS'});

agenda.every('10 * * * *', 'Spark Aggregate HOURS', {period: 'HOURS'});  // every 00:10 on the hour

agenda.every('15 0 * * *', 'Spark Aggregate DAYS', {period: 'DAYS'});  // every 00:15 on the day

//agenda.every('20 0 * * 0', 'Spark Aggregate WEEKS', {period: 'WEEKS'});
//agenda.every('25 0 1 * *', 'Spark Aggregate MONTHS', {period: 'MONTHS'});

agenda.start();

agenda.jobs({}, function (err, jobs) {
   _.forEach(jobs, function (job) {
      console.log('AGG Jobs: ' + JSON.stringify(job));

      var Job = eval('(' + JSON.stringify(job) + ')');

      var PrevAgendaShedule = later.schedule(later.parse.cron(Job.repeatInterval)).prev(1);

      var lastFinishedAt = Job.lastFinishedAt;

      console.log(moment(lastFinishedAt).unix() - moment(PrevAgendaShedule).unix());

      console.log('DATES: ' + moment(lastFinishedAt).format() + ' -:- ' + moment(PrevAgendaShedule).format());

      console.log("XXX " + Job.repeatInterval );

      console.log('Z '+ later.schedule(later.parse.cron(Job.repeatInterval)).prev(1))

   })
});

agenda.on('start', function (job) {
   //console.log("Job %s starting", job.attrs.name);
   console.log("Job: " + job.attrs.name + ' -> starting: ' + Date());
});

var sched = later.parse.cron('15 0 * * *');

// console.log(JSON.stringify(sched)+' -:- ' + later.schedule(sched).prev(1))

var T = Date(later.schedule(sched).prev(1));

// console.log(T)

// var prev = later.schedule(sched).prev(5, startDate, endDate);