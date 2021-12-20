"use strict" 

/** 
 * Pulls the demo files from the server, merges them into a zip and then downloads the zip.
 * Source: https://jalara-studio.de/mit-javascript-eine-zip-datei-erstellen
 */
function downloaddemodata(){

    var zip = new JSZip();

    JSZipUtils.getBinaryContent("./javascripts/3_1_demoresultAOA.js", function( err, data1 ) {
        if ( err ) {
            throw err;
        }
        zip.file("2_1_resultAOA.js", data1, { binary:true } );

    JSZipUtils.getBinaryContent("./javascripts/2_calculateAOA.js", function( err, data2 ) {
        if ( err ) {
            throw err;
        }
        zip.file("2_calculateAOA.js", data2, { binary:true } );

    JSZipUtils.getBinaryContent("./javascripts/3_demo.js", function( err, data3 ) {
        if ( err ) {
            throw err;
        }
        zip.file("3_demo.js", data3, { binary:true } );

    JSZipUtils.getBinaryContent("./javascripts/4_download.js", function( err, data4 ) {
        if ( err ) {
            throw err;
        }
        zip.file("4_download.js", data4, { binary:true } );

    zip.generateAsync( { type:"blob" } ).then( function( blob ) {
                saveAs( blob, "demodata.zip" );
                } );
})})})})}