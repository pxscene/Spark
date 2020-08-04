px.import({       scene: 'px:scene.1.js',
                   keys: 'px:tools.keys.js'
}).then( function importsAreReady(imports)
{
  module.exports.wantsClearscreen = function()
  {
    return true; // return 'false' to skip system black/blank draw
  };

 var scene = imports.scene;
 var root  = imports.scene.root;
 var keys  = imports.keys;

 var STRETCH = scene.stretch.STRETCH;

 var rate = 1.0;
 var ar   = 16/9;

 var w1 = scene.w;
 var h1 = w1 / ar;

 var x1 = (scene.w * 0.5);
 var y1 = (scene.h * 0.5);

 var bg   = scene.create({ t: 'rect', parent: root, fillColor: '#884', x: 0, y: 0, w: w1, h: h1, interactive: false });
 var text = scene.create({t:'text', w: 100, h: 20, parent: bg, x: w1 * 0.40, y: h1 * 0.45,
                   pixelSize: 48, textColor:'#fff', text:  'Scene 2', interactive: false });

}).catch(function importFailed(err) {
  console.error('Import for MyApp.js failed: ' + err);
});