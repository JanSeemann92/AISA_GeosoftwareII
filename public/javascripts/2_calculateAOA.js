"use strict"

// Center of the map
var center = [50.943144, 10.388001];

// Create a variable that contains the map, initial settings
var map = L.map('map').setView(center, 6); 

// Initialiation of the attributes
let drawEvent = false; 

// Add tileLayer
L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=86IucIQ0W7mo5uspiDDB', 
    {
     attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
    }).addTo(map); 

// Add drawControl
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
    
// Array to store drawn rectangles
var array = [];

// Manage draw events
map.on(L.Draw.Event.CREATED, function (e) {
    var type = e.layerType,
        layer = e.layer; 
    drawEvent = true; 
    if (type == 'rectangle') {
      var rectangle = e; 
      console.log(rectangle.layer._latlngs);
      array.push(rectangle)
    }
    drawnItems.addLayer(layer);
    console.log(drawnItems)
    console.log(array)
 });
 
map.on('draw:edited', function (e) {
    var layers = e.layers;
    layers.eachLayer(function (layer) {
    });
});

// Event Handler for Area-Selection-Input-form -> disable/enable form field depending on selected option
$(document).ready(function(){
    $("select[name='choose']").on('change',function(){
      if($(this).val()==1){
        $("input[name='coordinates']").prop("disabled",false);
      }else{
        $("input[name='coordinates']").prop("disabled",true);
      }
    });
  });

// Manage slider for cloud cover
var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
output.innerHTML = slider.value; // Display the default slider value
// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
  output.innerHTML = this.value;
  console.log(this.value)
} 

/**
 * Function for calculation is started when button on Calculate page is pressed.
 * Checks the input of the calculation data, returns errors if necessary and forwards the data to the backend,
 * whereupon after a little calculation time the redirection to the result page takes place.
 */
