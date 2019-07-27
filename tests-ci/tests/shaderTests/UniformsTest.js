px.import({       scene: 'px:scene.1.js'
}).then( function importsAreReady(imports)
{
  var scene = imports.scene;
  var root  = imports.scene.root;
  var base  = px.getPackageBaseFilePath();

  var ww    = scene.w - 20;
  var hh    = scene.h - 20;

  var bg    = scene.create({ t: 'rect', parent: root, x:  10,  y:   10, w:   ww, h: hh, fillColor: '#088',  interactive: false});
  var rect  = scene.create({ t: 'rect', parent: bg,   x: ww/2, y: hh/2, w: ww/2, h: hh/2, px: 0.5, py: 0.5, fillColor: '#000', interactive: false });
  var fx    = scene.create({
                            t:'shaderResource',
                      fragment: base + "/uniformsTest.frg",
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

        resolve();

        //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        //
        //   RESULT:  #FFF ... unless any SET UNIFORM fails.  Then the failure is *uniquely* colored.
        //
        //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      }); // READY
    });

}).catch(function importFailed(err) {
  console.error('Import for directTest.js failed: ' + err);
});