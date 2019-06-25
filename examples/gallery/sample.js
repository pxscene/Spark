"use strict";
px.import({scene:"px:scene.1.js", 
  tools:"tools.mjs"}).then( function ready(imports) {

  var scene = imports.scene;
  var tools = imports.tools;
  var basePackageUri = px.getPackageBaseFilePath();
  var url = basePackageUri + "/SVG/android.svg";
 
  var svg = tools.getSvgTexture(scene, url, 400, 400);
  svg.ready.then(function () {
    svg.x=0;
    svg.y=100;
  });

  var rect = tools.getRoundRect(scene, 350, 50, 15, 2,  "darkgreen", false, "green");
  rect.ready.then(function () {
    rect.x=10;
    rect.y=10;
  });

  var rectShadow = tools.getShadowRect(scene, 350, 150);
  rectShadow.ready.then(function () {
    rectShadow.x=400;
    rectShadow.y=200;
  });
    
}).catch(function (e) {
  console.error("Import failed for agif1.js: " + e);
});
