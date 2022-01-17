"use strict" 

/**
 * Add icon for the suggested training points
 * Icon-source: Icons erstellt von "https://www.flaticon.com/de/autoren/hasim-safii" hasim safii from "https://www.flaticon.com/de/" 
 * Code source: https://leafletjs.com/examples/custom-icons/
 **/
var icon = L.icon({
    iconSize: [18, 18],
    iconUrl: '/stylesheets/kreuz.png'
});


/**
 * Loading the demo AOA:
 * Accesses the demo AOA, saves it as a GeoRasterLayer in a leaflet layerGroup, adjusts the colors, and then calls the createAOALayer(layerAOA) 
 * function to display the layer on the map.
 */
var url_to_geotiff_file = "/demodata/aoaOutput.tif";
fetch(url_to_geotiff_file).then(response => response.arrayBuffer()).then(arrayBuffer => {
    parseGeoraster(arrayBuffer).then(georaster => {
        console.log("georaster:", georaster);
        var AOAlayer = new GeoRasterLayer({
            georaster: georaster,
            opacity: 0.8,
            // color selection oriented to scale for color blind people: https://www.extensis.com/de-de/blog/so-gestalten-sie-designs-f%C3%BCr-farbenblinde
            pixelValuesToColorFn: values => (values[0] > 0 && values[0] <= 0.1) ? '#56b4e9' :
                                            (values[0] > 0.1 && values[0] <= 0.15) ? '#e69f00' :
                                            (values[0] > 0.15 && values[0] <= 0.2) ? '#009e73' :
                                            (values[0] > 0.2 && values[0] <= 0.25) ? '#f0e442' :
                                            (values[0] > 0.25 && values[0] <= 0.3) ? '#0072b2' :
                                            (values[0] > 0.3 && values[0] <= 0.5) ? '##d55e00' :
                                            (values[0] > 0.5 && values[0] <= 0.7) ? '#cc79a7' :
                                            (values[0] > 0.7 && values[0] <= 0.1) ? '#000000' :
                                            (values[0] > 1 && values[0] <= 2) ? '#cc79a7' :
                                            (values[0] > 2 && values[0] <= 3) ? '#d55e00' :
                                            (values[0] > 3 && values[0] <= 4) ? '#0072b2' :
                                            (values[0] > 4 && values[0] <= 5) ? '#f0e442' :
                                            (values[0] > 5 && values[0] <= 6) ? '#009e73' :
                                            (values[0] > 6 && values[0] <= 7) ? '#e69f00' :
                                            (values[0] > 7 && values[0] <= 8) ? '#56b4e9' :
                                            (values[0] > 8 && values[0] <= 9) ? '#000000' :
                                            null,
            resolution: 1200,
        })
        var layerAOA = L.layerGroup([AOAlayer]);
        createAOALayer(layerAOA);
})})

