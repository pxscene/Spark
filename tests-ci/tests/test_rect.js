px.import("px:scene.1.js").then( function ready(scene) {
var root = scene.root;
var basePackageUri = px.getPackageBaseFilePath();
var rect = scene.create({t:"rect", parent: root, w:500, h:500, fillColor:0xFF0000ff});

}).catch( function importFailed(err){
  console.error("Import failed for cliptest.js: " + err)
});