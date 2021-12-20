const express = require('express')
var router = express.Router(); 

//get router for download page
router.get('/', function(req, res, next)
{
    res.render('4_download', {title: 'Download'})
}); 

module.exports = router; 