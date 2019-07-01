"use strict";
px.import({scene:"px:scene.1.js",
           assert:"../test-run/assert.js",
           shots:"../test-run/tools_screenshot.js",
           manual:"../test-run/tools_manualTests.js"}).then( function ready(imports) {

var scene  = imports.scene;
var root   = imports.scene.root;
var assert = imports.assert.assert;
var manual = imports.manual;
var shots = imports.shots;

var basePackageUri = px.getPackageBaseFilePath();

var doScreenshot = shots.getScreenshotEnabledValue();
var manualTest = manual.getManualTestValue();

var beforeStart = function() {
  // Nothing to do here...
  console.log("test_pxScreenshot start.....");
  var promise = new Promise(function(resolve,reject) {
    resolve("beforeStart");
  });
  return promise;
}

var doScreenshotComparison = function(name, resolve, reject) 
{
  testText.text="ScreenShot"+name;
    var results = rectMeasurementResults();
    shots.validateScreenshot(basePackageUri+"/images/screenshot_results/"+testPlatform+"/test_pxScreenshot"+name+".png", false).then(function(match){
        console.log("test result is match: "+match);
        results.push(assert(match == true, "screenshot comparison for "+name+" failed\n"+basePackageUri+"/images/screenshot_results/test_pxScreenshot_"+name+".png"));
        resolve(results);
     // });
    }).catch(function(err) {
        results.push(assert(false, "screenshot comparison for "+name+" failed due to error: "+err));
        resolve(results);
    });
}

var tests = {

  testScreenShot: function() {
    return new Promise(function(resolve, reject) {
      var results = [];
      var url = basePackageUri + "/helpers/test_rect.js";
      var stage = scene.create({ t: 'scene', parent: root, x:0, y:0, w: scene.w, h: scene.h, sx: 1, sy: 1, url: url, interactive: false, clip: true, stretchX: 1, stretchY: 1 });
      stage.ready.then( function(obj) {
          if(doScreenshot) 
          {
            setTimeout( function() {
              doScreenshotComparison("test1", resolve)
            }, timeoutForScreenshot);
          } 
          else 
          {
            var base64String = stage.screenshot("image/png;base64");
            var expected64String="data:image/png;base64";
            console.log("test_pxScreenshot:"+base64String);
            var isValid = ( base64String.indexOf(expected64String) == 0)
            console.log(assert(isValid,"screen shot base64String!=expected64String"));
          
            results.push(assert(isValid,"screen shot base64String!=expected64String"));
          }
      }, function failure() {
        console.log(assert(false,"test_pxScreenshot:testScreenShot failed!"));
        results.push(assert(false,"test_pxScreenshot:testScreenShot failed!"));
      }).then(function(error) {
        console.log(assert(false,"test_pxScreenshot:testScreenShot failed!"));
        resolve(results);
      });
    });
  }/*,
  testPngScreenShot: function() {
    return new Promise(function(resolve, reject) {
      var results = [];
      var url = basePackageUri + "/images/ball.png";
      var stage = scene.create({ t: 'scene', parent: root, x:0, y:0, url: url});
      stage.ready.then( function(obj) {
        px.getFile(url).then(function(data) { 
          var expected64String =(new Buffer(data)).toString('base64'); 
          
          console.log("*********************************expected64String*********************************\n"+expected64String);
          var base64String = stage.screenshot("image/png;base64");
          base64String = base64String.slice(base64String.indexOf(',')+1);

          console.log("*********************************base64String*********************************\n"+base64String);
          var isValid = (base64String==expected64String);
          console.log(assert(isValid,"screen shot base64String!=expected64String"));
          results.push(assert(isValid,"screen shot base64String!=expected64String"));
        }, function failure() {
          console.log(assert(false,"test_pxScreenshot:testPngScreenShot failed!"));
          results.push(assert(false,"test_pxScreenshot:testPngScreenShot failed!"));
        });
      }, function failure() {
        console.log(assert(false,"test_pxScreenshot:testPngScreenShot failed!"));
        results.push(assert(false,"test_pxScreenshot:testPngScreenShot failed!"));
      }).then(function(error) {
        console.log(assert(false,"test_pxScreenshot:testPngScreenShot failed!"));
        resolve(results);
      });
    });
  },
  testScreenShotPng: function() {
    return new Promise(function(resolve, reject) {
      var results = [];
      var url = basePackageUri + "/images/ball.png";
      var img = scene.create({t:"imageA", parent:root, url:url });
      var stage = scene.create({ t: 'scene', parent: root, x:0, y:0, w: img.w, h: img.h, sx: 1, sy: 1, url: url, interactive: false, clip: true, stretchX: 1, stretchY: 1});
      stage.ready.then( function(obj) {
        shots.validateScreenshot(url, false).then(function(isValid){
          console.log(assert(isValid,"screen shot base64String!=expected64String"));
          results.push(assert(isValid,"screen shot base64String!=expected64String"));
      }).catch(function(err) {
          results.push(assert(false, "screenshot comparison for "+name+" failed due to error: "+err));
          resolve(results);
      });

      }, function failure() {
        console.log(assert(false,"test_pxScreenshot:testPngScreenShot failed!"));
        results.push(assert(false,"test_pxScreenshot:testPngScreenShot failed!"));
      }).then(function(error) {
        console.log(assert(false,"test_pxScreenshot:testPngScreenShot failed!"));
        resolve(results);
      });
    });
  }*/

}//tests
module.exports.tests = tests;
module.exports.beforeStart = beforeStart;

if(manualTest === true) {

  manual.runTestsManually(tests, beforeStart);

}

}).catch( function importFailed(err){
  console.error("Import for test_pxScreenshot.js failed: " + err)
});
