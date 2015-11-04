(function () {
   var Spark_raw = require('../../api/spark_raw/spark_raw.model'),
      Spark_data_mins = require('../../api/spark_data/spark_data_mins.model'),
      Spark_data_hours = require('../../api/spark_data/spark_data_hours.model'),
      Spark_data_days = require('../../api/spark_data/spark_data_days.model'),
      moment = require('moment'),
      _ = require('lodash');

   var AggProjectCalc = function (period) {
      var AggProj = {};
      switch (period) {
         case 'mins':
            AggProj.Project = {
               s: {"$second": "$ts"},
               ml: {"$millisecond": "$ts"}
            };
            AggProj.Math = ["$ml",
               {"$multiply": ["$s", 1000]}   // seconds  1'000
            ];
            return AggProj;
         case 'hours':
            AggProj.Project = {
               m: {"$minute": "$ts"},
               s: {"$second": "$ts"},
               ml: {"$millisecond": "$ts"}
            };
            AggProj.Math = ["$ml",
               {"$multiply": ["$s", 1000]},   // seconds  1'000
               {"$multiply": ["$m", 60000]}    // minutes  60'000
            ];
            return AggProj;
         case 'days':
            AggProj.Project = {
               h: {"$hour": "$ts"},
               m: {"$minute": "$ts"},
               s: {"$second": "$ts"},
               ml: {"$millisecond": "$ts"}
            };
            AggProj.Math = ["$ml",
               {"$multiply": ["$s", 1000]},   // seconds  1'000
               {"$multiply": ["$m", 60000]},    // minutes  60'000
               {"$multiply": ["$h", 3600000]}  // hourly  60 * 60 * 1'000
            ];
            return AggProj;
         case 'weeks':
            AggProj.Project = {
               h: {"$hour": "$ts"},
               m: {"$minute": "$ts"},
               s: {"$second": "$ts"},
               ml: {"$millisecond": "$ts"}
            };
            AggProj.Math = ["$ml",
               {"$multiply": ["$s", 1000]},   // seconds  1'000
               {"$multiply": ["$m", 60000]},    // minutes  60'000
               {"$multiply": ["$h", 3600000]}  // hourly  60 * 60 * 1'000
            ];
            return AggProj;
         case 'months':
            AggProj.Project = {
               h: {"$hour": "$ts"},
               m: {"$minute": "$ts"},
               s: {"$second": "$ts"},
               ml: {"$millisecond": "$ts"}
            };
            AggProj.Math = ["$ml",
               {"$multiply": ["$s", 1000]},   // seconds  1'000
               {"$multiply": ["$m", 60000]},    // minutes  60'000
               {"$multiply": ["$h", 3600000]}  // hourly  60 * 60 * 1'000
            ]
      }
      return AggProj;
   };

   exports.aggregate_data = function (period) {
      var AggProject = AggProjectCalc(period);
      var matchCalc = AggProject.Math;
      //console.log('AggProjMath: ' + JSON.stringify(matchCalc))
      var tempMerge = {SEQ: 1, T: 1, ts: 1, v1: 1, v2: 1, v3: 1, date: "$ts", _id: 0};
      AggProject = _.merge(AggProject.Project, tempMerge);
      //console.log('AggProject: ' + JSON.stringify(AggProject))
      var endDate = moment().subtract(0, 'hours').toDate();
      var CoreMatch = {};
      Spark_raw.aggregate({$group: {_id: "$SEQ", T: {$addToSet: "$T"}}},
         function (err, res) {
            if (err) console.log('AGG_X: ' + err);
            // [{"_id":"51ff6f065067545749550287","T":["THT"]},{"_id":"55ff69065075555354381887","T":["LGT","MOV"]}]
            _.forEach(res, function (Core) {
               _.forEach(Core.T, function (CoreT) {
                  CoreMatch.T = CoreT;
                  CoreMatch.SEQ = Core._id;
                  console.log('AGG RAW: ' + CoreMatch.SEQ + ' : ' + CoreMatch.T);
                  Spark_raw.aggregate(
                     //  {$match: {T: "MOV", SEQ: "55ff69065075555354381887", ts: {$lt: endDate}}},
                     {$match: {T: CoreMatch.T, SEQ: CoreMatch.SEQ, ts: {$lt: endDate}}},
                     // {"s":{"$second":"$ts"},"ml":{"$millisecond":"$ts"},"SEQ":1,"T":1,"ts":1,"v1":1,"v2":1,"v3":1,"date":"$ts","_id":0}
                     {$project: AggProject},
                     {
                        "$project": {
                           SEQ: 1, T: 1, ts: 1, v1: 1, v2: 1, v3: 1,
                           date: {
                              "$subtract": [
                                 "$date", {"$add": matchCalc}]
                           }
                        }
                     },
                     {
                        $group: {
                           _id: {ts: "$date", T: "$T", SEQ: "$SEQ"},
                           SEQ: {$last: "$SEQ"},
                           v1H: {$max: "$v1"},
                           v1L: {$min: "$v1"},
                           v1C: {$last: "$v1"},
                           v2H: {$max: "$v2"},
                           v2L: {$min: "$v2"},
                           v2C: {$last: "$v2"},
                           v3H: {$max: "$v3"},
                           v3L: {$min: "$v3"},
                           v3C: {$last: "$v3"},
                           ct: {$sum: 1},
                           T: {$last: "$T"},
                           ts: {$last: "$date"}
                        }
                     },
                     {$sort: {"ts": 1}},
                     function (err, data) {
                        console.log('DATA: ' + JSON.stringify(data));
                        if (err) {
                           console.log('ERR_loop: ' + CoreMatch.SEQ + ' : ' + CoreMatch.T + ' : ' + err)
                        }
                        if (!err) {
                           if (data.length > 0) {
                              if ((moment().unix() - moment(data[data.length-1].ts).unix()) < 100) {
                                 data.pop();  // remove last minute data
                              }
                           }
                           Spark_data_mins.create(data, function (err, res) {
                           })
                        }
                     }
                  )
               })
            })
         })
   };



   exports.aggregate_data_HOUR = function (period) {
      var AggProject = AggProjectCalc(period);
      var matchCalc = AggProject.Math;
      // console.log('AggProjMath_HR: ' + JSON.stringify(matchCalc))
      var tempMergeH = {
         SEQ: 1,
         T: 1,
         v1H: 1,
         v1L: 1,
         v1C: 1,
         v2H: 1,
         v2L: 1,
         v2C: 1,
         v3H: 1,
         v3L: 1,
         v3C: 1,
         date: "$ts",
         _id: 0
      };
      AggProject = _.merge(AggProject.Project, tempMergeH);
      //console.log('AggProject_H: ' + JSON.stringify(AggProject))
      var endDate = moment().subtract(0, 'hours').toDate();
      var CoreMatch = {};
      Spark_data_mins.aggregate({$group: {_id: "$SEQ", T: {$addToSet: "$T"}}},
         function (err, res) {
            //if (err) console.log('AGG_HOUR ERR: ' + err);
            _.forEach(res, function (Core) {
               _.forEach(Core.T, function (CoreT) {
                  CoreMatch.T = CoreT;
                  CoreMatch.SEQ = Core._id;
                  console.log('AGG HR: ' + CoreMatch.SEQ + ' : ' + CoreMatch.T);
                  //  {$match: {T: "MOV", SEQ: "55ff69065075555354381887", ts: {$lt: endDate}}},
                  Spark_data_mins.aggregate(
                     {$match: {T: CoreMatch.T, SEQ: CoreMatch.SEQ, ts: {$lt: endDate}}},
                     {$project: AggProject},
                     {
                        "$project": {
                           SEQ: 1, T: 1, v1H: 1, v1L: 1, v1C: 1, v2H: 1, v2L: 1, v2C: 1, v3H: 1, v3L: 1, v3C: 1,
                           date: {
                              "$subtract": ["$date", {"$add": matchCalc}]
                           }
                        }
                     },
                     {
                        $group: {
                           _id: {ts: "$date", T: "$T", SEQ: "$SEQ"},
                           SEQ: {$last: "$SEQ"},
                           v1H: {$max: "$v1H"},
                           v1L: {$min: "$v1L"},
                           v1C: {$last: "$v1C"},
                           v2H: {$max: "$v2H"},
                           v2L: {$min: "$v2L"},
                           v2C: {$last: "$v2C"},
                           v3H: {$max: "$v3H"},
                           v3L: {$min: "$v3L"},
                           v3C: {$last: "$v3C"},
                           ct: {$sum: 1},
                           T: {$last: "$T"}
                        }
                     },
                     {$sort: {"ts": 1}},
                     function (err, data) {
                        //console.log('DATA HR: ' + JSON.stringify(data))
                        if (err) {
                           console.log('ERR_loop: ' + CoreMatch.SEQ + ' : ' + CoreMatch.T + ' : ' + err)
                        }
                        if (!err) {
                           switch (period) {
                              case 'hours':
                                 if (data.length > 0) {
                                    if ((moment().unix() - moment(data[data.length-1].ts).unix()) < 4200) {
                                       data.pop();  // remove last hour data
                                    }
                                 }
                                 Spark_data_hours.create(data, function (err, res) {
                                 });
                                 break;
                              case 'days':
                                 if (data.length > 0) {
                                    if ((moment().unix() - moment(data[data.length-1].ts).unix()) < 86600) {
                                       data.pop();  // remove last day data
                                    }
                                 }
                                 Spark_data_days.create(data, function (err, res) {
                                 });
                                 break;
                              case 'weeks':
                                 if (data.length > 0) {
                                    if ((moment().unix() - moment(data[data.length-1].ts).unix()) < 605400) {
                                       data.pop();  // remove last week data
                                    }
                                 }
                                 Spark_data_days.create(data, function (err, res) {
                                 });
                                 break;
                           }
                        }

                     }
                  )
               })
            })
         })
   }

}).call(this);