"use strict"

// Functions for testing

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
  if(ymin >= 0 && ymax >= 0){
    if(ymin > ymax){
      document.querySelector('#msgformat').style.display = 'block';
      document.querySelector('#validate2').checked = 'false';
      document.querySelector('#validate').checked = 'false';
      document.querySelector('#validate1').style.display = 'block';
      document.querySelector('#validate3').style.display = 'none';
      console.log('plus ymin > ymax')
      return false;
    }
  } 
  if(ymin <= 0 && ymax <= 0){
    if(ymin < ymax){
      document.querySelector('#msgformat').style.display = 'block';
      document.querySelector('#validate2').checked = 'false';
      document.querySelector('#validate').checked = 'false';
      document.querySelector('#validate1').style.display = 'block';
      document.querySelector('#validate3').style.display = 'none';
      console.log('minus ymin < ymax')
      return false;
    }
  } 
  if(ymin >= 0 && ymax <= 0){
    document.querySelector('#msgformat').style.display = 'block';
    document.querySelector('#validate2').checked = 'false';
    document.querySelector('#validate').checked = 'false';
    document.querySelector('#validate1').style.display = 'block';
    document.querySelector('#validate3').style.display = 'none';
    console.log('ymin > 0 && ymax < 0')
    return false;
  }
  if(xmin >= 0 && xmax >= 0){
    if(xmin > xmax){
      document.querySelector('#msgformat').style.display = 'block';
      document.querySelector('#validate2').checked = 'false';
      document.querySelector('#validate').checked = 'false';
      document.querySelector('#validate1').style.display = 'block';
      document.querySelector('#validate3').style.display = 'none';
      console.log('plus xmin > xmax')
      return false;
    }
  }
  if(xmin <= 0 && xmax <= 0){
    if(xmin < xmax){
      document.querySelector('#msgformat').style.display = 'block';
      document.querySelector('#validate2').checked = 'false';
      document.querySelector('#validate').checked = 'false';
      document.querySelector('#validate1').style.display = 'block';
      document.querySelector('#validate3').style.display = 'none';
      console.log('minus xmin < xmax')
      return false;
    }
  }
  if(xmin >= 0 && xmax <= 0){
    document.querySelector('#msgformat').style.display = 'block';
    document.querySelector('#validate2').checked = 'false';
    document.querySelector('#validate').checked = 'false';
    document.querySelector('#validate1').style.display = 'block';
    document.querySelector('#validate3').style.display = 'none';
    console.log('xmin > 0 && xmax < 0')
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
      if(features[i].properties.Label == "" || features[i].properties.Label == null || features[i].properties.Label == undefined){
        console.log(features[i].properties.Label)
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