function startCalculation(){
  // Coordinate input or draw rectangle?
  var state = document.querySelector("#choose2").options.selectedIndex;
  console.log(state)
  // If no option is selected message is shown
  if(state == 0){
    document.querySelector('#msgoption').style.display = 'block';
  }
  else{
    // Option 2 = Coordinate input
    if(state == 2){
      // Hide message
      document.querySelector('#msgoption').style.display = 'none';
      // If "all correct" check mark was not set at the first attempt
      if(document.querySelector('#validate3').style.display == 'block'){
        // If check mark is still not set
        if(document.querySelector('#validate2').checked == false){  
          console.log('Test3: false')}
        // If check mark was set
        else{
          console.log('Test4: true')
          // Reading in the entered coordinates
          var ymin = document.querySelector("#ymin").value;
          var xmin = document.querySelector("#xmin").value;
          var ymax = document.querySelector("#ymax").value;
          var xmax = document.querySelector("#xmax").value;
          // Check the format of the coordinates
          checkcoordinates(ymin, xmin, ymax, xmax);
          console.log(ymin);
          console.log(xmin);
          console.log(ymax);
          console.log(xmax);
          // Entered value for cloud cover
          var cloudcover = slider.value;
          console.log(cloudcover);
          // Entered value for resolution
          var resolution = document.getElementById('resolution').value;
          console.log(resolution);
          // Check if a file has been uploaded
          if(document.getElementById("upload").files.length > 0){
            // Uploaded file
            var upload = document.getElementById("upload").files[0];
            document.querySelector('#msgupload').style.display = 'none';   
            console.log('found file')
            console.log(upload.name)
            console.log(upload)
            // Size of the uploaded file
            var size = upload.size;
            console.log(size)
            // Check if the uploaded file is of type .geojson or .gpkg
            if(getending(upload.name) == 'geojson' || getending(upload.name) == 'gpkg'){
              document.querySelector('#msgfile').style.display = 'none';
              document.querySelector('#msggeojson').style.display = 'none';
              document.querySelector('#msggpkg').style.display = 'none';
              document.querySelector('#msgRDS').style.display = 'none';
              console.log('trainingdata')
              // Check if the uploaded file is of type .geojson 
              if(getending(upload.name) == 'geojson'){
                console.log('geojson')
                // Check if there is anything in the file
                if(size > 0){
                  console.log('valid .geojson')
                  document.querySelector('#msggeojson').style.display = 'none';
                  var reader = new FileReader(); //File reader to read the selected file
                  reader.readAsText(upload); //reads the file
                  reader.addEventListener('load', function(){
                  let fileAsGeojson = JSON.parse(reader.result);
                    // Check the format of the file
                    if(checkformatgeojson(fileAsGeojson) == true){
                      document.querySelector('#msggeojsonformat').style.display = 'none';
                      console.log('valid .geojson format')
                      // Call function to send the entered data to the backend 
                      //sendValuesTrainingdata(ymin, xmin, ymax, xmax, cloudcover, resolution)
                    }
                    // Show message if format is invalid
                    else{
                      document.querySelector('#msggeojsonformat').style.display = 'block';
                      console.log('invalid .geojson format')
                      return false
                    }   
                  })
                }
                // Show message when file is empty
                else{
                  console.log('invalid .geojson')
                  document.querySelector('#msggeojson').style.display = 'block';
                  return false
                }
              }
              // Check if the uploaded file is of type .gpkg
              if(getending(upload.name) == 'gpkg'){
                document.querySelector('#msggeojsonformat').style.display = 'none';
                console.log('gpkg')
                // Check if there is anything in the file
                if(size > 0){
                  console.log('valid .gpkg')
                  document.querySelector('#msggpkg').style.display = 'none';
                  // Call function to send the entered data to the backend 
                  //sendValuesTrainingdata(ymin, xmin, ymax, xmax, cloudcover, resolution)
                }
                // Show message when file is empty
                else{
                  console.log('invalid .gpkg')
                  document.querySelector('#msggpkg').style.display = 'block';
                  return false
                }
        	    }
            }
            else{
              document.querySelector('#msggeojson').style.display = 'none';
              document.querySelector('#msggpkg').style.display = 'none';
              // Check if the uploaded file is of type .RDS
              if(getending(upload.name) == 'RDS'){
                document.querySelector('#msggeojsonformat').style.display = 'none';
                document.querySelector('#msgfile').style.display = 'none';
                console.log('RDS')
                // Check if there is anything in the file
                if(size > 0){
                  console.log('valid .RDS')
                  document.querySelector('#msgRDS').style.display = 'none';
                  // Call function to send the entered data to the backend 
                  //sendValuesModel(ymin, xmin, ymax, xmax, cloudcover, resolution)
                }
                // Show message when file is empty
                else{
                  console.log('invalid file')
                  document.querySelector('#msgfile').style.display = 'block';
                  return false
                }
              }

              else{
                document.querySelector('#msgupload').style.display = 'block';
                console.log('failed')   
                return false
              }
            }
          }
        }
      }
        // If "all correct" check mark was set at the first attempt
        if(document.querySelector('#validate1').style.display == 'block'){
          if(document.querySelector('#validate').checked == true){ 
            // Reading in the entered coordinates
            var ymin = document.querySelector("#ymin").value;
            var xmin = document.querySelector("#xmin").value;
            var ymax = document.querySelector("#ymax").value;
            var xmax = document.querySelector("#xmax").value;
            // Check the format of the coordinates
            checkcoordinates(ymin, xmin, ymax, xmax);
            console.log(ymin);
            console.log(xmin);
            console.log(ymax);
            console.log(xmax);
            // Entered value for cloud cover
            var cloudcover = slider.value;
            console.log(cloudcover);
            // Entered value for resolution
            var resolution = document.getElementById('resolution').value;
            console.log(resolution);
            // Check if a file has been uploaded
            if(document.getElementById("upload").files.length > 0){
              // Uploaded file
              var upload = document.getElementById("upload").files[0];
              document.querySelector('#msgupload').style.display = 'none';   
              console.log('found file')
              console.log(upload.name)
              console.log(upload)
              // Size of the uploaded file
              var size = upload.size;
              console.log(size)
              // Check if the uploaded file is of type .geojson or .gpkg
              if(getending(upload.name) == 'geojson' || getending(upload.name) == 'gpkg'){
                document.querySelector('#msgfile').style.display = 'none';
                document.querySelector('#msggeojson').style.display = 'none';
                document.querySelector('#msggpkg').style.display = 'none';
                document.querySelector('#msgRDS').style.display = 'none';
                console.log('trainingdata')
                // Check if the uploaded file is of type .geojson 
                if(getending(upload.name) == 'geojson'){
                  console.log('geojson')
                  // Check if there is anything in the file
                  if(size > 0){
                    console.log('valid .geojson')
                    document.querySelector('#msggeojson').style.display = 'none';
                    var reader = new FileReader(); //File reader to read the selected file
                    reader.readAsText(upload); //reads the file
                    reader.addEventListener('load', function(){
                    let fileAsGeojson = JSON.parse(reader.result);
                    // Check the format of the file
                    if(checkformatgeojson(fileAsGeojson) == true){
                      document.querySelector('#msggeojsonformat').style.display = 'none';
                      console.log('valid .geojson format')
                      // Call function to send the entered data to the backend 
                      //sendValuesTrainingdata(ymin, xmin, ymax, xmax, cloudcover, resolution)
                    }
                    // Show message if format is invalid
                    else{
                      document.querySelector('#msggeojsonformat').style.display = 'block';
                      console.log('invalid .geojson format')
                      return false
                    }
                  })
                  } 
                  // Show message when file is empty
                  else{
                    console.log('invalid .geojson')
                    document.querySelector('#msggeojson').style.display = 'block';
                    return false
                  }
                }
                // Check if the uploaded file is of type .gpkg
                if(getending(upload.name) == 'gpkg'){
                  document.querySelector('#msggeojsonformat').style.display = 'none';
                  console.log('gpkg')
                  // Check if there is anything in the file
                  if(size > 0){
                    console.log('valid .gpkg')
                    document.querySelector('#msggpkg').style.display = 'none';
                    // Call function to send the entered data to the backend 
                    //sendValuesTrainingdata(ymin, xmin, ymax, xmax, cloudcover, resolution)
                  }
                  // Show message when file is empty
                  else{
                    console.log('invalid .gpkg')
                    document.querySelector('#msggpkg').style.display = 'block';
                    return false
                  }
                }
              }
              else{
                document.querySelector('#msggeojson').style.display = 'none';
                document.querySelector('#msggpkg').style.display = 'none';
                // Check if the uploaded file is of type .RDS
                if(getending(upload.name) == 'RDS'){
                  document.querySelector('#msggeojsonformat').style.display = 'none';
                  document.querySelector('#msgfile').style.display = 'none';
                  console.log('RDS')
                  // Check if there is anything in the file
                  if(size > 0){
                    console.log('valid .RDS')
                    document.querySelector('#msgRDS').style.display = 'none';
                    // Call function to send the entered data to the backend 
                    //sendValuesModel(ymin, xmin, ymax, xmax, cloudcover, resolution)
                  }
                  // Show message when file is empty
                  else{
                    console.log('invalid .RDS')
                    document.querySelector('#msgRDS').style.display = 'block';
                    return false
                  }
                }
                // Show message if file has wrong extension
                else{
                  console.log('invalid file')
                  document.querySelector('#msgfile').style.display = 'block';
                  return false
                }
             }
            }
            // Show message if no file was uploaded
            else{
              document.querySelector('#msgupload').style.display = 'block';
              console.log('failed')   
              return false
            }
          }   
          // If checkmark was not set
          else{
            document.querySelector('#validate1').style.display = 'none';
            document.querySelector('#validate3').style.display = 'block';
            console.log('Test2: false')
          }  
        }
      }

    // Option 1 = Bounding Box
    else{
      document.querySelector('#msgoption').style.display = 'none';
      console.log('Bounding box!')
      // If "all correct" check mark was not set at the first attempt
      if(document.querySelector('#validate3').style.display == 'block'){
        // If check mark is still not set
        if(document.querySelector('#validate2').checked == false){  
          console.log('Test3: false')
        }
        // If check mark was set
        else{
          // Check if rectangle was drawn, if not, show message
          if(array.length == 0){
            document.querySelector('#msgbox').style.display = 'block';
            document.querySelector('#validate1').style.display = 'block';
            document.querySelector('#validate3').style.display = 'none';
            document.querySelector('#validate').checked = 'true';
          }
          else{
            document.querySelector('#msgbox').style.display = 'none';
            document.querySelector('#validate1').style.display = 'block';
            document.querySelector('#validate3').style.display = 'none';
            document.querySelector('#validate').checked = 'true';
            console.log('Test4: true')
            // Take over rectangle coordinates
            var coordinates = array[0].layer._latlngs;
            var ymin = coordinates[0][0].lat;
            var xmin = coordinates[0][0].lng;
            var ymax = coordinates[0][2].lat;
            var xmax = coordinates[0][2].lng;
            console.log(coordinates);
            console.log(ymin);
            console.log(xmin);
            console.log(ymax);
            console.log(xmax);
            // Entered value for cloud cover
            var cloudcover = slider.value;
            console.log(cloudcover);
            // Entered value for resolution
            var resolution = document.getElementById('resolution').value;
            console.log(resolution);
            // Check if a file has been uploaded
            if(document.getElementById("upload").files.length > 0){
              // Uploaded file
              var upload = document.getElementById("upload").files[0];
              document.querySelector('#msgupload').style.display = 'none';   
              console.log('found file')
              console.log(upload.name)
              console.log(upload)
              // Size of the uploaded file
              var size = upload.size;
              console.log(size)
              // Check if the uploaded file is of type .geojson or .gpkg
              if(getending(upload.name) == 'geojson' || getending(upload.name) == 'gpkg'){
                document.querySelector('#msgfile').style.display = 'none';
                document.querySelector('#msggeojson').style.display = 'none';
                document.querySelector('#msggpkg').style.display = 'none';
                document.querySelector('#msgRDS').style.display = 'none';
                console.log('trainingdata')
                // Check if the uploaded file is of type .geojson 
                if(getending(upload.name) == 'geojson'){
                  console.log('geojson')
                  // Check if there is anything in the file
                  if(size > 0){
                    console.log('valid .geojson')
                    document.querySelector('#msggeojson').style.display = 'none';
                    var reader = new FileReader(); //File reader to read the selected file
                    reader.readAsText(upload); //reads the file
                    reader.addEventListener('load', function(){
                    let fileAsGeojson = JSON.parse(reader.result);
                    // Check the format of the file
                    if(checkformatgeojson(fileAsGeojson) == true){
                      document.querySelector('#msggeojsonformat').style.display = 'none';
                      console.log('valid .geojson format')
                      // Call function to send the entered data to the backend 
                      //sendValuesTrainingdata(ymin, xmin, ymax, xmax, cloudcover, resolution)
                    }
                    // Show message if format is invalid
                    else{
                      document.querySelector('#msggeojsonformat').style.display = 'block';
                      console.log('invalid .geojson format')
                      return false
                    }
                    })
                  }
                   // Show message when file is empty
                  else{
                    console.log('invalid .geojson')
                    document.querySelector('#msggeojson').style.display = 'block';
                    return false
                  }
                }
                // Check if the uploaded file is of type .gpkg
                if(getending(upload.name) == 'gpkg'){
                  document.querySelector('#msggeojsonformat').style.display = 'none';
                  console.log('gpkg')
                  // Check if there is anything in the file
                  if(size > 0){
                    console.log('valid .gpkg')
                    document.querySelector('#msggpkg').style.display = 'none';
                    // Call function to send the entered data to the backend 
                    //sendValuesTrainingdata(ymin, xmin, ymax, xmax, cloudcover, resolution)
                  }
                  // Show message when file is empty
                  else{
                    console.log('invalid .gpkg')
                    document.querySelector('#msggpkg').style.display = 'block';
                    return false
                  }
                }
              }
              else{
                document.querySelector('#msggeojson').style.display = 'none';
                document.querySelector('#msggpkg').style.display = 'none';
                // Check if the uploaded file is of type .RDS
                if(getending(upload.name) == 'RDS'){
                  document.querySelector('#msggeojsonformat').style.display = 'none';
                  document.querySelector('#msgfile').style.display = 'none';
                  console.log('RDS')
                  // Check if there is anything in the file
                  if(size > 0){
                    console.log('valid .RDS')
                    document.querySelector('#msgRDS').style.display = 'none';
                    // Call function to send the entered data to the backend 
                    //sendValuesModel(ymin, xmin, ymax, xmax, cloudcover, resolution)
                  }
                  // Show message when file is empty
                  else{
                    console.log('invalid .RDS')
                    document.querySelector('#msgRDS').style.display = 'block';
                    return false
                  }
                }
                // Show message if file has wrong extension
                else{
                  console.log('invalid file')
                  document.querySelector('#msgfile').style.display = 'block';
                  return false
                }
             }
            }
            // Show message if no file was uploaded
            else{
              document.querySelector('#msgupload').style.display = 'block';
              console.log('failed')   
              return false
            }
          }
        }
      }
      // If "all correct" check mark was set at the first attempt
      if(document.querySelector('#validate1').style.display == 'block'){
        if(document.querySelector('#validate').checked == true){ 
          // Check if rectangle was drawn, if not, show message
          if(array.length == 0){
            document.querySelector('#msgbox').style.display = 'block';
          }
          else{
            document.querySelector('#msgbox').style.display = 'none';
            console.log('Test4: true')
            // Take over rectangle coordinates
            var coordinates = array[0].layer._latlngs;
            var ymin = coordinates[0][0].lat;
            var xmin = coordinates[0][0].lng;
            var ymax = coordinates[0][2].lat;
            var xmax = coordinates[0][2].lng;
            console.log(coordinates);
            console.log(ymin);
            console.log(xmin);
            console.log(ymax);
            console.log(xmax);
            // Entered value for cloud cover
            var cloudcover = slider.value;
            console.log(cloudcover);
            // Entered value for resolution
            var resolution = document.getElementById('resolution').value;
            console.log(resolution);
            // Check if a file has been uploaded
            if(document.getElementById("upload").files.length > 0){
              // Uploaded file
              var upload = document.getElementById("upload").files[0];
              document.querySelector('#msgupload').style.display = 'none';   
              console.log('found file')
              console.log(upload.name)
              console.log(upload)
              // Size of the uploaded file
              var size = upload.size;
              console.log(size)
              // Check if the uploaded file is of type .geojson or .gpkg
              if(getending(upload.name) == 'geojson' || getending(upload.name) == 'gpkg'){
                document.querySelector('#msgfile').style.display = 'none';
                document.querySelector('#msggeojson').style.display = 'none';
                document.querySelector('#msggpkg').style.display = 'none';
                document.querySelector('#msgRDS').style.display = 'none';
                console.log('trainingdata')
                // Check if the uploaded file is of type .geojson 
                if(getending(upload.name) == 'geojson'){
                  console.log('geojson')
                  // Check if there is anything in the file
                  if(size > 0){
                    console.log('valid .geojson')
                    document.querySelector('#msggeojson').style.display = 'none';
                    var reader = new FileReader(); //File reader to read the selected file
                    reader.readAsText(upload); //reads the file
                    reader.addEventListener('load', function(){
                    let fileAsGeojson = JSON.parse(reader.result);
                    // Check the format of the file
                    if(checkformatgeojson(fileAsGeojson) == true){
                      document.querySelector('#msggeojsonformat').style.display = 'none';
                      console.log('valid .geojson format')
                      // Call function to send the entered data to the backend 
                      //sendValuesTrainingdata(ymin, xmin, ymax, xmax, cloudcover, resolution)
                    }
                    // Show message if format is invalid
                    else{
                      document.querySelector('#msggeojsonformat').style.display = 'block';
                      console.log('invalid .geojson format')
                      return false
                    }
                    })
                  }
                   // Show message when file is empty
                  else{
                    console.log('invalid .geojson')
                    document.querySelector('#msggeojson').style.display = 'block';
                    return false
                  }
                }
                // Check if the uploaded file is of type .gpkg
                if(getending(upload.name) == 'gpkg'){
                  document.querySelector('#msggeojsonformat').style.display = 'none';
                  console.log('gpkg')
                  // Check if there is anything in the file
                  if(size > 0){
                    console.log('valid .gpkg')
                    document.querySelector('#msggpkg').style.display = 'none';
                    // Call function to send the entered data to the backend 
                    //sendValuesTrainingdata(ymin, xmin, ymax, xmax, cloudcover, resolution)
                  }
                  // Show message when file is empty
                  else{
                    console.log('invalid .gpkg')
                    document.querySelector('#msggpkg').style.display = 'block';
                    return false
                  }
                }
              }
              else{
                document.querySelector('#msggeojson').style.display = 'none';
                document.querySelector('#msggpkg').style.display = 'none';
                // Check if the uploaded file is of type .RDS
                if(getending(upload.name) == 'RDS'){
                  document.querySelector('#msggeojsonformat').style.display = 'none';
                  document.querySelector('#msgfile').style.display = 'none';
                  console.log('RDS')
                  // Check if there is anything in the file
                  if(size > 0){
                    console.log('valid .RDS')
                    document.querySelector('#msgRDS').style.display = 'none';
                    // Call function to send the entered data to the backend 
                    //sendValuesModel(ymin, xmin, ymax, xmax, cloudcover, resolution)
                  }
                  // Show message when file is empty
                  else{
                    console.log('invalid .RDS')
                    document.querySelector('#msgRDS').style.display = 'block';
                    return false
                  }
                }
                // Show message if file has wrong extension
                else{
                  console.log('invalid file')
                  document.querySelector('#msgfile').style.display = 'block';
                  return false
                }
             }
            }
            // Show message if no file was uploaded
            else{
              document.querySelector('#msgupload').style.display = 'block';
              console.log('failed')   
              return false
            }
          }
        }
        // If checkmark was not set
        else{
          document.querySelector('#validate1').style.display = 'none';
          document.querySelector('#validate3').style.display = 'block';
          console.log('Test2: false')}
        }
      }
    }
  }

