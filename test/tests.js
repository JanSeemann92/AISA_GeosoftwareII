// Tests for the frontend input functions
// To start: "npm test"

var assert = require('assert');

describe('Frontend input tests', function () {
    // function checkcoordinates
    it('all entered', function () {
        assert.equal(checkcoordinates(52.25, 7.4, 52.3, 7.5), true);
       }); 
    it('something is missing', function () {
        assert.equal(checkcoordinates('', 7.4, 52.3, 7.5), false);
       }); 
    // function checkcoordsformat
    it('number', function () {
        assert.equal(checkcoordsformat(52.25, 7.4, 52.3, 7.5), true);
       }); 
    it('no number', function () {
        assert.equal(checkcoordsformat('abc', 7.4, 52.3, 7.5), false);
       }); 
    it('ymin too big', function () {
        assert.equal(checkcoordsformat2(100, 7, 53, 8), false);
        });
    it('ymax too big', function () {
        assert.equal(checkcoordsformat2(52, 7, 100, 8), false);
        });
    it('ymin too small', function () {
        assert.equal(checkcoordsformat2(-100, 7, 53, 8), false);
        });
    it('ymax too small', function () {
        assert.equal(checkcoordsformat2(52, 7, -100, 8), false);
        });
    it('xmin too big', function () {
        assert.equal(checkcoordsformat2(52, 200, 53, 8), false);
        });
    it('xmax too big', function () {
        assert.equal(checkcoordsformat2(52, 7, 53, 200), false);
        });
    it('xmin too small', function () {
        assert.equal(checkcoordsformat2(52, -200, 53, 8), false);
        });
    it('xmax too small', function () {
        assert.equal(checkcoordsformat2(52, 7, 53, -200), false);
        });
    it('plus ymin > ymax', function () {
        assert.equal(checkcoordsformat3(53, 7, 52, 8), false);
        });
    it('minus ymin < ymax', function () {
        assert.equal(checkcoordsformat3(-52, 7, -53, 8), false);
        });
    it('ymin > 0 && ymax < 0', function () {
        assert.equal(checkcoordsformat3(52, 7, -53, 8), false);
        });
    it('plus xmin > xmax', function () {
        assert.equal(checkcoordsformat4(52, 8, 53, 7), false);
        });
    it('minus xmin < xmax', function () {
        assert.equal(checkcoordsformat4(52, -7, 53, -8), false);
        });
    it('xmin > 0 && xmax < 0', function () {
        assert.equal(checkcoordsformat4(52, 7, 53, -8), false);
        });
    // function getending
    it('geojson', function () {
        assert.equal(getending('file.geojson'), 'geojson');
        });
    it('gpkg', function () {
        assert.equal(getending('file.gpkg'), 'gpkg');
        });
    it('rds', function () {
        assert.equal(getending('file.rds'), 'rds');
        });
    it('png', function () {
        assert.equal(getending('file.png'), 'png');
        });
    // function checkformatgeojson
    it('valid geojson', function () {
        assert.equal(checkformatgeojson1(valid), true);
        });
    it('FeatureCollection', function () {
        assert.equal(checkformatgeojson2(valid), true);
        });
    it('No FeatureCollection', function () {
        assert.equal(checkformatgeojson2(NoFeatureCollection), false);
        });
    it('Polygon', function () {
        assert.equal(checkformatgeojson3(valid), true);
        });
    it('No Polygon', function () {
        assert.equal(checkformatgeojson3(NoPolygon), false);
        });
    it('Label', function () {
        assert.equal(checkformatgeojson4(valid), true);
        });
    it('No Label', function () {
        assert.equal(checkformatgeojson4(NoLabel), false);
        });
    it('Valid Coordinates', function () {
        assert.equal(checkformatgeojson5(valid), true);
        });
    it('Invalid Coordinates', function () {
        assert.equal(checkformatgeojson5(NoCoordinates), false);
        });
    
});

// Functions to test
// Had to separate them because mocha incorrectly worked through the cases one after the other.
// When entering in frontend, cases are correctly distinguished (was tested by input).

// originally function checkcoordinates (see 2_calculateAOA.js)
function checkcoordinates(ymin, xmin, ymax, xmax){
    if(ymin == '' || xmin == '' || ymax == '' || xmax == ''){
        return false
    }
    else{
        return true
    }
}

// originally function checkcoordsformat (see 2_calculateAOA.js)
function checkcoordsformat(ymin, xmin, ymax, xmax){
var coords = [ymin, xmin, ymax, xmax];
for(let i=0; i<coords.length; i++){
    // Checks if they are numbers
    //https://qastack.com.de/programming/18042133/check-if-input-is-number-or-letter-javascript
    if(isNaN(coords[i])){
        return false
    }
    else{
        return true
    }
}}

