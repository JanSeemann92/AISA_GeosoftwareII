const express = require('express')
var router = express.Router(); 

//get router for result page of demo calculations
router.get('/', function(req, res, next)
{
    res.render('3_1_demoresultAOA', {title: 'Demo Result'})
}); 

module.exports = router;