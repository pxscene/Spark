"use strict";
/** 
 * This test ensures that changing x or y values does not create new promise for 
 * text, rect, image, imageA and image9.
 */

px.import({scene:"px:scene.1.js",
           assert:"../test-run/assert.js",
           manual:"../test-run/tools_manualTests.js"}).then( function ready(imports) {

var scene = imports.scene;
var root = scene.root;
var assert = imports.assert.assert;
var manual = imports.manual;

var manualTest = manual.getManualTestValue();

var goodImageUrl = "https://sparkui.org/tests-ci/tests/images/ball.png";

var POSITIONS = 
{ 
  image:   { originalX:0,  originalY:100,  testX:100,  testY:300},
  imageA:  { originalX:0,  originalY:200,  testX:100,  testY:100},
  image9:  { originalX:0,  originalY:300,  testX:100,  testY:200},
  rect:    { originalX:300,  originalY:300,  testX:0,  testY:100},
  text:    { originalX:300,  originalY:400,  testX:0,  testY:500},

}

// Use a bogus url to cause promise rejection
var image = scene.create({t:"image",parent:root, 
                          x:POSITIONS.image.originalX,
                          y:POSITIONS.image.originalY, url:goodImageUrl});

var imageA = scene.create({t:"imageA",parent:root, x:POSITIONS.imageA.originalX,y:POSITIONS.imageA.originalY, url:goodImageUrl});

var image9 = scene.create({t:"image9",parent:root, x:POSITIONS.image9.originalX,y:POSITIONS.image9.originalY, url:goodImageUrl});

var rect = scene.create({t:"rect", parent:root, x:POSITIONS.rect.originalX,y:POSITIONS.rect.originalY, h:50, w:200, fillColor: 0x005454ff});

var text = scene.create({t:"text", parent:root, x:POSITIONS.text.originalX,y:POSITIONS.text.originalY, h:50, w:200, text:"I'm just a text; I'm only a text."});

var imageReadySaved = image.ready;
var imageAReadySaved = imageA.ready;
var image9ReadySaved = image9.ready;
var rectReadySaved = rect.ready;
var textReadySaved = text.ready;

var beforeStart = function() {
  // Ensure rejected promise on first, invalid url 
  // before beginning the rest of the test
  console.log("test_promiseNewCreation_xy start.....");

    return new Promise(function(resolve, reject) {
      var results = []; 
      Promise.all([image.ready, imageA.ready, image9.ready, rect.ready, text.ready]).then( function() {
        results.push(assert((image.ready === imageReadySaved), "image promise is not equal"));
        results.push(assert((imageA.ready === imageAReadySaved), "imageA promise is not equal"));
        results.push(assert((image9.ready === image9ReadySaved), "image9 promise is not equal"));
        results.push(assert((rect.ready === rectReadySaved), "rect promise is not equal"));
        results.push(assert((text.ready === textReadySaved), "text promise is not equal"));

      }, function rejection(o) {
        console.log("Promise.all rejection received");
        results.push(assert(true, "Promise.all received"));
      }).then( function(obj) {
        resolve(results);
      });
    });
 
}

var tests = {

  test_imageSetPos: function() {

    return new Promise(function(resolve, reject) {
      var results = []; 
      image.x = POSITIONS.image.testX;
      image.y = POSITIONS.image.testY;
      // No new promise should be created
      image.ready.then(function(o) {
        results.push(assert((image.ready === imageReadySaved), "test_imageSetPos: New image Promise was created"));
      }, function rejection(o) {
        results.push(assert(false, "test_imageSetPos: Promise rejection received"));
      }).then( function(obj) {
        imageReadySaved = image.ready;
        resolve(results);
      });
    });
  },

  test_imageASetPos: function() {

    return new Promise(function(resolve, reject) {
      var results = []; 
      imageA.x = POSITIONS.imageA.testX;
      imageA.y = POSITIONS.imageA.testY;
      // No new promise should be created
      imageA.ready.then(function(o) {
        results.push(assert((imageA.ready === imageAReadySaved), "test_imageASetPos: New image Promise was created"));
      }, function rejection(o) {
        results.push(assert(false, "test_imageASetPos: Promise rejection received"));
      }).then( function(obj) {
        imageAReadySaved = imageA.ready;
        resolve(results);
      });
    });
  },

  test_image9SetPos: function() {

    return new Promise(function(resolve, reject) {
      var results = []; 
      image9.x = POSITIONS.image9.testX;
      image9.y = POSITIONS.image9.testY;
      // No new promise should be created
      image9.ready.then(function(o) {
        results.push(assert((image9.ready === image9ReadySaved), "test_image9SetPos: New image Promise was created"));
      }, function rejection(o) {
        results.push(assert(false, "test_image9SetPos: Promise rejection received"));
      }).then( function(obj) {
        image9ReadySaved = image9.ready;
        resolve(results);
      });
    });
  },

  test_rectSetPos: function() {

    return new Promise(function(resolve, reject) {
      var results = []; 
      rect.x = POSITIONS.rect.testX;
      rect.y = POSITIONS.rect.testY;
      // No new promise should be created
      rect.ready.then(function(o) {
        results.push(assert((rect.ready === rectReadySaved), "test_rectSetPos: New rect Promise was created"));
      }, function rejection(o) {
        results.push(assert(false, "test_rectSetPos: Promise rejection received"));
      }).then( function(obj) {
        rectReadySaved = rect.ready;
        resolve(results);
      });
    });
  },

  test_textSetPos: function() {

    return new Promise(function(resolve, reject) {
      var results = []; 
      text.x = POSITIONS.text.testX;
      text.y = POSITIONS.text.testY;
      // No new promise should be created
      text.ready.then(function(o) {
        results.push(assert((text.ready === textReadySaved), "test_textSetPos: New text Promise was created"));
      }, function rejection(o) {
        results.push(assert(false, "test_textSetPos: Promise rejection received"));
      }).then( function(obj) {
        textReadySaved = text.ready;
        resolve(results);
      });
    });
  },

  test_imageAnimatePos: function() {

    return new Promise(function(resolve, reject) {
      var results = []; 
      image.animateTo({x:POSITIONS.image.originalX,y:POSITIONS.image.originalY}, 0.2, scene.animation.TWEEN_LINEAR).then( function() { 
        // No new promise should be created
        image.ready.then(function(o) {
          results.push(assert((image.ready === imageReadySaved), "test_imageAnimatePos: New image Promise was created"));
        }, function rejection(o) {
          results.push(assert(false, "test_imageAnimatePos: Promise rejection received"));
        }).then( function(obj) {
          imageReadySaved = image.ready;
          resolve(results);
        });
      });
    });
  },
  test_imageAAnimatePos: function() {

    return new Promise(function(resolve, reject) {
      var results = []; 
      imageA.animateTo({x:POSITIONS.imageA.originalX,y:POSITIONS.imageA.originalY}, 0.2, scene.animation.TWEEN_LINEAR).then( function() { 
        // No new promise should be created
        imageA.ready.then(function(o) {
          results.push(assert((imageA.ready === imageAReadySaved), "test_imageAAnimatePos: New imageA Promise was created"));
        }, function rejection(o) {
          results.push(assert(false, "test_imageAAnimatePos: Promise rejection received"));
        }).then( function(obj) {
          imageAReadySaved = imageA.ready;
          resolve(results);
        });
      });
    });
  },

  test_image9AnimatePos: function() {

    return new Promise(function(resolve, reject) {
      var results = []; 
      image9.animateTo({x:POSITIONS.image9.originalX,y:POSITIONS.image9.originalY}, 0.2, scene.animation.TWEEN_LINEAR).then( function() { 
        // No new promise should be created
        image9.ready.then(function(o) {
          results.push(assert((image9.ready === image9ReadySaved), "test_image9AnimatePos: New image9 Promise was created"));
        }, function rejection(o) {
          results.push(assert(false, "test_image9AnimatePos: Promise rejection received"));
        }).then( function(obj) {
          image9ReadySaved = image9.ready;
          resolve(results);
        });
      });
    });
  },

  test_rectAnimatePos: function() {

    return new Promise(function(resolve, reject) {
      var results = []; 
      rect.animateTo({x:POSITIONS.rect.originalX,y:POSITIONS.rect.originalY}, 0.2, scene.animation.TWEEN_LINEAR).then( function() { 
        // No new promise should be created
        rect.ready.then(function(o) {
          results.push(assert((rect.ready === rectReadySaved), "test_rectAnimatePos: New rect Promise was created"));
        }, function rejection(o) {
          results.push(assert(false, "test_rectAnimatePos: Promise rejection received"));
        }).then( function(obj) {
          rectReadySaved = rect.ready;
          resolve(results);
        });
      });
    });
  },

  test_textAnimatePos: function() {

    return new Promise(function(resolve, reject) {
      var results = []; 
      text.animateTo({x:POSITIONS.text.originalX,y:POSITIONS.text.originalY}, 0.2, scene.animation.TWEEN_LINEAR).then( function() { 
        // No new promise should be created
        text.ready.then(function(o) {
          results.push(assert((text.ready === textReadySaved), "test_textAnimatePos: New rect Promise was created"));
        }, function rejection(o) {
          results.push(assert(false, "test_textAnimatePos: Promise rejection received"));
        }).then( function(obj) {
          textReadySaved = text.ready;
          resolve(results);
        });
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
  console.error("Import failed for test_promiseNewCreation_xy.js: " + err)
});
