// Mitte der Karte
var center = [50.943144, 10.388001];

// Erstellung einer Variablen, die die Karte enthält, initial settings
var map = L.map('map').setView(center, 6); 

//initialiation of the attributes
let marker = ""; 
let rectangle = ""; 
let drawEvent = false; 
var route2 = null; 
var drawnGeojson; 

// MapTiler hinuzfügen
L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=86IucIQ0W7mo5uspiDDB', 
    {
     attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
    }).addTo(map); 

// Draw Group/ Toolbar hinzufügen
var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);
var drawControl = new L.Control.Draw ({
    edit: {
        featureGroup: drawnItems,
    },
    draw: {
        polygon:false,
        marker:false,
        polyline: false,
        circle: false
    }
});
map.addControl(drawControl);
    

// Draw Events
map.on(L.Draw.Event.CREATED, function (e) {
    var type = e.layerType,
        layer = e.layer;
    var element = document.getElementById('input-map'); 
    console.log(element); 
    console.log(e.layer) //--> toGeoJson  --> drawnIten
    drawEvent = true; 
    if (type === 'marker') {
        marker = e;
        console.log(marker.layer._latlng);
    } 
    if (type == 'rectangle') {
      rectangle = e; 
        console.log(rectangle.layer._latlngs);
    }
    //fetch('/tour/add')
    //    .then(res => drawEvent)
    drawnGeojson = drawnItems.toGeoJSON(); 
    drawnItems.addLayer(layer);
 });
 
map.on('draw:edited', function (e) {
    var layers = e.layers;
    layers.eachLayer(function (layer) {
    });
});

// Event Handler for Area-Selection-Input-form -> disabel/ enable form field depending on selected option
$(document).ready(function(){
    $("select[name='choose']").on('change',function(){
      if($(this).val()==1){
        $("input[name='coordinates']").prop("disabled",false);
      }else{
        $("input[name='coordinates']").prop("disabled",true);
      }
    });
  });

$(document).ready(function(){
    $("select[name='choose']").on('change',function(){
      if($(this).val()==0){
        $("input[name='bbox']").prop("disabled",false)
      }else{
        $("input[name='bbox']").prop("disabled",true);
      }
    });
  });

