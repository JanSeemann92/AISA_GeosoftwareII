const express = require('express')
var router = express.Router(); 

//get router for about page
router.get('/', function(req, res, next)
{
    res.render('5_about', {title: 'About'})
}); 

module.exports = router; 