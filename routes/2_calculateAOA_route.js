var express = require('express')
var router = express.Router(); 

/**
 * GET Router for Calculate AOA
 */
router.get('/', function(req, res, next)
{
    res.render('2_calculateAOA', {title: 'AOA'})
}); 

/**
 * POST Router for AOA Results
 * isn´t working so far...
 */
 router.post('/result', function(req, res, next)
 {
    res.send('POST request')
    /**console.log("Test")
    res.render('2_1_resultAOA', {title: 'AOA Result'})*/
})


/**
 * POST Router for AOA Results
 * isn´t working so far...
 */
 router.get('/upload', function(req, res, next)
 {
    //res.send('GET request')
    //console.log("Test")
    res.render('2_2_uploadAOA', {title: 'AOA Upload'})
})

module.exports = router; 