px.import({       scene: 'px:scene.1.js'
}).then( function importsAreReady(imports)
{
  var scene = imports.scene;
  var root  = imports.scene.root;
  var base  = px.getPackageBaseFilePath();

  var hasShaders = true;

  if( scene.capabilities                  == undefined ||
      scene.capabilities.graphics         == undefined ||
      scene.capabilities.graphics.shaders == undefined ||
      scene.capabilities.graphics.shaders < 1)
  {
    // If Shader is not supported...
    hasShaders = false;
  }

  var direct_URL = base + "/directTest.js"
  var single_URL = base + "/singlepassTest.js"
  var multi_URL  = base + "/multipassTest.js"

  var PASSED = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPAAAACHCAYAAAAoctTrAAABp0lEQVR4nO3VsQ2DUBAFQWPRM5QAVePUIcJCn5Vn4gtesrrXCwAAAAAAAAAAgN9Mpy+37bhxB/BtXU+1+b57B3AfAUOYgCFMwBAmYAgTMIQJGMIEDGEChjABQ5iAIUzAECZgCBMwhAkYwgQMYQKGMAFDmIAhTMAQJmAIEzCECRjCBAxhAoYwAUOYgCFMwBA2jx7wBMeyjJ7ABdO+j54wnA8MYQKGMAFDmIAhTMAQJmAIEzCECRjCBAxhAoYwAUOYgCFMwBAmYAgTMIQJGMIEDGEChjABQ5iAIUzAECZgCBMwhAkYwgQMYQKGMAFDmIAhTMAQJmAIEzCECRjCBAxhAoYwAUOYgCFMwBAmYAgTMIQJGMIEDGEChjABQ5iAIUzAECZgCBMwhAkYwgQMYQKGMAFDmIAhTMAQJmAIEzCECRjC5tEDnmDa99ET4BIfGMIEDGEChjABQ5iAIUzAECZgCBMwhAkYwgQMYQKGMAFDmIAhTMAQJmAIEzCECRjCBAxhAoYwAUOYgCFMwBAmYAgTMIQJGMIEDGEChjABAwAAAAAAAAAAAH/sA3PtB/2R0gFhAAAAAElFTkSuQmCC";

  // Smaller image ... smaller Base64 result string.
  var ww = 480/2;
  var hh = 270/2;

  var xx = (1280)/2;
  var yy = ( 720)/3;

  var bg           = scene.create({ t: 'rect',    parent: root, x: 10, y: 10, w: 1260, h: 700, fillColor: '#111', interactive: false});

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

  var multi_bg     = scene.create({ t: 'rect',    parent:       bg,  x: xx * 1.5 - ww/2, y: yy, w: ww, h: hh, fillColor: "#888", lineColor: "#fff", lineWidth: 2 });
  var multi        = scene.create({ t: 'scene',   parent: multi_bg,  x:         0, y:  0, w: ww, h: hh, url: multi_URL, interactive: false });

  var multi_title  = scene.create({ t: 'text', parent:    root,  x: multi_bg.x + 65, y: multi_bg.y - 25, w: 300, h: 20,
                                pixelSize: 18,  textColor: '#fff',  text: 'MULTI CONFIG', interactive: false });

  var multi_txt    = scene.create({ t: 'text', parent:     root,  x: multi_bg.x + 20, y: multi_bg.y + multi_bg.h + 15, w: 300, h: 20,
                                pixelSize: 24, textColor: '#fff',  text: 'Expected Color: ', interactive: false });

  var multi_ans    = scene.create({ t: 'rect', parent: bg, x: multi_txt.x + multi_txt.w + 10, y: multi_txt.y, w: 20, h: 20, fillColor: "#FFF", lineColor: "#fff", lineWidth: 2, focus: true });

  var multi_res    = scene.create({ t: 'text', parent: root, x: multi_bg.x + multi.w/2 - 22, y: multi_bg.y + multi_bg.h/2 - 10, w: 300, h: 20,
                      pixelSize: 24,  textColor: '#000',  text:  '####', interactive: false, draw: false });

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  var direct_bg    = scene.create({ t: 'rect',    parent:        bg, x: xx/2 - ww/2, y: yy, w: ww, h: hh, fillColor: "#888", lineColor: "#fff", lineWidth: 2 });
  var direct       = scene.create({ t: 'scene',   parent: direct_bg, x:    0, y:  0,        w: ww, h: hh, url: direct_URL, interactive: false });

  var direct_title = scene.create({ t: 'text', parent:    root,  x: direct_bg.x + 60, y: direct_bg.y - 25, w: 300, h: 20,
                                pixelSize: 18,  textColor: '#fff',  text: 'DIRECT CONFIG', interactive: false });

  var direct_txt   = scene.create({ t: 'text', parent:    root,  x: direct_bg.x + 20, y: direct_bg.y + direct_bg.h + 15, w: 300, h: 20,
                                pixelSize: 24,  textColor: '#fff',  text: 'Expected Color: ', interactive: false });

  var direct_ans   = scene.create({ t: 'rect', parent: bg, x: direct_txt.x + direct_txt.w + 10, y: direct_txt.y, w: 20, h: 20, fillColor: "#fff", lineColor: "#888", lineWidth: 2 });

  var direct_res   = scene.create({ t: 'text', parent: root, x: direct_bg.x + direct.w/2 - 22, y: direct_bg.y + direct_bg.h/2 - 10, w: 300, h: 20,
                      pixelSize: 24,  textColor: '#000',  text:  '####', interactive: false, draw: false });

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  setTimeout( () =>
  {
    //
    // NOTE:  Changes to a shaders Uniforms >> DIRECTLY << may be overwritten of other shared uses of the shader
    //
    direct.ready.then(() =>
    {
      var screenshot = direct.screenshot("image/png;base64");

      // console.log("direct = " + screenshot)
      direct_res.text = (screenshot == PASSED) ? "PASS" :  "FAIL";
      direct_res.draw = true;
    })

    single.ready.then(() =>
    {
      var screenshot = single.screenshot("image/png;base64");

      // console.log("single = " + screenshot)
      single_res.text = (screenshot == PASSED) ? "PASS" :  "FAIL";
      single_res.draw = true;
    })

    multi.ready.then(() =>
    {
      var screenshot = multi.screenshot("image/png;base64");

      // console.log("multi = " + screenshot)
      multi_res.text = (screenshot == PASSED) ? "PASS" :  "FAIL";
      multi_res.draw = true;
    })

  }, 2000)

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

}).catch(function importFailed(err) {
  console.error('Import for runShaderTest.js failed: ' + err);
});