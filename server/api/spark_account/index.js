'use strict';

var controller = require('./spark_account.controller.js'),
   express = require('express'),
   router = express.Router();

router.get('/', controller.index);
router.get('/:core', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;
