px.import({scene:"px:scene.1.js",
           assert:"../test-run/assert.js",
           manual:"../test-run/tools_manualTests.js"}).then( function ready(imports) {

  var scene = imports.scene;
  var root = imports.scene.root;
  var assert = imports.assert.assert;
  var manual = imports.manual;

  var manualTest = manual.getManualTestValue();

  var basePackageUri = px.getPackageBaseFilePath();

  var tests = {
    test_localContextUse: function() {
      return new Promise(function(resolve, reject) {
        
        var results = [];
        console.testParam = 1;
        const foreignFunction = console.constructor.constructor;
        var retValue = foreignFunction("console.log('hello inside script'); return console.testParam;")();
        if( retValue == 1 ) {
          results.push(assert(true, "local context use test success"));
        }
        else {
          results.push(assert(false, "local context use test not success"));
        }
        delete console.testParam; 
        resolve(results);
      });
    }
  } 
  module.exports.tests = tests;

  if(manualTest === true) {

    manual.runTestsManually(tests);

  }
}).catch( function importFailed(err){
  console.error("Import failed for test_indirectProcessAccess.js: " + err)
});
