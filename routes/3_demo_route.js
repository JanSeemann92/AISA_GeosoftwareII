const express = require('express')
var router = express.Router(); 

//get router for demo page
router.get('/', function(req, res, next)
{
    res.render('3_demo', {title: 'Demo'})
}); 

module.exports = router; 