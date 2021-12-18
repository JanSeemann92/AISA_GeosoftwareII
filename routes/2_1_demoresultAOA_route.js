const express = require('express')
var router = express.Router(); 

/**
 * GET Router for Calculate AOA
 */
router.get('/', function(req, res, next)
{
    res.render('2_1_demoresultAOA', {title: 'Demo Result'})
}); 

module.exports = router;