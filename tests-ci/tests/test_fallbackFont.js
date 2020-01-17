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

  var scf_only = scene.create({ t: 'fontResource', url: base + '/fonts/MaShanZheng-RegularOnly.ttf' });        // SIMPLIFIED   (from Google Fonts)
  var scf      = scene.create({ t: 'fontResource', url: base + '/fonts/MaShanZheng-Regular.ttf' });            // SIMPLIFIED   (from Google Fonts)
  var tcf      = scene.create({ t: 'fontResource', url: base + '/fonts/Noto_Sans_TC/NotoSansTC-Medium.ttf' }); // TRADITIONAL  (from Google Fonts)

  // NOTE:
  // NOTE:   Renamed "NotoSansTC-Medium.otf"  OpenType ... to  "NotoSansTC-Medium.ttf"  ... to load in Spark .. FreeType seems to prefer TTF
  // NOTE:

  let pts   = 30;
  let gap   = '   +   '; //'...+...';
  let txt   = '这是简体中文' + gap /* "This is simplified Chinese" */ + '這是繁體中文' /* "This is traditional Chinese" */;

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
          var mu = unbacked.measureText();
          var mb =   backed.measureText();

          results.push(assert(mu.charLast.x > mb.charLast.x, "Fallback font CORRECTLY used"));

          resolve(results);
        },
        function rejection() {
          results.push(assert(false, "fallbackFont failed : "+exception));
        }).then(function() {
          resolve(results);
        });
      });//PROMISE
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  }//tests

  module.exports.tests = tests;

  if(manualTest === true)
  {
    console.log("runTestsManually...");
    manual.runTestsManually(tests);

  }

}).catch(function importFailed(err) {
    console.error("Imports [ test_fallbackFont.js ] failed: " + err);
});
