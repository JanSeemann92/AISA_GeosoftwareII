const express = require('express')
var router = express.Router(); 

/**
 * GET Router für Kontakt Seite
 */
router.get('/', function(req, res, next)
{
    res.render('3_demo', {title: 'Demo'})
}); 

module.exports = router; 