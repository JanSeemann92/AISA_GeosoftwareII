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

function startCalculation(){
  var state = document.querySelector("#choose2").options.selectedIndex;
    console.log(state)
  if(state == 0){
    document.querySelector('#msgoption').style.display = 'block';
  }
  else{
  if(state == 2){
  document.querySelector('#msgoption').style.display = 'none';
  if(document.querySelector('#validate3').style.display == 'block'){
    if (document.querySelector('#validate2').checked == false){  
      console.log('Test3: false')}
    else{
      console.log('Test4: true')
      //coordinates
      var ymin = document.querySelector("#ymin").value;
      var xmin = document.querySelector("#xmin").value;
      var ymax = document.querySelector("#ymax").value;
      var xmax = document.querySelector("#xmax").value;
      checkcoordinates(ymin, xmin, ymax, xmax);
      console.log(ymin);
      console.log(xmin);
      console.log(ymax);
      console.log(xmax);
      var cloudcover = slider.value;
      console.log(cloudcover);
      var resolution = document.getElementById('resolution').value;
      console.log(resolution);
      //alert("The calculation will now be executed, you will then be redirected to the results. The calculation may take a few minutes, please wait...")
      //window.location.href= '/ownresultAOA'
    }}
  if(document.querySelector('#validate1').style.display == 'block'){
    if (document.querySelector('#validate').checked == true){ 
        //coordinates
      var ymin = document.querySelector("#ymin").value;
      var xmin = document.querySelector("#xmin").value;
      var ymax = document.querySelector("#ymax").value;
      var xmax = document.querySelector("#xmax").value;
      checkcoordinates(ymin, xmin, ymax, xmax);
      console.log(ymin);
      console.log(xmin);
      console.log(ymax);
      console.log(xmax);
      var cloudcover = slider.value;
      console.log(cloudcover);
      var resolution = document.getElementById('resolution').value;
      console.log(resolution);
      //alert("The calculation will now be executed, you will then be redirected to the results. The calculation may take a few minutes, please wait...")
      //window.location.href= '/ownresultAOA'
    }
    else{
    document.querySelector('#validate1').style.display = 'none';
    document.querySelector('#validate3').style.display = 'block';
    console.log('Test2: false')}
}}
else{
  document.querySelector('#msgoption').style.display = 'none';
  console.log('Bounding box!')
  if(document.querySelector('#validate3').style.display == 'block'){
    if (document.querySelector('#validate2').checked == false){  
      console.log('Test3: false')}
    else{
      console.log('Test4: true')
      //coordinates
      var cloudcover = slider.value;
      console.log(cloudcover);
      var resolution = document.getElementById('resolution').value;
      console.log(resolution);
      //alert("The calculation will now be executed, you will then be redirected to the results. The calculation may take a few minutes, please wait...")
      //window.location.href= '/ownresultAOA'
    }}
  if(document.querySelector('#validate1').style.display == 'block'){
    if (document.querySelector('#validate').checked == true){ 
        //coordinates
      var cloudcover = slider.value;
      console.log(cloudcover);
      var resolution = document.getElementById('resolution').value;
      console.log(resolution);
      //alert("The calculation will now be executed, you will then be redirected to the results. The calculation may take a few minutes, please wait...")
      //window.location.href= '/ownresultAOA'
    }
    else{
    document.querySelector('#validate1').style.display = 'none';
    document.querySelector('#validate3').style.display = 'block';
    console.log('Test2: false')}
}}}}


function checkcoordinates(ymin, xmin, ymax, xmax){
  if(ymin == '' || xmin == '' || ymax == '' || xmax == ''){
    document.querySelector('#msgmissed').style.display = 'block';
    document.querySelector('#validate2').checked = 'false';
    document.querySelector('#validate').checked = 'false';
    document.querySelector('#validate1').style.display = 'block';
    document.querySelector('#validate3').style.display = 'none';
    return false
}
if(checkcoordsformat(ymin, xmin, ymax, xmax) == false){
  console.log('invalid format')
}
 else{
  document.querySelector('#msgmissed').style.display = 'none';
  document.querySelector('#validate').checked = 'true';
 }}

function checkcoordsformat(ymin, xmin, ymax, xmax){
  var coords = [ymin, xmin, ymax, xmax];
  console.log(coords)
  for(let i=0; i<coords.length; i++){
    console.log(coords[i])
    //https://qastack.com.de/programming/18042133/check-if-input-is-number-or-letter-javascript
    if(isNaN(coords[i])) 
    {   console.log(isNaN(coords[i]))
        console.log('No number')
        document.querySelector('#msgformat').style.display = 'block';
        document.querySelector('#validate2').checked = 'false';
        document.querySelector('#validate').checked = 'false';
        document.querySelector('#validate1').style.display = 'block';
        document.querySelector('#validate3').style.display = 'none';
        return false
    }}
  var yminfv = ymin.split('.');
  var ymaxfv = ymax.split('.');
  if(yminfv[0] > 90 || yminfv[0] <-90 || ymaxfv[0] > 90 || ymaxfv[0] <-90){
    document.querySelector('#msgformat').style.display = 'block';
    document.querySelector('#validate2').checked = 'false';
    document.querySelector('#validate').checked = 'false';
    document.querySelector('#validate1').style.display = 'block';
    document.querySelector('#validate3').style.display = 'none';
    console.log("invalid lat value")
    return false;
  }
  var xminfv = xmin.split('.');
  var xmaxfv = xmax.split('.');
  if(xminfv[0] > 180 || xminfv[0] <-180 || xmaxfv[0] > 180 || xmaxfv[0] <-180){
    document.querySelector('#msgformat').style.display = 'block';
    document.querySelector('#validate2').checked = 'false';
    document.querySelector('#validate').checked = 'false';
    document.querySelector('#validate1').style.display = 'block';
    document.querySelector('#validate3').style.display = 'none';
    console.log("invalid lng value")
    return false;
  }
  else{
    document.querySelector('#msgformat').style.display = 'none';
    document.querySelector('#validate1').style.display = 'block';
    document.querySelector('#validate3').style.display = 'none';
    document.querySelector('#validate').checked = 'true';
    console.log('valid format')
    return true
  }}




