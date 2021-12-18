const express = require('express')
var router = express.Router(); 

/**
 * GET Router for Calculate AOA
 */
router.get('/', function(req, res, next)
{
    res.render('2_2_ownresultAOA', {title: 'Own Calculation Result'})
}); 

module.exports = router;