// originally function checkcoordsformat (see 2_calculateAOA.js)
function checkcoordsformat2(ymin, xmin, ymax, xmax){
// Checks if they exceed the maximum values
if(ymin > 90 || ymin <-90 || ymax > 90 || ymax <-90){
  return false;
}
else{
    if(xmin > 180 || xmin <- 180 || xmax > 180 || xmax <- 180){
    return false
    }
    else{
        return true
    }
}}

// originally function checkcoordsformat (see 2_calculateAOA.js)
function checkcoordsformat3(ymin, xmin, ymax, xmax){
if(ymin >= 0 && ymax >= 0){
    if(ymin > ymax){
      return false;
    }
}
else{
    if(ymin <= 0 && ymax <= 0){
        if(ymin > ymax){
            return false;
        }
    } 
    else{
        if(ymin >= 0 && ymax <= 0){
            return false;
        }
        else{
            return true;
}}}}

// originally function checkcoordsformat (see 2_calculateAOA.js)
function checkcoordsformat4(ymin, xmin, ymax, xmax){
if(xmin >= 0 && xmax >= 0){
    if(xmin > xmax){
        return false;
    }
}
else{
    if(xmin <= 0 && xmax <= 0){
        if(xmin > xmax){
        return false;
        }
    }
    else{
        if(xmin >= 0 && xmax <= 0){
        return false;
        }
        else{
            return true;
        }}}}

// originally function getending (see 2_calculateAOA.js)
function getending(filename){
    var splitted = filename.split('.')
    var ending = splitted[splitted.length-1]
    return ending
    }

// originally function checkformatgeojson (see 2_calculateAOA.js)
function checkformatgeojson1(fileAsGeojson){
    var geojson = fileAsGeojson;
    // Checks if type = FeatureCollection
    if(geojson.type !== 'FeatureCollection'){
        return false
    }
    // Checks features
    else{
        var features = geojson.features;
        // labels?
        for(let i = 0; i < features.length; i++){
        if(features[i].properties.Label == "" || features[i].properties.Label == null || features[i].properties.Label == undefined){
            return false
        }
        // MultiPolygon or Polygon?
        if(!features[i].geometry.type == "MultiPolygon" || !features[i].geometry.type == "Polygon"){
            return false
        }
        // Coordinates?
        if(features[i].geometry.coordinates.length < 1){
            return false
        }
        else{
            console.log('valid')
            return true
        }
        }
    }
}

// originally function checkformatgeojson (see 2_calculateAOA.js)
function checkformatgeojson2(fileAsGeojson){
    var geojson = fileAsGeojson;
    // Checks if type = FeatureCollection
    if(geojson.type !== 'FeatureCollection'){
        return false
    }
    else{
        console.log('valid')
        return true
    }
}

// originally function checkformatgeojson (see 2_calculateAOA.js)
function checkformatgeojson3(fileAsGeojson){
    var geojson = fileAsGeojson;
    var features = geojson.features;
        // labels?
        for(let i = 0; i < features.length; i++){
        // MultiPolygon or Polygon?
        if(features[i].geometry.type !== "MultiPolygon"){
            if(features[i].geometry.type !== "Polygon"){
            return false
        }}
        else{
            return true;
}}}

// originally function checkformatgeojson (see 2_calculateAOA.js)
function checkformatgeojson4(fileAsGeojson){
    var geojson = fileAsGeojson;
    var features = geojson.features;
        // labels?
        for(let i = 0; i < features.length; i++){
        if(features[i].properties.Label == "" || features[i].properties.Label == null || features[i].properties.Label == undefined){
            return false
        }
        else{
            return true;
        }
    }
}

// originally function checkformatgeojson (see 2_calculateAOA.js)
function checkformatgeojson5(fileAsGeojson){
    var geojson = fileAsGeojson;
    var features = geojson.features;
        // labels?
        for(let i = 0; i < features.length; i++){
            if(features[i].geometry.coordinates.length < 1){
                return false
        }
        else{
            return true;
        }
    }
}

// Geojsons for testing chechformatgeojson functions

