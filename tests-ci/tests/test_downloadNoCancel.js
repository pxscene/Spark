"use strict";
/** This test is for testing the issue with double downloading image resources. 
 * Fixes were done in pxCore in 
 * - https://github.com/pxscene/pxCore/pull/1750
 * - https://github.com/pxscene/pxCore/pull/1758
 * 
 * Before running this test, clear the Spark cache. Run this test with Spark
 * logging at INFO level.  After running test, verify that each of the urls
 * defined below only show up in the log as being downloaded once.  Do this  
 * by checking for a log line like the following for each of the 9 URLs used 
 * in these tests:
 * 
 * rt: INFO rtFileDownloader.cpp:995 -- Thread-11515991: download stats - connect time: 169 ms, ssl time: 189 ms, total time: 426 ms, download speed: 24440 bytes/sec, url: https://www.sparkui.org/tests-ci/tests/images/001.jpg
 * 
 * If any URL appears more than one in an rtFileDownloader.cpp log line with download stats, etc., 
 * then consider this test to have failed.
 */

px.import({scene:"px:scene.1.js",
           assert:"../test-run/assert.js",
           manual:"../test-run/tools_manualTests.js"}).then( function ready(imports) {

var scene = imports.scene;
var root = scene.root;
var assert = imports.assert.assert;
var manual = imports.manual;

var manualTest = manual.getManualTestValue();

var goodImageUrl1= "https://www.sparkui.org/tests-ci/tests/images/001.jpg";
var goodImageUrl2 = "https://www.sparkui.org/tests-ci/tests/images/002.jpg";
var goodImageUrl3 = "https://www.sparkui.org/tests-ci/tests/images/003.jpg";
var goodFontUrl1 = "https://www.sparkui.org/examples/fonts/Pacifico.ttf";
var goodFontUrl2 = "https://www.sparkui.org/examples/fonts/IndieFlower.ttf";
var goodFontUrl3 = "https://www.sparkui.org/examples/fonts/DejaVuSans.ttf";
var goodImage9Url1= "https://www.sparkui.org/tests-ci/tests/images/004.jpg";
var goodImage9Url2 = "https://www.sparkui.org/tests-ci/tests/images/008.jpg";
var goodImage9Url3 = "https://www.sparkui.org/tests-ci/tests/images/ball.png";



var tests = {

  testImageNoCancel: function() {

    return new Promise(function(resolve, reject) {
      var results = []; 


      var imageRes = scene.create({t:"imageResource",url:goodImageUrl1});
      var resStatus = imageRes.loadStatus;
      var resReady = imageRes.ready;
      console.log("resStatus = "+JSON.stringify(resStatus));

      resReady.then(function() { console.log("resource ready was resolved"); },
                    function() { console.log("resource ready was rejected");});

      var image = scene.create({t:"image",parent:root, x:0,y:100, resource:imageRes});
      var imageStatus = image.resource.loadStatus;
      var imageReady = image.ready;

      imageReady.then( 
        function() { 
          console.log("image ready was resolved");
        
            // test that resource promise is the same as resReady
            results.push(assert(image.resource == imageRes, "image resource and imageRes are not the same!"));
            results.push(assert( resReady == imageRes.ready, "New resource promise was created because of cancel!"));
        },
        function() 
        {
          console.log("image ready was rejected");
          results.push(assert( false, "image promise was rejected"));
        }).then( function(obj) {
          resolve(results);
        });

    });
  },
  testImageNoCancelUseURLAndReverse: function() {

    return new Promise(function(resolve, reject) {
      var results = []; 

      var image = scene.create({t:"image",parent:root, x:0,y:100, url:goodImageUrl2});
      var imageStatus = image.resource.loadStatus;
      var imageReady = image.ready;


      var imageRes = scene.create({t:"imageResource",url:goodImageUrl2});
      var resStatus = imageRes.loadStatus;
      var resReady = imageRes.ready;

      resReady.then(function() { console.log("resource ready was resolved"); },
                    function() { console.log("resource ready was rejected");});



      imageReady.then( 
        function() { 
          console.log("image ready was resolved");
            // test that resource promise is the same as resReady
            results.push(assert(image.resource == imageRes, "image resource and imageRes are not the same!"));
            results.push(assert( resReady == imageRes.ready, "New resource promise was created because of cancel!"));
        },
        function() 
        {
          console.log("image ready was rejected");
          results.push(assert( false, "image promise was rejected"));
        }).then( function(obj) {
          resolve(results);
        });

    });
  },
  testImageNoCancelWaitForRes: function() {

    return new Promise(function(resolve, reject) {
      var results = []; 

      var imageRes = scene.create({t:"imageResource",url:goodImageUrl3});
      var resStatus = imageRes.loadStatus;
      var resReady = imageRes.ready;

      resReady.then(
        function() { 
          console.log("resource ready was resolved"); 

          var image = scene.create({t:"image",parent:root, x:0,y:100, resource:imageRes});
          var imageStatus = image.resource.loadStatus;
          var imageReady = image.ready;
    
          imageReady.then( 
            function() { 
              console.log("image ready was resolved");
                // test that resource promise is the same as resReady
                results.push(assert(image.resource == imageRes, "image resource and imageRes are not the same!"));
                results.push(assert( resReady == imageRes.ready, "New resource promise was created because of new request!"));
                results.push(assert( image.resource.ready == imageRes.ready, "New resource promise was created because of new request!"));
            },
            function() 
            {
              console.log("image ready was rejected");
              results.push(assert( false, "image promise was rejected"));
            }).then( function(obj) {
              resolve(results);
            });

        },
        function() { 
          console.log("resource ready was rejected");
          results.push(assert( false, "resource promise was rejected"));
        })

    });
  },
  testFontNoCancel: function() {

    return new Promise(function(resolve, reject) {
      var results = []; 


      var fontRes = scene.create({t:"fontResource",url:goodFontUrl1});
      var resStatus = fontRes.loadStatus;
      var resReady = fontRes.ready;

      resReady.then(function() { console.log("font resource ready was resolved"); },
                    function() { console.log("font resource ready was rejected");});

      var text = scene.create({t:"text",parent:root, x:0,y:100, font:fontRes});
      var textStatus = text.font.loadStatus;
      var textReady = text.ready;
              
              

      textReady.then( 
        function() { 
          console.log("text ready was resolved");
            // test that resource promise is the same as resReady
            results.push(assert(text.font == fontRes, "font resource and fontRes are not the same!"));
            results.push(assert( resReady == fontRes.ready, "New resource promise was created because of cancel!"));
        },
        function() 
        {
          console.log("text ready was rejected");
          results.push(assert( false, "text promise was rejected"));
        }).then( function(obj) {
          resolve(results);
        });

    });
  },
  testFontNoCancelUseURLAndReverse: function() {

    return new Promise(function(resolve, reject) {
      var results = []; 

      var text = scene.create({t:"text",parent:root, x:0,y:100, fontUrl:goodFontUrl2});
      var textStatus = text.font.loadStatus;
      var textReady = text.ready;


      var fontRes = scene.create({t:"fontResource",url:goodFontUrl2});
      var resStatus = fontRes.loadStatus;
      var resReady = fontRes.ready;

      resReady.then(function() { console.log("resource ready was resolved"); },
                    function() { console.log("resource ready was rejected");});



      textReady.then( 
        function() { 
          console.log("text ready was resolved");
            // test that resource promise is the same as resReady
            results.push(assert(text.font == fontRes, "font resource and fontRes are not the same!"));
            results.push(assert( resReady == fontRes.ready, "New resource promise was created because of cancel!"));
        },
        function() 
        {
          console.log("text ready was rejected");
          results.push(assert( false, "text promise was rejected"));
        }).then( function(obj) {
          resolve(results);
        });

    });
  },
  testFontNoCancelWaitForRes: function() {

    return new Promise(function(resolve, reject) {
      var results = []; 

      var fontRes = scene.create({t:"fontResource",url:goodFontUrl3});
      var resStatus = fontRes.loadStatus;
      var resReady = fontRes.ready;


      resReady.then(
        function() { 
          console.log("resource ready was resolved"); 

          var text = scene.create({t:"text",parent:root, x:0,y:100, font:fontRes});
          var textStatus = text.font.loadStatus;
          var textReady = text.ready;
    
    
          textReady.then( 
            function() { 
              console.log("text ready was resolved");
                // test that resource promise is the same as resReady
                results.push(assert(text.font == fontRes, "image resource and imageRes are not the same!"));
                results.push(assert( resReady == fontRes.ready, "New resource promise was created because of new request!"));
                results.push(assert( text.font.ready == fontRes.ready, "New resource promise was created because of new request!"));
            },
            function() 
            {
              console.log("text ready was rejected");
              results.push(assert( false, "text promise was rejected"));
            }).then( function(obj) {
              resolve(results);
            });

        },
        function() { 
          console.log("resource promise was rejected");
          results.push(assert( false, "resource promise was rejected"));

        });


    });
  },

  testImage9NoCancel: function() {

    return new Promise(function(resolve, reject) {
      var results = []; 


      var imageRes = scene.create({t:"imageResource",url:goodImage9Url1});
      var resStatus = imageRes.loadStatus;
      var resReady = imageRes.ready;
      console.log("resStatus = "+JSON.stringify(resStatus));

      resReady.then(function() { console.log("resource ready was resolved"); },
                    function() { console.log("resource ready was rejected");});

      var image = scene.create({t:"image9",parent:root, x:0,y:100, resource:imageRes});
      var imageStatus = image.resource.loadStatus;
      var imageReady = image.ready;

      imageReady.then( 
        function() { 
          console.log("image ready was resolved");
        
            // test that resource promise is the same as resReady
            results.push(assert(image.resource == imageRes, "image resource and imageRes are not the same!"));
            results.push(assert( resReady == imageRes.ready, "New resource promise was created because of cancel!"));
        },
        function() 
        {
          console.log("image ready was rejected");
          results.push(assert( false, "image promise was rejected"));
        }).then( function(obj) {
          resolve(results);
        });

    });
  },
  testImage9NoCancelUseURLAndReverse: function() {

    return new Promise(function(resolve, reject) {
      var results = []; 

      var image = scene.create({t:"image9",parent:root, x:0,y:100, url:goodImage9Url2});
      var imageStatus = image.resource.loadStatus;
      var imageReady = image.ready;


      var imageRes = scene.create({t:"imageResource",url:goodImage9Url2});
      var resStatus = imageRes.loadStatus;
      var resReady = imageRes.ready;

      resReady.then(function() { console.log("resource ready was resolved"); },
                    function() { console.log("resource ready was rejected");});



      imageReady.then( 
        function() { 
          console.log("image ready was resolved");
            // test that resource promise is the same as resReady
            results.push(assert(image.resource == imageRes, "image resource and imageRes are not the same!"));
            results.push(assert( resReady == imageRes.ready, "New resource promise was created because of cancel!"));
        },
        function() 
        {
          console.log("image ready was rejected");
          results.push(assert( false, "image promise was rejected"));
        }).then( function(obj) {
          resolve(results);
        });

    });
  },
  testImage9NoCancelWaitForRes: function() {

    return new Promise(function(resolve, reject) {
      var results = []; 

      var imageRes = scene.create({t:"imageResource",url:goodImage9Url3});
      var resStatus = imageRes.loadStatus;
      var resReady = imageRes.ready;

      resReady.then(
        function() { 
          console.log("resource ready was resolved"); 

          var image = scene.create({t:"image9",parent:root, x:0,y:100, resource:imageRes});
          var imageStatus = image.resource.loadStatus;
          var imageReady = image.ready;
    
          imageReady.then( 
            function() { 
              console.log("image ready was resolved");
                // test that resource promise is the same as resReady
                results.push(assert(image.resource == imageRes, "image resource and imageRes are not the same!"));
                results.push(assert( resReady == imageRes.ready, "New resource promise was created because of new request!"));
                results.push(assert( image.resource.ready == imageRes.ready, "New resource promise was created because of new request!"));
            },
            function() 
            {
              console.log("image ready was rejected");
              results.push(assert( false, "image promise was rejected"));
            }).then( function(obj) {
              resolve(results);
            });

        },
        function() { 
          console.log("resource ready was rejected");
          results.push(assert( false, "resource promise was rejected"));
        })

    });
  },
} 

module.exports.tests = tests;

if(manualTest === true) {

  manual.runTestsManually(tests);

}

}).catch( function importFailed(err){
  console.error("Import failed for test_downloadNoCancel.js: " + err)
});
