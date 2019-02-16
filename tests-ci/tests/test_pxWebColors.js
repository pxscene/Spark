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

module.exports.beforeStart = function() {
  console.log("test_pxWebColors beforeStart()!");
  var promise = new Promise(function(resolve,reject) {
    resolve("beforeStart");
  });
  return promise;
}

function toHex32str(dec)
{
  var s = dec.toString(16);
  while(s.length != 8)
  {
    s = "0" + s;
  }

  return s;
}
function hasCapabilities()
{
  if( scene.capabilities                    == undefined ||
      scene.capabilities.graphics           == undefined ||
      scene.capabilities.graphics.cssColors == undefined)
  {
    return false; // "Oh NO ... cssColors is not supported in this build."
  }
  return true;
}

var tests = {

  // 0xRRGGBBAA  values
  test1: function(){
    if(hasCapabilities() == false)
    {
      return Promise.resolve(["test1 - SKIPPED ...  cssColors is not supported in this build."]);
    }

  return new Promise(function(resolve, reject) {

    var rect = scene.create({t:"rect", parent: root, w: 100, h: 50, x: 100, y: 100, lineWidth: 2, fillColor: 0xFF0000ff, lineColor: 0x00FF00ff });
    var results = [];
    rect.ready.then(function()  {
      console.log("test1: rect ready");

      // check value
      results.push(assert(rect.fillColor==0xFF0000ff, "Test1: fillColor >>  0x" + toHex32str( rect.fillColor ) + " (received) != 0xFF0000ff (expected) "));
      results.push(assert(rect.lineColor==0x00FF00ff, "Test1: lineColor >>  0x" + toHex32str( rect.lineColor ) + " (received) != 0x00FF00ff (expected) "));
      resolve(results);
      }, function(o){
        console.log("test1: rect rejection");
        results.push(assert(false,"rect promise rejection was unexpected!"));
        reject(results);
      });
    });
  },

  // #RGB  values
  test2: function() {
    if(hasCapabilities() == false)
    {
      return Promise.resolve(["test2 - SKIPPED ...  cssColors is not supported in this build."]);
    }

  return new Promise(function(resolve, reject) {
    var rect = scene.create({t:"rect", parent: root, w: 100, h: 50, x: 100, y: 100, lineWidth: 2, fillColor: "#f00", lineColor: "#0f0" });
    var results = [];
    rect.ready.then(function()  {
        console.log("test2: rect ready");

        // check value
        results.push(assert(rect.fillColor==0xFF0000ff, "Test2: fillColor >>  0x" + toHex32str( rect.fillColor ) + " (received) != 0xFF0000ff (expected) "));
        results.push(assert(rect.lineColor==0x00FF00ff, "Test2: lineColor >>  0x" + toHex32str( rect.lineColor ) + " (received) != 0x00FF00ff (expected) "));
        resolve(results);
      }, function(o){
        console.log("test2: rect rejection");
        results.push(assert(false,"rect promise rejection was unexpected!"));
        reject(results);
      });
    });
  },

  // #RRGGBB  values
  test3: function() {
    if(hasCapabilities() == false)
    {
      return Promise.resolve(["test3 - SKIPPED ...  cssColors is not supported in this build."]);
    }

  return new Promise(function(resolve, reject) {
    var rect = scene.create({t:"rect", parent: root, w: 100, h: 50, x: 100, y: 100, lineWidth: 2, fillColor: "#ff0000", lineColor: "#00ff00" });
    var results = [];
    rect.ready.then(function()  {
        console.log("test3: rect ready");

        // check value
        results.push(assert(rect.fillColor==0xFF0000ff, "Test3: fillColor >>  0x" + toHex32str( rect.fillColor ) + " (received) != 0xFF0000ff (expected) "));
        results.push(assert(rect.lineColor==0x00FF00ff, "Test3: lineColor >>  0x" + toHex32str( rect.lineColor ) + " (received) != 0x00FF00ff (expected) "));
        resolve(results);
      }, function(o){
        console.log("test3: rect rejection");
        results.push(assert(false,"rect promise rejection was unexpected!"));
        reject(results);
      });
    });
  },

  // "Named" CSS values
  test4: function() {
    if(hasCapabilities() == false)
    {
      return Promise.resolve(["test4 - SKIPPED ...  cssColors is not supported in this build."]);
    }

  return new Promise(function(resolve, reject) {
    var rect = scene.create({t:"rect", parent: root, w: 100, h: 50, x: 100, y: 100, lineWidth: 2, fillColor: "red", lineColor: "green" });
    var results = [];
    rect.ready.then(function()  {
        console.log("test4: rect ready");

        // check value
        results.push(assert(rect.fillColor==0xFF0000ff, "Test4: fillColor >>  0x" + toHex32str( rect.fillColor ) + " (received) != 0xFF0000ff (expected) "));
        results.push(assert(rect.lineColor==0x008000ff, "Test4: lineColor >>  0x" + toHex32str( rect.lineColor ) + " (received) != 0x00FF00ff (expected) "));
          resolve(results);
      }, function(o){
        console.log("test4: rect rejection");
        results.push(assert(false,"rect promise rejection was unexpected!"));
        reject(results);
      });
    });
  },

  // #RGBA  values
  test5: function() {
  if(hasCapabilities() == false)
  {
    return Promise.resolve(["test5 - SKIPPED ...  cssColors is not supported in this build."]);
  }

  return new Promise(function(resolve, reject) {
    var rect = scene.create({t:"rect", parent: root, w: 100, h: 50, x: 100, y: 100, lineWidth: 2, fillColor: "#f008", lineColor: "#0f08" });
    var results = [];
    rect.ready.then(function()  {
        console.log("test5: rect ready");

        // check value
        results.push(assert(rect.fillColor==0xFF000088, "Test5: fillColor >>  0x" + toHex32str( rect.fillColor ) + " (received) != 0xFF000088 (expected) "));
        results.push(assert(rect.lineColor==0x00FF0088, "Test5: lineColor >>  0x" + toHex32str( rect.lineColor ) + " (received) != 0x00FF0088 (expected) "));
        resolve(results);
      }, function(o){
        console.log("test5: rect rejection");
        results.push(assert(false,"rect promise rejection was unexpected!"));
        reject(results);
      });
    });
  },

  // #RRGGBBAA  values
  test6: function() {

  if(hasCapabilities() == false)
  {
    return Promise.resolve(["test6 - SKIPPED ...  cssColors is not supported in this build."]);
  }
  
  return new Promise(function(resolve, reject) {
    var rect = scene.create({t:"rect", parent: root, w: 100, h: 50, x: 100, y: 100, lineWidth: 2, fillColor: "#ff000080", lineColor: "#00ff0080" });
    var results = [];
    rect.ready.then(function()  {
        console.log("test6: rect ready");

        // check value
        results.push(assert(rect.fillColor==0xFF000080, "Test6: fillColor >>  0x" + toHex32str( rect.fillColor ) + " (received) != 0xFF000080 (expected) "));
        results.push(assert(rect.lineColor==0x00FF0080, "Test6: lineColor >>  0x" + toHex32str( rect.lineColor ) + " (received) != 0x00FF0080 (expected) "));
        resolve(results);
      }, function(o){
        console.log("test6: rect rejection");
        results.push(assert(false,"rect promise rejection was unexpected!"));
        reject(results);
      });
    });
  },

  // pxText - pxText - pxText - pxText - pxText - pxText - pxText - pxText - pxText - pxText - pxText - pxText -
  // pxText - pxText - pxText - pxText - pxText - pxText - pxText - pxText - pxText - pxText - pxText - pxText -

  // #RGB Text color
  test7: function() {
    if(hasCapabilities() == false)
    {
      return Promise.resolve(["test7 - SKIPPED ...  cssColors is not supported in this build."]);
    }

    return new Promise(function(resolve, reject) {
      var txt = scene.create({t:"text", parent: root, pixelSize: 20, x: 100, y: 100, text: "Testing",  textColor: "#00f" });
      var results = [];
      txt.ready.then(function()  {
          console.log("test7: text ready");

          // check value
          results.push(assert(txt.textColor==0x0000FFff, "Test7: textColor >>  0x" + toHex32str( txt.textColor ) + " (received) != 0x0000FFff (expected) "));
          resolve(results);
        }, function(o){
          console.log("test7: text rejection");
          results.push(assert(false,"text promise rejection was unexpected!"));
          reject(results);
        });
      });
    },

  // #RGBA Text color
  test8: function() {
    if(hasCapabilities() == false)
    {
      return Promise.resolve(["test8 - SKIPPED ...  cssColors is not supported in this build."]);
    }
  
    return new Promise(function(resolve, reject) {
      var txt = scene.create({t:"text", parent: root, pixelSize: 20, x: 100, y: 100, text: "Testing",  textColor: "#00f8" });
      var results = [];
      txt.ready.then(function()  {
          console.log("test8: text ready");

          // check value
          results.push(assert(txt.textColor==0x0000FF88, "Test8: textColor >>  0x" + toHex32str( txt.textColor ) + " (received) != 0x0000FF88 (expected) "));
          resolve(results);
        }, function(o){
          console.log("test8: text rejection");
          results.push(assert(false,"text promise rejection was unexpected!"));
          reject(results);
        });
      });
    },

  // #RRGGBBAA Text color
  test9: function() {
    if(hasCapabilities() == false)
    {
      return Promise.resolve(["test9 - SKIPPED ...  cssColors is not supported in this build."]);
    }
  
    return new Promise(function(resolve, reject) {
      var txt = scene.create({t:"text", parent: root, pixelSize: 20, x: 100, y: 100, text: "Testing",  textColor: "#0000ff80" });
      var results = [];
      txt.ready.then(function()  {
          console.log("test9: text ready");

          // check value
          results.push(assert(txt.textColor==0x0000FF80, "Test8: textColor >>  0x" + toHex32str( txt.textColor ) + " (received) != 0x0000FF80 (expected) "));
          resolve(results);
        }, function(o){
          console.log("test9: text rejection");
          results.push(assert(false,"text promise rejection was unexpected!"));
          reject(results);
        });
      });
    },


  // "Named" Text color
  test10: function() {
    if(hasCapabilities() == false)
    {
      return Promise.resolve(["test10 - SKIPPED ...  cssColors is not supported in this build."]);
    }
  
    return new Promise(function(resolve, reject) {
      var txt = scene.create({t:"text", parent: root, pixelSize: 20, x: 100, y: 100, text: "Testing",  textColor: "blue" });
      var results = [];
      txt.ready.then(function()  {
          console.log("test10: text ready");

          // check value
          results.push(assert(txt.textColor==0x0000FFff, "Test10: textColor >>  0x" + toHex32str( txt.textColor ) + " (received) != 0x0000FFff (expected) "));
          resolve(results);
        }, function(o){
          console.log("test10: text rejection");
          results.push(assert(false,"text promise rejection was unexpected!"));
          reject(results);
        });
      });
    },

  // pxTextBox - pxTextBox - pxTextBox - pxTextBox - pxTextBox - pxTextBox - pxTextBox - pxTextBox - pxTextBox -
  // pxTextBox - pxTextBox - pxTextBox - pxTextBox - pxTextBox - pxTextBox - pxTextBox - pxTextBox - pxTextBox -

  // #RGB Text color
  test11: function() {

    if(hasCapabilities() == false)
    {
      return Promise.resolve(["test11 - SKIPPED ...  cssColors is not supported in this build."]);
    }

    return new Promise(function(resolve, reject) {
      var txt = scene.create({t:"textBox", parent: root, pixelSize: 20, x: 300, y: 100, text: "Testing",  textColor: "#00f" });
      var results = [];
      txt.ready.then(function()  {
          console.log("test11: text ready");

          // check value
          results.push(assert(txt.textColor==0x0000FFff, "Test11: textColor >>  0x" + toHex32str( txt.textColor ) + " (received) != 0x0000FFff (expected) "));
          resolve(results);
        }, function(o){
          console.log("test11: text rejection");
          results.push(assert(false,"text promise rejection was unexpected!"));
          reject(results);
        });
      });
    },

  // #RGBA Text color
  test12: function() {
    if(hasCapabilities() == false)
    {
      return Promise.resolve(["test12 - SKIPPED ...  cssColors is not supported in this build."]);
    }

    return new Promise(function(resolve, reject) {
      var txt = scene.create({t:"textBox", parent: root, pixelSize: 20, x: 300, y: 100, text: "Testing",  textColor: "#00f8" });
      var results = [];
      txt.ready.then(function()  {
          console.log("test12: text ready");

          // check value
          results.push(assert(txt.textColor==0x0000FF88, "Test12: textColor >>  0x" + toHex32str( txt.textColor ) + " (received) != 0x0000FF88 (expected) "));
          resolve(results);
        }, function(o){
          console.log("test12: text rejection");
          results.push(assert(false,"text promise rejection was unexpected!"));
          reject(results);
        });
      });
    },

  // #RRGGBBAA Text color
  test13: function() {
    if(hasCapabilities() == false)
    {
      return Promise.resolve(["test13 - SKIPPED ...  cssColors is not supported in this build."]);
    }

    return new Promise(function(resolve, reject) {
      var txt = scene.create({t:"textBox", parent: root, pixelSize: 20, x: 300, y: 100, text: "Testing",  textColor: "#0000ff80" });
      var results = [];
      txt.ready.then(function()  {
          console.log("test13: text ready");

          // check value
          results.push(assert(txt.textColor==0x0000FF80, "Test13: textColor >>  0x" + toHex32str( txt.textColor ) + " (received) != 0x0000FF80 (expected) "));
          resolve(results);
        }, function(o){
          console.log("test13: text rejection");
          results.push(assert(false,"text promise rejection was unexpected!"));
          reject(results);
        });
      });
    },


  // "Named" Text color
  test14: function() {
    if(hasCapabilities() == false)
    {
      return Promise.resolve(["test14 - SKIPPED ...  cssColors is not supported in this build."]);
    }
    return new Promise(function(resolve, reject) {
      var txt = scene.create({t:"textBox", parent: root, pixelSize: 20, x: 300, y: 100, text: "Testing", textColor: "blue" });
      var results = [];
      txt.ready.then(function()  {
          console.log("test14: text ready");

          // check value
          results.push(assert(txt.textColor==0x0000FFff, "Test14: textColor >>  0x" + toHex32str( txt.textColor ) + " (received) != 0x0000FFff (expected) "));
          resolve(results);
        }, function(o){
          console.log("test14: text rejection");
          results.push(assert(false,"text promise rejection was unexpected!"));
          reject(results);
        });
      });
    },
}
module.exports.tests = tests;

if(manualTest === true) {

  manual.runTestsManually(tests, module.exports.beforeStart);
}

}).catch( function importFailed(err){
  console.log("err: "+err);
  console.error("Import for test_pxWebColors.js failed: " + err)
});