/**
 * Loading the demo prediction:
 * Accesses the demo prediction, saves it as a GeoRasterLayer in a leaflet layerGroup, adjusts the colors, and then calls the 
 * createPredictionLayer(layerPrediction) function to display the layer on the map.
 */

 $.ajax({
    url: "demodata/labelsOutput.json",
    type: 'GET',
    dataType: 'json', 
    success: function(res) {
        var labels = res;
        console.log(labels)
        var url_to_geotiff_file = "/demodata/predictionOutput.tif";
        fetch(url_to_geotiff_file).then(response => response.arrayBuffer()).then(arrayBuffer => {
            parseGeoraster(arrayBuffer).then(georaster => {
                const min = 0;
                const max = labels.length;
                const range = max-min;
                console.log(chroma.brewer);
                var scale = chroma.scale(['#a50026',
                '#d73027',
                '#f46d43',
                '#fdae61',
                '#fee090',
                '#ffffbf',
                '#e0f3f8',
                '#abd9e9',
                '#74add1',
                '#4575b4',
                '#313695']).classes(res.length)
                console.log(res.length)
                console.log("georaster:", georaster);
                var Predictionlayer = new GeoRasterLayer({
                    georaster: georaster,
                    opacity: 0.8,
                    pixelValuesToColorFn: function(pixelValues) {
                        var pixelValue = pixelValues[0]; // there's just one band in this raster

                        // if there's zero wind, don't return a color
                        if (pixelValue === 0) return null;

                        // scale to 0 - 1 used by chroma
                        var scaledPixelValue = (pixelValue - min) / range;

                        var color = scale(scaledPixelValue).hex();

                        return color;
                    },
                    resolution: 1000
                });
                var layerPrediction = L.layerGroup([Predictionlayer])
                createPredictionLayer(layerPrediction);

                var classBreaks = []

                for(let i = 0; i < labels.length-1; i++){
                    var count = i + 1;
                    classBreaks.push(count);
                }

                console.log(classBreaks);
                
                var categories = labels;
                
                var colorHex = ['#a50026',
                '#d73027',
                '#f46d43',
                '#fdae61',
                '#fee090',
                '#ffffbf',
                '#e0f3f8',
                '#abd9e9',
                '#74add1',
                '#4575b4',
                '#313695'];
                function getColor(n,classBreaks,colorHex) {
                    var mapScale = chroma.scale(colorHex).classes(classBreaks);
                    if (n === 0) {
                        var regionColor = '#ffffff';
                    } else { 
                        var regionColor = mapScale(n).hex();
                    }
                    return regionColor
                }
                var legend = L.control({position: 'topleft'});
                
                legend.onAdd = function (demoresultmap) {
                    var div = L.DomUtil.create('div', 'legend');
                    classBreaks.push(999); // add dummy class to extend to get last class color, chroma only returns class.length - 1 colors
                    for (var i = 0; i < classBreaks.length; i++) {
                        if (i+2 === classBreaks.length) {
                            div.innerHTML += '<i style="background: ' + getColor(classBreaks[i], classBreaks, colorHex) + ';"></i> ' +
                            categories[i] ;
                            break
                        } else {
                            div.innerHTML += '<i style="background: ' + getColor(classBreaks[i], classBreaks, colorHex) + ';"></i> ' +
                            categories[i] +'<br>';
                        }
                    }
                    return div;
                };
                legend.addTo(demoresultmap);
            })
        })}})

/** 
 * Loading the recommended sampling areas:
 * Accesses the recommended sampling areas of the demo via ajax-call, converts them to leaflet markers with icon, saves it as a leaflet layerGroup
 * and then calls the createSamplingLayer(layertraingspots) function to display the layer on the map.
 */
 $.ajax({
    url: "demodata/demodata_rheine_sampling_EPSG4326.geojson",
    type: 'GET',
    dataType: 'json', 
    success: function(res) {
        console.dir(res);
        var samplingareas = L.geoJson(res, {
            pointToLayer: function(feature, latlng) {            
                return L.marker(latlng, {icon: icon})}})

            console.log(samplingareas)
            var layertrainingspots = L.layerGroup([samplingareas]);
            createSamplingLayer(layertrainingspots);
    }
});


/** 
 * Loading the trainingpolygons:
 * Accesses the trainingpolygons of the demo via XMLHttpRequest, converts them for leaflet, saves it as a leaflet layerGroup
 * and then calls the createPolygonLayer(layerpolygons) function to display the layer on the map.
 */
var xhr = new XMLHttpRequest();
xhr.open('GET', '/demodata/demodata_rheine_trainingspolygone.geojson');
xhr.setRequestHeader('Content-Type', 'application/json');
xhr.onload = function() {
if (xhr.status === 200) {
var polygons = L.geoJSON(JSON.parse(xhr.responseText))
var layerpolygons = L.layerGroup([polygons])
createPolygonLayer(layerpolygons);
console.log(polygons)
}}
xhr.send();


// add tileLayer with basemap
var demobase = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', 
    {
    attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
    })

// create map for demo calculation results
var demoresultmap = L.map('demoresultmap', {center: [50.943144, 10.388001], zoom: 6, layers: demobase});

// declare basemap and overlaymaps
var demobaseMap = {"Basemap": demobase};
var demooverlayMaps;

/**
 * Adds training polygons to demooverlaymaps-variable and creates option to display the polygons on the map 
 * using layer control.
 * @param {L.layerGroup} polygonlayer 
 */
function createPolygonLayer(polygonlayer){
    demooverlayMaps = {"Trainingpolygons": polygonlayer}
    L.control.layers(demobaseMap,demooverlayMaps).addTo(demoresultmap)
}

