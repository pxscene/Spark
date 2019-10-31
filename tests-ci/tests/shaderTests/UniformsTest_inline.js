px.import({       scene: 'px:scene.1.js'
}).then( function importsAreReady(imports)
{
  var scene = imports.scene;
  var root  = imports.scene.root;
  var base  = px.getPackageBaseFilePath();

  var ww    = scene.w - 20;
  var hh    = scene.h - 20;

  var src   =  `#ifdef GL_ES
                  precision mediump float;
                #endif

                varying vec2    v_uv;

                uniform vec2    u_resolution;

                uniform int     u_colorInt;
                uniform float   u_colorFloat;

                uniform ivec2   u_colorVec2i;
                uniform ivec3   u_colorVec3i;
                uniform ivec4   u_colorVec4i;

                uniform vec2    u_colorVec2f;
                uniform vec3    u_colorVec3f;
                uniform vec4    u_colorVec4f;

                void main()
                {
                  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
                  //
                  // Note:  PASS/FAIL ... any color other that WHITE #fff ... indicates a Set Uniform failure.
                  //
                  if(u_colorInt <= 0)
                  {
                    //
                    // TEST - setUniform1i()
                    //
                    gl_FragColor = vec4(1.0, 0.0, 0.0,  1.0); //  was NOT set !  // FAIL:  #f00
                  }
                  else
                  if(u_colorFloat <= 0.0)
                  {
                    //
                    // TEST - setUniform1f()
                    //
                    gl_FragColor = vec4(0.0, 1.0, 0.0,  1.0); //  was NOT set !  // FAIL:  #0f0
                  }
                  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
                  // TEST - Integer Vectors
                  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
                  else
                  if( any( notEqual( u_colorVec2i, ivec2(1, 1) ) ))
                  {
                    //
                    // TEST - setUniform2iv()
                    //
                    gl_FragColor = vec4(0.0, 0.0, 1.0,  1.0); //  was NOT set !  // FAIL:  #00f
                  }
                  else
                  if( any( notEqual( u_colorVec3i, ivec3(1, 1, 1) ) ))
                  {
                    //
                    // TEST - setUniform3iv()
                    //
                    gl_FragColor = vec4(1.0, 1.0, 0.0,  1.0); //  was NOT set !  // FAIL:  #ff0
                  }
                  else
                  if( any( notEqual( u_colorVec4i, ivec4(1, 1, 1, 1) ) ))
                  {
                    //
                    // TEST - setUniform4iv()
                    //
                    gl_FragColor = vec4(0.0, 1.0, 0.5,  1.0); //  was NOT set !  // FAIL:  #0f8
                  }
                  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
                  // TEST - Floating Point Vectors
                  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
                  else
                  if( any( notEqual( u_colorVec2f, vec2(1.0, 1.0) ) ))
                  {
                    //
                    // TEST - setUniform2iv()
                    //
                    gl_FragColor = vec4(0.5, 0.0, 0.5,  1.0); //  was NOT set !  // FAIL:  #808
                  }
                  else
                  if( any( notEqual( u_colorVec3f, vec3(1.0, 1.0, 1.0) ) ))
                  {
                    //
                    // TEST - setUniform2iv()
                    //
                    gl_FragColor = vec4(0.5, 0.5, 0.0,  1.0); //  was NOT set !  // FAIL:  #880
                  }
                  else
                  if( any( notEqual( u_colorVec4f, vec4(1.0, 1.0, 1.0, 1.0) ) ))
                  {
                    //
                    // TEST - setUniform2iv()
                    //
                    gl_FragColor = vec4(0.5, 0.5, 0.5,  1.0); //  was NOT set !  // FAIL:  #888
                  }
                  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
                  // Test - PASSED
                  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
                  else
                  {
                    gl_FragColor = vec4(1.0, 1.0, 1.0,  1.0); // PASS: #fff  (default)
                  }
                  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
                }`;

  var bg    = scene.create({ t: 'rect', parent: root, x:  10,  y:   10, w:   ww, h: hh, fillColor: '#088',  interactive: false});
  var rect  = scene.create({ t: 'rect', parent: bg,   x: ww/2, y: hh/2, w: ww/2, h: hh/2, px: 0.5, py: 0.5, fillColor: '#000', interactive: false });
  var fx    = scene.create({
                            t:'shaderResource',
                      fragment: "data:text/plain," + src,
                      uniforms:
                      {
                        u_colorInt   : "int",
                        u_colorFloat : "float",

                        u_colorVec2i : "ivec2",
                        u_colorVec3i : "ivec3",
                        u_colorVec4i : "ivec4",

                        u_colorVec2f : "vec2",
                        u_colorVec3f : "vec3",
                        u_colorVec4f : "vec4"
                      }
                  });

  module.exports.reallyReady = function(value)
  {
    return new Promise(function(resolve, reject)
    {
      Promise.all([fx.ready, bg.ready, rect.ready])
      .then( () =>
      {
        //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

        rect.effect =
        {
            name: "Test - Set UNIFORMS",
          shader: fx,
          uniforms: {
                      u_colorInt:     1,                 // non-zero values
                      u_colorFloat: 1.0,                 // non-zero values

                      u_colorVec2i: [1, 1],              // non-zero values
                      u_colorVec3i: [1, 1, 1],           // non-zero values
                      u_colorVec4i: [1, 1, 1, 1],        // non-zero values

                      u_colorVec2f: [1.0, 1.0],          // non-zero values
                      u_colorVec3f: [1.0, 1.0, 1.0],     // non-zero values
                      u_colorVec4f: [1.0, 1.0, 1.0, 1.0] // non-zero values
                    }
        };

        rect.painting = false; // force redraw
        rect.painting = true;  // force redraw

        setTimeout(()=>
        {
          resolve("REALLY READY (UniformsTests.js) "); // signal that  complete
        }, 1);

        //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        //
        //   RESULT:  #FFF ... unless any SET UNIFORM fails.  Then the failure is *uniquely* colored.
        //
        //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      }); // READY
    });
  }//reallyReady()

}).catch(function importFailed(err) {
  console.error('Import for UniformsTest.js failed: ' + err);
});
