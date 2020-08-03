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
    throw "Shader is not supported";
  }

  var       url = base + "/images/Spark_logo256px.png";
  var heart_res = scene.create({ t: 'imageResource', url:  base + "/images/heart.svg", w: 25, h: 25});

  // Layout geometry
  var sw2 = scene.w/2, sh2 = scene.h/2;
  var gw  = scene.w/4,  gh = scene.h/2;
  var gw2 = gw/2,      gh2 = gh/2, gh95 = gh * 0.95;

  // Layout helpers
  function rhs1() { return made_with.x + made_with.w + 5; };
  function rhs2() { return heart_img.x + heart_img.w + 5; };

  // Backgound + Frame
  var bg        = scene.create({ t: 'rect',   parent: root,    x: sw2,    y: sh2,  w: 1260, h: 700, cx: 1260/2, cy: 700/2, px: 0.5, py: 0.5, fillColor: '#444' });
  var rect      = scene.create({ t: 'rect',   parent: root,    x: sw2,    y: sh2,  w: 1280, h: 720, cx: 1280/2, cy: 720/2, px: 0.5, py: 0.5, fillColor: "#000" });

  // Container + Logo 
  var group     = scene.create({ t: 'object', parent: rect,    x: sw2,    y: sh2,  w: gw,   h: gh,  cx: 300/2, cy: 550/2, px: 0.5, py: 0.5, draw: false });
  var logo      = scene.create({ t: 'image',  parent: group,   x: gw2,    y: gh2,  w: 256,  h: 256,             url: url, px: 0.5, py: 0.5 });

  // "Made with ♥️ in Philadelphia" Text
  var message   = scene.create({ t: 'object', parent: group,   x: gw2,    y: gh95, w: 300, h: 40, fillColor: "#888", px: 0.5, py: 0.5                      });
  var made_with = scene.create({ t: 'text',   parent: message, x: 0,      y: 0,    w: 100, h: 20, pixelSize: 24, textColor:'#fff', text: 'Made with'       });
  var heart_img = scene.create({ t: 'image',  parent: message, x: rhs1(), y: 10,   w:  25, h: 25,  resource: heart_res                                     });
  var in_philly = scene.create({ t: 'text',   parent: message, x: rhs2(), y: 0,    w: 100, h: 20, pixelSize: 24, textColor:'#fff', text: 'in Philadelphia' });

  var objs = [bg.ready, rect.ready, group.ready, heart_res.ready, made_with.ready, heart_img.ready, in_philly.ready];

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  Promise.all(objs).then( () =>
  {
    group.draw = true;

    // Create the Shader and anchor to 'rect'
    rect.effect = scene.create({  t: 'shaderResource',
                          fragment: base + "/shaders/Smoke.frg",
                          uniforms: { "u_time"      : "float",
                                      "u_resolution": "vec2",
                                      "s_texture"   : "sampler2D"
                                    }
                          });
  });

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  scene.on("onResize", function (e)
  {
    updateSize(e.w, e.h);
  });

  function updateSize(w, h)
  {
    var ss = 0.9;

    var ww = w * ss;
    var hh = h * ss;

    var tt = 1.5;

       bg.animateTo({ w: w,  h: h,  x: w/2,  y: h/2  }, tt );
     rect.animateTo({ w: ww, h: hh, x: w/2,  y: h/2  }, tt );
    group.animateTo({               x: ww/2, y: hh/2 }, tt );
}

  updateSize(scene.w, scene.h);

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

}).catch(function importFailed(err) {
  console.error('Import for SparkSmoke.js failed: ' + err);
});