/**
 * Checks if anything has been entered for the coordinates and then forwards to the format checker.
 * @param {String} ymin 
 * @param {String} xmin 
 * @param {String} ymax 
 * @param {String} xmax 
 */
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
  }
}

/**
 * Checks the format of the passed coordinates
 * @param {String} ymin 
 * @param {String} xmin 
 * @param {String} ymax 
 * @param {String} xmax 
 */
function checkcoordsformat(ymin, xmin, ymax, xmax){
  document.querySelector('#msgmissed').style.display = 'none';
  var coords = [ymin, xmin, ymax, xmax];
  console.log(coords)
  for(let i=0; i<coords.length; i++){
    console.log(coords[i])
    // Checks if they are numbers
    //https://qastack.com.de/programming/18042133/check-if-input-is-number-or-letter-javascript
    if(isNaN(coords[i])){
        console.log(isNaN(coords[i]))
        console.log('No number')
        document.querySelector('#msgformat').style.display = 'block';
        document.querySelector('#validate2').checked = 'false';
        document.querySelector('#validate').checked = 'false';
        document.querySelector('#validate1').style.display = 'block';
        document.querySelector('#validate3').style.display = 'none';
        return false
    }
  }
  // Checks if they exceed the maximum values
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
  }
}

/**
 * Returns the file extension
 * @param {String} filename 
 * @returns String: ending
 */
