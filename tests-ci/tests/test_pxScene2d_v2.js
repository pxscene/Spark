"use strict";
px.import({scene:"px:scene.1.js",
           assert:"../test-run/assert.js",
           manual:"../test-run/tools_manualTests.js"}).then( function ready(imports) {

var scene = imports.scene;
var root = imports.scene.root;
var assert = imports.assert.assert;
var manual = imports.manual;

root.w = 800;
root.h = 300;

var basePackageUri = px.getPackageBaseFilePath();

var manualTest = manual.getManualTestValue();

module.exports.beforeStart = function() {
  console.log("test_pxScene2d beforeStart()!");
  var promise = new Promise(function(resolve,reject) {
    resolve("beforeStart");
  });
  return promise;
}

var tests = {
  test1: function() {
  return new Promise(function(resolve, reject) {
   var url = basePackageUri+"/helpers/test_simpleApiChild.js";
   var sceneChild = scene.create({t:'scene',parent:root,url:url,id:"1",cx:0,cy:0,rx:0,ry:0,rz:0,painting:true,mask:false,draw:true,focus:false,interactive:false,hitTest:false,w:100,h:100});
   sceneChild.on("hello",function() {});
   sceneChild.delListener("hello",function() {});
   sceneChild.ready.then(function()  {
        console.log("test1: scene child is ready");
        var results = [];
        results.push(assert(sceneChild.id === "1","id not properly set for scene"));
        results.push(assert(sceneChild.interactive === false,"interactive not coming proper for scene"));
        results.push(assert(sceneChild.cx === 0,"cx not coming proper for scene"));
        results.push(assert(sceneChild.cy === 0,"cy not coming proper for scene"));
        results.push(assert(sceneChild.rx === 0,"rx not coming proper for scene"));
        results.push(assert(sceneChild.ry === 0,"ry not coming proper for scene"));
        results.push(assert(sceneChild.rz === 0,"rz not coming proper for scene"));
        results.push(assert(sceneChild.painting === true,"painting not coming proper for scene"));
        results.push(assert(sceneChild.mask === false,"mask not coming proper for scene"));
        results.push(assert(sceneChild.draw === true,"draw not coming proper for scene"));
        results.push(assert(sceneChild.hitTest === false,"hitTest not coming proper for scene"));
        results.push(assert(sceneChild.focus === false,"focus not coming proper for scene"));
        results.push(assert(sceneChild.url === url,"url not coming proper for scene"));
        results.push(assert(sceneChild.w === 100,"width not coming proper for scene"));
        results.push(assert(sceneChild.h === 100,"height not coming proper for scene"));
        resolve(results);
      });
    });
  },

  test2: function() {
  return new Promise(function(resolve, reject) {
        console.log("test2: testing innerscene");
        var results = [];
        var ctx = null;
        var focus =  false;
        scene.ctx = "context";
        scene.focus = false;
        var focusGet = scene.getFocus();
        results.push(assert(scene.focus === false,"main scene focus not proper"));
        results.push(assert(scene.ctx === "context","main scene context not proper"));
        resolve(results);
      });
  },


  test3: function() {
  return new Promise(function(resolve, reject) {
        console.log("test3: testing scene childrens");
        var results = [];
        var url = basePackageUri+"/helpers/test_simpleApiChild.js";
        var sceneChild = scene.create({t:'scene',parent:root,url:url});
        url = "https://www.sparkui.org/examples/gallery/images/ball.png";
        var ball = scene.create({t:"image",url:url,parent:sceneChild});
        ball.ready.then(function() {
          var childrens = sceneChild.children;
          results.push(assert(childrens !== null,"scene chilrens are not proper"));
          resolve(results);
        }, function(obj) {
          console.log("REJECTION in test3");
          results.push(assert(false,"test3 received rejection: "+obj));
          resolve(results);
        });
    });
  },

  test4: function() {
    return new Promise(function(resolve, reject) {
    var results = [];
    var image9 = scene.create({t:"image9",parent:root, url:"https://www.sparkui.org/examples/gallery/images/dolphin.jpg"});
    image9.ready.then(function()  {
      console.log("test4: image9 ready");
      results.push(assert(image9.url=="https://www.sparkui.org/examples/gallery/images/dolphin.jpg","url is not proper"));
      resolve(results);
    }, function(obj) { 
      console.log("test4: REJECTION!");
      results.push(assert(false,"https://www.sparkui.org/examples/gallery/images/dolphin.jpg failed to load!"));
      resolve(results);
    });
  });
  },

  test5: function() {
    return new Promise(function(resolve, reject) {
      var ext = scene.create({t:"external",parent:root});
      var results = [];
      results.push(assert(null !== ext,"externals not created"));
      resolve(results);
  });
  },
/*
  test6: function() {
    return new Promise(function(resolve, reject) {
      var ext = scene.create({t:"unknown",parent:root});
      var results = [];
      results.push(assert(null === ext,"unknown component not created"));
      resolve(results);
  });
  },
*/
  test8: function() {
    return new Promise(function(resolve, reject) {
      scene.logDebugMetrics();
      var results = [];
      results.push("SUCCESS");
      resolve(results);
  });
  },

  test9: function() {
    return new Promise(function(resolve, reject) {
      scene.showOutlines = false;
      scene.showDirtyRect = false;
      var screenshot = scene.screenshot("image/png;base64");
      //scene.clipboardSet("a","A");
      //var clipSet = scene.clipboardGet("a");
      //console.log("clip set is " + clipSet);
      var results = [];
      results.push(assert(null !== scene.clock(),"clock of inner scene not null"));
      results.push(assert(false === scene.showOutlines,"show outlines of inner scene not proper"));
      results.push(assert(false === scene.showDirtyRect,"show dirty rect of inner scene not proper"));
      results.push(assert(null !== screenshot,"screenshot of inner scene not proper"));
     // results.push(assert(clipSet === "A","clipboard of inner scene not proper"));
      resolve(results);
  });
  },

  test10: function() {
    return new Promise(function(resolve, reject) {
        console.log("test10: testing c property");
        var results = [];
        var url = "https://www.sparkui.org/examples/gallery/images/ball.png";
        var ball = scene.create({t:"image",url:url, c:[{t:"rect"}]});
        ball.ready.then(function() {
          results.push(assert(ball !== null,"ball is created"));
          resolve(results);
        },function(obj) {
          console.log("REJECTION from test10");
          results.push(assert(false,"ball is rejected: "+obj));
          resolve(results);
        
        });
      });
  },

  test11: function() {
    return new Promise(function(resolve, reject) {
      var results = [];
      var url = basePackageUri+"/helpers/test_simpleApiChild.js";
      var ball;
      var sceneChild = scene.create({t:'scene',parent:root,url:url,painting:true,draw:true,focus:true,w:100,h:100});
      sceneChild.ready.then(function()  {
          console.log("test11: scene child is ready");
          url = "https://www.sparkui.org/examples/gallery/images/ball.png";
          ball = scene.create({t:"image",url:url,draw:true,mask:true,parent:sceneChild});
          //ball.ready.then(function() {});
          results.push(assert(sceneChild === ball.parent,"test11 succeeded"));
          resolve(results);
      },function(obj) {
        console.log("REJECTION from test11");
        results.push(assert(false,"Rejection in test11 "+obj));
        resolve(results);
      
      });
    });
  },
  
  testServiceContext: function() {
    return new Promise(function(resolve, reject) {
      var results = [];
      var url = basePackageUri+"/helpers/test_simpleApiChild.js";

      var sceneChild = scene.create({t:'scene',parent:root,url:url,w:100,h:100, serviceContext:{test:"value1",name:"blah"}});
      sceneChild.ready.then(function()  {
          results.push(assert(sceneChild.serviceContext.test == "value1","serviceContext 'test' property is not correct."));
          results.push(assert(sceneChild.serviceContext.name == "blah","serviceContext 'name' property is not correct."));

          sceneChild.serviceContext = {test:"value2",name:"blah2"}
          results.push(assert(sceneChild.serviceContext.test == "value1","serviceContext 'test' property is not correct after attempted SET."));
          results.push(assert(sceneChild.serviceContext.name == "blah","serviceContext 'name' property is not correct after attempted SET."));          
          resolve(results);
      },function(obj) {
        console.log("REJECTION from test11");
        results.push(assert(false,"Rejection in test11 "+obj));
        resolve(results);
      
      });
    });

  }
}

module.exports.tests = tests;

if(manualTest === true) {
  
    manual.runTestsManually(tests);
  
}

}).catch( function importFailed(err){
  console.log("err: "+err);
  console.error("Import for test_pxScene2d.js failed: " + err)
});
