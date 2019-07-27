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

  if( scene.capabilities                  == undefined ||
      scene.capabilities.graphics         == undefined ||
      scene.capabilities.graphics.shaders == undefined ||
      scene.capabilities.graphics.shaders < 1)
  {
    // Shader is not supported...
    var results = [];
    results.push(assert( false ,"DIRECT >> scene.capabilities.graphics.shaders ... shaderResource is NOT supporte"));

    resolve(results);
    return;
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  var direct_URL   = base + "/shaderTests/directTest.js"
  var single_URL   = base + "/shaderTests/singlepassTest.js"
  var multi_URL    = base + "/shaderTests/multipassTest.js"
  var uniforms_URL = base + "/shaderTests/UniformsTest.js"
  var bind_URL     = base + "/shaderTests/bindTest.js"

  var PASSED = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPAAAACHCAYAAAAoctTrAAABp0lEQVR4nO3VsQ2DUBAFQWPRM5QAVePUIcJCn5Vn4gtesrrXCwAAAAAAAAAAgN9Mpy+37bhxB/BtXU+1+b57B3AfAUOYgCFMwBAmYAgTMIQJGMIEDGEChjABQ5iAIUzAECZgCBMwhAkYwgQMYQKGMAFDmIAhTMAQJmAIEzCECRjCBAxhAoYwAUOYgCFMwBA2jx7wBMeyjJ7ABdO+j54wnA8MYQKGMAFDmIAhTMAQJmAIEzCECRjCBAxhAoYwAUOYgCFMwBAmYAgTMIQJGMIEDGEChjABQ5iAIUzAECZgCBMwhAkYwgQMYQKGMAFDmIAhTMAQJmAIEzCECRjCBAxhAoYwAUOYgCFMwBAmYAgTMIQJGMIEDGEChjABQ5iAIUzAECZgCBMwhAkYwgQMYQKGMAFDmIAhTMAQJmAIEzCECRjC5tEDnmDa99ET4BIfGMIEDGEChjABQ5iAIUzAECZgCBMwhAkYwgQMYQKGMAFDmIAhTMAQJmAIEzCECRjCBAxhAoYwAUOYgCFMwBAmYAgTMIQJGMIEDGEChjABAwAAAAAAAAAAAH/sA3PtB/2R0gFhAAAAAElFTkSuQmCC";

  // Smaller image ... smaller Base64 result string.
  var ww = 480/2;
  var hh = 270/2;

  var xx = (1280)/2;
  var yy = ( 720) * 0.10;

  var bg = scene.create({ t: 'object', parent: root, x: 10, y: 10, w: 1260, h: 700, fillColor: '#111', interactive: false});

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  var single_bg    = scene.create({ t: 'rect',    parent:        bg, x: xx - ww/2 , y: yy, w: ww, h: hh, fillColor: "#888", lineColor: "#fff", lineWidth: 2 });
  var single       = scene.create({ t: 'scene',   parent: single_bg, x:    0, y:  0,        w: ww, h: hh, url: single_URL, interactive: false });

  var single_title = scene.create({ t: 'text', parent:    root,  x: single_bg.x + 60, y: single_bg.y - 25, w: 300, h: 20,
                                pixelSize: 18,  textColor: '#fff',  text: 'SINGLE CONFIG', interactive: false });

  var single_txt   = scene.create({ t: 'text', parent:    root,  x: single_bg.x + 20, y: single_bg.y + single_bg.h + 15, w: 300, h: 20,
                                pixelSize: 24,  textColor: '#fff',  text: 'Expected Color: ', interactive: false });

  var single_ans   = scene.create({ t: 'rect', parent: bg, x: single_txt.x + single_txt.w + 10, y: single_txt.y, w: 20, h: 20, fillColor: "#fff", lineColor: "#888", lineWidth: 2 });

  var single_res   = scene.create({ t: 'text', parent: root, x: single_bg.x + single.w/2 - 22, y: single_bg.y + single_bg.h/2 - 10, w: 300, h: 20,
                      pixelSize: 24,  textColor: '#000',  text:  '####', interactive: false, draw: false });

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  var multi_bg   = scene.create({ t: 'rect',    parent:       bg,  x: xx * 1.5 - ww/2, y: yy, w: ww, h: hh, fillColor: "#888", lineColor: "#fff", lineWidth: 2 });
  var multi      = scene.create({ t: 'scene',   parent: multi_bg,  x:         0, y:  0, w: ww, h: hh, url: multi_URL, interactive: false });

  var multi_title = scene.create({ t: 'text', parent:    root,  x: multi_bg.x + 65, y: multi_bg.y - 25, w: 300, h: 20,
                                pixelSize: 18,  textColor: '#fff',  text: 'MULTI CONFIG', interactive: false });

  var multi_txt  = scene.create({ t: 'text', parent:     root,  x: multi_bg.x + 20, y: multi_bg.y + multi_bg.h + 15, w: 300, h: 20,
                                pixelSize: 24, textColor: '#fff',  text: 'Expected Color: ', interactive: false });

  var multi_ans  = scene.create({ t: 'rect', parent: bg, x: multi_txt.x + multi_txt.w + 10, y: multi_txt.y, w: 20, h: 20, fillColor: "#FFF", lineColor: "#fff", lineWidth: 2, focus: true });

  var multi_res = scene.create({ t: 'text', parent: root, x: multi_bg.x + multi.w/2 - 22, y: multi_bg.y + multi_bg.h/2 - 10, w: 300, h: 20,
                      pixelSize: 24,  textColor: '#000',  text:  '####', interactive: false, draw: false });

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  var direct_bg  = scene.create({ t: 'rect',    parent:        bg, x: xx/2 - ww/2, y: yy, w: ww, h: hh, fillColor: "#888", lineColor: "#fff", lineWidth: 2 });
  var direct     = scene.create({ t: 'scene',   parent: direct_bg, x:    0, y:  0,        w: ww, h: hh, url: direct_URL, interactive: false });

  var direct_title = scene.create({ t: 'text', parent:    root,  x: direct_bg.x + 60, y: direct_bg.y - 25, w: 300, h: 20,
                                pixelSize: 18,  textColor: '#fff',  text: 'DIRECT CONFIG', interactive: false });

  var direct_txt = scene.create({ t: 'text', parent:    root,  x: direct_bg.x + 20, y: direct_bg.y + direct_bg.h + 15, w: 300, h: 20,
                                pixelSize: 24,  textColor: '#fff',  text: 'Expected Color: ', interactive: false });

  var direct_ans = scene.create({ t: 'rect', parent: bg, x: direct_txt.x + direct_txt.w + 10, y: direct_txt.y, w: 20, h: 20, fillColor: "#fff", lineColor: "#888", lineWidth: 2 });

  var direct_res = scene.create({ t: 'text', parent: root, x: direct_bg.x + direct.w/2 - 22, y: direct_bg.y + direct_bg.h/2 - 10, w: 300, h: 20,
                      pixelSize: 24,  textColor: '#000',  text:  '####', interactive: false, draw: false });

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  yy = ( 720) * 0.50;
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  var uniforms_bg  = scene.create({ t: 'rect',    parent:        bg, x: xx/2 - ww/2, y: yy, w: ww, h: hh, fillColor: "#888", lineColor: "#fff", lineWidth: 2 });
  var uniforms     = scene.create({ t: 'scene',   parent: uniforms_bg, x:    0, y:  0,        w: ww, h: hh, url: uniforms_URL, interactive: false });

  var uniforms_title = scene.create({ t: 'text', parent:    root,  x: uniforms_bg.x + 60, y: uniforms_bg.y - 25, w: 300, h: 20,
                                        pixelSize: 18,  textColor: '#fff',  text: 'Set UNIFORMS', interactive: false });

  var uniforms_txt = scene.create({ t: 'text', parent:    root,  x: uniforms_bg.x + 20, y: uniforms_bg.y + uniforms_bg.h + 15, w: 300, h: 20,
                                      pixelSize: 24,  textColor: '#fff',  text: 'Expected Color: ', interactive: false });

  var uniforms_ans = scene.create({ t: 'rect', parent: bg, x: uniforms_txt.x + uniforms_txt.w + 10, y: uniforms_txt.y, w: 20, h: 20, fillColor: "#fff", lineColor: "#888", lineWidth: 2 });

  var uniforms_res = scene.create({ t: 'text', parent: root, x: uniforms_bg.x + uniforms.w/2 - 22, y: uniforms_bg.y + uniforms_bg.h/2 - 10, w: 300, h: 20,
                                      pixelSize: 24,  textColor: '#000',  text:  '####', interactive: false, draw: false });

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  var bindTest_bg  = scene.create({ t: 'rect',    parent:          bg, x: xx - ww/2, y: yy, w: ww, h: hh, fillColor: "#888", lineColor: "#fff", lineWidth: 2 });
  var bindTest     = scene.create({ t: 'scene',   parent: bindTest_bg, x:    0, y:  0,        w: ww, h: hh, url: bind_URL, interactive: false });

  var bind_title = scene.create({ t: 'text', parent:    root,  x: bindTest_bg.x + 90, y: bindTest_bg.y - 25, w: 300, h: 20,
  pixelSize: 18,  textColor: '#fff',  text: 'Bind Test', interactive: false });

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  var tests =
  {
    test_directConfig: function()
    {
      var results  = [];
      return new Promise(function(resolve, reject)
      {
          direct.ready.then(() =>
          {
            // When the shader has been applied, take a screenshot to compare
            direct.api.reallyReady().then(() =>
            {
              // Use 'screenshot' of child scene to verify visual output of shader...
              // ...  via base64 encoded image as a string - in string comparison with 'PASSED'
              //
              var screenshot = direct.screenshot("image/png;base64");

              direct_res.text = (screenshot == PASSED) ? "PASS" :  "FAIL";
              direct_res.draw = true;

              results.push(assert( (screenshot == PASSED) ,"DIRECT >> Shader config " + direct_res.text));

              resolve(results);
            })
        })
      });
    },

    test_singleConfig: function()
    {
      var results  = [];
      return new Promise(function(resolve, reject)
      {
        single.ready.then(() =>
        {
          // Use 'screenshot' of child scene to verify visual output of shader...
          // ...  via base64 encoded image as a string - in string comparison with 'PASSED'
          //
          var screenshot = single.screenshot("image/png;base64");

          single_res.text = (screenshot == PASSED) ? "PASS" :  "FAIL";
          single_res.draw = true;

          results.push(assert( (screenshot == PASSED) ,"SINGLE >> Shader config " + single_res.text));

          // console.log("#########  TEST 2 - results.length: " + results.length + "   ans: " + (screenshot == PASSED));
          resolve(results);
        })
      });
    },

    test_multiConfig: function()
    {
      var results  = [];
      return new Promise(function(resolve, reject)
      {
        multi.ready.then(() =>
        {
          // Use 'screenshot' of child scene to verify visual output of shader...
          // ...  via base64 encoded image as a string - in string comparison with 'PASSED'
          //
          var screenshot = multi.screenshot("image/png;base64");

          multi_res.text = (screenshot == PASSED) ? "PASS" :  "FAIL";
          multi_res.draw = true;

          results.push(assert( (screenshot == PASSED) ,"MULTI  >> Shader config " + multi_res.text));

          // console.log("#########  TEST 3 - results.length: " + results.length + "   ans: " + (screenshot == PASSED));
          resolve(results);
        })
      });
    },


    test_uniforms: function()
    {
      var results  = [];
      return new Promise(function(resolve, reject)
      {
        uniforms.ready.then(() =>
        {
          // When the shader has been applied, take a screenshot to compare
          // Use 'screenshot' of child scene to verify visual output of shader...
          // ...  via base64 encoded image as a string - in string comparison with 'PASSED'
          //
          var screenshot = uniforms.screenshot("image/png;base64");

          uniforms_res.text = (screenshot == PASSED) ? "PASS" :  "FAIL";
          uniforms_res.draw = true;

          results.push(assert( (screenshot == PASSED) ,"uniformINT  >> Shader config " + uniforms_res.text));

          if(screenshot != PASSED)
          {
            console.log("\n######### test_uniforms: FAIL ... Screenshot - Shader color-codes the uniform type failing.\n");
            console.log("screenshot = " + screenshot + "\n\n");
          }
          resolve(results);

        })
      });
    }
  }//tests

  module.exports.tests = tests;

  if(manualTest === true)
  {
    manual.runTestsManually(tests);
  }
}).catch(function importFailed(err) {
    console.error("Imports [ test_pxShaderResource.js ] failed: " + err);
});
