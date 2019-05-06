px.import({scene:"px:scene.1.js",
           assert:"../test-run/assert.js",
           shots:"../test-run/tools_screenshot.js",
           manual:"../test-run/tools_manualTests.js"}).then( function ready(imports) {

var scene = imports.scene;
var root = scene.root;
var assert = imports.assert.assert;
var shots = imports.shots;
var manual = imports.manual;
var isGifLoaderEnabled = scene.capabilities.graphics.gif;
var doScreenshot = shots.getScreenshotEnabledValue();
var testPlatform=scene.info.build.os;

var manualTest = manual.getManualTestValue();
var timeoutForScreenshot = 40;

var basePackageUri = px.getPackageBaseFilePath();

var url = basePackageUri + "/images/Spark_equalizerSVG.gif";

/**********************************************************************/
/**                                                                   */
/**            pxscene tests go in this section                       */
/**                                                                   */
/**********************************************************************/
var beforeStart = function() {
  return new Promise(function(resolve, reject) {
    resolve("test_gifLoader.js beforeStart");
  });
}

var doScreenshotComparison = function(name, resolve, reject) 
{
  testText.text="ScreenShot"+name;
    var results = rectMeasurementResults();
    shots.validateScreenshot(basePackageUri+"/images/screenshot_results/"+testPlatform+"/gifLoader_test"+name+".png", false).then(function(match){
        console.log("test result is match: "+match);
        results.push(assert(match == true, "screenshot comparison for "+name+" failed\n"+basePackageUri+"/images/screenshot_results/gifLoader_tests_"+name+".png"));
        resolve(results);
     // });
    }).catch(function(err) {
        results.push(assert(false, "screenshot comparison for "+name+" failed due to error: "+err));
        resolve(results);
    });
}
var tests = {

  test1: function() {
	if (isGifLoaderEnabled == false)
	{   
	return new Promise(function(resolve, reject) { resolve(isGifLoaderEnabled == false);
		});
	}
	else
	{var imgres = scene.create({t:'imageAResource',parent: scene.root});
  	
  	var img = scene.create({ t: "imageA", url: url, parent: scene.root });

	return new Promise(function(resolve, reject) {
	    img.ready.then(function() {
	      if(doScreenshot) 
	      {
		  setTimeout( function() {
		    doScreenshotComparison("test1", resolve)
		  }, timeoutForScreenshot);
	      } 
	      else 
		resolve(isGifLoaderEnabled == true ? "test_gifLoader: SUCCESS" : "test_gifLoader: Failed to load file");
	    });
	  });
	}
     },
test2: function() {
	if (isGifLoaderEnabled == false)
	{   
	return new Promise(function(resolve, reject) { resolve(isGifLoaderEnabled == false);
		});
	}
	else
	{
        var imgres = scene.create({t:'imageAResource',parent: scene.root});
  
	var img = scene.create({ t: "imageA", url: url, parent: scene.root });

	return new Promise(function(resolve, reject) {
	    img.ready.then(function() {
             img.resource=imgres;
	      if(doScreenshot) 
	      {
		  setTimeout( function() {
		    doScreenshotComparison("test1", resolve)
		  }, timeoutForScreenshot);
	      } 
	      else 
		resolve(isGifLoaderEnabled == true ? "test_gifLoader: SUCCESS" : "test_gifLoader: Failed to load file");
	    });
	  });
	}
     }
 }

module.exports.beforeStart = beforeStart;
module.exports.tests = tests;


if(manualTest === true) {

  manual.runTestsManually(tests, beforeStart);

}

}).catch( function importFailed(err){
  console.error("Import failed for test_gifLoader.js: " + err)
});
