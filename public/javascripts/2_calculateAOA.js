"use strict"

// center of the map
var center = [50.943144, 10.388001];

// create a variable that contains the map, initial settings
var map = L.map('map').setView(center, 6); 

// initialiation of the attributes
let marker = ""; 
let rectangle = ""; 
let drawEvent = false; 
var route2 = null; 
var drawnGeojson; 

// add tileLayer
L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=86IucIQ0W7mo5uspiDDB', 
    {
     attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
    }).addTo(map); 

// add drawControl
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
        circle: false,
    }
});
map.addControl(drawControl);
    

// manage draw events
map.on(L.Draw.Event.CREATED, function (e) {
    var type = e.layerType,
        layer = e.layer; 
    console.log(e.layer) //--> toGeoJson  --> drawnItem
    drawEvent = true; 
    if (type == 'rectangle') {
      rectangle = e; 
        console.log(rectangle.layer._latlngs);
    }
    drawnGeojson = drawnItems.toGeoJSON(); 
    drawnItems.addLayer(layer);
    console.log(drawnItems)
 });
 
map.on('draw:edited', function (e) {
    var layers = e.layers;
    layers.eachLayer(function (layer) {
    });
});

// Event Handler for Area-Selection-Input-form -> disable/ enable form field depending on selected option
$(document).ready(function(){
    $("select[name='choose']").on('change',function(){
      if($(this).val()==1){
        $("input[name='coordinates']").prop("disabled",false);
      }else{
        $("input[name='coordinates']").prop("disabled",true);
      }
    });
  });

//possibly insert EventHandler for bounding box
/**$(document).ready(function(){
    $("select[name='choose']").on('change',function(){
      if($(this).val()==0){
        $("input[name='bbox']").prop("disable",true)
      }else{
        $("input[name='bbox']").prop("disable",false);
      }
    });
  });
 */


var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
output.innerHTML = slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
  output.innerHTML = this.value;
  console.log(this.value)
} 

resolution.oninput = function(){
  output.innerHTML = this.value;
  console.log(this.value)
} 

function startCalculation(){
  let msg = document.querySelector("#input1").value;
  console.log(msg);
  alert(slider.value)
  var resolution = document.getElementById('resolution');
    var name = resolution.options[resolution.selectedIndex].text;
    var wert = resolution.options[resolution.selectedIndex].value;
    alert('Wert: '+wert+' - Name: '+name);
  alert("The calculation will now be executed, you will then be redirected to the results. The calculation may take a few minutes, please wait...")
  window.location.href= '/ownresultAOA'  
}

var polygonvalue = document.getElementsByName('choose1').value
console.log


