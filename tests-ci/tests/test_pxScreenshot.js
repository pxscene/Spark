"use strict";
px.import({scene:"px:scene.1.js",
           assert:"../test-run/assert.js",
           manual:"../test-run/tools_manualTests.js"}).then( function ready(imports) {

var scene  = imports.scene;
var root   = imports.scene.root;
var assert = imports.assert.assert;
var manual = imports.manual;

var basePackageUri = px.getPackageBaseFilePath();
var url = basePackageUri + "/helpers/test_rect.js";

var manualTest = manual.getManualTestValue();

var beforeStart = function() {
  // Nothing to do here...
  console.log("test_pxScreenshot start.....");
  var promise = new Promise(function(resolve,reject) {
    resolve("beforeStart");
  });
  return promise;
}

var tests = {

  testScreenShot: function() {
    return new Promise(function(resolve, reject) {
      var results = [];
      var stage = scene.create({ t: 'scene', parent: root, x:0, y:0, w: scene.w, h: scene.h, sx: 1, sy: 1, url: url, interactive: false, clip: true, stretchX: 1, stretchY: 1 });
      stage.ready.then( function(obj) {
        var base64String = stage.screenshot("image/png;base64");
        var expected64String="data:image/png;base64";
        console.log("test_pxScreenshot:"+base64String);
        var isValid = ( base64String.indexOf(expected64String) == 0)
        console.log(assert(isValid,"screen shot base64String!=expected64String"));
      
        results.push(assert(isValid,"screen shot base64String!=expected64String"));
      }, function failure() {
        console.log(assert(false,"test_pxScreenshot failed on loading stage!"));
        results.push(assert(false,"test_pxScreenshot failed on loading stage!"));
      }).then(function(error) {
        console.log(assert(false,"test_pxScreenshot failed!"));
        resolve(results);
      });
    });
  }

}//tests
module.exports.tests = tests;
module.exports.beforeStart = beforeStart;

if(manualTest === true) {

  manual.runTestsManually(tests, beforeStart);

}

}).catch( function importFailed(err){
  console.error("Import for test_pxScreenshot.js failed: " + err)
});
