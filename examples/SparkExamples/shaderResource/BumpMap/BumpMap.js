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

  // var rock   = scene.create({ id: "rock",  t: 'imageResource', url: base + "/images/rock.png"   });
  // var rock_n = scene.create({ id: "roc_n", t: 'imageResource', url: base + "/images/rock_n.png" });

  var rock   = scene.create({ id: "rock",  t: 'imageResource', url: base + "/images/Spark_logo300px.png"   });
  var rock_n = scene.create({ id: "roc_n", t: 'imageResource', url: base + "/images/Spark_logo300px_n.png" });

  var rect   = scene.create({ t: 'rect',  parent: root, fillColor: '#222', x: 10, y: 10, w: 1260, h: 700, cx: 1260/2, cy: 700/2, interactive: false});
  var output = scene.create({ t: 'rect', parent: rect, x: 700, y: 250, w: 300, h: 225, fillColor: "#888", lineColor: "#fff", lineWidth: 2, focus: true });

  var lightPos = [0.5, 0.5];
  var fallOff  = [0.4, 3.0, -2.0];

  var text1 = scene.create({t:'text', w: 100, h: 20, x: 200, y: 200, parent: root,
                    pixelSize: 24, textColor:'#fff', text:  'Texture', interactive: false });

  var text2 = scene.create({t:'text', w: 100, h: 20, x: 200, y: 450, parent: root,
                    pixelSize: 24, textColor:'#fff', text:  'Normal', interactive: false });

  var text3 = scene.create({t:'text', w: 100, h: 20, x: 820, y: 210, parent: root,
                    pixelSize: 24, textColor:'#fff', text:  'Output', interactive: false });

  var help = scene.create({t:'text', w: 200, h: 20, x: 770, y: 550, parent: root, a: 0.0,
                    pixelSize: 14, textColor:'#aaa', text:  'Click and Drag to move Light', interactive: false });

  var rockImg  = scene.create({ t: 'image', parent: rect, x: 300,       y: 100,                        w: 300, h: 225, resource: rock, interactive: false });
  var rockNImg = scene.create({ t: 'image', parent: rect, x: rockImg.x, y: rockImg.y + rockImg.h + 20, w: 300, h: 225, resource: rock_n, interactive: false });

  var rectDn  = scene.create({ t: 'rect', parent: root, fillColor: '#800', lineColor: "#eee", lineWidth: 1, x: 810, y: 500, w: 50, h: 30 });
  var txt1    = scene.create({ t:'text', w: 100, h: 20, x: 15, y: -28, parent: rectDn, pixelSize: 50, textColor:'#fff', text:  '-', interactive: false });

  var rectUp  = scene.create({ t: 'rect', parent: root, fillColor: '#080', lineColor: "#eee", lineWidth: 1, x: rectDn.x + rectDn.w + 10, y: rectDn.y, w: 50, h: 30 });
  var txt2    = scene.create({ t:'text', w: 100, h: 20, x: 15, y: -17, parent: rectUp, pixelSize: 35, textColor:'#fff', text:  '+', interactive: false });

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  output.on("onMouseEnter", function(e) { help.text = 'Click and Drag to move Light'; help.animateTo({ a: 0.6}, 0.25); });
  output.on("onMouseLeave", function(e) { help.animateTo({ a: 0.0}, 0.25); });

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  rectDn.on("onMouseEnter", function(e) { help.text = "Click to move light AWAY"; help.animateTo({ a: 0.6}, 0.25); });
  rectDn.on("onMouseLeave", function(e) { help.animateTo({ a: 0.0}, 0.25); });

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  rectUp.on("onMouseEnter", function(e) { help.text = "Click to move light CLOSER"; help.animateTo({ a: 0.6}, 0.25); });
  rectUp.on("onMouseLeave", function(e) { help.animateTo({ a: 0.0}, 0.25); });

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  // http://127.0.0.1/BumpMap.js

  var bumpShader = scene.create({
           t: 'shaderResource',
   //   vertex: base + "/BumpMap.vtx",  ... using DEFAULT vertex shader
    fragment: base + "/BumpMap.frg",
    uniforms:
    {
        // texture samplers
        s_texture      : "sampler2D",   // diffuse map
        s_normals      : "sampler2D",   // normal map

        // values used for shading algorithm...
        u_lightPos     : "vec3",    // light position, normalized
        u_lightColor   : "vec4",    // light RGBA -- alpha is intensity
        u_ambientColor : "vec4",    // ambient RGBA -- alpha is intensity
        u_falloff      : "vec3"     // attenuation coefficients

    } });

    bumpShader.ready.then(
      (resolve) =>
      {
        console.log("Shader Compilation - OK");
        console.log("Shader Compilation - OK");
        console.log("Shader Compilation - OK");
      },
      (reject) =>
      {
        console.log("Shader Compilation - FAILED " + bumpShader.loadStatus.glError );
        console.log("Shader Compilation - FAILED " + bumpShader.loadStatus.glError );
        console.log("Shader Compilation - FAILED " + bumpShader.loadStatus.glError );
      });

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  function updateFalloff(d)
  {
    fallOff[2] += d;
    updateShader();
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  function updateShader()
  {
    output.effect =
    {
        name: "Bumps",
      shader: bumpShader,
    uniforms: {
                u_lightColor:   [1.0, 0.8, 0.6,  1.0],
                u_ambientColor: [0.6, 0.6, 1.0,  0.5],
                u_lightPos:     lightPos,
                u_falloff:      fallOff,
                s_texture:      rock,
                s_normals:      rock_n,
              }
    };
  };

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  bumpShader.ready.then( () =>
  {
      updateShader();
  });

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  var rectUpInterval = null;

  rectUp.on("onMouseUp",   function(e)
  {
    e.target.y -= 2;

    if(rectUpInterval != null)
    {
      clearInterval(rectUpInterval);
      rectUpInterval = null;
    }
  });

  rectUp.on("onMouseDown", function(e)
  {
    e.target.y += 2;

    if(rectUpInterval == null)
    {
      updateFalloff(0.5);

      rectUpInterval = setInterval( () =>
      {
        updateFalloff(0.5);
      }, 100);
    }
  });

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  var rectDnInterval = null;

  rectDn.on("onMouseUp",   function(e)
  {
    e.target.y -= 2;

    if(rectDnInterval != null)
    {
      clearInterval(rectDnInterval);
      rectDnInterval = null;
    }
  });

  rectDn.on("onMouseDown", function(e)
  {
    e.target.y += 2;

    if(rectDnInterval == null)
    {
      updateFalloff(-0.5);

      rectDnInterval = setInterval( () =>
      {
        updateFalloff(-0.5);
      }, 100);
    }
  });

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  var mouseDown = false;

  function updateLightPos(e)
  {
    console.log("Update LIGHT");

    lightPos = [      (e.x / output.w),
                1.0 - (e.y / output.h)];

    updateShader();
  }

  output.on("onMouseDown", function(e) { mouseDown = true;  });
  output.on("onMouseUp",   function(e) { mouseDown = false; updateLightPos(e); });
  output.on("onMouseMove", function(e)
  {
    if(mouseDown)
      updateLightPos(e);
  });

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

}).catch(function importFailed(err) {
  console.error('Import for BumpMap.js failed: ' + err);
});