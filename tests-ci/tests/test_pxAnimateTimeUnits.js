"use strict";
px.import({scene:"px:scene.1.js",
           assert:"../test-run/assert.js",
           manual:"../test-run/tools_manualTests.js"}).then( function ready(imports) {

var scene  = imports.scene;
var root   = imports.scene.root;
var assert = imports.assert.assert;
var manual = imports.manual;

var manualTest = manual.getManualTestValue();

root.w = 800;
root.h = 300;

var base = px.getPackageBaseFilePath();

var url  = base + "/images/ball.png";
var ball = null;

module.exports.beforeStart = function() {
  console.log("test_pxResource beforeStart()!");
  
  ball = scene.create({t:"image", url: url, x: 0, parent: root});

  var promise = new Promise(function(resolve,reject) {

    ball.ready.then( () =>
    {
      resolve("Ball Ready");
    });

  });
  return promise;
}

var tests = {

  test1: function()
  {
      return new Promise(function(resolve, reject)
      {
        ball.x = 0;
        var animateX = ball.animate({x:450}, 1.45, scene.animation.TWEEN_LINEAR,scene.animation.OPTION_FASTFORWARD, 1);
        animateX.done.then(function(o) 
        {
          var results = [];
          results.push(assert(animateX.provduration === 1.45,"animation prov duration not proper"));
          resolve(results);
        });
      })
    },

    test2: function()
    {
      return new Promise(function(resolve, reject)
      {
        ball.x = 0;
        var animateX = ball.animate({x:450}, "1.45s", scene.animation.TWEEN_LINEAR,scene.animation.OPTION_FASTFORWARD, 1);
        animateX.done.then(function()
        {
          var results = [];
          results.push(assert(animateX.provduration === 1.45,"animation prov duration not proper"));
          resolve(results);
        });
      })
    },

    test3: function()
    {
      return new Promise(function(resolve, reject)
      {
        ball.x = 0;
        var animateX = ball.animate({x:450}, "1450ms", scene.animation.TWEEN_LINEAR,scene.animation.OPTION_FASTFORWARD, 1);
        animateX.done.then(function()
        {
          var results = [];
          results.push(assert(animateX.provduration === 1.45,"animation prov duration not proper"));
          resolve(results);
        });
      })
    },

    test4: function()
    {
      return new Promise(function(resolve, reject)
      {
        ball.x = 0;
        var animateX = ball.animate({x:450}, "1450.0ms", scene.animation.TWEEN_LINEAR,scene.animation.OPTION_FASTFORWARD, 1);
        animateX.done.then(function()
        {
          var results = [];
          results.push(assert(animateX.provduration === 1.45,"animation prov duration not proper"));
          resolve(results);
        });
      })
    },

    test5: function()
    {
      return new Promise(function(resolve, reject)
      {
        ball.x = 0;
        var animateX = ball.animate({x:450}, "FooBar", scene.animation.TWEEN_LINEAR,scene.animation.OPTION_FASTFORWARD, 1);
        animateX.done
        .then(function()
        {
          var results = [];
          results.push(assert(animateX.provduration === 0,"animation prov duration not proper"));
          resolve(results);
        })
        .catch( function (err){

          console.log("err: "+err);

          var results = [];
          results.push(assert(false,"animation prov duration not proper"));
          resolve(results);
        });
      })
    },
}

module.exports.tests = tests;

if(manualTest === true) {

  manual.runTestsManually(tests, module.exports.beforeStart);

}

}).catch( function importFailed(err){
  console.log("err: "+err);
  console.error("Import for test_pxAnimateTimeUnits.js failed: " + err)
});
