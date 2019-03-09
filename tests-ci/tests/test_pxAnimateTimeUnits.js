"use strict";
px.import({scene:"px:scene.1.js",
           assert:"../test-run/assert.js",
           manual:"../test-run/tools_manualTests.js"}).then( function ready(imports) {

var scene = imports.scene;
var root = imports.scene.root;
var assert = imports.assert.assert;
var manual = imports.manual;

var manualTest = manual.getManualTestValue();

root.w = 800;
root.h = 300;

var tolerance = Number.EPSILON;
//var tolerance = 105; // ms
//function getTime() { return (new Date()).getTime(); };
// function getTime() { return scene.clock(); };


var base = px.getPackageBaseFilePath();

// var url  = "https://px-apps.sys.comcast.net/pxscene-samples/examples/px-reference/tests/images/ball.png";
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

/*
    ////////////////////////////////////////

    test6: function() {
      return new Promise(function(resolve, reject) {
        var results = [];
        var ball = scene.create({t:"image", url: url, x: 0, parent: root});
        ball.ready.then( function(o)
        {
          var start_ms   = scene.clock();  // START TIMER

          var animateX = ball.animateTo({x:450}, 5.0, scene.animation.TWEEN_LINEAR,scene.animation.OPTION_FASTFORWARD, 1);
          animateX.then( function(o)
          {
            var end_ms     = scene.clock();
            var elapsed_ms = (end_ms - start_ms); // END TIMER
            var delta_ms   = (elapsed_ms - 5000.0);

            console.log("// END animation -   start_ms: " + start_ms + " - end_ms: " + end_ms);
            console.log("// END animation - elapsed_ms: " + elapsed_ms);
            console.log("// END animation -   delta_ms: " + delta_ms + " (expected: 0 ms )");

            results.push(assert( Math.abs(elapsed_ms - 5000) < tolerance) ,"animationTo() duration not proper");
            resolve(results);
          });

        },
        function(o) // reject
        {
          results.push(assert(false,"animation promise rejection was unexpected!"));
        })
      });
    }

    test7: function() {
      return new Promise(function(resolve, reject) {
        var results = [];
        var ball = scene.create({t:"image", url: url, x: 0, parent: root});
        ball.x = 0;
        ball.ready.then(function() {});
        var animateX = ball.animateTo({x:450}, "5.0s", scene.animation.TWEEN_LINEAR,scene.animation.OPTION_FASTFORWARD, 1);
        //animateX.done.then(function(o) {}, function(o) { });
        results.push(assert(animateX.provduration === 5.0,"animation prov duration not proper"));
        resolve(results);
      });
      },

    test8: function() {
      return new Promise(function(resolve, reject) {
        var results = [];
        var ball = scene.create({t:"image", url: url, x: 0, parent: root});
        ball.x = 0;
        ball.ready.then(function() {});
        var animateX = ball.animateTo({x:450}, "5000ms", scene.animation.TWEEN_LINEAR,scene.animation.OPTION_FASTFORWARD, 1);
        //animateX.done.then(function(o) {}, function(o) { });
        results.push(assert(animateX.provduration === 5.0,"animation prov duration not proper (" + animateX.provduration + ")"));
        resolve(results);
      });
      },

    test9: function() {
      return new Promise(function(resolve, reject) {
        var results = [];
        var ball = scene.create({t:"image", url: url, x: 0, parent: root});
        ball.x = 0;
        ball.ready.then(function() {});
        var animateX = ball.animateTo({x:450}, "5000ms", scene.animation.TWEEN_LINEAR,scene.animation.OPTION_FASTFORWARD, 1);
        //animateX.done.then(function(o) {}, function(o) { });
        results.push(assert(animateX.provduration === 5.0,"animation prov duration not proper"));
        resolve(results);
      });
      },

    test10: function() {
      return new Promise(function(resolve, reject) {
        var results = [];
        var ball = scene.create({t:"image", url: url, x: 0, parent: root});
        ball.x = 0;
        ball.ready.then(function() {});
        var animateX = ball.animateTo({x:450}, "FooBar", scene.animation.TWEEN_LINEAR,scene.animation.OPTION_FASTFORWARD, 1);
        //animateX.done.then(function(o) {}, function(o) { });
        results.push(assert(animateX.provduration === 0.0,"animation prov duration not proper"));
        resolve(results);
      });
      },
*/
}

module.exports.tests = tests;

if(manualTest === true) {

  manual.runTestsManually(tests, module.exports.beforeStart);

}

}).catch( function importFailed(err){
  console.log("err: "+err);
  console.error("Import for test_pxResource.js failed: " + err)
});