// Geojson: Completely correct
var valid = 
{
    "type": "FeatureCollection",
    "name": "demodata_rheine_trainingspolygone_EPSG4326",
    "features": [
    { "type": "Feature", "properties": { "id": null, "Label": "Offenboden" }, "geometry": { "type": "MultiPolygon", "coordinates": [ [ [ [ 7.456729174504043, 52.28121351319146 ], [ 7.456729174504043, 52.28121351319146 ], [ 7.457217804818409, 52.280581398293343 ], [ 7.459354643807401, 52.281071663330358 ], [ 7.459148513730065, 52.281839577534804 ], [ 7.456729174504043, 52.28121351319146 ] ] ] ] } },
    { "type": "Feature", "properties": { "id": null, "Label": "Offenboden" }, "geometry": { "type": "MultiPolygon", "coordinates": [ [ [ [ 7.464571688523606, 52.272420787759387 ], [ 7.466801995622199, 52.272273634906732 ], [ 7.46654690124255, 52.271345596245922 ], [ 7.464563954765842, 52.271606047835157 ], [ 7.464571688523606, 52.272420787759387 ] ] ] ] } },
    { "type": "Feature", "properties": { "id": null, "Label": "Offenboden" }, "geometry": { "type": "MultiPolygon", "coordinates": [ [ [ [ 7.456002512138844, 52.279398596397598 ], [ 7.456002512138844, 52.279398596397598 ], [ 7.456605592659954, 52.279604637016789 ], [ 7.45622384232558, 52.280260164283746 ], [ 7.455513112735043, 52.280052713619469 ], [ 7.456002512138844, 52.279398596397598 ] ] ] ] } },
    { "type": "Feature", "properties": { "id": null, "Label": "Gewaesser" }, "geometry": { "type": "MultiPolygon", "coordinates": [ [ [ [ 7.443658977291601, 52.277210937285744 ], [ 7.446501642527312, 52.274958575189231 ], [ 7.446781728842667, 52.275160416178664 ], [ 7.44394369004905, 52.277280742030783 ], [ 7.443658977291601, 52.277210937285744 ] ] ] ] } },
    { "type": "Feature", "properties": { "id": null, "Label": "Gewaesser" }, "geometry": { "type": "MultiPolygon", "coordinates": [ [ [ [ 7.454613981374153, 52.270815702349829 ], [ 7.454819466884459, 52.269034989733981 ], [ 7.454819466884459, 52.269034989733981 ], [ 7.455286565080673, 52.269019085165148 ], [ 7.455081098361083, 52.270799798746161 ], [ 7.454613981374153, 52.270815702349829 ] ] ] ] } },
    { "type": "Feature", "properties": { "id": null, "Label": "Gruenland" }, "geometry": { "type": "MultiPolygon", "coordinates": [ [ [ [ 7.449601284967497, 52.272533381821702 ], [ 7.449601284967497, 52.272533381821702 ], [ 7.451177646405197, 52.271585310913338 ], [ 7.450117555419316, 52.271109034926475 ], [ 7.448968604973023, 52.272150777086104 ], [ 7.449601284967497, 52.272533381821702 ] ] ] ] } },
    { "type": "Feature", "properties": { "id": null, "Label": "Gruenland" }, "geometry": { "type": "MultiPolygon", "coordinates": [ [ [ [ 7.468640850949375, 52.283482263464876 ], [ 7.471910055194466, 52.283414532888557 ], [ 7.47192444240897, 52.282996391878442 ], [ 7.468764436535205, 52.283021504456229 ], [ 7.468640850949375, 52.283482263464876 ] ] ] ] } },
    { "type": "Feature", "properties": { "id": null, "Label": "Gruenland" }, "geometry": { "type": "MultiPolygon", "coordinates": [ [ [ [ 7.472880488949951, 52.268763603895444 ], [ 7.473151253544332, 52.268194657071184 ], [ 7.477179839220505, 52.268973260991096 ], [ 7.476915156060707, 52.2693661571505 ], [ 7.476915156060707, 52.2693661571505 ], [ 7.472880488949951, 52.268763603895444 ] ] ] ] } },
    { "type": "Feature", "properties": { "id": null, "Label": "Siedlung" }, "geometry": { "type": "MultiPolygon", "coordinates": [ [ [ [ 7.469142069829808, 52.278314712456314 ], [ 7.469142069829808, 52.278314712456314 ], [ 7.471938862952571, 52.277360167097704 ], [ 7.471938862952571, 52.277360167097704 ], [ 7.471890409644031, 52.278768643310663 ], [ 7.469142069829808, 52.278314712456314 ] ] ] ] } },
    { "type": "Feature", "properties": { "id": null, "Label": "Siedlung" }, "geometry": { "type": "MultiPolygon", "coordinates": [ [ [ [ 7.444963903011619, 52.280949056560722 ], [ 7.447264919658165, 52.280847236366562 ], [ 7.446608101398739, 52.27909923000125 ], [ 7.444752806228933, 52.279801376379893 ], [ 7.444963903011619, 52.280949056560722 ] ] ] ] } },
    { "type": "Feature", "properties": { "id": null, "Label": "Siedlung" }, "geometry": { "type": "MultiPolygon", "coordinates": [ [ [ [ 7.455154588659588, 52.276943586406453 ], [ 7.456994364209832, 52.275646608160905 ], [ 7.45536238159052, 52.275096852850133 ], [ 7.45536238159052, 52.275096852850133 ], [ 7.454236307076182, 52.276513238768239 ], [ 7.455154588659588, 52.276943586406453 ] ] ] ] } }
    ]
    }

