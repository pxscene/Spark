px.import({       scene: 'px:scene.1.js',
                   keys: 'px:tools.keys.js',
}).then( function importsAreReady(imports)
{
  module.exports.wantsClearscreen = function()
  {
    return true; // return 'false' to skip system black/blank draw
  };

  var scene = imports.scene;
  var root  = imports.scene.root;
  var keys  = imports.keys;

  var base = px.getPackageBaseFilePath();

  const LINEAR  = scene.animation.TWEEN_LINEAR;
  const FFWD    = scene.animation.OPTION_FASTFORWARD
  const STRETCH = scene.stretch.STRETCH;

  var container = null;
  var tv        = null;
  var wipe      = null;
  var help      = null;

  var busy      = false;
  var powerON   = true;

function animateOFF(e)
{
  return  new Promise(function (resolve, reject)
  {
    // POWER OFF !!!    Show WHITE wipe > Hide TV image > shrink/Fade WHITE wipe

    wipe.animateTo({a: 1}, 0.25, LINEAR, FFWD, 1)
    .then( o1 =>
      {
          tv.a = 0;  // Hide TV image

          o1.animateTo({a: 0}, 1.5, LINEAR, FFWD, 1);                   // Fade-Out Wipe
          o1.animateTo({y: scene.h / 2, h: 2}, 0.5, LINEAR, FFWD, 1)    // Shrink Vertially
          .then( o2 =>
          {
            o2.animateTo({x: scene.w / 2, w: 2}, 0.35, LINEAR, FFWD, 1) // Shrink Horizontally
            .then( o2 =>
              {
                  resolve();
              });
          });
      });

  });
};

function animateON(e)
{
  return  new Promise(function (resolve, reject)
  {
    // POWER ON !!!

    wipe.animateTo({a: 1}, 1.5, LINEAR, FFWD, 1)                  // Fade-In Wipe
    wipe.animateTo({x: 0, w: scene.w}, 0.35, LINEAR, FFWD, 1)     // Grow Horizontally
    .then( o1 =>
      {
          o1.animateTo({y: 0, h: scene.h}, 0.5, LINEAR, FFWD, 1)  // Grow Vertically
          .then( o2 =>
          {
              tv.animateTo({a: 1}, 0.35, LINEAR, FFWD, 1)         // Show TV image
            wipe.animateTo({a: 0}, 0.35, LINEAR, FFWD, 1)         // Hide Wipe

            resolve();
          });
      });

  });
};

function updateSize(w, h)
{
  var bg    = scene.create({ t: 'rect',   parent: root,       x: 0, y: 0, w: w, h: h, fillColor: '#000', a: 1.0, interactive: false });
  container = scene.create({ t: 'object', parent: root,       x: 0, y: 0, w: w, h: h, focus: true ,              interactive: true  });
  tv        = scene.create({ t: 'image',  parent: container,  x: 0, y: 0, w: w, h: h, url: base + "/Background.jpg", interactive: false, stretchX: STRETCH, stretchY: STRETCH });
  wipe      = scene.create({ t: 'rect',   parent: container,  x: 0, y: 0, w: w, h: h, fillColor: '#fff', a: 0.0, interactive: false });

  help      = scene.create({t:'text', w: 600, h: 40, parent: tv, x: scene.w/2 - 180, y: scene.h * 0.92,
                    pixelSize: 24, textColor:'#fff', text:  'Press Any Key to Toggle ON/OFF', interactive: false, a: 0. });

  Promise.all([tv.ready, wipe.ready, container.ready, help.ready])
  .then( o =>
{
  help.animateTo({ a: 0.8 }, 2);

  container.on('onKeyDown', function(e)
  {
    if( (busy == true) || (e.keyCode != keys.SPACE))
    {
      return; // already animating
    }

    busy = true; // going to animate !

    const fn = (powerON == false) ? animateON : animateOFF;

    fn(e).then( o =>
    {
      busy    = false;
      powerON = !powerON; // toggle
    })

  });

  wipe.cx = scene.w / 2;
  wipe.cy = scene.h / 2;
})
}

scene.on("onResize", function(e)
{
  updateSize(e.w,e.h);
});

updateSize(scene.w, scene.h);

}).catch(function importFailed(err) {
  console.error('Import for SparkPowerOff.js failed: ' + err);
});