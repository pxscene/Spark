px.import({       scene: 'px:scene.1.js'
}).then( function importsAreReady(imports)
{
  module.exports.wantsClearscreen = function()
  {
    return true; // return 'false' to skip system black/blank draw
  };

  var scene = imports.scene;
  var root  = imports.scene.root;
  var base  = px.getPackageBaseFilePath();

  var hasShaders    = true;
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

  var URL = base + "/images/test-pattern.png";

  var noiseGRAY = scene.create({ id: "noise", t: 'imageResource', url: base + "/images/Gray_Noise_Medium256x256.png" });
  var noiseRGBA = scene.create({ id: "noise", t: 'imageResource', url: base + "/images/RGBA_Noise_Medium256x256.png" });
  var imageRGB  = scene.create({ id: "image", t: 'imageResource', url: URL });

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  const STRETCH = scene.stretch.STRETCH;

  var ar = 16/9;

  var w1 = scene.w;
  var h1 = w1 / ar * 1.1;


  var x1 = (scene.w) * 0.50;
  var y1 = (scene.h) * 0.50;

  var bg     = scene.create({ t: 'object', parent: root,x: x1, y: y1, w: w1, h: h1, px: 0.5, py: 0.5, fillColor: '#000', interactive: true});

  var fooRGBA  = scene.create({ t: 'image', parent: bg, resource: noiseRGBA, interactive: false, a: 0.05 });
  var fooGRAY  = scene.create({ t: 'image', parent: bg, resource: noiseGRAY, interactive: false, a: 0.05 });
  var fooIMAGE = scene.create({ t: 'image', parent: bg, resource: imageRGB,  interactive: false, a: 0.01 });

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  var toys = [
      { filename: "DirtyOldCRT.frg",   texture0: noiseRGBA },
  //  { filename: "VCRdistortion.frg", texture0: noiseGRAY },
  ];

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  var header = `#ifdef GL_ES
                    precision mediump float;
                #endif

                uniform vec2        u_resolution;
                uniform vec4        u_mouse;

                uniform float       u_time;
                uniform sampler2D   s_texture0;
                uniform sampler2D   s_texture1;

                #define iResolution u_resolution
                #define iTime       u_time

                #define iChannel0   s_texture0
                #define iChannel1   s_texture1

                #define iMouse      u_mouse
                #define texture     texture2D
                #define textureLod  texture2D
                `;

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  function isObject(val)
  {
    return val instanceof Object;
  }

  var crt = null;

  function LoadShader(shader)
  {
    console.log("shader: " + shader);

    var filename = isObject(shader) ? shader.filename : shader;
    var texture0 = isObject(shader) ? shader.texture0 ? shader.texture0 : null : null;

    var fileLoadPromise = px.getModuleFile("/shaders/" + filename);
    fileLoadPromise.then(function(shader)
    {
      var main = `void mainImage(out vec4, in vec2);
                  void main(void) { mainImage(gl_FragColor, gl_FragCoord.xy); }`;

      var hasMainImage = (shader.indexOf("mainImage(") >= 0);

      // Append "compatibility" header and possible wrapper around "mainImage()" ... if used.
      var src = "data:text/plain," + header + (hasMainImage ? main : "") + shader;

      CreateShader( src, texture0 );
    });
  }

  function CreateShader(shader, texture0 = null)
  {
    crt = scene.create({
                t: 'shaderResource',
          fragment: shader,
          uniforms:
          {
            "u_time"      : "float",
            "s_texture0"  : "sampler2D",
            "s_texture1"  : "sampler2D"
          }
        });

    crt.ready.then( () =>
    {
      bg.effect =
      {
          name:  "shaderToy",
          shader: crt,
          uniforms:
          {
            s_texture0: imageRGB,
            s_texture1: noiseRGBA, // RANDOM
          }
      }
    });
  };

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  noiseRGBA.ready.then( () =>
  {
    if(hasShaders == true)
    {
      LoadShader(toys[index]);
    }
  });

  scene.on("onResize", function (e)
  {
    updateSize(e.w, e.h);
  });

  function updateSize(w, h)
  {
    bg.w = w;  bg.h = h;
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

}).catch(function importFailed(err) {
  console.error('Import for CRTeffect.js failed: ' + err);
});
