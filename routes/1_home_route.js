var express = require('express');
var router = express.Router();

/**
 * GET Router für Homepage 
 */
router.get('/', function(req, res, next) {
  res.render('1_home', { title: 'Homepage' });
});

module.exports = router;