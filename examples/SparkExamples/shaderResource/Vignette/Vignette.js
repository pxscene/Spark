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
    hasShaders = false;
    throw "EXPCEPTION - Shaders are not supported in this version of Spark..."
  }

  const STRETCH = scene.stretch.STRETCH;

  var URL = base + "/test-pattern.png";

  var gIntensity = 0.0;
  var gExtent    = 0.0;
  var gColor     = [0.0, 0.0, 0.0, 1.0];

  var ar = 16/9;

  var w1 = 850;
  var w2 = w1 + 50;

  var h1 = w1 / ar * 1.1;
  var h2 = h1 + 50;

  var lw = 1;

  // Border and 2x Border
  var bb = 10, b2 = bb * 2;

  var x1 = (scene.w) * 0.50;
  var y1 = (scene.h) * 0.50 + 30;
  var y2 = (scene.h) * 0.50 - 90;

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  //
  // SLIDER CLASS
  //
  function slider( props )
  {
    return slider(props.parent, props.cb, props.x, props.y,
                  props.w     != undefined ? props.w     : 300,
                  props.h     != undefined ? props.h     :  20,
                  props.px    != undefined ? props.px    : 0.0,
                  props.py    != undefined ? props.py    : 0.0,
                  props.label != undefined ? props.label : null )
  }

  function slider(parent, cb, x, y, w = 300, h = 20, px = 0.0, py = 0.0, label = null )
  {
    this.cb          = cb;
    this.drag_startX = 0;
    this.startX      = 0;
    this.mouseDown   = false;

    var bg   = scene.create({ id: "slider_bg",   t: 'rect', parent: parent, fillColor: '#222', lineColor: '#333', lineWidth: 1, x: x, y:  y, w:  w, h:  h, px:  px, py:  py, interactive: true, focus: true });
    var knob = scene.create({ id: "slider_knob", t: 'rect', parent: bg,     fillColor: '#444', lineColor: '#555', lineWidth: 1, x: 2, y: 10, w: 16, h: 16, px: 0.0, py: 0.5, interactive: true });

    if(label)
    {
      scene.create({ t: 'textBox', parent: bg, x: -w -10, y: 0, w: w, h: h, textColor: '#000', text: label, interactive: false,
        pixelSize: h, alignVertical: scene.alignVertical.CENTER, alignHorizontal: scene.alignHorizontal.RIGHT});
    }

    var max_w = (bg.w - knob.w - 4);

    // Handle Clicks...
    //
    bg.on('onMouseLeave', ( ) =>  { knob.fillColor = '#444'; });
    bg.on('onMouseUp',    (e) =>
    {
      var pos = Math.max(0, Math.min(e.x - knob.w/2, max_w));

      knob.x = pos + 2;
      var pc = (pos / max_w * 100.0);

      console.log("## CLICK >>  Slider Power: " + pc );

      if(cb) cb( pc ); // CALLBACK
    });

    // Handle Drags...
    //
    knob.on('onMouseUp',    (e) =>  { this.mouseDown = false;  e.stopPropagation(); });
    knob.on('onMouseEnter', ( ) =>  { knob.fillColor = '#666'; });
    knob.on('onMouseLeave', ( ) =>  { knob.fillColor = '#444'; });
    knob.on('onMouseDrag',  (e) =>
    {
      console.log("## MOUSE DRAG >>    this.mouseDown: " + this.mouseDown);

      if(this.mouseDown == false)
      {
        this.drag_startX = e.x;
        this.startX      = knob.x;
        this.mouseDown   = true;
      }

      var dx  = (e.x - this.drag_startX) + this.startX; // drag delta
      var pos = Math.max(0, Math.min(dx - knob.w/2, max_w));

      var pc = ( pos / max_w * 100.0);
      knob.x = ( pos + 2 );

      // console.log("## DRAG >>  Slider Power: " + pc );

      if(cb) cb( pc ); // CALLBACK
    });

    this.setPercent = function(p)
    {
      console.log(" ###  setPercent()  p: " + p);

      var pos = Math.max(0, (p * max_w / 100.0));

      knob.x  = pos + 2;
    }
  }//CLASS

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  var bg        = scene.create({ t: 'rect',    parent: root,      x: bb, y: bb, w: (scene.w - b2), h: (scene.h - b2), fillColor: '#ccc', interactive: true});

  var title_obj = scene.create({ t: 'object',  parent:        bg, x: bg.w/2, y: 70, w: 600 + 80,    h: 50+ 80, px: 0.5, py: 0.5 });
  var title     = scene.create({ t: 'textBox', parent: title_obj, x: 0,      y:   0, w: title_obj.w, h: title_obj.h,
                      pixelSize: 60, textColor: '#000', text:  'Vignette Tests', interactive: false,
                      alignVertical:   scene.alignVertical.CENTER,
                      alignHorizontal: scene.alignHorizontal.CENTER});

  var title2    = scene.create({ t: 'textBox', parent: bg, x: title_obj.x, y: title_obj.y, w: title_obj.w, h: title_obj.h, px: 0.5, py: 0.5,
                      pixelSize: 60, textColor: '#fff', text:  title.text, interactive: false,
                      alignVertical:   scene.alignVertical.CENTER,
                      alignHorizontal: scene.alignHorizontal.CENTER});

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  //
  // Create TEXT + BLUR Slider
  //

  var text_rect = scene.create({ t: 'rect',  parent: bg, x: x1, y: y1, w: w2,   h: h1,   px: 0.5, py: 0.5, lineColor: "#888", lineWidth: lw, fillColor: "#fff", interactive: false });
  var img       = scene.create({ t: 'image', parent: text_rect, url: URL, x: text_rect.w /2, y: text_rect.h/2, w: 960/2, h: 600/2, px: 0.5, py: 0.65, stretchX: STRETCH, stretchY: STRETCH, interactive: false });

  var ww = 300;
  var hh = 20;

  var xx = text_rect.w/2;
  var yy = text_rect.h - (3.1 * hh );

  function onIntensity(pc) { gIntensity = pc;        console.log(" SLIDER 1"); doVignette(img, gIntensity, gExtent, gColor); }
  function onExtent(pc)    { gExtent    = pc;        console.log(" SLIDER 2"); doVignette(img, gIntensity, gExtent, gColor); }
  function onAlpha(pc)     { gColor[3]  = pc/ 100.0; console.log(" SLIDER 3"); doVignette(img, gIntensity, gExtent, gColor); }

  var slider1     = new slider(text_rect, onIntensity, xx, yy, ww, hh, 0.5, 1.0, "Intensity:");   yy += hh + 5;
  var slider2     = new slider(text_rect, onExtent,    xx, yy, ww, hh, 0.5, 1.0, "Extent:");      yy += hh + 5;
  var slider4     = new slider(text_rect, onAlpha,     xx, yy, ww, hh, 0.5, 1.0, "Alpha:");

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  var swatch = [];
  var colors =
  [
    { fillColor: "#f00", fillArray: [1.0,  0.0,  0.0,  1.0] },
    { fillColor: "#0f0", fillArray: [0.0,  1.0,  0.0,  1.0] },
    { fillColor: "#00f", fillArray: [0.0,  0.0,  1.0,  1.0] },

    { fillColor: "#ff0", fillArray: [1.0,  1.0,  0.0,  1.0] },
    { fillColor: "#0ff", fillArray: [0.0,  1.0,  1.0,  1.0] },
    { fillColor: "#f0f", fillArray: [1.0,  0.0,  1.0,  1.0] },

    { fillColor: "#000", fillArray: [0.0,  0.0,  0.0,  1.0] },
    { fillColor: "#888", fillArray: [0.5,  0.5,  0.5,  1.0] },
    { fillColor: "#eee", fillArray: [0.94, 0.94, 0.94, 1.0] }
  ];

  lw = 1;

  var clr_w = 20;
  var    xx = text_rect.w - (13 * clr_w);
         yy = text_rect.h - (2.1 * hh ) - 20;

  colors.map( (c, i) =>
  {
    var o = scene.create({  t: 'rect', parent: text_rect,
                            x: xx + Math.floor(i % 3) * clr_w * 1.15,
                            y: yy + Math.floor(i / 3) * (hh + 5),
                            w: clr_w, h: clr_w,
                            cx: clr_w/2, cy: clr_w/2,
                            px: 0.5, py: 1.0,
                            lineColor: "#888", lineWidth: lw,
                            fillColor: c.fillColor });

    swatch.push(o);

    o.on('onMouseUp', (e) =>
    {
      e.stopPropagation();

      // Reset all
      swatch.map( s =>
      {
        s.lineColor = "#888";
        s.lineWidth = lw;
        s.sx        = 1.0; // 100 %
        s.sy        = 1.0; // 100 %
      });

      // Set selected
      e.target.lineColor = "#000";
      e.target.lineWidth = 2;
      e.target.sx        = 1.21; // 110 %
      e.target.sy        = 1.21; // 110 %

      gColor = c.fillArray;
      doVignette(img, gIntensity, gExtent, gColor); });
  });

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  var vignetteShader = scene.create({  t:'shaderResource',
                        fragment: base + "/Vignette.frg",
                        uniforms:
                              {
                                  u_color     : "vec4",
                                  u_intensity : "float",
                                  u_extent    : "float",
                                  s_texture   : "sampler2D"
                              } });

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  function doVignette(obj, i, e, clr)
  {
    console.log(" doVignette()  i: " + i + " e: "+ e);

    obj.effect =
    {
          name: "Vignette",
        shader: vignetteShader,
      uniforms: {
                  u_intensity : i/50.0,
                  u_extent    : e/100.0,
                  u_color     : clr
                }
    }

    obj.draw = false;
    obj.draw = true;
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

}).catch(function importFailed(err) {
  console.error('Import for DropShadow.js failed: ' + err);
});