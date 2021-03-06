"use strict" 

// Path to the backend directory
var path = "http://44.234.41.163:8782/verzeichnis"


/**
 * Add icon for the sampling areas
 * Icon-source: Icons erstellt von "https://www.flaticon.com/de/autoren/hasim-safii" hasim safii from "https://www.flaticon.com/de/" 
 * Code source: https://leafletjs.com/examples/custom-icons/
 **/
var icon = L.icon({
    iconSize: [18, 18],
    iconUrl: '/stylesheets/kreuz.png'
});

/**
 * Loading the AOA:
 * Accesses the AOA, saves it as a GeoRasterLayer in a leaflet layerGroup, adjusts the colors, and then calls the createAOALayer(layerAOA) 
 * function to display the layer on the map.
 */

 var url_to_geotiff_file = path + "/data/output/aoaOutput.tif";
 fetch(url_to_geotiff_file).then(response => response.arrayBuffer()).then(arrayBuffer => {
    parseGeoraster(arrayBuffer).then(georaster => {
        const min = 0;
        const max = 2;
        const range = max-min;
        var scale = chroma.scale(['#01665e', '#f6e8c3']).classes(2)
        console.log("georaster:", georaster);
        var AOAlayer = new GeoRasterLayer({
            georaster: georaster,
            opacity: 0.7,
            pixelValuesToColorFn: function(pixelValues) {
                var pixelValue = pixelValues[0]; // there's just one band in this raster

                // if there's zero wind, don't return a color
                if (pixelValue === 0) return '#01665e';

                // scale to 0 - 1 used by chroma
                var scaledPixelValue = (pixelValue - min) / range;

                var color = scale(scaledPixelValue).hex();

                return color;
            },
            resolution: 1000
        });
        var layerAOA = L.layerGroup([AOAlayer])
        createAOALayer(layerAOA);

        var classBreaks = [];
        for(let i = 0; i < 2; i++){
            var count = i + 1;
            classBreaks.push(count);
        }
        
        var categories = ['Inside AOA', 'Outside AOA'];
        
        var colorHex = ['#f6e8c3', '#01665e'];
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
        
        legend.onAdd = function (ownresultmap) {
            var div = L.DomUtil.create('div', 'legend');
            div.innerHTML += "<h4> AOA </h4>";
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
        legend.addTo(ownresultmap);
 })})
 
/**
 * Loading the prediction:
 * Accesses the prediction, saves it as a GeoRasterLayer in a leaflet layerGroup, adjusts the colors, and then calls the 
 * createPredictionLayer(layerPrediction) function to display the layer on the map.
 */

 $.ajax({
    url: path + "/data/output/labelsOutput.json",
    type: 'GET',
    dataType: 'json', 
    success: function(res) {
        var status = res[0];
        console.log(status)
        if(status == 'trainingdata'){
            var xhr = new XMLHttpRequest();
            xhr.open('GET', path + "/data/output/trainingsitesOutput.geojson");
            xhr.onload = function() {
            if (xhr.status === 200) {
            var polygons = L.geoJSON(JSON.parse(xhr.responseText))
            var layerpolygons = L.layerGroup([polygons])
            createPolygonLayer(layerpolygons);
            console.log(polygons)
            }}
            xhr.send();
        }
        // set labels
        var labels = res;
        labels.splice(0,2)
        console.log(labels)
        var url_to_geotiff_file = path + "/data/output/predictionOutput.tif";
        fetch(url_to_geotiff_file).then(response => response.arrayBuffer()).then(arrayBuffer => {
            parseGeoraster(arrayBuffer).then(georaster => {
                const min = 0;
                const max = labels.length+1;
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
                '#313695']).classes(labels.length)
                console.log("georaster:", georaster);
                var Predictionlayer = new GeoRasterLayer({
                    georaster: georaster,
                    opacity: 0.8,
                    pixelValuesToColorFn: function(pixelValues) {
                        var pixelValue = pixelValues[0]; 

                        if (pixelValue === 0) return null;

                        var scaledPixelValue = (pixelValue - min) / range;

                        var color = scale(scaledPixelValue).hex();

                        return color;
                    },
                    resolution: 1000
                });
                var layerPrediction = L.layerGroup([Predictionlayer])
                createPredictionLayer(layerPrediction);

                 // create legend
                var classBreaks = []
                for(let i = 0; i < labels.length; i++){
                    var count = i + 1;
                    classBreaks.push(count);
                }
                
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
                
                legend.onAdd = function (ownresultmap) {
                    var div = L.DomUtil.create('div', 'legend');
                    div.innerHTML += "<h4> LULC </h4>";
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
                legend.addTo(ownresultmap);

                // add AOI to the map
                var coordinates = [[georaster.ymin, georaster.xmin],[georaster.ymax,georaster.xmax]]
                L.rectangle(coordinates, {
                    color: 'black',
                    weight: 3,
                    fillOpacity: 0,
                }).addTo(ownresultmap)

                // set view to AOI
                ownresultmap.fitBounds(coordinates)
                })
        })}})

