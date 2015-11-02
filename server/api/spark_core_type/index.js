'use strict';

var controller = require('./spark_core_type.controller.js'),
   express = require('express'),
   router = express.Router();

var Spark_core_type = require('./spark_core_type.model.js');

router.get('/', controller.index);
router.get('/:core', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;

var body = {
   _id: 'MOV',
   name : "Movement detection",
   ct: "counter",
   v1: "void",
   v2:  "void",
   v3:  "void",
   tx: "text message"
}

Spark_core_type.create(body, function (err, domain) {
   if (err) {
      return handleError(res, err);
   }
   var updated = _.merge(domain, req_body);
   updated.save(function (err) {
      if (err) {
         return handleError(res, err);
      }
   });
});

console.log(body.ts + ' - ' + body.SEQ + ' : ' + body.ct + '  - ' + body.v1);