px.import({scene:"px:scene.1.js",
           assert:"../test-run/assert.js",
           manual:"../test-run/tools_manualTests.js"}).then( function ready(imports) {

  var scene = imports.scene;
  var root = imports.scene.root;
  var assert = imports.assert.assert;
  var manual = imports.manual;

  var accessibleProperties = ['env', 'hrtime', 'memoryUsage']
  var nonaccessibleProperties = ['kill']

  var manualTest = manual.getManualTestValue();

  var basePackageUri = px.getPackageBaseFilePath();

  var tests = {
    test_accessibleProperties: function() {
      return new Promise(function(resolve, reject) {
        
        var results = [];
	var success = true;
        for (var i =0; i<accessibleProperties.length; i++) {
          if (process[accessibleProperties[i]] == undefined) {
            success = false;
            break;
          }
        }

        if( true == success ) {
          results.push(assert(true, "process accessible properties test success"));
        }
        else {
          results.push(assert(false, "process accessible properties test not success"));
        }
        
        resolve(results);
      });
    },
    test_nonAccessibleProperties: function() {
      return new Promise(function(resolve, reject) {
        
        var results = [];
	var success = true;
        for (var i =0; i<nonaccessibleProperties.length; i++) {
          if (process[nonaccessibleProperties[i]] != undefined) {
            success = false;
            break;
          }
        }

        if( true == success ) {
          results.push(assert(true, "process non-accessible properties test success"));
        }
        else {
          results.push(assert(false, "process non-accessible properties test not success"));
        }
        resolve(results);
      });
    }
  } 
  module.exports.tests = tests;

  if(manualTest === true) {

    manual.runTestsManually(tests);

  }
  }).catch( function importFailed(err){
    console.error("Import failed for test_directProcessAccess.js: " + err)
  });
