"use strict";
px.import({scene:"px:scene.1.js",
           assert:"../test-run/assert.js",
           Optimus: 'optimus.js',
           manual:"../test-run/tools_manualTests.js"}).then( function ready(imports) {

var scene  = imports.scene;
var root   = imports.scene.root;
var assert = imports.assert.assert;
var manual = imports.manual;

const optimus = imports.Optimus;

var manualTest = manual.getManualTestValue();


var beforeStart = function() {
  // Nothing to do here...
  console.log("test_pxSuspendAndResume.js ... beforeStart ...");
  var promise = new Promise(function(resolve,reject) {
    resolve(assert(true,"beforeStart succeeded"));
  });
  return promise;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var tests = {

  test_pxSuspendAndResume_test: function()
  {
    return new Promise(function(resolve, reject)
    {
      var app = scene.create({t:"scene", parent:root, w: root.w, h: root.h, url:"http://www.sparkUi.org/examples/gallery/mousetest2.js", focus:true});
      var results = [];
      app.ready.then( function(obj) {
          var status = app.suspend() == true ? "SUSPENDED" : "RUNNING";
          console.log("STATE:"+status);
          results.push(assert(status == "SUSPENDED", "test_pxSuspendAndResume: application is failed to SUSPEND"));
          
          status = app.resume() == true ? "RUNNING" : "SUSPENDED";
          console.log("STATE:"+status);
          results.push(assert(status == "RUNNING", "test_pxSuspendAndResume: application is failed to RESUME"));
          
          resolve(results);
      }, function(err) {
          results.push(assert(false,"app creation failed"));
          resolve(results);
      });// test promise()
    });
  }
}

module.exports.tests = tests;
module.exports.beforeStart = beforeStart;

if(manualTest === true) {

  manual.runTestsManually(tests, beforeStart);

}

}).catch( function importFailed(err){
  console.error("Import for test_pxSuspendAndResume.js failed: " + err)
});
