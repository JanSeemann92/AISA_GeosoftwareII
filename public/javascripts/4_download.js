"use strict" 

/** 
 * Pulls the demo files from the server, merges them into a zip and then downloads the zip.
 * Source: https://jalara-studio.de/mit-javascript-eine-zip-datei-erstellen
 */
function downloaddemodata(){

    var zip = new JSZip();

    JSZipUtils.getBinaryContent("http://backend:8782/demodata/createdbyAISAtool/aoaOutput.tif", function( err, data1 ) {
        if ( err ) {
            throw err;
        }
        zip.file("aoaOutput.tif", data1, { binary:true } );

    JSZipUtils.getBinaryContent("http://backend:8782/demodata/createdbyAISAtool/predictionOutput.tif", function( err, data2 ) {
        if ( err ) {
            throw err;
        }
        zip.file("predictionOutput.tif", data2, { binary:true } );

    JSZipUtils.getBinaryContent("http://backend:8782/demodata/createdbyAISAtool/samplingLocationsOutput.geojson", function( err, data3 ) {
        if ( err ) {
            throw err;
        }
        zip.file("samplingLocations.geojson", data3, { binary:true } );

    JSZipUtils.getBinaryContent("http://backend:8782/demodata/createdbyAISAtool/trainingsitesOutput.geojson", function( err, data4 ) {
        if ( err ) {
            throw err;
        }
        zip.file("trainingsites.geojson", data4, { binary:true } );
    

    JSZipUtils.getBinaryContent("http://backend:8782/demodata/createdbyAISAtool/modelOutput.RDS", function( err, data5 ) {
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

    JSZipUtils.getBinaryContent("http://backend:8782/data/output/aoaOutput.tif", function( err, data1 ) {
        if ( err ) {
            throw err;
        }
        zip.file("aoaOutput.tif", data1, { binary:true } );

    JSZipUtils.getBinaryContent("http://backend:8782/data/output/predictionOutput.tif", function( err, data2 ) {
        if ( err ) {
            throw err;
        }
        zip.file("predictionOutput.tif", data2, { binary:true } );

    $.ajax({
        url: "http://backend:8782/data/output/labelsOutput.json",
        type: 'GET',
        dataType: 'json', 
        success: function(res) {
            var status = res[0][1];
            console.log(status)
            if(status == 'sampling'){
                JSZipUtils.getBinaryContent("http://backend:8782/data/output/samplingLocationsOutput.geojson", function( err, data3 ) {
                    if ( err ) {
                        throw err;
                    }
                    zip.file("samplingLocations.geojson", data3, { binary:true } );
    
    $.ajax({
        url: "http://backend:8782/data/output/labelsOutput.json",
        type: 'GET',
        dataType: 'json', 
        success: function(res) {
            var status = res[0][0];
            console.log(status)
            if(status == 'trainingdata'){
                JSZipUtils.getBinaryContent("http://backend:8782/data/output/modelOutput.RDS", function( err, data5 ) {
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
    }})})}}})})})}

