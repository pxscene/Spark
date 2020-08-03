px.import({       scene: 'px:scene.1.js'
}).then( function importsAreReady(imports)
{
  var scene = imports.scene;
  var root  = imports.scene.root;
  var base  = px.getPackageBaseFilePath();

  var hasShaders    = true;

  const STRETCH = scene.stretch.STRETCH;

  if( scene.capabilities                  == undefined ||
      scene.capabilities.graphics         == undefined ||
      scene.capabilities.graphics.shaders == undefined ||
      scene.capabilities.graphics.shaders < 1)
  {
    // If Shader is not supported...
    hasShaders = false;
    throw "EXPCEPTION - Shaders are not supported in this version of Spark..."
  }

  var ss    = 0.9;
  var bg    = scene.create({ t: 'rect',  parent: root, x:        10, y:        10, w: 1260, h: 700, fillColor: '#111', interactive: false});
  var image = scene.create({ t: 'image', parent:   bg, x: scene.w * ss, y: scene.h * ss, w: 1260, h: 700, px: 0.5, py: 0.5, url: base + "/images/RainyBridge.jpg", stretchX: STRETCH, stretchY: STRETCH, interactive: false });

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  function CreateShader(filename)
  {
    var shader = scene.create({
                 t: 'shaderResource',
          fragment: base + "/shaders/" + filename,
          uniforms:
          {
            "u_time"      : "float",
            "u_resolution": "vec2",
            "s_texture"   : "sampler2D"
          }
        });

        return shader;
  };

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  if(hasShaders == true)
  {
    var shader1 = CreateShader("Heartfelt.frg");
    image.effect = shader1;
  }

  scene.on("onResize", function (e)
  {
    updateSize(e.w, e.h);
  });

  function updateSize(w, h)
  {
    var ww = w*ss - 10;
    var hh = h*ss - 10;

    var xx = w/2;
    var yy = h/2;

    image.animateTo({ w: ww, h: hh, x: xx, y: yy }, 0.5);
  }

  updateSize(scene.w, scene.h);

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

}).catch(function importFailed(err) {
  console.error('Import for RainyBridge.js failed: ' + err);
});