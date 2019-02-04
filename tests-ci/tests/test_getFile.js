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

module.exports.beforeStart = function() {
  console.log("test_getFile beforeStart()!");
  var promise = new Promise(function(resolve,reject) {
    resolve("beforeStart");
  });
  return promise;
}

var tests = {
  testlocalAccessAllowed: function() {
    return new Promise(function(resolve, reject) {
      var localfile = px.getFile("browser.js"); 
      localfile.then(function()  {
        console.log("local file download succeeded .....");
        var results = [];
        results.push("SUCCESS");
        resolve(results);
  }, function() {
        var results = [];
        results.push("FAILURE");
        resolve(results);
     });
  });
  },

  testHttpAccessAllowed: function() {
    return new Promise(function(resolve, reject) {
      var remotefile = px.getFile("http://www.sparkui.org/examples/gallery/fancy.js"); 
      remotefile.then(function()  {
        console.log("remote file download success");
        var results = [];
        results.push("SUCCESS");
        resolve(results);
  }, function(err) {
        console.log("remote file download failed " + err);
        var results = [];
        results.push("FAILURE");
        resolve(results);
     });
  });
  }
}

module.exports.tests = tests;

if(manualTest === true) {

  manual.runTestsManually(tests, module.exports.beforeStart);

}

}).catch( function importFailed(err){
  console.log("err: "+err);
  console.error("Import for test_getFile.js failed: " + err)
});
