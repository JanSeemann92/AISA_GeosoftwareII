"use strict" 

// Mitte der Karte
var center = [50.943144, 10.388001];

// Erstellung einer Variablen, die die Karte enthält, initial settings
var resultmap = L.map('resultmap').setView(center, 6); 

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

//Functions 

var startCalculationButton = document.getElementById('startCalculation');

//Add click event listener to startCalculation Button. When clicked, function "samplingAreas()" is called.
startCalculationButton.addEventListener('click', function(){
    console.dir("hello")
})

/** 
 * Sends API request to [!!!] and calls the "displaySamplingAreas(givenspots)" function to display all the given recommended sampling areas on the map.
 * [URL ÄNDERN!!!]
 */
function samplingAreas() {
  jQuery.ajax({
      url: "https://rest.busradar.conterra.de/prod/haltestellen",
      method: "GET",
  })
  .done(function (response) {
      console.dir(response)
      displaySamplingAreas(response) 
  })
  .fail(function (xhr, status, errorThrown) {
      alert( "error" )
      console.dir(xhr)
      console.log(status)
      console.log(errorThrown)        
  })
  .always(function(xhr, status){
    console.log(xhr, status);
})}

/** 
 * Adds an icon marker to the recommended sampling areas using the given coordinates and the leaflet function "pointToLayer" and adds them to the map.
 * Source: https://leafletjs.com/examples/geojson/
 * @param givenspots The returned bus stops of the API query
 * @return markers at the locations of the bus stops
 */
function displaySamplingAreas(givenspots){    
    var samplingareas = L.geoJson(givenspots, {
        pointToLayer: function(feature, latlng) {            
            return L.marker(latlng, {icon: icon})}})
        samplingareas.addTo(resultmap)
        markers = samplingareas;
        console.log(samplingareas)
}