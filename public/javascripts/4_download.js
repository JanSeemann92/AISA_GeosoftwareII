"use strict" 

/** 
 * Pulls the demo files from the server, merges them into a zip and then downloads the zip.
 * Source: https://jalara-studio.de/mit-javascript-eine-zip-datei-erstellen
 */
function downloaddemodata(){

    var zip = new JSZip();

    JSZipUtils.getBinaryContent("/C:/Users/katha/Documents/GitHub/AISA_GeosoftwareII/Backend/demodata/createdbyAISAtool/predictionOutput.tif", function( err, data1 ) {
        if ( err ) {
            throw err;
        }
        zip.file("predictionOutput.tif", data1, { binary:true } );

    JSZipUtils.getBinaryContent("/C:/Users/katha/Documents/GitHub/AISA_GeosoftwareII/Backend/demodata/createdbyAISAtool/aoaOutput.tif", function( err, data2 ) {
        if ( err ) {
            throw err;
        }
        zip.file("aoaOutput.tif", data2, { binary:true } );

    JSZipUtils.getBinaryContent("/C:/Users/katha/Documents/GitHub/AISA_GeosoftwareII/Backend/demodata/createdbyAISAtool/demodata_rheine_trainingspolygone.geojson", function( err, data3 ) {
        if ( err ) {
            throw err;
        }
        zip.file("demodata_rheine_trainingspolygone.geojson", data3, { binary:true } );

    JSZipUtils.getBinaryContent("/C:/Users/katha/Documents/GitHub/AISA_GeosoftwareII/Backend/demodata/createdbyAISAtool/modelOutput.RDS", function( err, data4 ) {
        if ( err ) {
            throw err;
        }
        zip.file("modelOutput.RDS", data4, { binary:true } );

    zip.generateAsync( { type:"blob" } ).then( function( blob ) {
                saveAs( blob, "demodata.zip" );
                } );
})})})})}