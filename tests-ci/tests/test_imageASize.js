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
  
  var imageUrl = "http://sparkui.org/examples/gallery/images/apng/elephant.png";

  var testCapability = function() {
    if (scene.capabilities.graphics.imageAResource != undefined && scene.capabilities.graphics.imageAResource > 1)
      return true;
    else 
     return false;
  }
  
  var beforeStart = function() {
    // Nothing to do here...
    console.log("test_imageASize beforeStart.....");
    var promise = new Promise(function(resolve,reject) {
      resolve(assert(true,"beforeStart succeeded"));
    });
    return promise;
  }

  var tests = {

    testImageAResource_wAndh: function() {
    console.log("Running testImageAResource_wAndh");
      return new Promise(function(resolve, reject) {

        var results = [];

        var imageA = scene.create({t:"imageA",url:imageUrl,parent:root});


        Promise.all([imageA.ready]).then(function(obj) {
          if( testCapability()) {
            imageA.ready.then(function () {
                results.push(assert(imageA.resource.w > 0 && imageA.resource.h > 0, "imageAResource w or h was not populated"));
              })
            }
            else {  
                console.log("imageAResource fix is not in this version!");
                results.push(assert(true, "imageAResource fix "));
            }

        }, function rejection() {
          results.push(assert(false, "imageAResource failed : "+exception));      
        }).then(function() {
          resolve(results);
        });

      });
    },
    
    testImageA_wAndh: function() {
      console.log("Running testImageA_wAndh");
        return new Promise(function(resolve, reject) {
  
          var results = [];
  
          var imageA = scene.create({t:"imageA",url:imageUrl,parent:root, w:50, h: 50,
                                      stretchX: scene.stretch.STRETCH, stretchY: scene.stretch.STRETCH});
  
  
          Promise.all([imageA.ready]).then(function(obj) {
            if( testCapability()) {
              imageA.ready.then(function () {
                  results.push(assert(imageA.w == 50 && imageA.h == 50, "imageA w or h was not populated"));
                })
              }
              else {  
                  console.log("imageAResource fix is not in this version!");
                  results.push(assert(true, "imageAResource fix "));
              }
  
          }, function rejection() {
            results.push(assert(false, "imageAResource failed : "+exception));      
          }).then(function() {
            resolve(results);
          });
  
        });
      } 
  }
  
  module.exports.tests = tests;
  module.exports.beforeStart = beforeStart;
  
  if(manualTest === true) {
  
    manual.runTestsManually(tests, beforeStart);
  
  }

}).catch(function (e) {
  console.error("Import failed for test_imageASize.js: " + e);
});