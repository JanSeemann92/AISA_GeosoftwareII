"use strict" 

/** 
 * Pulls the demo files from the server, merges them into a zip and then downloads the zip.
 * Source: https://jalara-studio.de/mit-javascript-eine-zip-datei-erstellen
 */
function downloaddemodata(){

    var zip = new JSZip();

    JSZipUtils.getBinaryContent("/downloaddata/aoaOutput.tif", function( err, data1 ) {
        if ( err ) {
            throw err;
        }
        zip.file("aoaOutput.tif", data1, { binary:true } );

    JSZipUtils.getBinaryContent("/downloaddata/predictionOutput.tif", function( err, data2 ) {
        if ( err ) {
            throw err;
        }
        zip.file("predictionOutput.tif", data2, { binary:true } );

    JSZipUtils.getBinaryContent("/downloaddata/demodata_rheine_sampling_EPSG4326.geojson", function( err, data3 ) {
        if ( err ) {
            throw err;
        }
        zip.file("demodata_rheine_samling_ESPG4326.geojson", data3, { binary:true } );

    JSZipUtils.getBinaryContent("/downloaddata/demodata_rheine_trainingspolygone.geojson", function( err, data4 ) {
        if ( err ) {
            throw err;
        }
        zip.file("demodata_rheine_trainingspolygone.geojson", data4, { binary:true } );
    

    JSZipUtils.getBinaryContent("/downloaddata/modelOutput.RDS", function( err, data5 ) {
        if ( err ) {
            throw err;
        }
        zip.file("modelOutput.RDS", data5, { binary:true } );
        

    zip.generateAsync( { type:"blob" } ).then( function( blob ) {
            saveAs( blob, "demodata.zip" );
            } );})}
           
    )})})})}

/** 
 * Pulls the created files (own calculation) from the server, merges them into a zip and then downloads the zip.
 * Source: https://jalara-studio.de/mit-javascript-eine-zip-datei-erstellen
 */
function downloadowndata(){

    var zip = new JSZip();

    JSZipUtils.getBinaryContent("/downloaddata/aoaOutput.tif", function( err, data1 ) {
        if ( err ) {
            throw err;
        }
        zip.file("aoaOutput.tif", data1, { binary:true } );

    JSZipUtils.getBinaryContent("/downloaddata/predictionOutput.tif", function( err, data2 ) {
        if ( err ) {
            throw err;
        }
        zip.file("predictionOutput.tif", data2, { binary:true } );

    JSZipUtils.getBinaryContent("/downloaddata/demodata_rheine_sampling_EPSG4326.geojson", function( err, data3 ) {
        if ( err ) {
            throw err;
        }
        zip.file("demodata_rheine_samling_ESPG4326.geojson", data3, { binary:true } );
    
    $.ajax({
        url: "demodata/labelsOutput.json",
        type: 'GET',
        dataType: 'json', 
        success: function(res) {
            var status = res[0][0];
            console.log(status)
            if(status == 'trainingdata'){
                JSZipUtils.getBinaryContent("/downloaddata/modelOutput.RDS", function( err, data5 ) {
                    if ( err ) {
                        throw err;
                    }
                    zip.file("modelOutput.RDS", data5, { binary:true } );
        
            zip.generateAsync( { type:"blob" } ).then( function( blob ) {
                    saveAs( blob, "data.zip" );
                    } );})}
            else{
                zip.generateAsync( { type:"blob" } ).then( function( blob ) {
                    saveAs( blob, "data.zip" );
                    } )
            }
    }})})})})}

