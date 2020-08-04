px.import({       scene: 'px:scene.1.js'
}).then( function importsAreReady(imports)
{
  var scene = imports.scene;
  var root  = imports.scene.root;
  var base  = px.getPackageBaseFilePath();

  if( scene.capabilities                  == undefined ||
      scene.capabilities.graphics         == undefined ||
      scene.capabilities.graphics.shaders == undefined ||
      scene.capabilities.graphics.shaders < 1)
  {
    // If Shader is not supported...
    hasShaders = false;
    throw "EXPCEPTION - Shaders are not supported in this version of Spark..."
  }

  const STRETCH = scene.stretch.STRETCH;

  var URL   = "http://www.sparkui.org/examples/gallery/fancy.js";

  var ss = 0.375;
  var sx = ss;
  var sy = ss;

  var xx = 1280/2;
  var yy =  720/2;

  var bg            = scene.create({ t: 'rect',  parent:     root, x:      10, y:    10, w:    1260, h:     700, cx: 1260/2, cy: 700/2, fillColor: '#111', interactive: false});
  var stage_bg      = scene.create({ t: 'rect',  parent:       bg, x: xx - 10, y:    yy, w:     480, h:     270, px: 1.0, py: 0.5,      fillColor: "#888", lineColor: "#fff", lineWidth: 2, focus: true });
  var stage         = scene.create({ t: 'scene', parent: stage_bg, x:       0, y:     0, w: scene.w, h: scene.h, sx: sx, sy: sy, url: URL, interactive: false, clip: true, stretchX: STRETCH, stretchY: STRETCH });
  var screenshot_bg = scene.create({ t: 'rect',  parent:       bg, x: stage_bg.x + 20,   y:   stage_bg.y + 220, w:    1260, h:     700, sx: sx, sy: sy, px: 0.0, py: 0.5, fillColor: "#888", lineColor: "#fff", lineWidth: 2, focus: true });
  var screenshot    = null;

  var dy = stage_bg.y + 170;

  var snapButton = scene.create({ t: 'rect',  parent: bg,         x:  xx, y: dy, w:  50, h: 30, px: 0.5, py: 0.5, fillColor: "#088", lineColor: "#fff", lineWidth: 1 });
  var snapText   = scene.create({ t: 'text',  parent: snapButton, x:   9, y:  3, w: 100, h: 20, pixelSize: 14,    textColor:'#fff', text:  'snap', interactive: false });

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  // http://127.0.0.1/BlurShot.js

  var blurShader   = null;
  var kernelRadius = 0;
  var blurAmount   = 0;

  blurShader = scene.create({  t:'shaderResource',
                        fragment: base + "/BlurShader.frg",
                        uniforms:
                              {
                                  "u_direction"   : "vec2",
                                  "u_kernelRadius": "float",
                                  "s_texture"     : "sampler2D"
                              } });

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  snapButton.on("onMouseUp",   function(e) {  e.target.y -= 2; });
  snapButton.on("onMouseDown", function(e) {  e.target.y += 2;

    screenshot = stage.screenshot("image/image");

    screenshot.parent = screenshot_bg;
    screenshot.x = 0;
    screenshot.y = 0;
    screenshot.w = screenshot_bg.w;
    screenshot.h = screenshot_bg.h;

    doBlur();
  });

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  function doBlur()
  {
    // // setInterval( () =>
    // // {
    //       blurAmount  += 0.1;
    //       kernelRadius = Math.max(1, blurAmount /4);

    blurAmount   = 10.5;
    kernelRadius = Math.max(1, blurAmount /4);

    screenshot.effect =
    [
      {
          name: "Pass 1",
        shader: blurShader,
      uniforms: {
                  u_kernelRadius: kernelRadius,
                  u_direction:    [blurAmount, 0]  // HORIZONTAL
                }
      },
      {
          name: "Pass 2",
        shader: blurShader,
      uniforms: {
                  u_kernelRadius: kernelRadius,
                  u_direction:    [0, blurAmount]  // VERTICAL
                }
      }
    ];

    console.log("BLURRED !!!");

    // },1800);
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

}).catch(function importFailed(err) {
  console.error('Import for BlurShader.js failed: ' + err);
});