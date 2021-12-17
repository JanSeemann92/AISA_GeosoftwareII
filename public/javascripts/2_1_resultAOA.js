"use strict" 

//Generate result map
var resultmap = L.map('resultmap').setView([50.943144, 10.388001], 6);

// MapTiler hinzufügen
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', 
    {
     attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
    }).addTo(resultmap);


//Icon-source: Icons erstellt von "https://www.flaticon.com/de/autoren/hasim-safii" hasim safii from "https://www.flaticon.com/de/" 
//code source:https://leafletjs.com/examples/custom-icons/
var icon = L.icon({
    iconSize: [20, 20],
    iconUrl: '/stylesheets/kreuz.png'
});

var AOAbutton = document.getElementById("showAOA");

var legendStandard = document.getElementById('legendStandard');
var statuslegendStandard = legendStandard.style;

var legendAOA = document.getElementById('legendAOA');
var statuslegendAOA = legendAOA.style;

var legendPrediction = document.getElementById('legendPrediction');
var statuslegendPrediction = legendPrediction.style;


//Add click event listener to busbutton. When clicked, function "busStops()" is called.
AOAbutton.addEventListener('click', function(){
if (statuslegendStandard.display == 'block' || statuslegendPrediction.display == 'block') {
    statuslegendStandard.display = 'none';
    statuslegendPrediction.display = 'none';
    statuslegendAOA.display = 'block';
}
var url_to_geotiff_file = "/stylesheets/AOA_EPSG4326.tif";
fetch(url_to_geotiff_file).then(response => response.arrayBuffer()).then(arrayBuffer => {
    parseGeoraster(arrayBuffer).then(georaster => {
        console.log("georaster:", georaster);
        var layer = new GeoRasterLayer({
            georaster: georaster,
            opacity: 0.8,
            pixelValuesToColorFn: values => (values[0] > 0 && values[0] <= 0.1) ? '#56b4e9' :
                                            (values[0] > 0.1 && values[0] <= 0.15) ? '#e69f00' :
                                            (values[0] > 0.15 && values[0] <= 0.2) ? '#009e73' :
                                            (values[0] > 0.2 && values[0] <= 0.25) ? '#f0e442' :
                                            (values[0] > 0.25 && values[0] <= 0.3) ? '#0072b2' :
                                            (values[0] > 0.3 && values[0] <= 0.5) ? '##d55e00' :
                                            (values[0] > 0.5 && values[0] <= 0.7) ? '#cc79a7' :
                                            (values[0] > 0.7 && values[0] <= 0.1) ? '#000000' :
                                            (values[0] > 1 && values[0] <= 2) ? '#cc79a7' :
                                            (values[0] > 2 && values[0] <= 3) ? '#d55e00' :
                                            (values[0] > 3 && values[0] <= 4) ? '#0072b2' :
                                            (values[0] > 4 && values[0] <= 5) ? '#f0e442' :
                                            (values[0] > 5 && values[0] <= 6) ? '#009e73' :
                                            (values[0] > 6 && values[0] <= 7) ? '#e69f00' :
                                            (values[0] > 7 && values[0] <= 8) ? '#56b4e9' :
                                            (values[0] > 8 && values[0] <= 9) ? '#000000' :
                                            null,
            resolution: 1200,
        });
        layer.addTo(resultmap);
        resultmap.fitBounds(layer.getBounds());
    })
})})

var Predictionbutton = document.getElementById("showPrediction");

//Add click event listener to busbutton. When clicked, function "busStops()" is called.
Predictionbutton.addEventListener('click', function(){
console.log(statuslegendAOA)
if (statuslegendStandard.display == 'block' || statuslegendAOA.display == 'block') {
    statuslegendStandard.display = 'none';
    statuslegendAOA.display = 'none';
    statuslegendPrediction.display = 'block';
}
var url_to_geotiff_file = "/stylesheets/prediction_EPSG4326.tif";
fetch(url_to_geotiff_file).then(response => response.arrayBuffer()).then(arrayBuffer => {
    parseGeoraster(arrayBuffer).then(georaster => {
        console.log("georaster:", georaster);
        var layer = new GeoRasterLayer({
            georaster: georaster,
            opacity: 0.8,
            pixelValuesToColorFn: values => (values[0] > 0 && values[0] <= 0.1) ? '#56b4e9' :
                                            (values[0] > 0.1 && values[0] <= 0.15) ? '#e69f00' :
                                            (values[0] > 0.15 && values[0] <= 0.2) ? '#009e73' :
                                            (values[0] > 0.2 && values[0] <= 0.25) ? '#f0e442' :
                                            (values[0] > 0.25 && values[0] <= 0.3) ? '#0072b2' :
                                            (values[0] > 0.3 && values[0] <= 0.5) ? '##d55e00' :
                                            (values[0] > 0.5 && values[0] <= 0.7) ? '#cc79a7' :
                                            (values[0] > 0.7 && values[0] <= 0.1) ? '#000000' :
                                            (values[0] > 1 && values[0] <= 2) ? '#cc79a7' :
                                            (values[0] > 2 && values[0] <= 3) ? '#d55e00' :
                                            (values[0] > 3 && values[0] <= 4) ? '#0072b2' :
                                            (values[0] > 4 && values[0] <= 5) ? '#f0e442' :
                                            (values[0] > 5 && values[0] <= 6) ? '#009e73' :
                                            (values[0] > 6 && values[0] <= 7) ? '#e69f00' :
                                            (values[0] > 7 && values[0] <= 8) ? '#56b4e9' :
                                            (values[0] > 8 && values[0] <= 9) ? '#000000' :
                                            null,
            resolution: 1200,
        });
        layer.addTo(resultmap);
        resultmap.fitBounds(layer.getBounds());
    })
})})


/** 
 * Sends API request to [!!!] and to displays all the given recommended sampling areas on the map.
 * [URL ÄNDERN!!!]
 */

 $.ajax({
    url: "https://rest.busradar.conterra.de/prod/fahrzeuge",
    type: 'GET',
    dataType: 'json', // added data type
    success: function(res) {
        console.dir(res);
        var samplingareas = L.geoJson(res, {
            pointToLayer: function(feature, latlng) {            
                return L.marker(latlng, {icon: icon})}})
            samplingareas.addTo(resultmap)
            console.log(samplingareas)
    }
});


/** 
* !!!! Add description !!!
*/
var xhr = new XMLHttpRequest();
xhr.open('GET', '/stylesheets/demodata_rheine_trainingspolygone_EPSG4326.geojson');
xhr.setRequestHeader('Content-Type', 'application/json');
xhr.onload = function() {
if (xhr.status === 200) {
L.geoJSON(JSON.parse(xhr.responseText)).addTo(resultmap);
}
};
xhr.send();



