(function () {

   var mongoose = require('mongoose'),
      _ = require('lodash'),
      db = null,
      collection_name = 'io_counters',
      IO_Counter = null;

   exports.init_SEQ_ID_data = function (database, id_string, id_name) {
      db = database;
      var IO_countersSchema = new mongoose.Schema({
         _id: String,
         SEQ: String,
         SEQ_num: Number,
         name: String,
         created: {type: Date, default: Date.now},
         updated: {type: Date, default: Date.now}
      });
      try {
         if (mongoose.model(collection_name)) {
            console.log('spark_SEQ_ID model - EXISTS')
         }
      } catch (e) {
         //console.log('-> ' + e)
         if (e.name === 'MissingSchemaError') {
            console.log('spark_SEQ_ID model - NEW');
            IO_Counter = mongoose.model(collection_name, IO_countersSchema);
         }
      }
      db.model(collection_name).create({
            _id: id_string,
            SEQ_num: 1075000100,
            name: id_name
         },
         function (error, success) {
            if (error) console.log("spark_SEQ_ID : '" + id_string + "' : exists");
            if (!error) console.log("spark_SEQ_ID OK : " + success);
         });
      if (!mongoose.model(collection_name)) {
         return db.model(collection_name, IO_countersSchema);
      }
   };

   exports.SEQ_ID_aggregate = function (id_string) {
      var Spark_core = require('../api/spark_core/spark_core.model');
      var InsertCore = function (cores) {
         _.forEach(cores, function (core) {
            Spark_core.findById(core._id, function (err, res) {
               if (err) console.log("FIND: " + err);
               if (!res) {
                  console.log("CORE: " + res);
                  Spark_core.create(core, function (err, result) {
                     if (err) console.log("CORE ERR: " + err);
                     if (result) {
                        console.log("SAVE SEQ_ID: [" + result+ " ]");
                     }
                  })
               }
            })
         })
      };
      var Cores = [{
         _id: "55ff69065075555354381887",
         ownerSEQ: "AAA",
         coreid: "55ff69065075555354381887",
         name: "Motion Sensor",
         location: "GVA",
         comment: "My comments",
         types: ["MOV", "THT", "LGT"]
      }, {
         _id: "66ff69065075523354381811",
         ownerSEQ: "BBB",
         coreid: "66ff69065075523354381811",
         name: "Temp/Humid Sensor",
         location: "GVA",
         comment: "My comments",
         types: ["MOV", "THT", "LGT"]
      }];
      InsertCore(Cores);

   };

   exports.plugin = function (schema, options) {
      if (!options.counterID) {
         throw new Error('Missing: CounterID required parameter: counterID');
      }
      // get "io_counters" _id (text)
      var model_name = options.counterID.toLowerCase();
      // get "prefix" to put in front of base_32 number:  "C0" + "A1B2C3D4"
      var prefix = options.prefix;
      var Counter = db.model(collection_name);
      schema.add({
         SEQ: {
            type: String,
            unique: true
         }
      });
      return schema.pre('save', function (next) {
         var self = this;
         if (!self.SEQ) {
            return Counter.collection.findAndModify({
                  _id: model_name
               },
               [], {
                  $inc: {SEQ_num: 1},
                  $currentDate: {updated: true}
               }, {
                  "new": true,
                  upsert: true
               }, function (err, doc) {
                  var count;
                  count = doc.SEQ_num;
                  if (err) {
                     return next(err);
                  }
                  self.SEQ = prefix + count.toString(32).toUpperCase();
                  return next();
               });
         } else {
            return next();
         }
      });
   };
}).call(this);
