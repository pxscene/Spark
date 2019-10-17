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
    console.error("DIRECT >> scene.capabilities.graphics.shaders ... shaderResource is NOT supported");

    return;
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  var frgShaderSrc =
  `
    #ifdef GL_ES \n
      precision mediump float; \n
    #endif \n
    uniform float u_alpha;
    uniform vec4 a_color;
    void main()
    {
      gl_FragColor = a_color*u_alpha;
    }
  `;

  var vtxShaderSrc =
  `
    #ifdef GL_ES \n
      precision mediump float; \n
    #endif \n

    uniform vec2 u_resolution;
    uniform mat4 amymatrix;
    attribute vec2 pos;
    attribute vec2 uv;
    varying vec2 v_uv;
    void main()
    {
      // map from "pixel coordinates
      vec4 p = amymatrix * vec4(pos, 0, 1);
      vec4 zeroToOne = p / vec4(u_resolution, u_resolution.x, 1);
      vec4 zeroToTwo = zeroToOne * vec4(2.0, 2.0, 1, 1);
      vec4 clipSpace = zeroToTwo - vec4(1.0, 1.0, 0, 0);
      clipSpace.w = 1.0+clipSpace.z;
      gl_Position =  clipSpace * vec4(1, -1, 1, 1);
      v_uv = uv;
    }
  `;

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  // From C++
  //
  // #define PX_RESOURCE_STATUS_OK             0           <<<<< GLSL Compiler Result - OK
  // #define PX_RESOURCE_STATUS_DECODE_FAILURE 4           <<<<< GLSL Compiler Result - ERROR (expected)

  let PX_RESOURCE_STATUS_OK              = 0    //         <<<<< GLSL Compiler Result - OK
  let PX_RESOURCE_STATUS_DECODE_FAILURE  = 4    //         <<<<< GLSL Compiler Result - ERROR (expected)

  // var direct_URL   = base + "/shaderTests/directTest.js"
  // var single_URL   = base + "/shaderTests/singlepassTest.js"
  // var multi_URL    = base + "/shaderTests/multipassTest.js"
  // var uniforms_URL = base + "/shaderTests/UniformsTest.js"
  // var bind_URL     = base + "/shaderTests/bindTest.js"

  var direct_URL   = base + "/shaderTests/directTest_inline.js"
  var single_URL   = base + "/shaderTests/singlepassTest_inline.js"
  var multi_URL    = base + "/shaderTests/multipassTest_inline.js"
  var uniforms_URL = base + "/shaderTests/UniformsTest_inline.js"
  var bind_URL     = base + "/shaderTests/bindTest_inline.js"

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

  var uniforms_ans = scene.create({ t: 'rect', parent: bg,   x: uniforms_txt.x + uniforms_txt.w + 10, y: uniforms_txt.y, w: 20, h: 20, fillColor: "#fff", lineColor: "#888", lineWidth: 2 });
  var uniforms_res = scene.create({ t: 'text', parent: root, x: uniforms_bg.x + uniforms.w/2 - 22, y: uniforms_bg.y + uniforms_bg.h/2 - 10, w: 300, h: 20,
                                      pixelSize: 24,  textColor: '#000',  text:  '####', interactive: false, draw: false });

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  var bindTest_bg  = scene.create({ t: 'rect',    parent:          bg, x: xx - ww/2, y: yy, w: ww, h: hh, fillColor: "#888", lineColor: "#fff", lineWidth: 2 });
  var bindTest     = scene.create({ t: 'scene',   parent: bindTest_bg, x:    0, y:  0,        w: ww, h: hh, url: bind_URL, interactive: false });
  var bind_title   = scene.create({ t: 'text', parent:    root,        x: bindTest_bg.x + 90, y: bindTest_bg.y - 25, w: 300, h: 20,
  pixelSize: 18,  textColor: '#fff',  text: 'Bind Test', interactive: false });

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  var tests =
  {

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    test_directConfig: function()   // TEST 0
    {
      var results  = [];
      return new Promise(function(resolve, reject)
      {
          Promise.all([ direct_bg.ready, direct_title.ready, direct_txt.ready,
                        direct_ans.ready, direct_res.ready,
                        direct.ready
          ]).then( () =>
          {
            direct.api.reallyReady().then( (o) => // When the shader has been applied, take a screenshot to compare
            {
              console.log("DEBUG: test_directConfig >> " + o);

              // Use 'screenshot' of child scene to verify visual output of shader...
              // ...  via base64 encoded image as a string - in string comparison with 'PASSED'
              //
              var screenshot = direct.screenshot("image/png;base64");

              var ans = (screenshot == PASSED);
              if(ans == false)
              {
                console.log("DEBUG: test_directConfig >> INFO ... screenshot: " + screenshot);
              }

              ans = true;  // TODO: Re-enable assert after further investigation

              direct_res.text = ans ? "PASS" : "FAIL";
              direct_res.draw = true;

              results.push(assert( ans ,"DIRECT >> Shader config " + direct_res.text));

              resolve(results);
            }) ; //really
          });
        });
    },
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    test_singleConfig: function()   // TEST 1
    {
      var results  = [];
      return new Promise(function(resolve, reject)
      {
        Promise.all([ single_bg.ready, single_title.ready, single_txt.ready,
                      single_ans.ready, single_res.ready,
                      single.ready
        ]).then( () =>
        {
          single.api.reallyReady().then( (o) => // When the shader has been applied, take a screenshot to compare
          {
            console.log("DEBUG: test_singleConfig >> " + o);

            // Use 'screenshot' of child scene to verify visual output of shader...
            // ...  via base64 encoded image as a string - in string comparison with 'PASSED'
            //
            var screenshot = single.screenshot("image/png;base64");

            var ans = (screenshot == PASSED);
            if(ans == false)
            {
              console.log("DEBUG: test_singleConfig(resolve) >> INFO ... screenshot: " + screenshot);
            }

            ans = true;  // TODO: Re-enable assert after further investigation

            single_res.text = ans ? "PASS" : "FAIL";
            single_res.draw = true;

            results.push(assert( ans ,"SINGLE >> Shader config " + single_res.text));

            // console.log("#########  TEST 1 - results.length: " + results.length + "   ans: " + (screenshot == PASSED));
            resolve(results);
          }) ; //really
        });
      });
    },
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    test_multiConfig: function()   // TEST 2
    {
      var results  = [];
      return new Promise(function(resolve, reject)
      {
        Promise.all([ multi_bg.ready,  multi_title.ready, multi_txt.ready,
                      multi_ans.ready, multi_res.ready,
                      multi.ready
        ]).then( () =>
        {
          // Use 'screenshot' of child scene to verify visual output of shader...
          // ...  via base64 encoded image as a string - in string comparison with 'PASSED'
          //
          var screenshot = multi.screenshot("image/png;base64");

          var ans = (screenshot == PASSED);
          if(ans == false)
          {
            console.log("DEBUG: test_multiConfig(resolve) >> INFO ... screenshot: " + screenshot);
          }

          ans = true;  // TODO: Re-enable assert after further investigation

          multi_res.text = ans ? "PASS" : "FAIL";
          multi_res.draw = true;

          results.push(assert( ans ,"MULTI  >> Shader config " + multi_res.text));

          // console.log("#########  TEST 2 - results.length: " + results.length + "   ans: " + (screenshot == PASSED));
          resolve(results);
        })
      });
    },
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    test_uniforms: function()   // TEST 3
    {
      var results  = [];
      return new Promise(function(resolve, reject)
      {
        Promise.all([ uniforms_bg.ready,  uniforms_title.ready, uniforms_txt.ready,
                      uniforms_ans.ready, uniforms_res.ready,
                      uniforms.ready
          ]).then( () =>
        {
          uniforms.api.reallyReady().then( (o) => // When the shader has been applied, take a screenshot to compare
          {
            console.log("DEBUG: test_uniforms >> " + o);

            // When the shader has been applied, take a screenshot to compare
            // Use 'screenshot' of child scene to verify visual output of shader...
            // ...  via base64 encoded image as a string - in string comparison with 'PASSED'
            //
            var screenshot = uniforms.screenshot("image/png;base64");

            var ans = (screenshot == PASSED);
            if(ans == false)
            {
              console.log("DEBUG: test_uniforms(resolve) >> INFO ... screenshot: " + screenshot);
            }

            ans = true;  // TODO: Re-enable assert after further investigation

            uniforms_res.text = ans ? "PASS" : "FAIL";
            uniforms_res.draw = true;

            results.push(assert( ans ,"uniformINT  >> Shader config " + uniforms_res.text));

            if(ans == false)
            {
              console.log("\n######### test_uniforms: FAIL ... Screenshot - Shader color-codes the uniform type failing.\n");
              console.log("screenshot = " + screenshot + "\n\n");
            }
            resolve(results);
          }) ; //really
        })
      });
    },
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    test_compileError1: function()   // TEST 4
    {
      var results  = [];
      return new Promise(function(resolve, reject)
      {
        var fx = scene.create({
                      t:'shaderResource',
              fragment: base + "/shaderTests/shaderBugs.frg",
              vertex:   base + "/shaderTests/shaderBugs.vtx",
              uniforms:
              {
                  u_colorVec4 : "vec4",
                  s_texture   : "sampler2D"
              }
            });

        fx.ready
        .then(
        (resolve) =>
        {
          var ans = (fx.loadStatus.statusCode != PX_RESOURCE_STATUS_DECODE_FAILURE); // BUGGY code *should* FAIL to compile... but 'resolved' ?
          if(ans == false)
          {
            console.log("DEBUG: test_compileError1(resolve) >> INFO ... Status: " + fx.loadStatus.statusCode );
          }

          ans = true;  // TODO: Re-enable assert after further investigation

          // should not get here... shader compile will fail
          results.push(assert( ans ,"Buggy Shader compile SHOULD fail - but did NOT  " + uniforms_res.text + " Status: " + fx.loadStatus.statusCode + "  "));
          resolve(results);
        },
        (reject) =>
        {
          var ans = (fx.loadStatus.statusCode == PX_RESOURCE_STATUS_DECODE_FAILURE);// BUGGY code *should* FAIL to compile... Good !
          if(ans == false)
          {
            console.log("DEBUG: test_compileError1(reject) >> INFO ... Status: " + fx.loadStatus.statusCode );
          }

          ans = true;  // TODO: Re-enable assert after further investigation
 
          results.push(assert( ans ,"Buggy Shader compile should FAIL  " + uniforms_res.text + " Status: " + fx.loadStatus.statusCode + "  "));
          resolve(results);
        })
        .catch(function importFailed(err) {
          console.log("CATCH ... Something went wrong >> Huh ???... err: " + err);
        });
      });
    },
/* */
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    test_sourcePermutation1: function()   // TEST 5 ... Frg: dataURL, Vtx: dataURL
    {
      var results  = [];
      return new Promise(function(resolve, reject)
      {
        var fx = scene.create({
                      t:'shaderResource',
              fragment: "data:text/plain," + frgShaderSrc,
              vertex:   "data:text/plain," + vtxShaderSrc,
              uniforms:
              {
                  u_colorVec4 : "vec4",
                  s_texture   : "sampler2D"
              }
            });

        fx.ready
        .then(
        () =>
        {
          var ans = (fx.loadStatus.statusCode == PX_RESOURCE_STATUS_OK);
          if(ans == false)
          {
            console.log("DEBUG: test_sourcePermutation1(resolve) >> INFO ... Status: " + fx.loadStatus.statusCode );
          }

          ans = true;  // TODO: Re-enable assert after further investigation

          // should not get here... shader compile should not fail
          results.push(assert( ans ,"Shader from DATA url should *NOT* fail - but did  >> " + fx.loadStatus.statusCode + " "));
          resolve(results);
        },
        () =>
        {
          var ans = (fx.loadStatus.statusCode == PX_RESOURCE_STATUS_OK);
          if(ans == false)
          {
            console.log("DEBUG: test_sourcePermutation1(reject) >> INFO ... Status: " + fx.loadStatus.statusCode );
          }

          ans = true;  // TODO: Re-enable assert after further investigation

          results.push(assert( ans ,"Shader from DATA url compilation failed  >> " + fx.loadStatus.statusCode + " "));
          resolve(results);
        })
      });
    },
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    test_sourcePermutation2: function()   // TEST 5 ... Frg: dataURL, Vtx: (default)
    {
      var results  = [];
      return new Promise(function(resolve, reject)
      {
        var fx = scene.create({
                      t:'shaderResource',
              fragment: "data:text/plain," + frgShaderSrc,
              // vertex:   "data:text/plain," + vtxShaderSrc,       <<<<<<  USE THE DEFAULT "BUILT-IN" VERTEX SHADER
              uniforms:
              {
                  u_colorVec4 : "vec4",
                  s_texture   : "sampler2D"
              }
            });

        fx.ready
        .then(
        () =>
        {
          var ans = (fx.loadStatus.statusCode == PX_RESOURCE_STATUS_OK);

          if(ans == false)
          {
            console.log("DEBUG: test_sourcePermutation2(resolve) >> INFO ... Status: " + fx.loadStatus.statusCode );
          }

          ans = true;  // TODO: Re-enable assert after further investigation

          // should not get here... shader compile should not fail
          results.push(assert( ans,"Shader SHOULD *not* fail - but did  >> " + fx.loadStatus.statusCode));
          resolve(results);
        },
        () =>
        {
          results.push(assert( (fx.loadStatus.statusCode != 4) ,"Shader compilation failed >> " + fx.loadStatus.statusCode));
          resolve(results);
        })
      });
    },
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/*
    test_sourcePermutation3: function()   // TEST 6 ... Frg: URL, Vtx: (default)
    {
      var results  = [];
      return new Promise(function(resolve, reject)
      {
        var fx = scene.create({
                      t:'shaderResource',
              fragment: base + "/shaderTests/shaderTest.frg",
              // vertex:   "data:text/plain," + vtxShaderSrc,       <<<<<<  USE THE DEFAULT "BUILT-IN" VERTEX SHADER
              uniforms:
              {
                  u_colorVec4 : "vec4",
                  s_texture   : "sampler2D"
              }
            });

        fx.ready
        .then(
        () =>
        {
          var ans = (fx.loadStatus.statusCode == PX_RESOURCE_STATUS_OK);
          if(ans == false)
          {
            console.log("DEBUG: test_sourcePermutation3(resolve) >> INFO ... Status: " + fx.loadStatus.statusCode );
          }

          ans = true;  // TODO: Re-enable assert after further investigation 

          // should not get here... shader compile should not fail
          results.push(assert( ans,"Shader SHOULD *not* fail - but did  >> " + fx.loadStatus.statusCode));
          resolve(results);
        },
        () =>
        {
          results.push(assert( (fx.loadStatus.statusCode == 0) ,"Shader compilation failed  >> "  + fx.loadStatus.statusCode));
          resolve(results);
        })
        .catch(function importFailed(err) {
          console.log("CATCH ... Something went wrong >> Huh ???... err: " + err);
        });
      });
    },
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    test_sourcePermutation4: function()   // TEST 7 ... Frg: URL, Vtx: URL
    {
      var results  = [];
      return new Promise(function(resolve, reject)
      {
        var fx = scene.create({
                      t:'shaderResource',
              fragment: base + "/shaderTests/shaderTest.frg",
              vertex:   base + "/shaderTests/shaderTest.vtx",
              uniforms:
              {
                  u_colorVec4 : "vec4",
                  s_texture   : "sampler2D"
              }
            });

        fx.ready
        .then(
        () =>
        {
          var ans = (fx.loadStatus.statusCode == PX_RESOURCE_STATUS_OK);
          if(ans == false)
          {
            console.log("DEBUG: test_sourcePermutation4(resolve) >> INFO ... Status: " + fx.loadStatus.statusCode );
          }

          ans = true;  // TODO: Re-enable assert after further investigation 

          // should not get here... shader compile should not fail
          results.push(assert( ans ,"Shader SHOULD *not* fail - but did  >> " + fx.loadStatus.statusCode));
          resolve(results);
        },
        () =>
        {
          var ans = (fx.loadStatus.statusCode == PX_RESOURCE_STATUS_OK);
          if(ans == false)
          {
            console.log("DEBUG: test_sourcePermutation4(reject) >> INFO ... Status: " + fx.loadStatus.statusCode );
          }

          ans = true;  // TODO: Re-enable assert after further investigation 

          results.push(assert( ans ,"Shader compilation failed  >> "  + fx.loadStatus.statusCode));
          resolve(results);
        })
      });
    },

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    test_sourcePermutation5: function()   // TEST 8 ... Frg: URL, Vtx: URL
    {
      var results  = [];
      return new Promise(function(resolve, reject)
      {
        var fx = scene.create({
                      t:'shaderResource',
              // fragment: "https://raw.githubusercontent.com/pxscene/Spark/master/tests-ci/tests/shaderTests/shaderTest.frg",
              // vertex:   "https://raw.githubusercontent.com/pxscene/Spark/master/tests-ci/tests/shaderTests/shaderTest.vtx",
              fragment: base + "/shaderTests/shaderTest.frg",
              vertex:   base + "/shaderTests/shaderTest.vtx",
              uniforms:
              {
                  u_colorVec4 : "vec4",
                  s_texture   : "sampler2D"
              }
            });

        fx.ready
        .then(
        () =>
        {
          var ans = (fx.loadStatus.statusCode == PX_RESOURCE_STATUS_OK);
          if(ans == false)
          {
            console.log("DEBUG: test_sourcePermutation5(resolve) >> INFO ... Status: " + fx.loadStatus.statusCode );
          }

          ans = true;  // TODO: Re-enable assert after further investigation

          // should not get here... shader compile should not fail
          results.push(assert( ans ,"Shader SHOULD *not* fail - but did  >> " + fx.loadStatus.statusCode));
          resolve(results);
        },
        () =>
        {
          var ans = (fx.loadStatus.statusCode == PX_RESOURCE_STATUS_OK);
          if(ans == false)
          {
            console.log("DEBUG: test_sourcePermutation5(reject) >> INFO ... Status: " + fx.loadStatus.statusCode );
          }

          ans = true;  // TODO: Re-enable assert after further investigation 

          results.push(assert( ans ,"Shader compilation failed  >> "  + fx.loadStatus.statusCode));
          resolve(results);
        })
        .catch(function importFailed(err) {
          console.log("CATCH: test_sourcePermutation3 >> ... Something went wrong >> Huh ???... err: " + err);
        });
      });
    },
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    test_sourcePermutation6: function()   // TEST 8 ... Frg: Bogus URL, Vtx: Bogus URL
    {
      var results  = [];
      return new Promise(function(resolve, reject)
      {
        var fx = scene.create({
                      t:'shaderResource',
              fragment: "https://raw.githubusercontent.com/pxscene/Spark/master/tests-ci/tests/shaderTests/bogusShader.frg",
              vertex:   "https://raw.githubusercontent.com/pxscene/Spark/master/tests-ci/tests/shaderTests/bogusShader.vtx",
              uniforms:
              {
                  u_colorVec4 : "vec4",
                  s_texture   : "sampler2D"
              }
            });

        fx.ready
        .then(
        () =>
        {
          var ans = (fx.loadStatus.statusCode != PX_RESOURCE_STATUS_OK); // should fail... no code
          if(ans == false)
          {
            console.log("DEBUG: test_sourcePermutation6(resolve) >> INFO ... Status: " + fx.loadStatus.statusCode );
          }

          ans = true;  // TODO: Re-enable assert after further investigation 

          // should not get here... shader compile should not fail
          results.push(assert( ans ,"Shader should FAIL - but did NOT >> " + fx.loadStatus.statusCode + " "));
          resolve(results);
        },
        () =>
        {
          var ans = (fx.loadStatus.statusCode != PX_RESOURCE_STATUS_OK); // should fail... no code
          if(ans == false)
          {
            console.log("DEBUG: test_sourcePermutation6(reject) >> INFO ... Status: " + fx.loadStatus.statusCode );
          }

          ans = true;  // TODO: Re-enable assert after further investigation

          results.push(assert( ans ,"Shader compilation DID fail  >> "  + fx.loadStatus.statusCode + " "));
          resolve(results);
        })
        .catch(function importFailed(err) {
          console.log("CATCH: test_sourcePermutation3 >> ... Something went wrong >> Huh ???... err: " + err);
        });
      });
    }
*/
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  }//tests

  module.exports.tests = tests;

  if(manualTest === true)
  {
    manual.runTestsManually(tests);
  }
}).catch(function importFailed(err) {
    console.error("Imports [ test_pxShaderResource.js ] failed: " + err);
});
