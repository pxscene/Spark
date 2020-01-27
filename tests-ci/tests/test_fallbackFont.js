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

  // NOTE:
  // NOTE:   Renamed "NotoSansTC-Medium.otf"  OpenType ... to  "NotoSansTC-Medium.ttf"  ... to load in Spark .. FreeType seems to prefer TTF
  // NOTE:

  let pts   = 30;
  let gap   = '   +   '; //'...+...';
  let txt   = '这是简体中文' + gap /* "This is simplified Chinese" */ + '這是繁體中文' /* "This is traditional Chinese" */;

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  var tests =
  {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    test_fallbackFont_TEST: function()   // TEST 0
    {
      return new Promise(function(resolve, reject)
      {
        var backed   = null;
        var results  = [];

        var scf_only = scene.create({ t: 'fontResource', url: base + '/fonts/MaShanZheng-RegularOnly.ttf' });        // SIMPLIFIED   (from Google Fonts)
        var scf      = scene.create({ t: 'fontResource', url: base + '/fonts/MaShanZheng-Regular.ttf' });            // SIMPLIFIED   (from Google Fonts)
        var tcf      = scene.create({ t: 'fontResource', url: base + '/fonts/Noto_Sans_TC/NotoSansTC-Medium.ttf' }); // TRADITIONAL  (from Google Fonts)

        ///////////////////////////////////////////////////////////////////////////////////////////////
        //
        // NO-FALLBACK FONT

        scf_only.ready.then( () =>
        {
          var unbacked = scene.create({ id: 'unbacked', t:'textBox', parent: root, x: 100, y: 100,
                pixelSize: pts, textColor: '#fff', font: scf_only, text: txt, interactive: false,
                alignVertical:   scene.alignVertical.CENTER,
                alignHorizontal: scene.alignHorizontal.LEFT});
        });

        ///////////////////////////////////////////////////////////////////////////////////////////////
        //
        // WITH-FALLBACK FONT
        //
        scf.ready.then( () =>
        {
          tcf.ready.then( () =>
          {
            //
            // Assign the FALLBACK font
            //
            scf.fallbackFont = tcf; // assign FALLBACK font !!!

            backed = scene.create({ id: 'backed', t:'textBox', parent: root,  x: 100, y: 150,
              pixelSize: pts, textColor: '#fff', font: scf, text: txt, interactive: false,
              alignVertical:   scene.alignVertical.CENTER,
              alignHorizontal: scene.alignHorizontal.LEFT});

              backed.ready.then( () =>
              {
                var count = backed.font.fallbackGlyphsCount;
                var ans   = (count == 2);

                // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
                // TEST !
                //
                results.push(assert(ans, "Fallback font - fallbackGlyphsCount: ( "+count+" == 2) ... is " + (ans ? "CORRECT" : "INCORRECT") ));

                resolve(results);
                // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
              },
              function rejection(exception)
              {
                results.push(assert(false, "REJECT: fallbackFont failed   id: " + exception));
                resolve(results);
              })
          },
          (err) =>
          {
            console.log("FALLBACK font 'tcf' NOT ready ... unexpected.")
            results.push(assert(false, "FALLBACK font 'tcf' NOT ready ... unexpected."));
            resolve(results);
          });
        },
        (err) =>
        {
          console.log("PRIMARY font 'scf' NOT ready ... unexpected.")
          results.push(assert(false, "PRIMARY font 'scf' NOT ready ... unexpected."));
          resolve(results);
        });

        ///////////////////////////////////////////////////////////////////////////////////////////////
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
