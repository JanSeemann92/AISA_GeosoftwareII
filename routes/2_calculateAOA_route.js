var express = require('express');
const app = require('../app');
var router = express.Router();
  
//get router for calculation page
router.get('/', function(req, res, next)
{
    res.render('2_calculateAOA', {title: 'AOA'})
}); 


module.exports = router; 