// Geojson: No FeatureCollection
var NoFeatureCollection = 
{
    "type": "Object",
    "name": "demodata_rheine_trainingspolygone_EPSG4326",
    "features": [
    { "type": "Feature", "properties": { "id": null, "Label": "Offenboden" }, "geometry": { "type": "MultiPolygon", "coordinates": [ [ [ [ 7.456729174504043, 52.28121351319146 ], [ 7.456729174504043, 52.28121351319146 ], [ 7.457217804818409, 52.280581398293343 ], [ 7.459354643807401, 52.281071663330358 ], [ 7.459148513730065, 52.281839577534804 ], [ 7.456729174504043, 52.28121351319146 ] ] ] ] } },
    { "type": "Feature", "properties": { "id": null, "Label": "Offenboden" }, "geometry": { "type": "MultiPolygon", "coordinates": [ [ [ [ 7.464571688523606, 52.272420787759387 ], [ 7.466801995622199, 52.272273634906732 ], [ 7.46654690124255, 52.271345596245922 ], [ 7.464563954765842, 52.271606047835157 ], [ 7.464571688523606, 52.272420787759387 ] ] ] ] } },
    { "type": "Feature", "properties": { "id": null, "Label": "Offenboden" }, "geometry": { "type": "MultiPolygon", "coordinates": [ [ [ [ 7.456002512138844, 52.279398596397598 ], [ 7.456002512138844, 52.279398596397598 ], [ 7.456605592659954, 52.279604637016789 ], [ 7.45622384232558, 52.280260164283746 ], [ 7.455513112735043, 52.280052713619469 ], [ 7.456002512138844, 52.279398596397598 ] ] ] ] } },
    { "type": "Feature", "properties": { "id": null, "Label": "Gewaesser" }, "geometry": { "type": "MultiPolygon", "coordinates": [ [ [ [ 7.443658977291601, 52.277210937285744 ], [ 7.446501642527312, 52.274958575189231 ], [ 7.446781728842667, 52.275160416178664 ], [ 7.44394369004905, 52.277280742030783 ], [ 7.443658977291601, 52.277210937285744 ] ] ] ] } },
    { "type": "Feature", "properties": { "id": null, "Label": "Gewaesser" }, "geometry": { "type": "MultiPolygon", "coordinates": [ [ [ [ 7.454613981374153, 52.270815702349829 ], [ 7.454819466884459, 52.269034989733981 ], [ 7.454819466884459, 52.269034989733981 ], [ 7.455286565080673, 52.269019085165148 ], [ 7.455081098361083, 52.270799798746161 ], [ 7.454613981374153, 52.270815702349829 ] ] ] ] } },
    { "type": "Feature", "properties": { "id": null, "Label": "Gruenland" }, "geometry": { "type": "MultiPolygon", "coordinates": [ [ [ [ 7.449601284967497, 52.272533381821702 ], [ 7.449601284967497, 52.272533381821702 ], [ 7.451177646405197, 52.271585310913338 ], [ 7.450117555419316, 52.271109034926475 ], [ 7.448968604973023, 52.272150777086104 ], [ 7.449601284967497, 52.272533381821702 ] ] ] ] } },
    { "type": "Feature", "properties": { "id": null, "Label": "Gruenland" }, "geometry": { "type": "MultiPolygon", "coordinates": [ [ [ [ 7.468640850949375, 52.283482263464876 ], [ 7.471910055194466, 52.283414532888557 ], [ 7.47192444240897, 52.282996391878442 ], [ 7.468764436535205, 52.283021504456229 ], [ 7.468640850949375, 52.283482263464876 ] ] ] ] } },
    { "type": "Feature", "properties": { "id": null, "Label": "Gruenland" }, "geometry": { "type": "MultiPolygon", "coordinates": [ [ [ [ 7.472880488949951, 52.268763603895444 ], [ 7.473151253544332, 52.268194657071184 ], [ 7.477179839220505, 52.268973260991096 ], [ 7.476915156060707, 52.2693661571505 ], [ 7.476915156060707, 52.2693661571505 ], [ 7.472880488949951, 52.268763603895444 ] ] ] ] } },
    { "type": "Feature", "properties": { "id": null, "Label": "Siedlung" }, "geometry": { "type": "MultiPolygon", "coordinates": [ [ [ [ 7.469142069829808, 52.278314712456314 ], [ 7.469142069829808, 52.278314712456314 ], [ 7.471938862952571, 52.277360167097704 ], [ 7.471938862952571, 52.277360167097704 ], [ 7.471890409644031, 52.278768643310663 ], [ 7.469142069829808, 52.278314712456314 ] ] ] ] } },
    { "type": "Feature", "properties": { "id": null, "Label": "Siedlung" }, "geometry": { "type": "MultiPolygon", "coordinates": [ [ [ [ 7.444963903011619, 52.280949056560722 ], [ 7.447264919658165, 52.280847236366562 ], [ 7.446608101398739, 52.27909923000125 ], [ 7.444752806228933, 52.279801376379893 ], [ 7.444963903011619, 52.280949056560722 ] ] ] ] } },
    { "type": "Feature", "properties": { "id": null, "Label": "Siedlung" }, "geometry": { "type": "MultiPolygon", "coordinates": [ [ [ [ 7.455154588659588, 52.276943586406453 ], [ 7.456994364209832, 52.275646608160905 ], [ 7.45536238159052, 52.275096852850133 ], [ 7.45536238159052, 52.275096852850133 ], [ 7.454236307076182, 52.276513238768239 ], [ 7.455154588659588, 52.276943586406453 ] ] ] ] } }
    ]
    }