function getending(filename){
  var splitted = filename.split('.')
  var ending = splitted[splitted.length-1]
  return ending
}

/**
 * Checks the format of the geojson file
 * @param {geojson} fileAsGeojson 
 * @returns boolean
 */
function checkformatgeojson(fileAsGeojson){
   var geojson = fileAsGeojson;
   // Checks if type = FeatureCollection
   if(geojson.type !== 'FeatureCollection'){
    console.log('no featurecollection')
    return false
   }
   // Checks features
   else{
    var features = geojson.features;
    // labels?
    for(let i = 0; i < features.length; i++){
      if(features[i].properties.label == "" || features[i].properties.label == null || features[i].properties.label == undefined){
        console.log(features[i].properties.label)
        console.log('no label')
        return false
      }
      // MultiPolygon or Polygon?
      if(!features[i].geometry.type == "MultiPolygon" || !features[i].geometry.type == "Polygon"){
        console.log(features[i].geometry.type)
        console.log('no type')
        return false
      }
      // Coordinates?
      if(features[i].geometry.coordinates.length < 1){
        console.log(features[i].geometry.coordinates.length)
        console.log('no coords')
        return false
      }
      else{
        console.log('valid')
        return true
      }
    }
  }
}

/**
 * Case: trainingdata: Sends data via AJAX to the backend, meanwhile shows a loading gif and then redirects to the results page
 * @param {*} ymin 
 * @param {*} xmin 
 * @param {*} ymax 
 * @param {*} xmax 
 * @param {*} cloudcover 
 * @param {*} resolution 
 */
