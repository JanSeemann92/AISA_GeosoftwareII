"use strict" 

/**
 * Sends request for demo run to backend, meanwhile shows a loading gif and then redirects to the result page
 */
function startDemoCalculation(){
    alert("The calculation will now be executed, you will then be redirected to the results. The calculation may take a few minutes, please wait...")
    $.ajax({
        url: "http://127.0.0.1:25118/runDemo",
        type: 'GET',
        beforeSend: function(){$('#loading').html("<img src= 'https://media.giphy.com/media/52qtwCtj9OLTi/giphy.gif' />")},
        success: function(){
        ($('#loading').hide("<img src= 'https://media.giphy.com/media/52qtwCtj9OLTi/giphy.gif' />"))
        console.log("Hello"),
        window.location.href= '/demoresultAOA'
    }})
}