// Geojson: Not of Polygon/MultiPolygon type
var NoPolygon = 
{
    "type": "FeatureCollection",
    "name": "demodata_rheine_trainingspolygone_EPSG4326",
    "features": [
    { "type": "Feature", "properties": { "id": null, "Label": "Offenboden" }, "geometry": { "type": "Point", "coordinates": [ [ [ [ 7.456729174504043, 52.28121351319146 ], [ 7.456729174504043, 52.28121351319146 ], [ 7.457217804818409, 52.280581398293343 ], [ 7.459354643807401, 52.281071663330358 ], [ 7.459148513730065, 52.281839577534804 ], [ 7.456729174504043, 52.28121351319146 ] ] ] ] } },
    { "type": "Feature", "properties": { "id": null, "Label": "Offenboden" }, "geometry": { "type": "MultiPolygon", "coordinates": [ [ [ [ 7.464571688523606, 52.272420787759387 ], [ 7.466801995622199, 52.272273634906732 ], [ 7.46654690124255, 52.271345596245922 ], [ 7.464563954765842, 52.271606047835157 ], [ 7.464571688523606, 52.272420787759387 ] ] ] ] } },
    { "type": "Feature", "properties": { "id": null, "Label": "Offenboden" }, "geometry": { "type": "MultiPolygon", "coordinates": [ [ [ [ 7.456002512138844, 52.279398596397598 ], [ 7.456002512138844, 52.279398596397598 ], [ 7.456605592659954, 52.279604637016789 ], [ 7.45622384232558, 52.280260164283746 ], [ 7.455513112735043, 52.280052713619469 ], [ 7.456002512138844, 52.279398596397598 ] ] ] ] } },
    { "type": "Feature", "properties": { "id": null, "Label": "Gewaesser" }, "geometry": { "type": "MultiPolygon", "coordinates": [ [ [ [ 7.443658977291601, 52.277210937285744 ], [ 7.446501642527312, 52.274958575189231 ], [ 7.446781728842667, 52.275160416178664 ], [ 7.44394369004905, 52.277280742030783 ], [ 7.443658977291601, 52.277210937285744 ] ] ] ] } },
    { "type": "Feature", "properties": { "id": null, "Label": "Gewaesser" }, "geometry": { "type": "MultiPolygon", "coordinates": [ [ [ [ 7.454613981374153, 52.270815702349829 ], [ 7.454819466884459, 52.269034989733981 ], [ 7.454819466884459, 52.269034989733981 ], [ 7.455286565080673, 52.269019085165148 ], [ 7.455081098361083, 52.270799798746161 ], [ 7.454613981374153, 52.270815702349829 ] ] ] ] } },
    { "type": "Feature", "properties": { "id": null, "Label": "Gruenland" }, "geometry": { "type": "MultiPolygon", "coordinates": [ [ [ [ 7.449601284967497, 52.272533381821702 ], [ 7.449601284967497, 52.272533381821702 ], [ 7.451177646405197, 52.271585310913338 ], [ 7.450117555419316, 52.271109034926475 ], [ 7.448968604973023, 52.272150777086104 ], [ 7.449601284967497, 52.272533381821702 ] ] ] ] } },
    { "type": "Feature", "properties": { "id": null, "Label": "Gruenland" }, "geometry": { "type": "MultiPolygon", "coordinates": [ [ [ [ 7.468640850949375, 52.283482263464876 ], [ 7.471910055194466, 52.283414532888557 ], [ 7.47192444240897, 52.282996391878442 ], [ 7.468764436535205, 52.283021504456229 ], [ 7.468640850949375, 52.283482263464876 ] ] ] ] } },
    { "type": "Feature", "properties": { "id": null, "Label": "Gruenland" }, "geometry": { "type": "MultiPolygon", "coordinates": [ [ [ [ 7.472880488949951, 52.268763603895444 ], [ 7.473151253544332, 52.268194657071184 ], [ 7.477179839220505, 52.268973260991096 ], [ 7.476915156060707, 52.2693661571505 ], [ 7.476915156060707, 52.2693661571505 ], [ 7.472880488949951, 52.268763603895444 ] ] ] ] } },
    { "type": "Feature", "properties": { "id": null, "Label": "Siedlung" }, "geometry": { "type": "MultiPolygon", "coordinates": [ [ [ [ 7.469142069829808, 52.278314712456314 ], [ 7.469142069829808, 52.278314712456314 ], [ 7.471938862952571, 52.277360167097704 ], [ 7.471938862952571, 52.277360167097704 ], [ 7.471890409644031, 52.278768643310663 ], [ 7.469142069829808, 52.278314712456314 ] ] ] ] } },
    { "type": "Feature", "properties": { "id": null, "Label": "Siedlung" }, "geometry": { "type": "MultiPolygon", "coordinates": [ [ [ [ 7.444963903011619, 52.280949056560722 ], [ 7.447264919658165, 52.280847236366562 ], [ 7.446608101398739, 52.27909923000125 ], [ 7.444752806228933, 52.279801376379893 ], [ 7.444963903011619, 52.280949056560722 ] ] ] ] } },
    { "type": "Feature", "properties": { "id": null, "Label": "Siedlung" }, "geometry": { "type": "MultiPolygon", "coordinates": [ [ [ [ 7.455154588659588, 52.276943586406453 ], [ 7.456994364209832, 52.275646608160905 ], [ 7.45536238159052, 52.275096852850133 ], [ 7.45536238159052, 52.275096852850133 ], [ 7.454236307076182, 52.276513238768239 ], [ 7.455154588659588, 52.276943586406453 ] ] ] ] } }
    ]
    }

