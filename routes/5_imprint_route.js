const express = require('express')
var router = express.Router(); 

/**
 * GET Router für Kontakt Seite
 */
router.get('/', function(req, res, next)
{
    res.render('5_imprint', {title: 'Imprint'})
}); 

module.exports = router; 