"use strict";
px.import({scene:"px:scene.1.js",
           assert:"../test-run/assert.js",
           manual:"../test-run/tools_manualTests.js"}).then( function ready(imports) {

var scene  = imports.scene;
var root   = imports.scene.root;
var assert = imports.assert.assert;
var manual = imports.manual;

var manualTest = manual.getManualTestValue();

var beforeStart = function() {
  // Nothing to do here...
  console.log("test_pxRectangleWithAlpha0-1.js start.....");
  var promise = new Promise(function(resolve,reject) {
    resolve("beforeStart");
  });
  return promise;
}

var tests = {

  testRectFill: function() {
    return new Promise(function(resolve, reject) {
      var results = [];

      var rect = scene.create({t:"rect", parent: root, x:0, y: 0, w:500, h:500, fillColor:0xff000080, lineWidth:20, lineColor:0xFFFF0080});

      rect.ready.then( function(obj) {
        results.push(assert(rect.fillColor===0xff000080,"Rect 'fillColor' property was not as expected."));
      }, function failure() {
        results.push(assert(false,"Rect got rejected promise, so test could not proceed."));
      }).then(function(error) {
        rect = null;
        resolve(results);
      });
    });
  },

  testRectWxH: function() {
    return new Promise(function(resolve, reject) {
      var results = [];

      var rect = scene.create({t:"rect", parent: root, x:0, y: 0, w:500, h:500, fillColor:0xff000080, lineWidth:20, lineColor:0xFFFF0080});

      rect.ready.then( function(obj) {
        results.push(assert(rect.w===500,"Rect 'w' property was not as expected."));
        results.push(assert(rect.h===500,"Rect 'h' property was not as expected."));
      }, function failure() {
        results.push(assert(false,"Rect got rejected promise, so test could not proceed."));
      }).then(function(error) {
        rect = null;
        resolve(results);
      });
    });
  },
  testRectLineColor: function() {
    return new Promise(function(resolve, reject) {
      var results = [];

      var rect = scene.create({t:"rect", parent: root, x:0, y: 0, w:500, h:500, fillColor:0xff000080, lineWidth:20, lineColor:0xFFFF0080});

      rect.ready.then( function(obj) {
        results.push(assert(rect.lineColor===0xFFFF0080,"Rect 'lineColor' property was not as expected."));
      }, function failure() {
        results.push(assert(false,"Rect got rejected promise, so test could not proceed."));
      }).then(function(error) {
        rect = null;
        resolve(results);
      });
    });
  },

  testRectLineWidth: function() {
    return new Promise(function(resolve, reject) {
      var results = [];

      var rect = scene.create({t:"rect", parent: root, x:0, y: 0, w:500, h:500, fillColor:0xffFf0080, lineWidth:20, lineColor:0xFFFF0080});

      rect.ready.then( function(obj) {
        results.push(assert(rect.lineWidth===20,"Rect 'lineWidth' property was not as expected."));
      }, function failure() {
        results.push(assert(false,"Rect got rejected promise, so test could not proceed."));
      }).then(function(error) {
        rect = null;
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
  console.error("Import for test_pxRectangleWithAlpha0-1.js failed: " + err)
});