// Geojson: No label included
var NoLabel = 
{
    "type": "FeatureCollection",
    "name": "demodata_rheine_trainingspolygone_EPSG4326",
    "features": [
    { "type": "Feature", "properties": { "id": null, "Label": "" }, "geometry": { "type": "MultiPolygon", "coordinates": [ [ [ [ 7.456729174504043, 52.28121351319146 ], [ 7.456729174504043, 52.28121351319146 ], [ 7.457217804818409, 52.280581398293343 ], [ 7.459354643807401, 52.281071663330358 ], [ 7.459148513730065, 52.281839577534804 ], [ 7.456729174504043, 52.28121351319146 ] ] ] ] } },
    { "type": "Feature", "properties": { "id": null, "Label": "Offenboden" }, "geometry": { "type": "MultiPolygon", "coordinates": [ [ [ [ 7.464571688523606, 52.272420787759387 ], [ 7.466801995622199, 52.272273634906732 ], [ 7.46654690124255, 52.271345596245922 ], [ 7.464563954765842, 52.271606047835157 ], [ 7.464571688523606, 52.272420787759387 ] ] ] ] } },
    { "type": "Feature", "properties": { "id": null, "Label": "Offenboden" }, "geometry": { "type": "MultiPolygon", "coordinates": [ [ [ [ 7.456002512138844, 52.279398596397598 ], [ 7.456002512138844, 52.279398596397598 ], [ 7.456605592659954, 52.279604637016789 ], [ 7.45622384232558, 52.280260164283746 ], [ 7.455513112735043, 52.280052713619469 ], [ 7.456002512138844, 52.279398596397598 ] ] ] ] } },
    { "type": "Feature", "properties": { "id": null, "Label": "Gewaesser" }, "geometry": { "type": "MultiPolygon", "coordinates": [ [ [ [ 7.443658977291601, 52.277210937285744 ], [ 7.446501642527312, 52.274958575189231 ], [ 7.446781728842667, 52.275160416178664 ], [ 7.44394369004905, 52.277280742030783 ], [ 7.443658977291601, 52.277210937285744 ] ] ] ] } },
    { "type": "Feature", "properties": { "id": null, "Label": "Gewaesser" }, "geometry": { "type": "MultiPolygon", "coordinates": [ [ [ [ 7.454613981374153, 52.270815702349829 ], [ 7.454819466884459, 52.269034989733981 ], [ 7.454819466884459, 52.269034989733981 ], [ 7.455286565080673, 52.269019085165148 ], [ 7.455081098361083, 52.270799798746161 ], [ 7.454613981374153, 52.270815702349829 ] ] ] ] } },
    { "type": "Feature", "properties": { "id": null, "Label": "Gruenland" }, "geometry": { "type": "MultiPolygon", "coordinates": [ [ [ [ 7.449601284967497, 52.272533381821702 ], [ 7.449601284967497, 52.272533381821702 ], [ 7.451177646405197, 52.271585310913338 ], [ 7.450117555419316, 52.271109034926475 ], [ 7.448968604973023, 52.272150777086104 ], [ 7.449601284967497, 52.272533381821702 ] ] ] ] } },
    { "type": "Feature", "properties": { "id": null, "Label": "Gruenland" }, "geometry": { "type": "MultiPolygon", "coordinates": [ [ [ [ 7.468640850949375, 52.283482263464876 ], [ 7.471910055194466, 52.283414532888557 ], [ 7.47192444240897, 52.282996391878442 ], [ 7.468764436535205, 52.283021504456229 ], [ 7.468640850949375, 52.283482263464876 ] ] ] ] } },
    { "type": "Feature", "properties": { "id": null, "Label": "Gruenland" }, "geometry": { "type": "MultiPolygon", "coordinates": [ [ [ [ 7.472880488949951, 52.268763603895444 ], [ 7.473151253544332, 52.268194657071184 ], [ 7.477179839220505, 52.268973260991096 ], [ 7.476915156060707, 52.2693661571505 ], [ 7.476915156060707, 52.2693661571505 ], [ 7.472880488949951, 52.268763603895444 ] ] ] ] } },
    { "type": "Feature", "properties": { "id": null, "Label": "Siedlung" }, "geometry": { "type": "MultiPolygon", "coordinates": [ [ [ [ 7.469142069829808, 52.278314712456314 ], [ 7.469142069829808, 52.278314712456314 ], [ 7.471938862952571, 52.277360167097704 ], [ 7.471938862952571, 52.277360167097704 ], [ 7.471890409644031, 52.278768643310663 ], [ 7.469142069829808, 52.278314712456314 ] ] ] ] } },
    { "type": "Feature", "properties": { "id": null, "Label": "Siedlung" }, "geometry": { "type": "MultiPolygon", "coordinates": [ [ [ [ 7.444963903011619, 52.280949056560722 ], [ 7.447264919658165, 52.280847236366562 ], [ 7.446608101398739, 52.27909923000125 ], [ 7.444752806228933, 52.279801376379893 ], [ 7.444963903011619, 52.280949056560722 ] ] ] ] } },
    { "type": "Feature", "properties": { "id": null, "Label": "Siedlung" }, "geometry": { "type": "MultiPolygon", "coordinates": [ [ [ [ 7.455154588659588, 52.276943586406453 ], [ 7.456994364209832, 52.275646608160905 ], [ 7.45536238159052, 52.275096852850133 ], [ 7.45536238159052, 52.275096852850133 ], [ 7.454236307076182, 52.276513238768239 ], [ 7.455154588659588, 52.276943586406453 ] ] ] ] } }
    ]
    }

