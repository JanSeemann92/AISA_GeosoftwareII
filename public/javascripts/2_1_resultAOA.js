"use strict" 

//Generate result map
var resultmap = L.map('resultmap').setView([50.943144, 10.388001], 6);

// MapTiler hinzufügen
L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=86IucIQ0W7mo5uspiDDB', 
    {
     attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
    }).addTo(resultmap);


//Icon-source: Icons erstellt von "https://www.freepik.com" Freepik from Flaticon www.flaticon.com
//code source:https://leafletjs.com/examples/custom-icons/
var icon = L.icon({
    iconSize: [25, 25],
    iconUrl: '/stylesheets/circle.png'
});

function startCalculation(){
    console.log("Hello")
    window.location.href= '/resultAOA'  
    samplingAreas(); 
}

/** 
 * Sends API request to [!!!] and calls the "displaySamplingAreas(givenspots)" function to display all the given recommended sampling areas on the map.
 * [URL ÄNDERN!!!]
 */
function samplingAreas(){
    console.log("hello3");
    anfrage();
}

function anfrage(){
    console.log("Hello4")
    $.ajax({
        url: "https://rest.busradar.conterra.de/prod/haltestellen",
        type: 'GET',
        dataType: 'json', // added data type
        success: function(res) {
            console.dir(res);
            displaySamplingAreas(res)
        }
    })};


/** 
 * Adds an icon marker to the recommended sampling areas using the given coordinates and the leaflet function "pointToLayer" and adds them to the map.
 * Source: https://leafletjs.com/examples/geojson/
 * @param givenspots The returned bus stops of the API query
 * @return markers at the locations of the bus stops
 */

function displaySamplingAreas(givenspots){    
    console.log("HELLO4")
    console.dir(givenspots)
    var samplingareas = L.geoJson(givenspots, {
        pointToLayer: function(feature, latlng) {            
            return L.marker(latlng, {icon: icon})}})
        samplingareas.addTo(resultmap)
        markers = samplingareas;
        console.log(samplingareas)
}