// Mitte der Karte
var center = [50.943144, 10.388001];

// Erstellung einer Variablen, die die Karte enthält, initial settings
var resultmap = L.map('resultmap').setView(center, 6); 

// MapTiler hinuzfügen
L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=86IucIQ0W7mo5uspiDDB', 
    {
     attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
    }).addTo(resultmap);

