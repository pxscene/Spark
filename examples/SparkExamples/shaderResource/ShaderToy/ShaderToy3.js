px.import({       scene: 'px:scene.1.js',
                  keys:  'px:tools.keys.js',
}).then( function importsAreReady(imports)
{
  var scene = imports.scene;
  var root  = imports.scene.root;
  var keys  = imports.keys;
  var base  = px.getPackageBaseFilePath();

  var hasShaders    = true;
  var intervalTimer = null;
  var index         = 0;

  if( scene.capabilities                  == undefined ||
      scene.capabilities.graphics         == undefined ||
      scene.capabilities.graphics.shaders == undefined ||
      scene.capabilities.graphics.shaders < 1)
  {
    // If Shader is not supported...
    hasShaders = false;
    throw "EXPCEPTION - Shaders are not supported in this version of Spark..."
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  var rect1 = scene.create({ t: 'rect', parent: root, fillColor: '#f00', px: 1.0, py: 1.0, x: 1280/2, y: 720/2, w: 1260/2, h: 700/2, cx: 1260/2/2, cy: 700/2/2 });
  var rect2 = scene.create({ t: 'rect', parent: root, fillColor: '#0f0', px: 0.0, py: 1.0, x: 1280/2, y: 720/2, w: 1260/2, h: 700/2, cx: 1260/2/2, cy: 700/2/2 });
  var rect3 = scene.create({ t: 'rect', parent: root, fillColor: '#00f', px: 1.0, py: 0.0, x: 1280/2, y: 720/2, w: 1260/2, h: 700/2, cx: 1260/2/2, cy: 700/2/2 });
  var rect4 = scene.create({ t: 'rect', parent: root, fillColor: '#ff0', px: 0.0, py: 0.0, x: 1280/2, y: 720/2, w: 1260/2, h: 700/2, cx: 1260/2/2, cy: 700/2/2 });

  var toys = [
      // "RollingHills.frg", // IFFY
      // "InsideTheMatrix.frg",  // ES 3.0 :(
      "ElectricSinusoid.frg",
      "LightsInSmoke.frg",
      "BokehTraffic.frg",
      "TambysSnowflakes.frg",
      "BokehBlur.frg",
      "UltraLiquidBokeh.frg",
      "TileableWaterCaustic.frg",
      "LiquidCubes.frg",
      "RaymarchedReflections.frg",
      "Supernovae.frg",
      "Protophore.frg",
      "GalaxyOfUniverses.frg",
      "AwesomeStar.frg",
      "MandelbrotSmooth.frg",
      "Threads.frg",
      "ProteanClouds.frg",
      "GiveItMoire.frg",
      "Seascape.frg",
      "Creation.frg",
      "Flame.frg",
      "Warping.frg",
      "Voronoise.frg",
      "MengerSponge.frg",
      "MandelbrotDistance.frg",
      "BallofFire.frg",
      "RayTracingSphereExample.frg",
      "Bubbles.frg",
      "OnOffSpikes.frg",
      "DiskIntersection.frg",
      "CubesAndSpheres.frg",
  ];

  var CaptionBG = scene.create({ t: 'rect', parent: root, fillColor: '#0008', x: scene.w/2, y: rect1.h - 50, w: rect1.w, h: 40, a: 0});
  var Caption   = scene.create({ t: 'textBox', w: rect1.w, h: 40, parent: CaptionBG, a: 1,
                      pixelSize: 24, textColor: '#fff', text: '...', interactive: false,
                      alignVertical:   scene.alignVertical.CENTER, 
                      alignHorizontal: scene.alignHorizontal.CENTER});

  var MessageBG = scene.create({ t: 'rect', parent: root, fillColor: '#0008', x: 10, y: 10, w: 120, h: 40, a: 0});
  var Message   = scene.create({ t: 'textBox', w: 120, h: 40, parent: MessageBG, a: 1,
                      pixelSize: 24, textColor: '#fff', text: '...', interactive: false,
                      alignVertical:   scene.alignVertical.CENTER, 
                      alignHorizontal: scene.alignHorizontal.CENTER});

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  function showHide(o)
  {
    o.animateTo({a: 1.0}, 0.25);
    setTimeout( () => { o.animateTo({a: 0.0}, 0.2); }, 2000 );
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  function showCaption(txt, x = 0.5, y = (rect1.h - 50) )
  {
    Caption.text = txt;

    Caption.ready.then( () =>
    {
      var metrics = Caption.measureText();

      CaptionBG.w = (metrics.bounds.x2 -  metrics.bounds.x1) + 20;
      CaptionBG.h = (metrics.bounds.y2 -  metrics.bounds.y1) + 10;

      Caption.w   = CaptionBG.w;
      Caption.h   = CaptionBG.h;

      CaptionBG.x = x;
      CaptionBG.x = y;

      if(x == 0.5)
      {
        CaptionBG.x = (scene.w - CaptionBG.w) / 2;
      }

      showHide(CaptionBG);
    });
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  function CreateShader(filename)
  {
    var name = filename.split('.').slice(0, -1).join('.')

    showCaption(name);

    var shader = scene.create({
                 t: 'shaderResource',
          fragment: base + "/shaders/" + filename,
          uniforms:
          {
            "u_time"      : "float",
            "u_resolution": "vec2"
          }
        });

        return shader;
  };

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  var paused = false;

  rect1.on('onKeyUp', function(e)
  {
    if(e.keyCode == keys.SPACE)
    {
      // Handle KEYUP event
      paused = !paused;

      Message.text = (paused ? "PAUSED" : "Unpaused");
      showHide( MessageBG );
    }
    else
    if(e.keyCode == keys.LEFT)
    {
      Message.text = "PREV";
      showHide( MessageBG );

      PrevShader();
    }
    else
    if(e.keyCode == keys.RIGHT)
    {
      Message.text = "NEXT";
      showHide( MessageBG );

      NextShader();
    }
  });

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  function NextShader()
  {
    index++;
    if(index >= toys.length )
      index = 0; // WRAP

    ResetInterval();
    CreateShader(toys[index]);
  }

  function PrevShader()
  {
    index--;
    if(index < 0 )
      index = toys.length - 1; // WRAP

    ResetInterval();
    CreateShader(toys[index]);
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  function ResetInterval()
  {
    if(intervalTimer)
    {
      clearInterval(intervalTimer);
    }

    intervalTimer = setInterval( () =>
    {
      if(paused == false)
      {
        NextShader();

  //      console.log("Shader Index: " + index);
      }
    }, 4000);
  }

  if(hasShaders == true)
  {
    var shader1 = CreateShader("ElectricSinusoid.frg");
    rect1.effect = shader1;

    var shader2 = CreateShader("Bubbles.frg");
    rect2.effect = shader2;

    var shader3 = CreateShader("BokehBlur.frg");
    rect3.effect = shader3;

    var shader4 = CreateShader("UltraLiquidBokeh.frg");
    rect4.effect = shader4;

  //  ResetInterval();
  }


  scene.on("onResize", function (e)
  {
    updateSize(e.w, e.h);
  });

  function updateSize(w, h)
  {
    var rects = [rect1, rect2, rect3, rect4];

    rects.map(r =>
    {
      var ww = w/2 - 10;
      var hh = h/2 - 10;

      var xx = w/2;
      var yy = h/2;

      r.animateTo({ w: ww, h: hh, x: xx, y: yy }, 0.5);
    });

    Caption.w   = rect1.w;
    CaptionBG.w = rect1.w;
    CaptionBG.y = rect1.h - 50;
  }

  updateSize(scene.w, scene.h);

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

}).catch(function importFailed(err) {
  console.error('Import for ShaderToy2.js failed: ' + err);
});