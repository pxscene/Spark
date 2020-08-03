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

  var hasShaders = true;

  if( scene.capabilities                  == undefined ||
      scene.capabilities.graphics         == undefined ||
      scene.capabilities.graphics.shaders == undefined ||
      scene.capabilities.graphics.shaders < 1)
  {
    // If Shader is not supported...
    hasShaders = false;
    throw "EXPCEPTION - Shaders are not supported in this version of Spark..."
  }

  var URL = base + "/images/CloudScene.png";

  var noiseGRAY = scene.create({ t: 'imageResource', url: base + "/images/Gray_Noise_Medium256x256.png" });
  var noiseRGBA = scene.create({ t: 'imageResource', url: base + "/images/RGBA_Noise_Medium256x256.png" });
  var imageRGBA = scene.create({ t: 'imageResource', url: URL });

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  var ar = 16/9;

  var w1 = scene.w;
  var h1 = w1 / ar * 1.0;

  var x1 = (scene.w) * 0.50;
  var y1 = (scene.h) * 0.50;

  var bg        = scene.create({ t: 'rect',   parent: root, x: x1, y: y1, w: w1, h: h1, px: 0.5, py: 0.5, fillColor: '#126', interactive: false});
  var clouds    = scene.create({ t: 'object', parent: root, x: x1, y: y1, w: w1, h: h1, px: 0.5, py: 0.5, fillColor: '#050', interactive: false});
  var mountains = scene.create({ t: 'image',  parent: root, x: x1, y: y1, w: w1, h: h1, px: 0.5, py: 0.5, url: URL,          interactive: false });

  var fooRGBA   = scene.create({ t: 'image', parent: bg, resource: noiseRGBA, interactive: false, a: 0.01 });
  var fooGRAY   = scene.create({ t: 'image', parent: bg, resource: noiseGRAY, interactive: false, a: 0.01 });

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  var cfg = {
              filename: "CloudScene.frg",
              texture0: noiseGRAY,
              texture1: noiseRGBA
            };

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  var header = `#ifdef GL_ES
                    precision mediump float;
                #endif

                //
                // Declare UNIFORMS ...
                //

                uniform vec2        u_resolution;
                uniform vec4        u_mouse;

                uniform float       u_time;
                uniform sampler2D   s_texture0;
                uniform sampler2D   s_texture1;

                //
                // Alias to ShaderToy norms ...
                //

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

  var cloudShader = null;

  function LoadShader(shader)
  {
    console.log("shader: " + shader);

    var filename = isObject(shader) ? shader.filename : shader;
    var texture0 = isObject(shader) ? shader.texture0 ? shader.texture0 : null : null;
    var texture1 = isObject(shader) ? shader.texture1 ? shader.texture1 : null : null;

    console.log(" texture0: "  + texture0.url );
    console.log(" texture1: "  + texture1.url );

    var fileLoadPromise = px.getModuleFile("/shaders/" + filename);
    fileLoadPromise.then(function(shader)
    {
      var main = `void mainImage(out vec4, in vec2);
                  void main(void) { mainImage(gl_FragColor, gl_FragCoord.xy); }`;

      var hasMainImage = (shader.indexOf("mainImage(") >= 0);

      // Append "compatibility" header and possible wrapper around "mainImage()" ... if used.
      var src = "data:text/plain," + header + (hasMainImage ? main : "") + shader;

      CreateShader( src, texture0, texture1 );
    });
  }

  function CreateShader(shader, texture0 = null, texture1 = null)
  {
    cloudShader = scene.create({
                t: 'shaderResource',
          fragment: shader,
          uniforms:
          {
            "u_time"      : "float",
            "s_texture0"  : "sampler2D",
            "s_texture1"  : "sampler2D"
          }
        });

    cloudShader.ready.then( () =>
    {
      clouds.effect =
      {
          name:  "shaderToy",
          shader: cloudShader,
          uniforms:
          {
            s_texture0: texture0, // RANDOM GRAY
            s_texture1: texture1, // RANDOM RGB
          }
      }
    });
  };

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  noiseRGBA.ready.then( () =>
  {
    if(hasShaders == true)
    {
      LoadShader(cfg);
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
  console.error('Import for CloudScene.js failed: ' + err);
});
