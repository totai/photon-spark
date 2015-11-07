'use strict';
var _ = require('lodash');

// seed new Users
var User = require('../api/user/user.model');
User.find({}).remove(function () {
   User.create({
         provider: 'local',
         username: 'pbernasconi',
         name: 'Paolo Bernasconi',
         email: 'p@ex.io',
         password: 'pass'
      }, {
         provider: 'local',
         username: 'marco_b',
         name: 'Marco Bernasconi',
         email: 'm@ex.io',
         password: 'pass'
      }, {
         provider: 'local',
         role: 'admin',
         username: 'admin',
         name: 'Admin',
         email: 'admin@admin.com',
         password: 'admin'
      },
      function (error, success) {
         if (error) console.log("USER error : " + error);
         console.log("USER Created : " + success.SEQ);
      })
});

// seed new Core Types
var Spark_core_type = require('../api/spark_core_type/spark_core_type.model');
var InsertCoreType = function (types) {
   _.forEach(types, function (type) {
      Spark_core_type.findById(type._id, function (err, res) {
         if (err) console.log("Spark_core_type NOT FOUND : " + err);
         if (!res) {
            Spark_core_type.create(type, function (err, success) {
               if (err) console.log("ERROR: Spark_core_type [" + err + ' ]');
               console.log("SAVE Spark_core_type : [ " + success + ' ]');
            })
         }
      })
   })
};
var Types = [{
   _id: "THT",
   v1: "Indoor Temp",
   v2: "Outdoor Temp",
   tx: "text",
   ct: "counter",
   name: "Temperature / Humidity"
}, {
   _id: "DOR",
   v1: "ON/OFF",
   tx: "text",
   ct: "counter",
   name: "Door open..."
}, {
   _id: "FID",
   tx: "Person ID",
   ct: "counter",
   name: "Finger ID"
}, {
   _id: "PIN",
   tx: "Person ID",
   ct: "counter",
   name: "PIN entry"
}, {
   _id: "MOV",
   tx: "sensor",
   ct: "counter",
   name: "Movement detection"
}, {
   _id: "LGT",
   v1: "main light",
   v2: "second light",
   tx: "RED-LIGHT",
   ct: "counter",
   name: "Light settings"
}, {
   _id: "CAM",
   tx: "camera view",
   ct: "counter",
   name: "Camera data"
}];
InsertCoreType(Types);

// see new Cores
var Spark_core = require('../api/spark_core/spark_core.model');
var InsertCore = function (cores) {
   _.forEach(cores, function (core) {
      Spark_core.findById(core._id, function (err, res) {
         if (err) console.log("Spark_core NOT FOUND : " + err);
         if (!res) {
            Spark_core.create(core, function (err, success) {
               if (err) console.log("ERROR: Spark_core [" + err + ' ]');
               console.log("SAVE Spark_core : [ " + success + ' ]');
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
}, {
   _id: "66ff69065075523354381XXX",
   ownerSEQ: "CCC",
   coreid: "66ff69065075523354381XXX",
   name: "OUTDOOR Temp Sensor",
   location: "NAS",
   comment: "My NASSAU comments",
   types: ["HUM", "THT", "LGT"]
}];
InsertCore(Cores);