// Geojson: No sufficient coordinates
var NoCoordinates= 
{
    "type": "FeatureCollection",
    "name": "demodata_rheine_trainingspolygone_EPSG4326",
    "features": [
    { "type": "Feature", "properties": { "id": null, "Label": "Offenboden" }, "geometry": { "type": "MultiPolygon", "coordinates": [] } },
    { "type": "Feature", "properties": { "id": null, "Label": "Offenboden" }, "geometry": { "type": "MultiPolygon", "coordinates": [ [ [ [ 7.464571688523606, 52.272420787759387 ], [ 7.466801995622199, 52.272273634906732 ], [ 7.46654690124255, 52.271345596245922 ], [ 7.464563954765842, 52.271606047835157 ], [ 7.464571688523606, 52.272420787759387 ] ] ] ] } },
    { "type": "Feature", "properties": { "id": null, "Label": "Offenboden" }, "geometry": { "type": "MultiPolygon", "coordinates": [ [ [ [ 7.456002512138844, 52.279398596397598 ], [ 7.456002512138844, 52.279398596397598 ], [ 7.456605592659954, 52.279604637016789 ], [ 7.45622384232558, 52.280260164283746 ], [ 7.455513112735043, 52.280052713619469 ], [ 7.456002512138844, 52.279398596397598 ] ] ] ] } },
    { "type": "Feature", "properties": { "id": null, "Label": "Gewaesser" }, "geometry": { "type": "MultiPolygon", "coordinates": [ [ [ [ 7.443658977291601, 52.277210937285744 ], [ 7.446501642527312, 52.274958575189231 ], [ 7.446781728842667, 52.275160416178664 ], [ 7.44394369004905, 52.277280742030783 ], [ 7.443658977291601, 52.277210937285744 ] ] ] ] } },
    { "type": "Feature", "properties": { "id": null, "Label": "Gewaesser" }, "geometry": { "type": "MultiPolygon", "coordinates": [ [ [ [ 7.454613981374153, 52.270815702349829 ], [ 7.454819466884459, 52.269034989733981 ], [ 7.454819466884459, 52.269034989733981 ], [ 7.455286565080673, 52.269019085165148 ], [ 7.455081098361083, 52.270799798746161 ], [ 7.454613981374153, 52.270815702349829 ] ] ] ] } },
    { "type": "Feature", "properties": { "id": null, "Label": "Gruenland" }, "geometry": { "type": "MultiPolygon", "coordinates": [ [ [ [ 7.449601284967497, 52.272533381821702 ], [ 7.449601284967497, 52.272533381821702 ], [ 7.451177646405197, 52.271585310913338 ], [ 7.450117555419316, 52.271109034926475 ], [ 7.448968604973023, 52.272150777086104 ], [ 7.449601284967497, 52.272533381821702 ] ] ] ] } },
    { "type": "Feature", "properties": { "id": null, "Label": "Gruenland" }, "geometry": { "type": "MultiPolygon", "coordinates": [ [ [ [ 7.468640850949375, 52.283482263464876 ], [ 7.471910055194466, 52.283414532888557 ], [ 7.47192444240897, 52.282996391878442 ], [ 7.468764436535205, 52.283021504456229 ], [ 7.468640850949375, 52.283482263464876 ] ] ] ] } },
    { "type": "Feature", "properties": { "id": null, "Label": "Gruenland" }, "geometry": { "type": "MultiPolygon", "coordinates": [ [ [ [ 7.472880488949951, 52.268763603895444 ], [ 7.473151253544332, 52.268194657071184 ], [ 7.477179839220505, 52.268973260991096 ], [ 7.476915156060707, 52.2693661571505 ], [ 7.476915156060707, 52.2693661571505 ], [ 7.472880488949951, 52.268763603895444 ] ] ] ] } },
    { "type": "Feature", "properties": { "id": null, "Label": "Siedlung" }, "geometry": { "type": "MultiPolygon", "coordinates": [ [ [ [ 7.469142069829808, 52.278314712456314 ], [ 7.469142069829808, 52.278314712456314 ], [ 7.471938862952571, 52.277360167097704 ], [ 7.471938862952571, 52.277360167097704 ], [ 7.471890409644031, 52.278768643310663 ], [ 7.469142069829808, 52.278314712456314 ] ] ] ] } },
    { "type": "Feature", "properties": { "id": null, "Label": "Siedlung" }, "geometry": { "type": "MultiPolygon", "coordinates": [ [ [ [ 7.444963903011619, 52.280949056560722 ], [ 7.447264919658165, 52.280847236366562 ], [ 7.446608101398739, 52.27909923000125 ], [ 7.444752806228933, 52.279801376379893 ], [ 7.444963903011619, 52.280949056560722 ] ] ] ] } },
    { "type": "Feature", "properties": { "id": null, "Label": "Siedlung" }, "geometry": { "type": "MultiPolygon", "coordinates": [ [ [ [ 7.455154588659588, 52.276943586406453 ], [ 7.456994364209832, 52.275646608160905 ], [ 7.45536238159052, 52.275096852850133 ], [ 7.45536238159052, 52.275096852850133 ], [ 7.454236307076182, 52.276513238768239 ], [ 7.455154588659588, 52.276943586406453 ] ] ] ] } }
    ]
    }