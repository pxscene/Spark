px.import({scene:"px:scene.1.js",
           assert:"../test-run/assert.js",
           shots:"../test-run/tools_screenshot.js",
           manual:"../test-run/tools_manualTests.js"}).then( function ready(imports) {

var scene = imports.scene;
var root = scene.root;
var assert = imports.assert.assert;
var shots = imports.shots;
var manual = imports.manual;
var isDirtyRectsEnabled = scene.dirtyRectanglesEnabled;
var doScreenshot = shots.getScreenshotEnabledValue();
var testPlatform=scene.info.build.os;

var manualTest = manual.getManualTestValue();
var timeoutForScreenshot = 40;

var basePackageUri = px.getPackageBaseFilePath();

// Use fontUrl to load from web
var fontUrlStart = "https://sparkui.org/examples/fonts/";
var IndieFlower = "IndieFlower.ttf";
var fontIndieFlower = scene.create({t:"fontResource",url:fontUrlStart+IndieFlower});
root.w=800;

var bg = scene.create({t:"object", parent:root, x:100, y:100, w:1000, h:1000, clip:false});
//var rect = scene.create({t:"rect", parent:root, x:100, y:100, w:700, h:700, fillColor:0x00000000, lineColor:0xFF00FF77, lineWidth:1, clip:false});
var container = scene.create({t:"object", parent:root, x:100, y:100, w:800, h:600, clip:false});

// Widgets for displaying metrics values 
var height = scene.create({t:"text", parent:root, x:50, y:0, textColor:0xFFDDFFFF, pixelSize:15,clip:false,text:"Height="});
var width = scene.create({t:"text", parent:root, x:50, y:20, textColor:0xFFDDFFFF, pixelSize:15,clip:false,text:"Width="});
var boundsX1 = scene.create({t:"text", parent:root, x:200, y:0, textColor:0xFFDDFFFF, pixelSize:15,clip:false,text:"BoundsX1="});
var boundsY1 = scene.create({t:"text", parent:root, x:200, y:20, textColor:0xFFDDFFFF, pixelSize:15,clip:false,text:"BoundsY1="});
var boundsX2 = scene.create({t:"text", parent:root, x:200, y:40, textColor:0xFFDDFFFF, pixelSize:15,clip:false,text:"BoundsX2="});
var boundsY2 = scene.create({t:"text", parent:root, x:200, y:60, textColor:0xFFDDFFFF, pixelSize:15,clip:false,text:"BoundsY2="});
var drboundsX1 = scene.create({t:"text", parent:root, x:400, y:0, textColor:0xFFDDFFFF, pixelSize:15,clip:false,text:"DrBoundsX1="});
var drboundsY1 = scene.create({t:"text", parent:root, x:400, y:20, textColor:0xFFDDFFFF, pixelSize:15,clip:false,text:"DrBoundsY1="});
var drboundsX2 = scene.create({t:"text", parent:root, x:400, y:40, textColor:0xFFDDFFFF, pixelSize:15,clip:false,text:"DrBoundsX2="});
var drboundsY2 = scene.create({t:"text", parent:root, x:400, y:60, textColor:0xFFDDFFFF, pixelSize:15,clip:false,text:"DrBoundsY2="});
var testText = scene.create({t:"text", parent:root, x:600, y:60, textColor:0xFFDDFFFF, pixelSize:15,clip:false,text:"Test="});


var url = "http://www.sparkui.org/examples/gallery/images/apng/cube.png";

var testrect = scene.create({t:"rect",url:url,parent:container,fillColor:0,x:0, y:100, w:300, h:300,cx:150,cy:150, draw:false});
var testimage = scene.create({ t: "image", url: url, parent: container, stretchX: 1, x:0, y:0, w:300, h:300, draw:false });          
var testimage9 = scene.create({ t: "image9", url: url, parent: container, stretchX: 1, x:0, y:0, w:300, h:300, draw:false });  
var testimageA = scene.create({ t: "imageA", url: url, parent: container, stretchX: 1, x:0, y:0, w:300, h:300, r: 0, draw:false });  
var testTextBox = scene.create({t:"textBox", text:"testingTextBox", pixelSize:20, parent: container, x:0, y:0, font:fontIndieFlower, draw:false});
var testimage9Border = scene.create({ t: "image9Border", url: url, parent: container, stretchX: 1, x:0, y:0, w:300, h:300, draw:false });  
var currObj = testrect;
var metrics = null;
var measurements = null;
var showMeasurements = function() {
    var bounds = measurements.bounds;
    var drbounds = measurements.drbounds;
    var green = 0x00FF0077;
    var blue = 0x0000FF77;
    var red = 0xFF000077;
    var yellow = 0xFFFF0077;
    var orange = 0xFF8C0077;
    var pink = 0xFF00FF77;
    scene.create({t:"rect", fillColor:0x00000000, parent:bg, lineColor:yellow, lineWidth:1, x:bounds.x1, y:bounds.y1, w:bounds.x2 - bounds.x1, h:bounds.y2 - bounds.y1});
    scene.create({t:"rect", fillColor:0x00000000, parent:bg, lineColor:red, lineWidth:1, x:drbounds.x1, y:drbounds.y1, w:drbounds.x2 - drbounds.x1, h:drbounds.y2 - drbounds.y1});
    }


var rectready = function(currObj) {
	console.log("inside rect.ready");
  //console.log("text2.h="+text2.h+" and text2.w="+text2.w);
  var dirtyRect=scene.dirtyRectangle;
  measurements=expectedTextDesc;
  measurements.drbounds=dirtyRect;
  measurements.bounds=dirtyRect;

  measurements.bounds.x1=currObj.x;
  measurements.bounds.y1=currObj.y;
  measurements.bounds.x2=(currObj.w+currObj.x);
  measurements.bounds.y2=(currObj.h+currObj.y);

  console.log("measurements boundsX1="+measurements.bounds.x1);
  console.log("measurements boundsY1="+measurements.bounds.y1);
  console.log("measurements boundsX2="+measurements.bounds.x2);
  console.log("measurements boundsY2="+measurements.bounds.y2);
  height.text="Height="+currObj.h;
  width.text="Width="+currObj.w;
  boundsX1.text="BoundsX1="+measurements.bounds.x1;
  boundsY1.text="BoundsY1="+measurements.bounds.y1;
  boundsX2.text="BoundsX2="+measurements.bounds.x2;
  boundsY2.text="BoundsY2="+measurements.bounds.y2;
  drboundsX1.text="DrBoundsX1="+measurements.drbounds.x1;
  drboundsY1.text="DrBoundsY1="+measurements.drbounds.y1;
  drboundsX2.text="DrBoundsX2="+measurements.drbounds.x2;
  drboundsY2.text="DrBoundsY2="+measurements.drbounds.y2;
  

  showMeasurements();
}

/** HELPER FUNCTIONS FOR CHANGING TEXT2 PROPERTIES **/
var cycleValues = function(v) {
    console.log("v is "+v);
    if( v >= 2) {
      v = 0;
    } else {
      v++;
    }
    console.log("v is now"+v);
    return v;
}

/**********************************************************************/
/**                                                                   */
/**            pxscene tests go in this section                       */
/**                                                                   */
/**********************************************************************/
var expectedTextDesc = [
  ["bounds", "x1"], 
  ["bounds", "y1"], 
  ["bounds", "x2"], 
  ["bounds", "y2"],
  ["drbounds", "x1"], 
  ["drbounds", "y1"], 
  ["drbounds", "x2"], 
  ["drbounds", "y2"],
  
];
var expectedValuesMeasure = {
  // bounds.x1, bounds.y1, bounds.x2, bounds.y2, dirbounds.x1, dirbounds.y1, dirbounds.x2, dirbounds.y2
  "rectangleTestx0y0":[0, 0, 300, 300, 0, 0, 300, 300], // rectangleTestx0y0
  "rectangleTestx100y0":[100, 0, 410, 300, 100, 0, 410, 300], // rectangleTestx100y0
  "rectangleTestx100y100":[100, 100, 410, 410, 100, 100, 410, 410], // rectangleTestx100y100
  "rectangleTestx200y200":[200, 200, 520, 520, 200, 200, 520, 520], // rectangleTestx200y200
  "rectangleTestx300y500":[300, 500, 630, 840, 300, 500, 630, 840], // rectangleTestx300y500

  "imageTestx0y0":[0, 0, 300, 300, 0, 0, 300, 300], // imageTestx0y0
  "imageTestx100y0":[100, 0, 410, 300, 100, 0, 410, 300], // imageTestx100y0
  "imageTestx100y100":[100, 100, 410, 410, 100, 100, 410, 410], // imageTestx100y100
  "imageTestx200y200":[200, 200, 520, 520, 200, 200, 520, 520], // imageTestx200y200
  "imageTestx300y500":[300, 500, 630, 840, 300, 500, 630, 840], // imageTestx300y500

  "image9Testx0y0":[0, 0, 300, 300, 0, 0, 300, 300], // image9Testx0y0
  "image9Testx100y0":[100, 0, 410, 300, 100, 0, 410, 300], // image9Testx100y0
  "image9Testx100y100":[100, 100, 410, 410, 100, 100, 410, 410], // image9Testx100y100
  "image9Testx200y200":[200, 200, 520, 520, 200, 200, 520, 520], // image9Testx200y200
  "image9Testx300y500":[300, 500, 630, 840, 300, 500, 630, 840], // image9Testx300y500

  "image9BorderTestx0y0":[0, 0, 300, 300, 0, 0, 300, 300], // image9BorderTestx0y0
  "image9BorderTestx100y0":[100, 0, 410, 300, 100, 0, 410, 300], // image9BorderTestx100y0
  "image9BorderTestx100y100":[100, 100, 410, 410, 100, 100, 410, 410], // image9BorderTestx100y100
  "image9BorderTestx200y200":[200, 200, 520, 520, 200, 200, 520, 520], // image9BorderTestx200y200
  "image9BorderTestx300y500":[300, 500, 630, 840, 300, 500, 630, 840], // image9BorderTestx300y500

  "imageATestx0y0":[0, 0, 300, 300, 0, 0, 300, 300], // imageATestx0y0
  "imageATestx100y0":[100, 0, 410, 300, 100, 0, 410, 300], // imageATestx100y0
  "imageATestx100y100":[100, 100, 410, 410, 100, 100, 410, 410], // imageATestx100y100
  "imageATestx200y200":[200, 200, 520, 520, 200, 200, 520, 520], // imageATestx200y200
  "imageATestx300y500":[300, 500, 630, 840, 300, 500, 630, 840], // imageATestx300y500

  "textBoxTestx0y0":[0, 0, 300, 300, 0, 0, 300, 300], // textBoxTestx0y0
  "textBoxTestx100y0":[100, 0, 410, 300, 100, 0, 410, 300], // textBoxTestx100y0
  "textBoxTestx100y100":[100, 100, 410, 410, 100, 100, 410, 410], // textBoxTestx100y100
  "textBoxTestx200y200":[200, 200, 520, 520, 200, 200, 520, 520], // textBoxTestx200y200
  "textBoxTestx300y500":[300, 500, 630, 840, 300, 500, 630, 840], // textBoxTestx300y500

};

var rectMeasurementResults = function(values) {
  var results = [];
  if (!isDirtyRectsEnabled)
    return results;
  var numResults = values.length;
  for( var i = 0; i < numResults; i++) {
    results[i] = assert(measurements[expectedTextDesc[i][0]][expectedTextDesc[i][1]] === values[i], "measurements "+expectedTextDesc[i][0]+"."+expectedTextDesc[i][1]+" should be "+values[i]+" but is "+measurements[expectedTextDesc[i][0]][expectedTextDesc[i][1]]);
  }
  return results;
}

var beforeStart = function() {
  return new Promise(function(resolve, reject) {

    // Setup all properties as assumed for start of tests
    // set to short text, wordWrap=false, pixelSize, hAlign=left 
  //  currObj.animateTo({r:0,x:0, y:0},2,scene.animation.TWEEN_LINEAR,scene.animation.OPTION_LOOP, 1);
  currObj.x=0;
  currObj.y=0;
   // currObj.t="rect";
    //currObj.url="";
    resolve("dirty_rect_tests.js beforeStart");
  });
}

var doScreenshotComparison = function(name, resolve, reject) 
{
  testText.text="ScreenShot"+name;
    var results = rectMeasurementResults(expectedValuesMeasure[name]);
    //shots.takeScreenshot(basePackageUri+"/images/screenshot_results/"+testPlatform+"/dirty_rect_tests_"+name+".png", false).then(function(link){
      shots.validateScreenshot(basePackageUri+"/images/screenshot_results/"+testPlatform+"/dirty_rect_tests_"+name+".png", false).then(function(match){
        console.log("test result is match: "+match);
        results.push(assert(match == true, "screenshot comparison for "+name+" failed\n"+basePackageUri+"/images/screenshot_results/dirty_rect_tests_"+name+".png"));
        resolve(results);
     // });
    }).catch(function(err) {
        results.push(assert(false, "screenshot comparison for "+name+" failed due to error: "+err));
        resolve(results);
    });
}

var tests = {

  rectangleTestx0y0: function() {
    currObj=testrect;
    currObj.draw=true;
  console.log("dirty_rect_tests.js rectangleTestx0y0");
  //currObj.animateTo({x:0, y:0},10,scene.animation.TWEEN_LINEAR,scene.animation.OPTION_LOOP, 1);
  currObj.x=0;
  currObj.y=0;
  currObj.w=300;
  currObj.h=300;
  console.log("rectangleTestx0y0 is "+expectedValuesMeasure.rectangleTestx0y0);
   return new Promise(function(resolve, reject) {
    currObj.ready.then(function() {
      bg.removeAll();
      rectready(currObj);
      testText.text="Test=rectangleTestx0y0";
      if(doScreenshot) 
      {
          setTimeout( function() {
            doScreenshotComparison("rectangleTestx0y0", resolve)
          }, timeoutForScreenshot);
      } 
      else 
        resolve( rectMeasurementResults(expectedValuesMeasure.rectangleTestx0y0));
    });
  });
  },
 rectangleTestx100y0: function() {
  
  console.log("dirty_rect_tests.js rectangleTestx100y0");
  //currObj.animateTo({x:100, y:0},10,scene.animation.TWEEN_LINEAR,scene.animation.OPTION_LOOP, 1);
  currObj.x=100;
  currObj.y=0;
  currObj.w=310;
  currObj.h=300;
  console.log("rectangleTestx100y0 is "+expectedValuesMeasure.rectangleTestx100y0);
   return new Promise(function(resolve, reject) {
    currObj.ready.then(function() {
      bg.removeAll();
      rectready(currObj);
      testText.text="Test=rectangleTestx100y0";
      if(doScreenshot) 
      {
          setTimeout( function() {
            doScreenshotComparison("rectangleTestx100y0", resolve)
          }, timeoutForScreenshot);
      } 
      else 
        resolve( rectMeasurementResults(expectedValuesMeasure.rectangleTestx100y0));
    });
  });
 },
 rectangleTestx100y100: function() {
  
  console.log("dirty_rect_tests.js rectangleTestx100y100");
  //currObj.animateTo({x:100, y:100},12,scene.animation.TWEEN_LINEAR,scene.animation.OPTION_LOOP, 1);
  currObj.x=100;
  currObj.y=100;
  currObj.w=310;
  currObj.h=310;
  console.log("rectangleTestx100y100 is "+expectedValuesMeasure.rectangleTestx100y100);

   return new Promise(function(resolve, reject) {
    currObj.ready.then(function() {
      bg.removeAll();
      rectready(currObj);
        testText.text="Test=rectangleTestx100y100";
        if(doScreenshot) 
        {
            setTimeout( function() {
              doScreenshotComparison("rectangleTestx100y100", resolve)
            }, timeoutForScreenshot);
        } 
        else 
          resolve( rectMeasurementResults(expectedValuesMeasure.rectangleTestx100y100));
      });
    });
 },
 rectangleTestx200y200: function() {
  
  console.log("dirty_rect_tests.js rectangleTestx200y200");
  //currObj.animateTo({x:200, y:200},12,scene.animation.TWEEN_LINEAR,scene.animation.OPTION_LOOP, 1);
  currObj.x=200;
  currObj.y=200;
  currObj.w=320;
  currObj.h=320;
  console.log("rectangleTestx200y200 is "+expectedValuesMeasure.rectangleTestx200y200);
   return new Promise(function(resolve, reject) {
    currObj.ready.then(function() {
      bg.removeAll();
      rectready(currObj);
      testText.text="Test=rectangleTestx200y200";
      if(doScreenshot) 
      {
          setTimeout( function() {
            doScreenshotComparison("rectangleTestx200y200", resolve)
          }, timeoutForScreenshot);
      } 
      else 
        resolve( rectMeasurementResults(expectedValuesMeasure.rectangleTestx200y200));
    });
  });
 },
 rectangleTestx300y500: function() {
  
  console.log("dirty_rect_tests.js rectangleTestx300y500");
  //currObj.animateTo({x:200, y:200},12,scene.animation.TWEEN_LINEAR,scene.animation.OPTION_LOOP, 1);
  currObj.x=300;
  currObj.y=500;
  currObj.w=330;
  currObj.h=340;
  console.log("rectangleTestx300y500 is "+expectedValuesMeasure.rectangleTestx300y500);
   return new Promise(function(resolve, reject) {
    currObj.ready.then(function() {
      bg.removeAll();
      rectready(currObj);
      testText.text="Test=rectangleTestx300y500";
      if(doScreenshot) 
      {
          setTimeout( function() {
            doScreenshotComparison("rectangleTestx300y500", resolve)
          }, timeoutForScreenshot);
      } 
      else 
        resolve( rectMeasurementResults(expectedValuesMeasure.rectangleTestx300y500));
    });
  });
 },
 imageTestx0y0: function() {
  currObj.draw=false;
  currObj=testimage;
  currObj.draw=true;
  console.log("dirty_rect_tests.js imageTestx0y0");
  //currObj.animateTo({x:0, y:0},10,scene.animation.TWEEN_LINEAR,scene.animation.OPTION_LOOP, 1);
  currObj.x=0;
  currObj.y=0;
  currObj.w=300;
  currObj.h=300;
  console.log("imageTestx0y0 is "+expectedValuesMeasure.imageTestx0y0);
   return new Promise(function(resolve, reject) {
    currObj.ready.then(function() {
      bg.removeAll();
      testText.text="Test=imageTestx0y0";
      rectready(currObj);
      if(doScreenshot) 
      {
          setTimeout( function() {
            doScreenshotComparison("imageTestx0y0", resolve)
          }, timeoutForScreenshot);
      } 
      else 
        resolve( rectMeasurementResults(expectedValuesMeasure.imageTestx0y0));
    });
  });
 },
 imageTestx100y0: function() {
  console.log("dirty_rect_tests.js imageTestx100y0");
  //currObj.animateTo({x:100, y:0},10,scene.animation.TWEEN_LINEAR,scene.animation.OPTION_LOOP, 1);
  currObj.x=100;
  currObj.y=0;
  currObj.w=310;
  currObj.h=300;
  console.log("imageTestx100y0 is "+expectedValuesMeasure.imageTestx100y0);
   return new Promise(function(resolve, reject) {
    currObj.ready.then(function() {
      bg.removeAll();
      rectready(currObj);
      testText.text="Test=imageTestx100y0";
      if(doScreenshot) 
      {
          setTimeout( function() {
            doScreenshotComparison("imageTestx100y0", resolve)
          }, timeoutForScreenshot);
      } 
      else 
        resolve( rectMeasurementResults(expectedValuesMeasure.imageTestx100y0));
    });
  });
 },
 imageTestx100y100: function() {
  
  console.log("dirty_rect_tests.js imageTestx100y100");
  //currObj.animateTo({x:100, y:100},12,scene.animation.TWEEN_LINEAR,scene.animation.OPTION_LOOP, 1);
  currObj.x=100;
  currObj.y=100;
  currObj.w=310;
  currObj.h=310;
  console.log("imageTestx100y100 is "+expectedValuesMeasure.imageTestx100y100);

   return new Promise(function(resolve, reject) {
    currObj.ready.then(function() {
      bg.removeAll();
      rectready(currObj);
      testText.text="Test=imageTestx100y100";
      if(doScreenshot) 
      {
          setTimeout( function() {
            doScreenshotComparison("imageTestx100y100", resolve)
          }, timeoutForScreenshot);
      } 
      else 
        resolve( rectMeasurementResults(expectedValuesMeasure.imageTestx100y100));
    });
  });
 },
 imageTestx200y200: function() {
  
  console.log("dirty_rect_tests.js imageTestx200y200");
  //currObj.animateTo({x:200, y:200},12,scene.animation.TWEEN_LINEAR,scene.animation.OPTION_LOOP, 1);
  currObj.x=200;
  currObj.y=200;
  currObj.w=320;
  currObj.h=320;
  console.log("imageTestx200y200 is "+expectedValuesMeasure.imageTestx200y200);
   return new Promise(function(resolve, reject) {
    currObj.ready.then(function() {
      bg.removeAll();
      rectready(currObj);
      testText.text="Test=imageTestx200y200";
      if(doScreenshot) 
      {
          setTimeout( function() {
            doScreenshotComparison("imageTestx200y200", resolve)
          }, timeoutForScreenshot);
      } 
      else 
        resolve( rectMeasurementResults(expectedValuesMeasure.imageTestx200y200));
    });
  });
 },
 imageTestx300y500: function() {
  
  console.log("dirty_rect_tests.js imageTestx300y500");
  //currObj.animateTo({x:200, y:200},12,scene.animation.TWEEN_LINEAR,scene.animation.OPTION_LOOP, 1);
  currObj.x=300;
  currObj.y=500;
  currObj.w=330;
  currObj.h=340;
  console.log("imageTestx300y500 is "+expectedValuesMeasure.imageTestx300y500);
   return new Promise(function(resolve, reject) {
    currObj.ready.then(function() {
      bg.removeAll();
      rectready(currObj);
      testText.text="Test=imageTestx300y500";
      if(doScreenshot) 
      {
          setTimeout( function() {
            doScreenshotComparison("imageTestx300y500", resolve)
          }, timeoutForScreenshot);
      } 
      else 
        resolve( rectMeasurementResults(expectedValuesMeasure.imageTestx300y500));
    });
  });
 },
 image9Testx0y0: function() {
  currObj.draw=false;
  currObj=testimage9;
  currObj.draw=true;
  console.log("dirty_rect_tests.js image9Testx0y0");
  //currObj.animateTo({x:0, y:0},10,scene.animation.TWEEN_LINEAR,scene.animation.OPTION_LOOP, 1);
  currObj.x=0;
  currObj.y=0;
  currObj.w=300;
  currObj.h=300;
  console.log("image9Testx0y0 is "+expectedValuesMeasure.image9Testx0y0);
   return new Promise(function(resolve, reject) {
    currObj.ready.then(function() {
      bg.removeAll();
      testText.text="Test=image9Testx0y0";
      rectready(currObj);
      if(doScreenshot) 
      {
          setTimeout( function() {
            doScreenshotComparison("image9Testx0y0", resolve)
          }, timeoutForScreenshot);
      } 
      else 
        resolve( rectMeasurementResults(expectedValuesMeasure.image9Testx0y0));
    });
  });
 },
 image9Testx100y0: function() {
  
  console.log("dirty_rect_tests.js image9Testx100y0");
  //currObj.animateTo({x:100, y:0},10,scene.animation.TWEEN_LINEAR,scene.animation.OPTION_LOOP, 1);
  currObj.x=100;
  currObj.y=0;
  currObj.w=310;
  currObj.h=300;
  console.log("image9Testx100y0 is "+expectedValuesMeasure.image9Testx100y0);
   return new Promise(function(resolve, reject) {
    currObj.ready.then(function() {
      bg.removeAll();
      rectready(currObj);
      testText.text="Test=image9Testx100y0";
      if(doScreenshot) 
      {
          setTimeout( function() {
            doScreenshotComparison("image9Testx100y0", resolve)
          }, timeoutForScreenshot);
      } 
      else 
        resolve( rectMeasurementResults(expectedValuesMeasure.image9Testx100y0));
    });
  });
 },
 image9Testx100y100: function() {
  
  console.log("dirty_rect_tests.js image9Testx100y100");
  //currObj.animateTo({x:100, y:100},12,scene.animation.TWEEN_LINEAR,scene.animation.OPTION_LOOP, 1);
  currObj.x=100;
  currObj.y=100;
  currObj.w=310;
  currObj.h=310;
  console.log("image9Testx100y100 is "+expectedValuesMeasure.image9Testx100y100);

   return new Promise(function(resolve, reject) {
    currObj.ready.then(function() {
      bg.removeAll();
      rectready(currObj);
      testText.text="Test=image9Testx100y100";
      if(doScreenshot) 
      {
          setTimeout( function() {
            doScreenshotComparison("image9Testx100y100", resolve)
          }, timeoutForScreenshot);
      } 
      else 
        resolve( rectMeasurementResults(expectedValuesMeasure.image9Testx100y100));
    });
  });
 },
 image9Testx200y200: function() {
  
  console.log("dirty_rect_tests.js image9Testx200y200");
  //currObj.animateTo({x:200, y:200},12,scene.animation.TWEEN_LINEAR,scene.animation.OPTION_LOOP, 1);
  currObj.x=200;
  currObj.y=200;
  currObj.w=320;
  currObj.h=320;
  console.log("image9Testx200y200 is "+expectedValuesMeasure.image9Testx200y200);
   return new Promise(function(resolve, reject) {
    currObj.ready.then(function() {
      bg.removeAll();
      rectready(currObj);
      testText.text="Test=image9Testx200y200";
      if(doScreenshot) 
      {
          setTimeout( function() {
            doScreenshotComparison("image9Testx200y200", resolve)
          }, timeoutForScreenshot);
      } 
      else 
        resolve( rectMeasurementResults(expectedValuesMeasure.image9Testx200y200));
    });
  });
 },
 image9Testx300y500: function() {
  
  console.log("dirty_rect_tests.js image9Testx300y500");
  //currObj.animateTo({x:200, y:200},12,scene.animation.TWEEN_LINEAR,scene.animation.OPTION_LOOP, 1);
  currObj.x=300;
  currObj.y=500;
  currObj.w=330;
  currObj.h=340;
  console.log("image9Testx300y500 is "+expectedValuesMeasure.image9Testx300y500);
   return new Promise(function(resolve, reject) {
    currObj.ready.then(function() {
      bg.removeAll();
      rectready(currObj);
      testText.text="Test=image9Testx300y500";
      if(doScreenshot) 
      {
          setTimeout( function() {
            doScreenshotComparison("image9Testx300y500", resolve)
          }, timeoutForScreenshot);
      } 
      else 
        resolve( rectMeasurementResults(expectedValuesMeasure.image9Testx300y500));
    });
  });
 },
 image9BorderTestx0y0: function() {
  currObj.draw=false;
  currObj=testimage9Border;
  currObj.draw=true;
  console.log("dirty_rect_tests.js image9BorderTestx0y0");
  //currObj.animateTo({x:0, y:0},10,scene.animation.TWEEN_LINEAR,scene.animation.OPTION_LOOP, 1);
  currObj.x=0;
  currObj.y=0;
  currObj.w=300;
  currObj.h=300;
  console.log("image9BorderTestx0y0 is "+expectedValuesMeasure.image9BorderTestx0y0);
   return new Promise(function(resolve, reject) {
    currObj.ready.then(function() {
      bg.removeAll();
      testText.text="Test=image9BorderTestx0y0";
      rectready(currObj);
      if(doScreenshot) 
      {
          setTimeout( function() {
            doScreenshotComparison("image9BorderTestx0y0", resolve)
          }, timeoutForScreenshot);
      } 
      else 
        resolve( rectMeasurementResults(expectedValuesMeasure.image9BorderTestx0y0));
    });
  });
 },
 image9BorderTestx100y0: function() {
  
  console.log("dirty_rect_tests.js image9BorderTestx100y0");
  //currObj.animateTo({x:100, y:0},10,scene.animation.TWEEN_LINEAR,scene.animation.OPTION_LOOP, 1);
  currObj.x=100;
  currObj.y=0;
  currObj.w=310;
  currObj.h=300;
  console.log("image9BorderTestx100y0 is "+expectedValuesMeasure.image9Testx100y0);
   return new Promise(function(resolve, reject) {
    currObj.ready.then(function() {
      bg.removeAll();
      rectready(currObj);
      testText.text="Test=image9BorderTestx100y0";
      if(doScreenshot) 
      {
          setTimeout( function() {
            doScreenshotComparison("image9BorderTestx100y0", resolve)
          }, timeoutForScreenshot);
      } 
      else 
        resolve( rectMeasurementResults(expectedValuesMeasure.image9BorderTestx100y0));
    });
  });
 },
 image9BorderTestx100y100: function() {
  
  console.log("dirty_rect_tests.js image9BorderTestx100y100");
  //currObj.animateTo({x:100, y:100},12,scene.animation.TWEEN_LINEAR,scene.animation.OPTION_LOOP, 1);
  currObj.x=100;
  currObj.y=100;
  currObj.w=310;
  currObj.h=310;
  console.log("image9BorderTestx100y100 is "+expectedValuesMeasure.image9BorderTestx100y100);

   return new Promise(function(resolve, reject) {
    currObj.ready.then(function() {
      bg.removeAll();
      rectready(currObj);
      testText.text="Test=image9BorderTestx100y100";
      if(doScreenshot) 
      {
          setTimeout( function() {
            doScreenshotComparison("image9BorderTestx100y100", resolve)
          }, timeoutForScreenshot);
      } 
      else 
        resolve( rectMeasurementResults(expectedValuesMeasure.image9BorderTestx100y100));
    });
  });
 },
 image9BorderTestx200y200: function() {
  
  console.log("dirty_rect_tests.js image9BorderTestx200y200");
  //currObj.animateTo({x:200, y:200},12,scene.animation.TWEEN_LINEAR,scene.animation.OPTION_LOOP, 1);
  currObj.x=200;
  currObj.y=200;
  currObj.w=320;
  currObj.h=320;
  console.log("image9BorderTestx200y200 is "+expectedValuesMeasure.image9BorderTestx200y200);
   return new Promise(function(resolve, reject) {
    currObj.ready.then(function() {
      bg.removeAll();
      rectready(currObj);
      testText.text="Test=image9BorderTestx200y200";
      if(doScreenshot) 
      {
          setTimeout( function() {
            doScreenshotComparison("image9BorderTestx200y200", resolve)
          }, timeoutForScreenshot);
      } 
      else 
        resolve( rectMeasurementResults(expectedValuesMeasure.image9BorderTestx200y200));
    });
  });
 },
 image9BorderTestx300y500: function() {
  
  console.log("dirty_rect_tests.js image9BorderTestx300y500");
  //currObj.animateTo({x:200, y:200},12,scene.animation.TWEEN_LINEAR,scene.animation.OPTION_LOOP, 1);
  currObj.x=300;
  currObj.y=500;
  currObj.w=330;
  currObj.h=340;
  console.log("image9BorderTestx300y500 is "+expectedValuesMeasure.image9BorderTestx300y500);
   return new Promise(function(resolve, reject) {
    currObj.ready.then(function() {
      bg.removeAll();
      rectready(currObj);
      testText.text="Test=image9BorderTestx300y500";
      if(doScreenshot) 
      {
          setTimeout( function() {
            doScreenshotComparison("image9BorderTestx300y500", resolve)
          }, timeoutForScreenshot);
      } 
      else 
        resolve( rectMeasurementResults(expectedValuesMeasure.image9BorderTestx300y500));
    });
  });
 },
 imageATestx0y0: function() {
  currObj.draw=false;
  currObj=testimageA;
  currObj.draw=true;
  console.log("dirty_rect_tests.js imageATestx0y0");
  //currObj.animateTo({x:0, y:0},10,scene.animation.TWEEN_LINEAR,scene.animation.OPTION_LOOP, 1);
  currObj.x=0;
  currObj.y=0;
  currObj.w=300;
  currObj.h=300;
  currObj.t="imageA";
  console.log("imageATestx0y0 is "+expectedValuesMeasure.imageATestx0y0);
   return new Promise(function(resolve, reject) {
    currObj.ready.then(function() {
      bg.removeAll();
      testText.text="Test=imageATestx0y0";
      rectready(currObj);
      /*if(doScreenshot) 
      {
          setTimeout( function() {
            doScreenshotComparison("imageATestx0y0", resolve)
          }, timeoutForScreenshot);
      } 
      else */
        resolve( rectMeasurementResults(expectedValuesMeasure.imageATestx0y0));
    });
  });
 },
 imageATestx100y0: function() {
  
  console.log("dirty_rect_tests.js imageATestx100y0");
  //currObj.animateTo({x:100, y:0},10,scene.animation.TWEEN_LINEAR,scene.animation.OPTION_LOOP, 1);
  currObj.x=100;
  currObj.y=0;
  currObj.w=310;
  currObj.h=300;
  console.log("imageATestx100y0 is "+expectedValuesMeasure.imageATestx100y0);
   return new Promise(function(resolve, reject) {
    rectready(currObj);
    testText.text="Test=imageATestx100y0";
    /*if(doScreenshot) 
    {
        setTimeout( function() {
          doScreenshotComparison("imageATestx100y0", resolve)
        }, timeoutForScreenshot);
    } 
    else */
      resolve( rectMeasurementResults(expectedValuesMeasure.imageATestx100y0));
   });
 },
 imageATestx100y100: function() {
  
  console.log("dirty_rect_tests.js imageATestx100y100");
  //currObj.animateTo({x:100, y:100},12,scene.animation.TWEEN_LINEAR,scene.animation.OPTION_LOOP, 1);
  currObj.x=100;
  currObj.y=100;
  currObj.w=310;
  currObj.h=310;
  console.log("imageATestx100y100 is "+expectedValuesMeasure.imageATestx100y100);

   return new Promise(function(resolve, reject) {
    currObj.ready.then(function() {
      bg.removeAll();
      rectready(currObj);
      testText.text="Test=imageATestx100y100";
      /*if(doScreenshot) 
      {
          setTimeout( function() {
            doScreenshotComparison("imageATestx100y100", resolve)
          }, timeoutForScreenshot);
      } 
      else*/ 
        resolve( rectMeasurementResults(expectedValuesMeasure.imageATestx100y100));
    });
  });
 },
 imageATestx200y200: function() {
  
  console.log("dirty_rect_tests.js imageATestx200y200");
  //currObj.animateTo({x:200, y:200},12,scene.animation.TWEEN_LINEAR,scene.animation.OPTION_LOOP, 1);
  currObj.x=200;
  currObj.y=200;
  currObj.w=320;
  currObj.h=320;
  console.log("imageATestx200y200 is "+expectedValuesMeasure.imageATestx200y200);
   return new Promise(function(resolve, reject) {
    currObj.ready.then(function() {
      bg.removeAll();
      rectready(currObj);
      testText.text="Test=imageATestx200y200";
      /*if(doScreenshot) 
      {
          setTimeout( function() {
            doScreenshotComparison("imageATestx200y200", resolve)
          }, timeoutForScreenshot);
      } 
      else*/ 
        resolve( rectMeasurementResults(expectedValuesMeasure.imageATestx200y200));
    });
  });
 },
 imageATestx300y500: function() {
  
  console.log("dirty_rect_tests.js imageATestx300y500");
  //currObj.animateTo({x:200, y:200},12,scene.animation.TWEEN_LINEAR,scene.animation.OPTION_LOOP, 1);
  currObj.x=300;
  currObj.y=500;
  currObj.w=330;
  currObj.h=340;
  console.log("imageATestx300y500 is "+expectedValuesMeasure.imageATestx300y500);
   return new Promise(function(resolve, reject) {
    currObj.ready.then(function() {
      bg.removeAll();
      rectready(currObj);
      testText.text="Test=imageATestx300y500";
      /*if(doScreenshot) 
      {
          setTimeout( function() {
            doScreenshotComparison("imageATestx300y500", resolve)
          }, timeoutForScreenshot);
      } 
      else */
        resolve( rectMeasurementResults(expectedValuesMeasure.imageATestx300y500));
    });
  });
 },
 textBoxTestx0y0: function() {
  currObj.draw=false;
  currObj=testTextBox;
  currObj.draw=true;
  console.log("dirty_rect_tests.js textBoxTestx0y0");
  //currObj.animateTo({x:0, y:0},10,scene.animation.TWEEN_LINEAR,scene.animation.OPTION_LOOP, 1);
  currObj.x=0;
  currObj.y=0;
  currObj.w=300;
  currObj.h=300;
  console.log("textBoxTestx0y0 is "+expectedValuesMeasure.textBoxTestx0y0);
   return new Promise(function(resolve, reject) {
    currObj.ready.then(function() {
      bg.removeAll();
      testText.text="Test=textBoxTestx0y0";
      rectready(currObj);
      if(doScreenshot) 
      {
          setTimeout( function() {
            doScreenshotComparison("textBoxTestx0y0", resolve)
          }, timeoutForScreenshot);
      } 
      else 
        resolve( rectMeasurementResults(expectedValuesMeasure.textBoxTestx0y0));
    });
  });
 },
 textBoxTestx100y0: function() {
  
  console.log("dirty_rect_tests.js textBoxTestx100y0");
  //currObj.animateTo({x:100, y:0},10,scene.animation.TWEEN_LINEAR,scene.animation.OPTION_LOOP, 1);
  currObj.x=100;
  currObj.y=0;
  currObj.w=310;
  currObj.h=300;
  console.log("textBoxTestx100y0 is "+expectedValuesMeasure.textBoxTestx100y0);
   return new Promise(function(resolve, reject) {
    currObj.ready.then(function() {
      bg.removeAll();
      rectready(currObj);
      testText.text="Test=textBoxTestx100y0";
      if(doScreenshot) 
      {
          setTimeout( function() {
            doScreenshotComparison("textBoxTestx100y0", resolve)
          }, timeoutForScreenshot);
      } 
      else 
        resolve( rectMeasurementResults(expectedValuesMeasure.textBoxTestx100y0));
    });
  });
 },
 textBoxTestx100y100: function() {
  
  console.log("dirty_rect_tests.js textBoxTestx100y100");
  //currObj.animateTo({x:100, y:100},12,scene.animation.TWEEN_LINEAR,scene.animation.OPTION_LOOP, 1);
  currObj.x=100;
  currObj.y=100;
  currObj.w=310;
  currObj.h=310;
  console.log("textBoxTestx100y100 is "+expectedValuesMeasure.textBoxTestx100y100);

   return new Promise(function(resolve, reject) {
    currObj.ready.then(function() {
      bg.removeAll();
      rectready(currObj);
      testText.text="Test=textBoxTestx100y100";
      if(doScreenshot) 
      {
          setTimeout( function() {
            doScreenshotComparison("textBoxTestx100y100", resolve)
          }, timeoutForScreenshot);
      } 
      else 
        resolve( rectMeasurementResults(expectedValuesMeasure.textBoxTestx100y100));
    });
  });
 },
 textBoxTestx200y200: function() {
  
  console.log("dirty_rect_tests.js textBoxTestx200y200");
  //currObj.animateTo({x:200, y:200},12,scene.animation.TWEEN_LINEAR,scene.animation.OPTION_LOOP, 1);
  currObj.x=200;
  currObj.y=200;
  currObj.w=320;
  currObj.h=320;
  console.log("textBoxTestx200y200 is "+expectedValuesMeasure.textBoxTestx200y200);
   return new Promise(function(resolve, reject) {
    currObj.ready.then(function() {
      bg.removeAll();
      rectready(currObj);
      testText.text="Test=textBoxTestx200y200";
      if(doScreenshot) 
      {
          setTimeout( function() {
            doScreenshotComparison("textBoxTestx200y200", resolve)
          }, timeoutForScreenshot);
      } 
      else 
        resolve( rectMeasurementResults(expectedValuesMeasure.textBoxTestx200y200));
    });
  });
 },
 textBoxTestx300y500: function() {
  
  console.log("dirty_rect_tests.js textBoxTestx300y500");
  //currObj.animateTo({x:200, y:200},12,scene.animation.TWEEN_LINEAR,scene.animation.OPTION_LOOP, 1);
  currObj.x=300;
  currObj.y=500;
  currObj.w=330;
  currObj.h=340;
  console.log("textBoxTestx300y500 is "+expectedValuesMeasure.textBoxTestx300y500);
   return new Promise(function(resolve, reject) {
    currObj.ready.then(function() {
      bg.removeAll();
      rectready(currObj);
      testText.text="Test=textBoxTestx300y500";
      if(doScreenshot) 
      {
          setTimeout( function() {
            doScreenshotComparison("textBoxTestx300y500", resolve)
          }, timeoutForScreenshot);
      } 
      else 
        resolve( rectMeasurementResults(expectedValuesMeasure.textBoxTestx300y500));
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
  console.error("Import failed for text2tests.js: " + err)
});
