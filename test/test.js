var expect = require('chai').expect;

// tests
console.log(

describe ("our Unittests", () =>
{
    it ("valid coordinates", () =>
    {
        expect(checkcoordinates(52.25, 7.4, 52.3, 7.5)).to.equal(true)
    })
    it ("invalid: '' ", () =>
    {
        expect(checkcoordinates('', 7.4, 52.3, 7.5)).to.equal(false)
    })
    it ("valid coordinates", () =>
    {
        expect(checkcoordsformat(52.25, 7.4, 52.3, 7.5)).to.equal(true)
    })
    it ("No number", () =>
    {
        expect(checkcoordsformat('abc', 7.4, 52.3, 7.5)).to.equal(false)
    })
    it ("Found ',' ", () =>
    {
        expect(checkcoordsformat('52,25', 7.4, 52.3, 7.5)).to.equal(false)
    })
    it ("ymax > 90", () =>
    {
        expect(checkcoordsformat(52.25, 7.4, 100, 7.5)).to.equal(false)
    })
    it ("ymin < -90", () =>
    {
        expect(checkcoordsformat(52.25, 7.4, -100, 7.5)).to.equal(false)
    })
    it ("xmax > 180", () =>
    {
        expect(checkcoordsformat(52.25, 7.4, 52.3, 200)).to.equal(false)
    })
    it ("xmax < 180", () =>
    {
        expect(checkcoordsformat(52.25, 7.4, 52.3, -200)).to.equal(false)
    })
    it ("ymin < -90", () =>
    {
        expect(checkcoordsformat(-100, 7.4, 52.3, 7.5)).to.equal(false)
    })
    it ("ymin > 90", () =>
    {
        expect(checkcoordsformat(100, 7.4, 52.3, 7.5)).to.equal(false)
    })
    it ("ymin > ymax", () =>
    {
        expect(checkcoordsformat(55, 7.4, 52.3, 7.5)).to.equal(false)
    })
    it ("ymin > ymax", () =>
    {
        expect(checkcoordsformat(-35, 7.4, -55, 7.5)).to.equal(false)
    })
    it ("ymin > 0 && ymax < 0", () =>
    {
        expect(checkcoordsformat(70, 7.4, -70, 7.5)).to.equal(false)
    })
    it ("xmin > xmax", () =>
    {
        expect(checkcoordsformat(52.25, 10, 52.3, 7.5)).to.equal(false)
    })
    it ("xmin > xmax", () =>
    {
        expect(checkcoordsformat(52.25, -10, 52.3, -15)).to.equal(false)
    })
    it ("xmin > 0 && xmax < 0", () =>
    {
        expect(checkcoordsformat(52.25, 10, 52.3, -10)).to.equal(false)
    })
    it ("valid coordinates", () =>
    {
        expect(checkcoordsformat(0, 7.4, 52.3, 7.5)).to.equal(true)
    })
    it ("ymin > ymax", () =>
    {
        expect(checkcoordsformat(52.2, 7.4, 0, 7.5)).to.equal(false)
    })
    it ("ymin >= 0 && ymax < 0", () =>
    {
        expect(checkcoordsformat(0, 7.4, -5, 7.5)).to.equal(false)
    })
    it ("valid coordinates", () =>
    {
        expect(checkcoordsformat(-5, 7.4, 0, 7.5)).to.equal(true)
    })
    it ("valid coordinates", () =>
    {
        expect(checkcoordsformat(52.25, 0, 52.3, 7.5)).to.equal(true)
    })
    it ("xmin > xmax", () =>
    {
        expect(checkcoordsformat(52.25, 7.4, 52.3, 0)).to.equal(false)
    })
    it ("xmin >= 0 && xmax < 0", () =>
    {
        expect(checkcoordsformat(52.25, 0, 52.3, -7.5)).to.equal(false)
    })
    it ("valid coordinates", () =>
    {
        expect(checkcoordsformat(52.25, -7.5, 52.3, 0)).to.equal(true)
    })
    it ("geojson", () =>
    {
        expect(getending('file.geojson')).to.equal('geojson')
    })
    it ("gpkg", () =>
    {
        expect(getending('file.gpkg')).to.equal('gpkg')
    })
    it ("rds", () =>
    {
        expect(getending('file.rds')).to.equal('rds')
    })
    it ("png", () =>
    {
        expect(getending('file.png')).to.equal('png')
    })
    it ("valid geojson", () =>
    {
        expect(checkformatgeojson(validgeojson)).to.equal(true)
    })
    it ("invalid geojson: no FeatureCollection", () =>
    {
        expect(checkformatgeojson(noFeatureCollection)).to.equal(false)
    })
    it ("invalid geojson: no label", () =>
    {
        expect(checkformatgeojson(nolabel)).to.equal(false)
    })
    it ("invalid geojson: no/wrong type", () =>
    {
        expect(checkformatgeojson(notype)).to.equal(true)
    })
    it ("invalid geojson: no/not enough coordinates", () =>
    {
        expect(checkformatgeojson(nocoords)).to.equal(false)
    })
}))

// geojsons for testing
var validgeojson = {
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
var noFeatureCollection = 
{
    "type": "object",
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
var nolabel = 
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
var notype = 
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
var nocoords = 
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
      return false
    }
    else{
      return true
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
}
// Checks if they exceed the maximum values
var yminfv = ymin.split('.');
var ymaxfv = ymax.split('.');
if(yminfv[0] > 90 || yminfv[0] <-90 || ymaxfv[0] > 90 || ymaxfv[0] <-90){
    return false;
}
var xminfv = xmin.split('.');
var xmaxfv = xmax.split('.');
if(xminfv[0] > 180 || xminfv[0] <-180 || xmaxfv[0] > 180 || xmaxfv[0] <-180){
    return false;
}
if(ymin >= 0 && ymax >= 0){
    if(ymin > ymax){
    return false;
    }
} 
if(ymin <= 0 && ymax <= 0){
    if(ymin < ymax){
    return false;
    }
} 
if(ymin >= 0 && ymax <= 0){
    return false;
}
if(xmin >= 0 && xmax >= 0){
    if(xmin > xmax){
    return false;
    }
}
if(xmin <= 0 && xmax <= 0){
    if(xmin < xmax){
    return false;
    }
}
if(xmin >= 0 && xmax <= 0){
    return false;
}
else{
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
    if(geojson.type !== "FeatureCollection"){
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
    if(features[i].geometry.type !== "MultiPolygon" ){
        return false
    }
    // Coordinates?
    if(features[i].geometry.coordinates.length < 2){
        return false
    }
    else{
        return true
    }
    }}}