/**
 * Adds the recommended sampling areas to demooverlaymaps-variable and creates option to display them
 * on the map using layer control.
 * @param {L.layerGroup} samplinglayer
 */
function createSamplingLayer(samplinglayer){
    demooverlayMaps = {"Recommended sampling areas": samplinglayer}
    L.control.layers(demobaseMap,demooverlayMaps).addTo(demoresultmap)
}

/**
 * Adds the demo AOA to demooverlaymaps-variable and creates option to display it
 * on the map using layer control.
 * @param {L.layerGroup} aoalayer
 */
function createAOALayer(aoalayer){
    demooverlayMaps = {"AOA": aoalayer}
    L.control.layers(demobaseMap,demooverlayMaps).addTo(demoresultmap)
}

/**
 * Adds the demo prediction to demooverlaymaps-variable and creates option to display it
 * on the map using layer control.
 * @param {L.layerGroup} predictionlayer
 */
function createPredictionLayer(predictionlayer){
    demooverlayMaps = {"Prediction": predictionlayer}
    L.control.layers(demobaseMap,demooverlayMaps).addTo(demoresultmap)
}

// add AOI to the map
var layerAOI = L.rectangle(coordsAOI, {
    color: 'black',
    weight: 3,
    fillOpacity: 0,
  }).addTo(demoresultmap)

// set view to AOI
demoresultmap.fitBounds(coordsAOI)

// add a legend
// source: https://leafletjs.com/examples/choropleth/

/*
var legend = L.control({position: 'topleft'});

legend.onAdd = function (demoresultmap) {

    var div = L.DomUtil.create('div', 'info legend');
    var labels = ['<strong>Categories</strong>'],
    categories = ['Road Surface','Signage','Line Markings','Roadside Hazards','Other'];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < categories.length; i++) {
        div.innerHTML +=
        labels.push(
            '<i style="background:' + getColor(categories.length - [i+1]) + '"</i> ' + '</i> ' +
            (categories[i] ? categories[i] : '+'));
    }
    div.innerHTML = labels.join('<br>');
    return div;
};

legend.addTo(demoresultmap);

/*
//source: https://colorbrewer2.org/#type=diverging&scheme=RdYlBu&n=11
function getColor(d) {
    return d > 10 ? '#a50026' :
           d > 9 ? '#d73027' :
           d > 8 ? '#f46d43' :
           d > 7 ? '#fdae61' :
           d > 6  ? '#fee090' :
           d > 5  ? '#ffffbf' :
           d > 4  ? '#e0f3f8' :
           d > 3  ? '#abd9e9' :
           d > 2  ? '#74add1' :
           d > 1  ? '#4575b4' :
                     '#313695';
}*/

/*
var classBreaks = [1,2,3,4,5,6,7,8,9,10];
var categories = ['Road Surface','Signage','Line Markings','Roadside Hazards','Other'];


var colorHex = ['#a50026',
'#d73027',
'#f46d43',
'#fdae61',
'#fee090',
'#ffffbf',
'#e0f3f8',
'#abd9e9',
'#74add1',
'#4575b4',
'#313695'];
function getColor(n,classBreaks,colorHex) {
    var mapScale = chroma.scale(colorHex).classes(classBreaks);
    if (n === 0) {
        var regionColor = '#ffffff';
    } else { 
        var regionColor = mapScale(n).hex();
    }
    return regionColor
}
var legend = L.control({position: 'topleft'});

legend.onAdd = function (demoresultmap) {
    var div = L.DomUtil.create('div', 'legend');
    classBreaks.push(999); // add dummy class to extend to get last class color, chroma only returns class.length - 1 colors
    for (var i = 0; i < classBreaks.length; i++) {
        if (i+2 === classBreaks.length) {
            div.innerHTML += '<i style="background: ' + getColor(classBreaks[i], classBreaks, colorHex) + ';"></i> ' +
            categories[i] ;
            break
        } else {
            div.innerHTML += '<i style="background: ' + getColor(classBreaks[i], classBreaks, colorHex) + ';"></i> ' +
            categories[i] +'<br>';
        }
    }
    return div;
};
legend.addTo(demoresultmap);*/