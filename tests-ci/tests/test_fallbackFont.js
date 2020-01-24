module.exports.wantsClearscreen = function() { return false; };

px.import({scene: "px:scene.1.js",
          assert: "../test-run/assert.js",
          manual: "../test-run/tools_manualTests.js"
        }).then( function ready(imports)
{
  module.exports.wantsClearscreen = function()
  {
    return true; // return 'false' to skip system black/blank draw
  };

  var scene  = imports.scene;
  var root   = imports.scene.root;
  var base   = px.getPackageBaseFilePath();

  var assert = imports.assert.assert;
  var manual = imports.manual;

  var manualTest = manual.getManualTestValue();

  if( scene.capabilities               == undefined ||
      scene.capabilities.font          == undefined ||
      scene.capabilities.font.fallback == undefined ||
      scene.capabilities.font.fallback < 1)
  {
    console.error("DIRECT >> scene.capabilities.font.fallback ... Fallback FONT is NOT supported");

    return;
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  var scf_only = null;
  var scf      = null;
  var tcf      = null;

  // NOTE:
  // NOTE:   Renamed "NotoSansTC-Medium.otf"  OpenType ... to  "NotoSansTC-Medium.ttf"  ... to load in Spark .. FreeType seems to prefer TTF
  // NOTE:

  let pts   = 30;
  let gap   = '   +   '; //'...+...';
  let txt   = '这是简体中文' + gap /* "This is simplified Chinese" */ + '這是繁體中文' /* "This is traditional Chinese" */;

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  var beforeStart = function()
  {
    console.log("test_fallbackFont.js ...  beforeStart()!");

    scf_only = scene.create({ t: 'fontResource', url: base + '/fonts/MaShanZheng-RegularOnly.ttf' });        // SIMPLIFIED   (from Google Fonts)
    scf      = scene.create({ t: 'fontResource', url: base + '/fonts/MaShanZheng-Regular.ttf' });            // SIMPLIFIED   (from Google Fonts)
    tcf      = scene.create({ t: 'fontResource', url: base + '/fonts/Noto_Sans_TC/NotoSansTC-Medium.ttf' }); // TRADITIONAL  (from Google Fonts)

    var promise = new Promise(function(resolve, reject)
    {
      Promise.all([ scf_only.ready, scf.ready, tcf.ready
      ]).then( () =>
      {
        resolve("RESOLVE: beforeStart");
      },
      function rejection(exception)
      {
        resolve("REJECT: beforeStart");
      })
    });
    return promise;
  }

  var tests =
  {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    test_fallbackFont_TEST: function()   // TEST 0
    {
      return new Promise(function(resolve, reject)
      {
        var results  = [];

        ///////////////////////////////////////////////////////////////////////////////////////////////
        //
        // NO-FALLBACK FONT

        var unbacked = scene.create({t:'textBox', parent: root, x: 100, y: 100, 
              pixelSize: pts, textColor: '#fff', font: scf_only, text: txt, interactive: false,
              alignVertical:   scene.alignVertical.CENTER,
              alignHorizontal: scene.alignHorizontal.LEFT});

        ///////////////////////////////////////////////////////////////////////////////////////////////

        scf.fallbackFont = tcf; // assign FALLBACK font !!!

        ///////////////////////////////////////////////////////////////////////////////////////////////
        //
        // WITH-FALLBACK FONT

        var backed = scene.create({t:'textBox', parent: root,  x: 100, y: 150, 
                                    pixelSize: pts, textColor: '#fff', font: scf, text: txt, interactive: false,
                                    alignVertical:   scene.alignVertical.CENTER,
                                    alignHorizontal: scene.alignHorizontal.LEFT});

        ///////////////////////////////////////////////////////////////////////////////////////////////

        Promise.all([ unbacked.ready, backed.ready
        ]).then( () =>
        {
          var ans = (backed.font.fallbackGlyphsCount == 2);
          results.push(assert(ans, "Fallback font - fallbackGlyphsCount: ( "+backed.font.fallbackGlyphsCount+" == 2) ... is " + (ans ? "CORRECT" : "INCORRECT") ));

          resolve(results);
        },
        function rejection(exception)
        {
          results.push(assert(false, "REJECT: fallbackFont failed : " + exception));
          resolve(results);

        })
      });//PROMISE
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  }//tests

  module.exports.beforeStart = beforeStart;
  module.exports.tests = tests;

  if(manualTest === true)
  {
    console.log("runTestsManually...");

    manual.runTestsManually(tests, beforeStart);
  }

}).catch(function importFailed(err) {
    console.error("Imports [ test_fallbackFont.js ] failed: " + err);
});
