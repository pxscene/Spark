px.import({       scene: 'px:scene.1.js'
}).then( function importsAreReady(imports)
{
  var scene = imports.scene;
  var root  = imports.scene.root;
  var base  = px.getPackageBaseFilePath();

  var ww    = scene.w - 20;
  var hh    = scene.h - 20;

  var bg    = scene.create({ t: 'rect', parent: root, x:  10,  y:   10, w:   ww, h: hh, fillColor: '#088', interactive: false});
  var rect  = scene.create({ t: 'rect', parent: bg,   x: ww/2, y: hh/2, w: ww/2, h: hh/2, px: 0.5, py: 0.5, fillColor: '#F0F', interactive: false });
  var fx    = scene.create({
                                t:'shaderResource',
                        fragment: base + "/shaderTestD.frg",
                        uniforms:
                        {
                            "u_colorVec4" : "vec4",
                            "s_texture"   : "sampler2D"
                        }
                    });

  module.exports.reallyReady = function(value)
  {
    return new Promise(function(resolve, reject)
    {
        console.log(">>>>>>>>>>>>  direct.ready  ")
        fx.ready.then( () =>
        {
          //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

          fx.u_colorVec4 = [0.0, 1.0, 1.0, 1.0];   // #0F0   GREEN

          rect.effect = fx; // force redraw

          rect.painting = false; // force redraw
          rect.painting = true;  // force redraw

          resolve(); // signal that redraw complete

          //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
          //
          //   RESULT:  #FFF ... by accumulatiing each pass: R #F00 + G #0F0 + B #00F =  #FFF
          //
          //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        }); // READY
      });
    }//reallyReady()

}).catch(function importFailed(err) {
  console.error('Import for directTest.js failed: ' + err);
});