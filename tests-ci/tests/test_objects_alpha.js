px.import({scene:"px:scene.1.js",
           assert:"../test-run/assert.js",
           shots:"../test-run/tools_screenshot.js",
           manual:"../test-run/tools_manualTests.js"}).then( function ready(imports) {

var scene = imports.scene;
var root = scene.root;
var assert = imports.assert.assert;
var shots = imports.shots;
var manual = imports.manual;
var doScreenshot = shots.getScreenshotEnabledValue();
var testPlatform=scene.info.build.os;

var manualTest = manual.getManualTestValue();
var timeoutForScreenshot = 40;

var basePackageUri = px.getPackageBaseFilePath();

root.w=800;

var bg = scene.create({t:"object", parent:root, x:100, y:100, w:1000, h:1000, clip:false});
var container = scene.create({t:"object", parent:root, x:100, y:100, w:800, h:600, clip:false});

// Widgets for displaying metrics values 
var height = scene.create({t:"text", parent:root, x:50, y:0, textColor:0xFFDDFFFF, pixelSize:15,clip:false,text:"Height="});
var width = scene.create({t:"text", parent:root, x:50, y:20, textColor:0xFFDDFFFF, pixelSize:15,clip:false,text:"Width="});
var alpha = scene.create({t:"text", parent:root, x:200, y:0, textColor:0xFFDDFFFF, pixelSize:15,clip:false,text:"alpha="});
var testText = scene.create({t:"text", parent:root, x:200, y:20, textColor:0xFFDDFFFF, pixelSize:15,clip:false,text:"Test="});

// - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -
const svg        = 'data:image/svg, <svg xmlns="http://www.w3.org/2000/svg"';
const x_only_svg = svg + 'width="140" height="140"><path fill="#fff" d="M46.381 70.715l26.054-34.929H61.556c-4.867 0-8.016 1.717-10.594 5.154L37.22 59.406 23.907 40.94c-2.578-3.438-5.727-5.154-10.594-5.154H2.434l25.768 34.929L0 108.791h10.307c4.868 0 8.016-1.717 10.594-5.151L37.22 82.024l38.222 52.82c2.434 3.438 5.727 5.154 10.594 5.154h11.165l-50.82-69.283z"/></svg>';
// - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - -

var xOnlyRes = scene.create({ t: "imageResource", url: x_only_svg, w: 500, h: 500 });

var x = scene.w/2, y = scene.h * 0.4, w = 500, h = 500;
var testimage = scene.create({ id: "rect", t: "rect",   parent: container,  x: 0, y: 0,  w: w, h: h, fillColor: "#c00" });
var testmask  = scene.create({ id: "mask", t: "image",  parent: container,  x: 0, y: 0,  w: w, h: h, resource: xOnlyRes,  mask: true, clip: false, draw: false } );


var currObj = testmask;
var metrics = null;
var measurements = null;

var rectready = function(currObj) {
	console.log("inside rect.ready");
  //console.log("text2.h="+text2.h+" and text2.w="+text2.w);
  
  measurements=expectedTextDesc;
  measurements.expected_alpha=currObj.parent.a;
  measurements.contextAlpha=currObj.a;
  height.text="Height="+currObj.h;
  width.text="Width="+currObj.w;
  alpha.text="Alpha="+measurements.contextAlpha;
}

/**********************************************************************/
/**                                                                   */
/**            pxscene tests go in this section                       */
/**                                                                   */
/**********************************************************************/
var expectedTextDesc = [
  ["expected_alpha"],
  ["contextAlpha"],
  
];
var expectedValuesMeasure = {
  // expected_alpha, alpha
  "parentAlphaMaskTest":[1, 1], // parentAlphaMaskTest
  "parentNoAlphaMaskTest":[0, 1], // parentNoAlphaTest

};

var rectMeasurementResults = function(values) {

  var results = [];
  var numResults = values.length;
  for( var i = 0; i < numResults; i++) {
    results[i] = assert(measurements[expectedTextDesc[i]] === values[i], "measurements "+expectedTextDesc[i][0]+"."+expectedTextDesc[i][1]+" should be "+values[i]+" but is "+measurements[expectedTextDesc[i][0]][expectedTextDesc[i][1]]);
  }
  return results;
}

var beforeStart = function() {
  return new Promise(function(resolve, reject) {

  currObj.x=0;
  currObj.y=0;
    resolve("test_objects_alpha.js beforeStart");
  });
}

var doScreenshotComparison = function(name, resolve, reject) 
{
  testText.text="ScreenShot"+name;
    var results = rectMeasurementResults(expectedValuesMeasure[name]);
    //shots.takeScreenshot(basePackageUri+"/images/screenshot_results/"+testPlatform+"/test_objects_alpha_"+name+".png", false).then(function(link){
      shots.validateScreenshot(basePackageUri+"/images/screenshot_results/"+testPlatform+"/test_objects_alpha_"+name+".png", false).then(function(match){
        console.log("test result is match: "+match);
        results.push(assert(match == true, "screenshot comparison for "+name+" failed\n"+basePackageUri+"/images/screenshot_results/test_objects_alpha_"+name+".png"));
        resolve(results);
     // });
    }).catch(function(err) {
        results.push(assert(false, "screenshot comparison for "+name+" failed due to error: "+err));
        resolve(results);
    });
}

var tests = {

  parentAlphaMaskTest: function() {
    currObj=testmask;
  console.log("test_objects_alpha.js parentAlphaMaskTest");
  //currObj.animateTo({x:0, y:0},10,scene.animation.TWEEN_LINEAR,scene.animation.OPTION_LOOP, 1);
  currObj.x=0;
  currObj.y=0;
  currObj.w=300;
  currObj.h=300;
  console.log("parentAlphaMaskTest is "+expectedValuesMeasure.parentAlphaMaskTest);
   return new Promise(function(resolve, reject) {
    currObj.ready.then(function() {
      bg.removeAll();
      rectready(currObj);
      testText.text="Test=parentAlphaMaskTest";
      if(doScreenshot) 
      {
          setTimeout( function() {
            doScreenshotComparison("parentAlphaMaskTest", resolve)
          }, timeoutForScreenshot);
      } 
      else 
        resolve( rectMeasurementResults(expectedValuesMeasure.parentAlphaMaskTest));
    });
  });
  },
  parentNoAlphaMaskTest: function() {
    container.a=0;
    currObj=testmask;
  console.log("test_objects_alpha.js parentNoAlphaMaskTest");
  //currObj.animateTo({x:0, y:0},10,scene.animation.TWEEN_LINEAR,scene.animation.OPTION_LOOP, 1);
  currObj.x=0;
  currObj.y=0;
  currObj.w=300;
  currObj.h=300;
  console.log("parentNoAlphaMaskTest is "+expectedValuesMeasure.parentNoAlphaMaskTest);
   return new Promise(function(resolve, reject) {
    currObj.ready.then(function() {
      bg.removeAll();
      rectready(currObj);
      testText.text="Test=parentNoAlphaMaskTest";
      if(doScreenshot) 
      {
          setTimeout( function() {
            doScreenshotComparison("parentNoAlphaMaskTest", resolve)
          }, timeoutForScreenshot);
      } 
      else 
        resolve( rectMeasurementResults(expectedValuesMeasure.parentNoAlphaMaskTest));
    });
  });
  }
 }

module.exports.beforeStart = beforeStart;
module.exports.tests = tests;


if(manualTest === true) {

  manual.runTestsManually(tests, beforeStart);

}

}).catch( function importFailed(err){
  console.error("Import failed for text2tests.js: " + err)
});
