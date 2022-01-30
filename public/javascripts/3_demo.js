"use strict" 

/**
 * Sends request for demo run to backend, meanwhile shows a loading gif and then redirects to the result page
 */
function startDemoCalculation(){
    document.getElementById('startdemo').style.display = 'none';
    document.getElementById('msgstartdemo').style.display = 'block';
    $.ajax({
        url: "http://44.234.41.163:8782/runDemo",
        type: 'GET',
        beforeSend: function(){$('#loadingdemo').html("<img src= 'https://media.giphy.com/media/lPcbCcPfACi3ncc3cv/giphy.gif' width ='150' />")},
        success: function(){
        ($('#loadingdemo').hide("<img src= 'https://media.giphy.com/media/lPcbCcPfACi3ncc3cv/giphy.gif' width ='150'/>")),
        window.location.href= '/demoresultAOA'
    }})
}

