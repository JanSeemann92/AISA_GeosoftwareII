const express = require('express')
var router = express.Router(); 

//get router for result page of own calculations
router.get('/', function(req, res, next)
{
    res.render('2_1_ownresultAOA', {title: 'Own Calculation Result'})
}); 

module.exports = router;