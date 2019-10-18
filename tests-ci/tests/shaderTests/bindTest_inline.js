px.import({       scene: 'px:scene.1.js'
}).then( function importsAreReady(imports)
{
  var scene = imports.scene;
  var root  = imports.scene.root;
  var base  = px.getPackageBaseFilePath();

  var ww    = scene.w - 20;
  var hh    = scene.h - 20;

  var vert_src = `data:text/plain,
                    #version 110  // OpenGL ES 2.0

                    #ifdef GL_ES
                      precision mediump float;
                    #endif
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
                    }`;

  // FROM: https://www.shadertoy.com/view/Ms3SRf
  var frag_src1 =
                  `
                  #version 110  // OpenGL ES 2.0

                  data:text/plain,

                  #ifdef GL_ES
                    precision mediump float;
                  #endif

                  varying vec2 v_uv;

                  uniform vec2        u_resolution;

                  uniform float       u_time;
                  uniform sampler2D   s_texture0;
                  uniform sampler2D   s_texture1;
                  uniform sampler2D   s_texture2;
                  uniform sampler2D   s_texture3;

                  #define iResolution u_resolution
                  #define iTime       u_time
                  #define iChannel0   s_texture0
                  #define iChannel1   s_texture1
                  #define iChannel2   s_texture2
                  #define iChannel3   s_texture3

                  #define texture     texture2D
                  #define textureLod  texture2D

                  void mainImage(out vec4, in vec2);
                  void main(void) { mainImage(gl_FragColor, gl_FragCoord.xy); }

                  float w = 0.2;

                  void mainImage( out vec4 fragColor, in vec2 fragCoord )
                  {
                      vec2 uv = fragCoord.xy / iResolution.xy;

                      float g = 1.5;
                      vec4 gamma = vec4(g, g, g, 1.0);

                      vec4 color0 = pow(texture(iChannel0, uv), gamma);
                      vec4 color1 = texture(iChannel1, uv);
                      vec4 color2 = texture(iChannel2, uv * 3.);
                      vec4 color3 = texture(iChannel3, uv);

                      float duration = 2.0;
                      float t = mod(float(iTime), duration) /  duration;

                      float correction = mix(w, -w, t);
                      float choose     = smoothstep(t  - w, t + w, uv.x + correction); // clamped ramp

                      fragColor = mix(color1, color0, choose); // lerp

                      fragColor +=  vec4(color2.rgb, 0.15);
                      fragColor +=  vec4(color3.rgb, 0.5);
                  }
                  `;

  // var frag_src     = "https://raw.githubusercontent.com/pxscene/Spark/master/tests-ci/tests/shaderTests/bindTest.frg";
  var frag_src     = base + "/bindTest.frg";

  var texture0_URL = "http://sparkui.org/examples/gallery/images/gold_star.png";
  var texture1_URL = "http://sparkui.org/examples/gallery/images/banana.png";
  var texture2_URL = "http://sparkui.org/examples/gallery/images/grapes.png";
  var texture3_URL = "http://sparkui.org/examples/gallery/images/ball.png";

  var texture0_RES = scene.create({ t: 'imageResource', url: texture0_URL });
  var texture1_RES = scene.create({ t: 'imageResource', url: texture1_URL });
  var texture2_RES = scene.create({ t: 'imageResource', url: texture2_URL });
  var texture3_RES = scene.create({ t: 'imageResource', url: texture3_URL });

  var texture0_IMG = scene.create({ t: 'image', parent: root, x:  10, a: 0.01, resource: texture0_RES });
  var texture1_IMG = scene.create({ t: 'image', parent: root, x: 200, a: 0.01, resource: texture1_RES });
  var texture2_IMG = scene.create({ t: 'image', parent: root, x: 400, a: 0.01, resource: texture2_RES });
  var texture3_IMG = scene.create({ t: 'image', parent: root, x: 800, a: 0.01, resource: texture3_RES });

  var bg         = scene.create({ t: 'rect', parent: root, x:  10,  y:   10, w:   ww, h: hh, fillColor: '#088', interactive: false});
  var rect       = scene.create({ t: 'rect', parent: bg,   x: ww/2, y: hh/2, w: ww/2, h: hh/2, px: 0.5, py: 0.5, fillColor: '#111', interactive: false });

  var pix   = Promise.all([texture0_IMG.ready, texture1_IMG.ready, texture2_IMG.ready, texture3_IMG.ready]);

  var fx    = scene.create({
                               t:'shaderResource',
                        fragment: frag_src,
                        vertex:   vert_src,
                        uniforms:
                        {
                          s_texture0: "sampler2D",
                          s_texture1: "sampler2D",
                          s_texture2: "sampler2D",
                          s_texture3: "sampler2D",
                          u_time:     "float"
                        }
                    });

      Promise.all([pix.ready, fx.ready ]).then( () =>
      {
        //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        rect.effect =
        {
            shader: fx,
          uniforms:
          {
            s_texture0: texture0_RES,
            s_texture1: texture1_RES,
            s_texture2: texture2_RES,
            s_texture3: texture3_RES
          }
        }
        }); // READY

}).catch(function importFailed(err) {
  console.error('Import for bindTest.js failed: ' + err);
});