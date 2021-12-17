"use strict" 

//Generate result map
var resultmap = L.map('resultmap').setView([50.943144, 10.388001], 6);

// MapTiler hinzufügen
L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=86IucIQ0W7mo5uspiDDB', 
    {
     attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
    }).addTo(resultmap);


//Icon-source: Icons erstellt von "https://www.flaticon.com/de/autoren/hasim-safii" hasim safii from "https://www.flaticon.com/de/" 
//code source:https://leafletjs.com/examples/custom-icons/
var icon = L.icon({
    iconSize: [20, 20],
    iconUrl: '/stylesheets/kreuz.png'
});


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

var xhr = new XMLHttpRequest();
xhr.open('GET', '/stylesheets/test.geojson');
xhr.setRequestHeader('Content-Type', 'application/json');
xhr.onload = function() {
  if (xhr.status === 200) {
    L.geoJSON(JSON.parse(xhr.responseText)).addTo(resultmap);
  }
};
xhr.send();