function sendValuesTrainingdata(ymin, xmin, ymax, xmax, cloudcover, resolution){}
  //alert("The calculation will now be executed, you will then be redirected to the results. The calculation may take a few minutes, please wait...")
    /*$.ajax({
        url: http://127.0.0.1:25118/noModel?lat1=${ymin}&long1={xmin}&lat2={ymax}&long2={xmax}&cov={cloudcover}&reso={resolution},
        type: 'POST',
        beforeSend: function(){$('#loading').html("<img src= 'https://media.giphy.com/media/52qtwCtj9OLTi/giphy.gif' />")},
        success: function(){
        ($('#loading').hide("<img src= 'https://media.giphy.com/media/52qtwCtj9OLTi/giphy.gif' />")),
        window.location.href= '/ownresultAOA'
    }})*/

/** 
 * Case: model: Sends data via AJAX to the backend, meanwhile shows a loading gif and then redirects to the results page
 * @param {*} ymin 
 * @param {*} xmin 
 * @param {*} ymax 
 * @param {*} xmax 
 * @param {*} cloudcover 
 * @param {*} resolution 
 */
function sendValuesModel(ymin, xmin, ymax, xmax, cloudcover, resolution){}
  //alert("The calculation will now be executed, you will then be redirected to the results. The calculation may take a few minutes, please wait...")
    /*$.ajax({
        url: http://127.0.0.1:25118/withModel?lat1=${ymin}&long1={xmin}&lat2={ymax}&long2={xmax}&cov={cloudcover}&reso={resolution},
        type: 'POST',
        beforeSend: function(){$('#loading').html("<img src= 'https://media.giphy.com/media/52qtwCtj9OLTi/giphy.gif' />")},
        success: function(){
        ($('#loading').hide("<img src= 'https://media.giphy.com/media/52qtwCtj9OLTi/giphy.gif' />")),
        window.location.href= '/ownresultAOA'
    }})*/