/** 
 * Loading the recommended sampling areas:
 * Accesses the recommended sampling areas of the demo via ajax-call, converts them to leaflet markers with icon, saves it as a leaflet layerGroup
 * and then calls the createSamplingLayer(layertraingspots) function to display the layer on the map.
 */
 $.ajax({
    url: path + "/data/output/labelsOutput.json",
    type: 'GET',
    dataType: 'json', 
    success: function(res) {
        var status = res[1];
        console.log(status)
        if(status == 'sampling'){
            $.ajax({
                url: path + "/data/output/samplingLocationsOutput.geojson",
                type: 'GET',
                dataType: 'json', 
                success: function(res) {
                    console.dir(res);
                    var samplingareas = L.geoJson(res, {
                        pointToLayer: function(feature, latlng) {            
                            return L.marker(latlng, {icon: icon})}})
                        var layertrainingspots = L.layerGroup([samplingareas]);
                        createSamplingLayer(layertrainingspots);
                }
            });
        }}})

// add tileLayer with basemap
var base = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', 
    {
    attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
    })

    //Source: http://bl.ocks.org/d3noob/8663620
    var mapLink = 
    '<a href="http://www.esri.com/">Esri</a>';
    var wholink = 
    'i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';

var satbase = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: '&copy; '+mapLink+', '+wholink,});


// create map for own calculation results
var ownresultmap = L.map('ownresultmap', {center: [50.943144, 10.388001], zoom: 6, layers: base});

// declare basemap and overlaymaps
var baseMap = {"Basemap": base, "Satellite": satbase};
var overlayMaps;

/**
 * Adds training polygons to overlaymaps-variable and creates option to display the polygons on the map 
 * using layer control.
 * @param {L.layerGroup} polygonlayer 
 */
function createPolygonLayer(polygonlayer){
    overlayMaps = {"Trainingpolygons": polygonlayer}
    L.control.layers(baseMap,overlayMaps).addTo(ownresultmap)
}

/**
 * Adds the recommended sampling areas to overlaymaps-variable and creates option to display them
 * on the map using layer control.
 * @param {L.layerGroup} samplinglayer
 */
function createSamplingLayer(samplinglayer){
    overlayMaps = {"Recommended sampling areas": samplinglayer}
    L.control.layers(baseMap,overlayMaps).addTo(ownresultmap)
}

/**
 * Adds the demo AOA to overlaymaps-variable and creates option to display it
 * on the map using layer control.
 * @param {L.layerGroup} aoalayer
 */
function createAOALayer(aoalayer){
    overlayMaps = {"AOA": aoalayer}
    L.control.layers(baseMap,overlayMaps).addTo(ownresultmap)
}

/**
 * Adds the demo prediction to overlaymaps-variable and creates option to display it
 * on the map using layer control.
 * @param {L.layerGroup} predictionlayer
 */
function createPredictionLayer(predictionlayer){
   overlayMaps = {"Prediction": predictionlayer}
    L.control.layers(baseMap,overlayMaps).addTo(ownresultmap)
}

