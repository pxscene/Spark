px.import({       scene: 'px:scene.1.js',
                  keys:  'px:tools.keys.js',
}).then( function importsAreReady(imports)
{
  var scene = imports.scene;
  var root  = imports.scene.root;
  var keys  = imports.keys;
  var base  = px.getPackageBaseFilePath();

  var hLEFT   = scene.alignHorizontal.LEFT
  var hCENTER = scene.alignHorizontal.CENTER
  var vCENTER = scene.alignVertical.CENTER

  var gpuHeavy = true;  // default to TRUE unless param set

  if(px.appQueryParams.gpuHeavy != undefined)
  {
    gpuHeavy = (px.appQueryParams.gpuHeavy == "true");
  }

  console.log("INFO: Using gpuHeavy: " + gpuHeavy);

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

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

  var noiseGRAY = scene.create({ t: 'imageResource', url: base + "/images/Gray_Noise_Medium256x256.png" });
  var noiseRGBA = scene.create({ t: 'imageResource', url: base + "/images/RGBA_Noise_Medium256x256.png" });
  var stars     = scene.create({ t: 'imageResource', url: base + "/images/stars.jpg" });
  var organic2  = scene.create({ t: 'imageResource', url: base + "/images/organic2.jpg" });

  var header = `#ifdef GL_ES
                  precision mediump float;
                #endif

                uniform vec2        u_resolution;
                uniform vec4        u_mouse;

                uniform float       u_time;
                uniform sampler2D   s_texture0;
                uniform sampler2D   s_texture1;

                #define mat2x2      mat2
                #define iResolution u_resolution
                #define iTime       u_time
                #define iChannel0   s_texture0
                #define iChannel1   s_texture1

                #define iMouse      u_mouse
                #define texture     texture2D
                #define textureLod  texture2D
                `;

  var toys =
  [
    { filename: "Spectrum.frg",                gpuHeavy: false },
    { filename: "GradientCircles.frg",         gpuHeavy: false },
    { filename: "WarpVortex.frg",              gpuHeavy: false },
    { filename: "SpaceCurvature.frg",          gpuHeavy: true,  texture0: stars , texture1: organic2 },   // ## HEAVY
    { filename: "FlightOverBespin.frg",        gpuHeavy: true  }, // ## HEAVY
    { filename: "PlanetShadertoy.frg",         gpuHeavy: true  }, // ## HEAVY
    { filename: "TheHomeDrive.frg",            gpuHeavy: true  }, // ## HEAVY
    { filename: "FlowOfCells.frg",             gpuHeavy: false },
    { filename: "GeodesicTiling.frg",          gpuHeavy: true  }, // ## HEAVY
    { filename: "FluxCore.frg",                gpuHeavy: true  }, // ## HEAVY
    { filename: "InfinityMatrixLite.frg",      gpuHeavy: true  }, // ## HEAVY
    { filename: "ElectricSinusoid.frg",        gpuHeavy: false },
    { filename: "TriangleGridContouring.frg",  gpuHeavy: true },
    { filename: "LightsInSmoke.frg",           gpuHeavy: true  }, // ## HEAVY
    { filename: "BokehTraffic.frg",            gpuHeavy: true  }, // ## HEAVY
    { filename: "TambysSnowflakes.frg",        gpuHeavy: true  }, // ## HEAVY
    { filename: "BokehBlur.frg",               gpuHeavy: true  }, // ## HEAVY
    { filename: "UltraLiquidBokeh.frg",        gpuHeavy: true  }, // ## HEAVY
    { filename: "TileableWaterCaustic.frg",    gpuHeavy: false },
    { filename: "LiquidCubes.frg",             gpuHeavy: true  }, // ## HEAVY
    { filename: "RaymarchedReflections.frg",   gpuHeavy: true  }, // ## HEAVY
    { filename: "Supernovae.frg",              gpuHeavy: true  }, // ## HEAVY
    { filename: "Protophore.frg",              gpuHeavy: true  }, // ## HEAVY
    { filename: "GalaxyOfUniverses.frg",       gpuHeavy: true  }, // ## HEAVY
    { filename: "AwesomeStar.frg",             gpuHeavy: true  }, // ## HEAVY
    { filename: "MandelbrotSmooth.frg",        gpuHeavy: true  }, // ## HEAVY
    { filename: "Threads.frg",                 gpuHeavy: true  }, // ## HEAVY
    { filename: "ProteanClouds.frg",           gpuHeavy: true  }, // ## HEAVY
    { filename: "GiveItMoire.frg",             gpuHeavy: true  }, // ## HEAVY
    { filename: "Seascape.frg",                gpuHeavy: true  }, // ## HEAVY
    { filename: "Creation.frg",                gpuHeavy: false },
    { filename: "Flame.frg",                   gpuHeavy: false },
    { filename: "Warping.frg",                 gpuHeavy: true  }, // ## HEAVY
    { filename: "Voronoise.frg",               gpuHeavy: false },
    { filename: "MengerSponge.frg",            gpuHeavy: true  }, // ## HEAVY
    { filename: "MandelbrotDistance.frg",      gpuHeavy: false },
    { filename: "BallofFire.frg",              gpuHeavy: false },
    { filename: "RayTracingSphereExample.frg", gpuHeavy: true  }, // ## HEAVY
    { filename: "Bubbles.frg",                 gpuHeavy: true  }, // ## HEAVY
    { filename: "OnOffSpikes.frg",             gpuHeavy: true  }, // ## HEAVY
    { filename: "DiskIntersection.frg",        gpuHeavy: true  }, // ## HEAVY
    { filename: "CubesAndSpheres.frg",         gpuHeavy: true  }, // ## HEAVY
    { filename: "SeascapeSailing.frg",         gpuHeavy: true  }, // ## HEAVY
    { filename: "InversionMachine.frg",        gpuHeavy: true  }, // ## HEAVY

//    { filename: "ExplosionEffect.frg", gpuHeavy: true,  texture0: noiseRGBA },

    { filename: "Clouds.frg",          gpuHeavy: true, texture0: noiseRGBA }, // HEAVY
    { filename: "Generators.frg",      gpuHeavy: true, texture0: noiseRGBA }, // HEAVY
//    { filename: "DigitalBrain.frg",  gpuHeavy: true,  texture0: noiseRGBA }, // HEAVY
    { filename: "2DClouds.frg",        gpuHeavy: true, texture0: noiseRGBA }, // HEAVY
    { filename: "Oceanic.frg",         gpuHeavy: true, texture0: noiseGRAY }, // HEAVY
    { filename: "RainierMood.frg",     gpuHeavy: true, texture0: noiseRGBA } // HEAVY
  ];

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  var hasShaders    = true;
  var intervalTimer = null;
  var index         = -1;

  var       url = base + "/images/Spark_logo20px.png";

  var rect      = scene.create({ t: 'rect', parent: root, fillColor: '#0008', x: 10, y: 10, w: scene.w - 5, h: scene.h - 5, cx: (scene.w-20)/2, cy: (scene.h-20)/2, focus: true});


  var LogoBG    = scene.create({ t: 'rect',    parent: root,   x: (rect.w - 20), y: (rect.h - 20),  w: 160, h: 40, px: 1.0, py: 1.0, fillColor: '#0008' });
  var LogoIMG   = scene.create({ t: 'image',   parent: LogoBG, x: (LogoBG.w - 15), y: (LogoBG.h /2),  w: 20,  h: 20, url: url, px: 1.0, py: 0.5 });
  var LogoTXT   = scene.create({ t: 'textBox', parent: LogoBG, x: 20, w: LogoBG.w - 20, h: LogoBG.h,
                      pixelSize: 18, textColor: '#fff', text: 'Powered by ', interactive: false,
                      alignHorizontal: hLEFT, alignVertical: vCENTER});


  var CaptionBG = scene.create({ t: 'rect', parent: root, fillColor: '#0008', x: scene.w/2, y: rect.h - 20, w: rect.w/2, h: 40, px: 0.5, py: 1.0, a: 0});
  var Caption   = scene.create({ t: 'textBox', w: rect.w, h: 40, parent: CaptionBG, a: 1,
                      pixelSize: 24, textColor: '#fff', text: '...', interactive: false,
                      alignHorizontal: hCENTER, alignVertical: vCENTER});

  var MessageBG = scene.create({ t: 'rect', parent: root, fillColor: '#0008', x: 10, y: 10, w: 120, h: 40, a: 0});
  var Message   = scene.create({ t: 'textBox', w: 120, h: 40, parent: MessageBG, a: 1,
                      pixelSize: 24, textColor: '#fff', text: '...', interactive: false,
                      alignHorizontal: hCENTER, alignVertical: vCENTER});

  var fooRGBA    = scene.create({ t: 'image', parent: root, resource: noiseRGBA, x: 0, y: 0, interactive: false, a: 0.01 });
  var fooGRAY    = scene.create({ t: 'image', parent: root, resource: noiseGRAY, x: 0, y: 0, interactive: false, a: 0.01 });
  var fooSTARS   = scene.create({ t: 'image', parent: root, resource: stars,     x: 0, y: 0, interactive: false, a: 0.01 });
  var fooORGANIC = scene.create({ t: 'image', parent: root, resource: organic2,  x: 0, y: 0, interactive: false, a: 0.01 });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  function showHide(o)
  {
    o.animateTo({a: 1.0}, 0.25);
    setTimeout( () => { o.animateTo({a: 0.0}, 0.2); }, 2000 );
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  function showCaption(index, txt)
  {
    Caption.text = (index + 1) + ". " + txt;

    Caption.ready.then( () =>
    {
      var metrics = Caption.measureText();

      CaptionBG.w = (metrics.bounds.x2 -  metrics.bounds.x1) + 20;
      CaptionBG.h = (metrics.bounds.y2 -  metrics.bounds.y1) + 10;

      Caption.w   = CaptionBG.w;
      Caption.h   = CaptionBG.h;

      showHide(CaptionBG);
    });
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  function isObject(val)
  {
    return val instanceof Object;
  }

  var shaderToy = null;

  function LoadShader(shader)
  {
    var filename = isObject(shader) ? shader.filename : shader;
    var texture0 = isObject(shader) ? shader.texture0 : null;
    var texture1 = isObject(shader) ? shader.texture1 : null;
    var texture2 = isObject(shader) ? shader.texture2 : null;

    var name = filename.split('.').slice(0, -1).join('.')

    showCaption(index, name);

    var fileLoadPromise = px.getModuleFile("/shaders/" + filename);
    fileLoadPromise.then(function(shader)
    {
      var main = `void mainImage(out vec4, in vec2);
                  void main(void) { mainImage(gl_FragColor, gl_FragCoord.xy); }`;

      var hasMainImage = (shader.indexOf("mainImage(") >= 0);

      // Append "compatibility" header and possible wrapper around "mainImage()" ... if used.
      var src = "data:text/plain," + header + (hasMainImage ? main : "") + shader;

      CreateShader( filename, src, texture0 , texture1, texture2 );
    });
  }

  function CreateShader(name, shader,
                        texture0 = null,
                        texture1 = null,
                        texture2 = null)
  {
    var uniforms =
    {
      "u_time"      : "float",
      "u_resolution": "vec2",
      "u_mouse"     : "vec4"
    }

    // Add UNIFORMS if used ...
    if(texture0) { uniforms[ "s_texture0" ] = "sampler2D"; }
    if(texture1) { uniforms[ "s_texture1" ] = "sampler2D"; }
    if(texture2) { uniforms[ "s_texture2" ] = "sampler2D"; }

    let createCfg =
    {
      t: 'shaderResource',
      fragment: shader,
      uniforms: uniforms
    };

    shaderToy = scene.create( createCfg );

    shaderToy.ready.then( () =>
    {
      var config =
      {
        name:  "shaderToy",
        shader: shaderToy,
        uniforms: {}
      };

      // Configure UNIFORMS if used ...
      if(texture0) { config.uniforms[ "s_texture0" ] = texture0; }
      if(texture1) { config.uniforms[ "s_texture1" ] = texture1; }
      if(texture2) { config.uniforms[ "s_texture2" ] = texture2; }

      // Apply UNIFORMS ...
      rect.effect = config;
    })
    .catch( (err) =>
    {
      console.error('Compilation of "'+ name +'" failed: ' + err.loadStatus.glError );
      console.error('Compilation of "'+ shader +'" failed: ' + err.loadStatus.glError );
    });
  };

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  rect.on('onMouseDrag',  (e) =>
  {
      rect.effect =
      {
          name: "Mouse",
        shader: shaderToy,
      uniforms: {
                  u_mouse: [e.x, e.y, 0, 0]
                }
      };
  });

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  var paused = false;

  rect.on('onKeyUp', function(e)
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
    while(toys.length > 1)
    {
      if(++index >= toys.length )
        index = 0; // WRAP

      console.log("INFO:  Next >>  Shader["+index+"]: " + toys[index].filename + "  gpuHeavy: " + toys[index].gpuHeavy + "  GPU: " + gpuHeavy);

      if(gpuHeavy == false)
      {
        if(toys[index].gpuHeavy == false) // found next LIGHT one
        {
          break;
        }
        else
        {
          console.log("INFO:  Next >> skipping Shader: " + toys[index].filename + "  gpuHeavy: " + toys[index].gpuHeavy);
        }
      }
      else
      {
        console.log("INFO:  ELSE Break");
        break;
      }
    }

    LoadShader(toys[index]);
    ResetInterval();
  }

  function PrevShader()
  {
    while(toys.length > 1)
    {
      if(--index < 0 )
        index = toys.length - 1; // WRAP

        console.log("INFO:  Prev >>  Shader["+index+"]: " + toys[index].filename + "  gpuHeavy: " + toys[index].gpuHeavy);

      if(gpuHeavy == false)
      {
        if(toys[index].gpuHeavy == false)
        {
          break;
        }
        else
        {
          console.log("INFO:  Prev >> skipping Shader: " + toys[index].filename + "  gpuHeavy: " + toys[index].gpuHeavy);
        }
      }
      else
      {
        break;
      }
    }

    LoadShader(toys[index]);
    ResetInterval();
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
      }
    }, 4000);
  }

  noiseRGBA.ready.then( () =>
  {
    console.log("### READY");

    if(hasShaders == true)
    {
      NextShader();
      ResetInterval();
    }
  });


  scene.on("onResize", function (e)
  {
    updateSize(e.w, e.h);
  });

  function updateSize(w, h)
  {
    rect.w = w - 20;
    rect.h = h - 20;

    LogoBG.x    = (rect.w - 20);
    LogoBG.y    = (rect.h - 20);

    CaptionBG.x = rect.w/2;
    Caption.w   = rect.w;
    CaptionBG.w = rect.w;
    CaptionBG.y = rect.h - 20;
  }

  updateSize(scene.w, scene.h)

  // Promise.all([rect.ready, CaptionBG.ready, Caption.ready, MessageBG.ready, Message.ready,
  //              fooRGBA.ready, fooGRAY.ready, fooSTARS.ready, fooORGANIC.ready ]).then( () =>
  // {
  //   //showCaption(0, "Starting");
  // })

  // rect.ready.then( () =>
  // {
  //   rect.animateTo({ r: 360}, 20);
  // });

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

}).catch(function importFailed(err) {
  console.error('Import for ShaderToy.js failed: ' + err);
});