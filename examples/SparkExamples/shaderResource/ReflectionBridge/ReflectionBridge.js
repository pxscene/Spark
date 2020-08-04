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
  }

  var ss    = 0.9;
  var bg    = scene.create({ t: 'rect',  parent: root, x:        10, y:        10, w: 1260, h: 700, fillColor: '#111', interactive: false});
  var image = scene.create({ t: 'image', parent: root, x: scene.w/2, y: scene.h/2, w: 1280, h: 720, px: 0.5, py: 0.5, url: base + "/images/bridge.jpg", stretchX: STRETCH, stretchY: STRETCH, interactive: false });

  var heart_res = scene.create({ t: 'imageResource', url:  base + "/images/heart.svg", w: 25, h: 25});

  var clip_obj = scene.create({ t: 'object', parent: image, x: scene.w/2, y: scene.h/2, fillColor: "#888", w: 300, h: 550, px: 0.5, py: 0.5, interactive: false, draw: false });
  var logo     = scene.create({ t: 'image',  parent: clip_obj, x: 10, y: 300, w: 100, h: 100, cx: 128, cy: 128, url: base + "/images/Spark_logo256px.png", interactive: false });

  var message_obj = scene.create({ t: 'object', parent: clip_obj, x: 0, y: 300, fillColor: "#888", w: 300, h: 20, px: 0.5, py: 0.5, interactive: false, draw: false });

  var made_with = scene.create({t:'text', w: 100, h: 20,  x: 100, y: 0, parent: message_obj,
                    pixelSize: 24, textColor:'#fff', text:  'Made with ', interactive: false });

  var heart_img = scene.create({ t: 'image', parent: message_obj, x: 223, y: 10, w: 25, h: 25, resource: heart_res, interactive: false });

  var in_philly = scene.create({t:'text', w: 100, h: 20,  x: 260, y: 0, parent: message_obj,
              pixelSize: 24, textColor:'#fff', text:  'in Philadelphia', interactive: false });


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

  Promise.all([bg.ready, image.ready, heart_res.ready, made_with.ready, heart_img.ready, in_philly.ready]).then( () =>
  {
    clip_obj.draw    = true;
    message_obj.draw = true;

    if(hasShaders == true)
    {
      image.effect = CreateShader("WaterReflection.frg");

      setTimeout( () =>
      {
        logo.animateTo({ y: 10 }, 2.5);

        setTimeout( () =>
        {
          logo.animateTo({ y: 300 }, 2.5);

          setTimeout( () => { message_obj.animateTo({ y: 225 }, 2.5); }, 1500)
        }, 8000)

      }, 2000)
    }
  });


  scene.on("onResize", function (e)
  {
    updateSize(e.w, e.h);
  });

  function updateSize(w, h)
  {
    var ww = w * ss
    var hh = h * ss

    image.animateTo({ w: ww, h: hh }, 0.5);
  }

  updateSize(scene.w, scene.h);

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

}).catch(function importFailed(err) {
  console.error('Import for RainyBridge.js failed: ' + err);
});