"use strict" 

/** 
 * Pulls the demo files from the server, merges them into a zip and then downloads the zip.
 * Source: https://jalara-studio.de/mit-javascript-eine-zip-datei-erstellen
 */
function downloaddemodata(){

    var zip = new JSZip();

    JSZipUtils.getBinaryContent("http://127.0.0.1:25118/verzeichnisdemodaten/aoaOutput.tif", function( err, data1 ) {
        if ( err ) {
            throw err;
        }
        zip.file("aoaOutput.tif", data1, { binary:true } );

    JSZipUtils.getBinaryContent("http://127.0.0.1:25118/verzeichnisdemodaten/predictionOutput.tif", function( err, data2 ) {
        if ( err ) {
            throw err;
        }
        zip.file("predictionOutput.tif", data2, { binary:true } );

    JSZipUtils.getBinaryContent("http://127.0.0.1:25118/verzeichnisdemodaten/demodata_rheine_sampling_EPSG4326.geojson", function( err, data3 ) {
        if ( err ) {
            throw err;
        }
        zip.file("demodata_rheine_sampling_EPSG4326.geojson", data3, { binary:true } );

    JSZipUtils.getBinaryContent("http://127.0.0.1:25118/verzeichnisdemodaten/demodata_rheine_trainingspolygone.geojson", function( err, data4 ) {
        if ( err ) {
            throw err;
        }
        zip.file("demodata_rheine_trainingspolygone.geojson", data4, { binary:true } );

    JSZipUtils.getBinaryContent("http://127.0.0.1:25118/verzeichnisdemodaten/modelOutput.RDS", function( err, data5 ) {
        if ( err ) {
            throw err;
        }
        zip.file("modelOutput.RDS", data5, { binary:true } );

    zip.generateAsync( { type:"blob" } ).then( function( blob ) {
                saveAs( blob, "demodata.zip" );
                } );
})})})})})}