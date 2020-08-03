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

  // Creating an 'imageResource' with an SVG allows it to be scaled to a "best fit" desired size
  var mask_res = scene.create({ t: 'imageResource', url: base + "/images/philly_mask.svg", w: scene.w+200, h: scene.h });

  // "Fudge Factors" ... accomadate SVG impresision in locating image at poster/canvas "origin"
  var bg        = scene.create({ t: 'rect',   parent: root,      x: 0,   y:       0, w: scene.w, h: scene.h,       interactive: false, fillColor: '#000' });
  var container = scene.create({ t: 'object', parent: bg,        x: 0,   y:       0, w: scene.w, h: scene.h,       interactive: false });

  // Create MASK image using 'imageResource', using Anchor Points (px & py) to position from bottom-left, and enable MASKING
  var mask_img  = scene.create({ t: 'image',  parent: container, x: -50, y: scene.h, w: scene.w, h: scene.h/2,     interactive: false, px: 0.0, py: 1.0, resource: mask_res, mask: true, draw: false  });
  var sunburst  = scene.create({ t: 'image',  parent: container, x: 0, y: 0, url: base + "/images/sunburst-1.jpg", interactive: false });

}).catch(function importFailed(err) {
  console.error('Import for MaskingExample.js failed: ' + err);
});