"use strict";
/** 
 * This test ensures that changing x or y values creates a new promise for textBox.
 * This is because the text measurements for textBox are (currently) relative to its parent.
 */

px.import({scene:"px:scene.1.js",
           assert:"../test-run/assert.js",
           manual:"../test-run/tools_manualTests.js"}).then( function ready(imports) {

var scene = imports.scene;
var root = scene.root;
var assert = imports.assert.assert;
var manual = imports.manual;

var manualTest = manual.getManualTestValue();

var originalX = 300;
var originalY = 100;
var testX = 100;
var testY = 300;

var textBox = scene.create({t:"textBox", parent:root, x:originalX,y:originalY, h:50, w:200, wordWrap:true, text: "some longish text for testing in order to see wrapping change as properties change"});


var textBoxReadySaved = textBox.ready;

var beforeStart = function() {
  // Ensure rejected promise on first, invalid url 
  // before beginning the rest of the test
  console.log("test_promiseNewCreationTextBox_xy start.....");

    return new Promise(function(resolve, reject) {
      var results = []; 
      Promise.all([textBox.ready]).then( function() {
        results.push(assert((textBox.ready === textBoxReadySaved), "textBox promise is not equal"));

      }, function rejection(o) {
        console.log("Promise.all rejection received");
        results.push(assert(true, "Promise.all received"));
      }).then( function(obj) {
        resolve(results);
      });
    });
 
}

var tests = {

  test_textBoxSetPos: function() {

    return new Promise(function(resolve, reject) {
      var results = []; 
      textBox.x = testX;
      textBox.y = testY;
      // New promise should be resolved or rejected
      textBox.ready.then(function(o) {
        results.push(assert(!(textBox.ready === textBoxReadySaved), "test_textBoxSetW: textBox Promise was old"));
      }, function rejection(o) {
        results.push(assert(false, "test_textBoxSetW: Promise rejection received"));
      }).then( function(obj) {
        textBoxReadySaved = textBox.ready;
        resolve(results);
      });
    });
  },

  test_textBoxAnimatePos: function() {

    return new Promise(function(resolve, reject) {
      var results = []; 
      textBox.animateTo({x:originalX,y:originalY}, 0.2, scene.animation.TWEEN_LINEAR).then( function() { 
        // New promise should be resolved or rejected
        textBox.ready.then(function(o) {
          results.push(assert(!(textBox.ready === textBoxReadySaved), "test_textBoxAnimatePos: textBox Promise was old"));
        }, function rejection(o) {
          results.push(assert(false, "test_textBoxAnimatePos: Promise rejection received"));
        }).then( function(obj) {
          textBoxReadySaved = textBox.ready;
          resolve(results);
        });
      });
    });
  },


  test_textBoxSetSamePos: function() {

    return new Promise(function(resolve, reject) {
      var results = []; 
      textBox.x = originalX;
      textBox.y = originalY;
      // No new promise should be created
      textBox.ready.then(function(o) {
        results.push(assert((textBox.ready === textBoxReadySaved), "test_textBoxSetSamePos: new textBox Promise was created"));
      }, function rejection(o) {
        results.push(assert(false, "test_textBoxSetSamePos: Promise rejection received"));
      }).then( function(obj) {
        textBoxReadySaved = textBox.ready;
        resolve(results);
      });
    });
  },  

  test_textBoxReset: function() {

    return new Promise(function(resolve, reject) {
      var results = []; 
      textBox.h = 50;
      textBox.w = 200;
      textBox.wordWrap = true;
      textBox.truncation = 0;
      textBox.clip = false;
      textBox.alignVertical = 0;
      textBox.alignHorizontal = 0;
      textBox.xStartPos = 0;
      textBox.xStopPos = 0;
      textBox.sx = 1.0;
      textBox.sy = 1.0;
      // New promise should be resolved or rejected
      textBox.ready.then(function(o) {
        results.push(assert(!(textBox.ready === textBoxReadySaved), "test_textBoxReset: textBox Promise was old"));
      }, function rejection(o) {
        results.push(assert(false, "test_textBoxReset: Promise rejection received"));
      }).then( function(obj) {
        textBoxReadySaved = textBox.ready;
        resolve(results);
      });
    });
  },
}
module.exports.beforeStart = beforeStart;
module.exports.tests = tests;

if(manualTest === true) {

  manual.runTestsManually(tests, beforeStart);

}

}).catch( function importFailed(err){
  console.error("Import failed for test_promiseNewCreationTextBox_xy.js: " + err)
});
