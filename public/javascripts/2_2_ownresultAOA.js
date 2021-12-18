//Generate result map
var predictionmap = L.map('predictionmap').setView([50.943144, 10.388001], 6);

// MapTiler hinzufügen
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', 
    {
     attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
    }).addTo(predictionmap);