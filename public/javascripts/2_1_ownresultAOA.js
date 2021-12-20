"use strict"

// Create map for own calculation results
var ownresultmap = L.map('ownresultmap').setView([50.943144, 10.388001], 6);

// add tileLayer
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', 
    {
     attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
    }).addTo(ownresultmap);