"use strict" 

function startDemoCalculation(){
    //alert("The calculation will now be executed, you will then be redirected to the results. The calculation may take a few minutes, please wait...")
    /*$.ajax({
        url: "http://127.0.0.1:25118/runDemo",
        type: 'GET',
        success: function(){
        console.log("Hello"),
        window.location.href= '/demoresultAOA'
    }})*/
    alert("The calculation will now be executed, you will then be redirected to the results. The calculation may take a few minutes, please wait...")
    window.location.href= '/demoresultAOA'  
}

var coordsAOI = [[52.18672, 7.325238], [52.34297,7.611398]];