"use strict";
px.import({scene:"px:scene.1.js",
           assert:"../test-run/assert.js",
           manual:"../test-run/tools_manualTests.js"}).then( function ready(imports) {

var scene = imports.scene;
var root = imports.scene.root;
var assert = imports.assert.assert;
var manual = imports.manual;
var isGifLoaderEnabled = scene.capabilities.graphics.gif == undefined ? 0 : scene.capabilities.graphics.gif >= 2;

var manualTest = manual.getManualTestValue();

root.w = 800;
root.h = 300;

var basePackageUri = px.getPackageBaseFilePath();


module.exports.beforeStart = function() {
  console.log("test_pxResourceA beforeStart()!");
  var promise = new Promise(function(resolve,reject) {
    resolve("beforeStart");
  });
  return promise;
}

var tests = {
  test1: function() {
      
  if (!isGifLoaderEnabled)
	{   
			console.log(scene.capabilities.graphics.gif == undefined ? "No GIF support in this Spark build!" : "GIF version support is not compatible with this example; example requires at least version 2")
			return new Promise(function(resolve, reject) { resolve(assert(!isGifLoaderEnabled));
		});
	}
	else 
	{
  return new Promise(function(resolve, reject) {
      
   var url = basePackageUri + "/images/Spark_equalizerSVG.gif";
    var imageARes = scene.create({t:"imageAResource",parent:root, url:url});
    var results = []; 
    imageARes.ready.then(function()  {
      console.log("test1: imageARes ready");
    
        // check value 
        var loadStatus = imageARes.loadStatus;
        results.push(assert(loadStatus["statusCode"]==0,"status code is not correct"));
        results.push(assert(loadStatus["sourceType"]=="http","load type is not correct"));
        results.push(assert(imageARes.w != 0 ,"image width is 0"));
        results.push(assert(imageARes.h != 0,"image height is 0"));
        resolve(results);
      }, function(o){
        console.log("test1: imageARes rejection");
        var loadStatus = imageARes.loadStatus;
        results.push(assert(loadStatus["statusCode"]==0,"status code is not correct; code is "+loadStatus["statusCode"]));
        results.push(assert(false,"imageA promise rejection was unexpected!"));
        reject(results);
        });
      });
    }
  },

  test2: function() {
  if (!isGifLoaderEnabled)
	{   
			console.log(scene.capabilities.graphics.gif == undefined ? "No GIF support in this Spark build!" : "GIF version support is not compatible with this example; example requires at least version 2")
			return new Promise(function(resolve, reject) { resolve(assert(!isGifLoaderEnabled));
		});
	}
	else 
	{
    return new Promise(function(resolve, reject) {
      var url = basePackageUri + "/images/Spark_equalizerSVG.gif";
      var imageA = scene.create({t:"imageA",parent:root, url:url});
      var results = [];
      imageA.ready.then(function()  {
        console.log("test2: imageA ready");
        var res = imageA.resource;
        var loadStatus = res.loadStatus;
        // check value 
        results.push(assert(imageA.url=="https://sparkui.org/tests-ci/tests/images/dolphin.jpg","url is not correct"));
        results.push(assert(loadStatus["statusCode"]==0,"status code is not correct"));
        results.push(assert(loadStatus["sourceType"]=="http","load type is not correct"));
        resolve(results);
      }, function(o){
        console.log("test2: imageA rejection");
        var res = imageA.resource;
        var loadStatus = res.loadStatus;
        results.push(assert(loadStatus["statusCode"]==0,"status code is not correct; code is "+loadStatus["statusCode"]));
        results.push(assert(false,"image promise rejection was unexpected!"));
        reject(results);
        });
      });
    }
  },

  test3: function() {
  if (!isGifLoaderEnabled)
	{   
			console.log(scene.capabilities.graphics.gif == undefined ? "No GIF support in this Spark build!" : "GIF version support is not compatible with this example; example requires at least version 2")
			return new Promise(function(resolve, reject) { resolve(assert(!isGifLoaderEnabled));
		});
	}
	else 
	{
    return new Promise(function(resolve, reject) {
      var url = basePackageUri + "/images/Spark_equalizerSVG.gif";
      var imageA = scene.create({t:"imageA",parent:root, url:url});
      var results = [];
      imageA.ready.then(function()  {
        console.log("test3: imageA ready");
        var res = imageA.resource;
        var loadStatus = res.loadStatus;
        // check value 
        results.push(assert(imageA.url==url,"url is not correct"));
        resolve(results);
      }, function(o){
        console.log("test3: imageA rejection");
        var res = imageA.resource;
        var loadStatus = res.loadStatus;
        results.push(assert(loadStatus["statusCode"]==0,"status code is not correct; code is "+loadStatus["statusCode"]));
        results.push(assert(false,"imageA promise rejection was unexpected!"));
        reject(results);
        });
      });
    }
  }
}
module.exports.tests = tests;

if(manualTest === true) {

  manual.runTestsManually(tests, module.exports.beforeStart);

}

}).catch( function importFailed(err){
  console.log("err: "+err);
  console.error("Import for test_pxResourceA.js failed: " + err)
});
