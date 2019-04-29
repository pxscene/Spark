"use strict";

px.import({scene:"px:scene.1.js",
           assert:"../test-run/assert.js",
           manual:"../test-run/tools_manualTests.js"}).then( function ready(imports) {

var scene = imports.scene;
var root = imports.scene.root;
var assert = imports.assert.assert;
var manual = imports.manual;
var manualTest = manual.getManualTestValue();
var basePackageUri = px.getPackageBaseFilePath();

var beforeStart = function() {
  // Nothing to do here...
  console.log("test_xre2-2063 beforeStart.....");
  var promise = new Promise(function(resolve,reject) {
    resolve(assert(true,"beforeStart succeeded"));
  });
  return promise;
}

var tests = {

  testWithGarbageCollect: function() {
    console.log("Running testWithGarbageCollect");
    return new Promise(function(resolve, reject) {
      var results = [];
      for (var i=0; i<10; i++) {
        scene.create({ t: "rect", parent: root, w: root.w, h: root.h, clip: true, fillColor: "#F00" });
      }
      var metricsBeforeRemove = scene.logDebugMetrics();
      root.removeAll();
      var metricsAfterRemove = scene.logDebugMetrics();
      results.push(assert((metricsBeforeRemove.numObjects-metricsAfterRemove.numObjects)>=10,"memory leak seen after removeAll call"));
      resolve(results);
    });
  }
}
module.exports.tests = tests;
module.exports.beforeStart = beforeStart;

if(manualTest === true) {

  manual.runTestsManually(tests, beforeStart);

}

}).catch( function importFailed(err){
  console.error("Import for test_xre2-2063.js failed: " + err)
});
