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

  // Border and 2x Border
  var bb = 10, b2 = bb * 2;

  var x1 = (scene.w - b2) * 0.25;
  var y1 = (scene.h - b2) * 0.50 - 120;

  var x2 = (scene.w - b2) * 0.75;
  var y2 = (scene.h - b2) * 0.50 + 120;

  var ar = 16/9;

  var w1 = 350;
  var w2 = w1 + 50;

  var h1 = w1 / ar;
  var h2 = h1 + 50;

  var lw = 1;

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  //
  // SLIDER CLASS
  //
  function slider(parent, cb, x, y, w = 300, h = 20, px = 0.0, py = 0.0 )
  {
    this.cb = cb;

    this.drag_startX = 0;
    this.startX      = 0;
    this.mouseDown   = false;

    var bg   = scene.create({ t: 'rect', parent: parent, fillColor: '#222', lineColor: '#333', lineWidth: 1, x: x, y:  y, w:  w, h:  h, px:  px, py:  py, interactive: true, focus: true });
    var knob = scene.create({ t: 'rect', parent: bg,     fillColor: '#444', lineColor: '#555', lineWidth: 1, x: 2, y: 10, w: 16, h: 16, px: 0.0, py: 0.5, interactive: true });

    var max_w = (bg.w - knob.w - 4);

    // Handle Clicks...
    //
    bg.on('onMouseLeave', ( ) =>  { knob.fillColor = '#444'; });
    bg.on('onMouseUp',    (e) =>
    {
      var pos = Math.max(0, Math.min(e.x - knob.w/2, max_w));

      knob.x  = pos + 2;
      var pc = (pos / max_w * 100.0);

      // console.log("## CLICK >>  Slider Power: " + pc );

      if(cb) cb(pc); // CALLBACK
    });

    // Handle Drags...
    //
    knob.on('onMouseUp',    (e) =>  { mouseDown = false;  e.stopPropagation(); });
    knob.on('onMouseEnter', ( ) =>  { knob.fillColor = '#666'; });
    knob.on('onMouseLeave', ( ) =>  { knob.fillColor = '#444'; });
    knob.on('onMouseDrag',  (e) =>
    {
      if(this.mouseDown == false)
      {
        this.drag_startX = e.x;
        this.startX      = knob.x;
        this.mouseDown   = true;
      }

      var dx  = (e.x - this.drag_startX); // drag delta
      var pos = Math.max(0, Math.min(dx - knob.w/2, max_w));

      knob.x  = pos + 2;
      var pc  = ( pos / max_w * 100.0);

      // console.log("## DRAG >>  Slider Power: " + pc );

      if(cb) cb(pc); // CALLBACK
    });

  }//CLASS

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  var bg    = scene.create({ t: 'rect',  parent: root, x: bb, y: bb, w: (scene.w - b2), h: (scene.h - b2), fillColor: '#111', interactive: true});

  var title_obj = scene.create({ t: 'object',  parent:        bg, x: bg.w/2, y: 100, w: 500 + 80,    h: 50+ 80, px: 0.5, py: 0.5 });
  var title     = scene.create({ t: 'textBox', parent: title_obj, x: 0,      y:   0, w: title_obj.w, h: title_obj.h,
                      pixelSize: 60, textColor: '#aaa', text:  'Blur Shader Tests', interactive: false,
                      alignVertical:   scene.alignVertical.CENTER,
                      alignHorizontal: scene.alignHorizontal.CENTER});

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  //
  // Create TEXT + BLUR Slider
  //

  var text_obj    = scene.create({ t: 'rect',   parent:        bg, x: x1, y: y1,  w: w2,        h: 120, px: 0.5, py: 0.5, lineColor: "#444", lineWidth: lw, fillColor: "#0000", interactive: false });
  var text_blur   = scene.create({ t: 'object', parent:        bg, x: x1, y: y1,  w: w2 + 100,  h: 120, px: 0.5, py: 0.5, interactive: false });
  var text        = scene.create({ t: 'textBox', parent: text_blur, x: 0, y: 0,   w: text_blur.w, h: text_blur.h,
                      pixelSize: 44, textColor: '#aaa', text:  'Blurring', interactive: false,
                      alignVertical:   scene.alignVertical.CENTER,
                      alignHorizontal: scene.alignHorizontal.CENTER});

  function onPercent1(pc) { doImageBlur(text_blur, pc); }
  var slider1     = new slider(text_obj, onPercent1, text_obj.w/2, text_obj.h - bb, 300, 20, 0.5, 1.0);

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  //
  // Create IMAGE + BLUR Slider
  //
  var image_obj   = scene.create({ t: 'rect', parent:        bg, x: x1,   y: y2, w: w2, h: h2, px: 0.5, py: 0.5, lineColor: "#444", lineWidth: lw, fillColor: "#0000" });
  var image       = scene.create({ t: 'image',parent: image_obj, x: w2/2, y: bb, w: w1, h: h1, px: 0.5, py: 0.0, url: URL, interactive: false, stretchX: STRETCH, stretchY: STRETCH });

  function onPercent2(pc) { doImageBlur(image, pc); }
  var slider2     = new slider(image_obj, onPercent2, image_obj.w/2, image_obj.h - bb, 300, 20, 0.5, 1.0);

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  //
  // Create RECT + BLUR Slider
  //
  var rect_obj    = scene.create({ t: 'rect',   parent:       bg, x: x2,   y: y1,   w: w2,    h: 120,    px: 0.5, py: 0.5, lineColor: "#444", lineWidth: lw, fillColor: "#0000" });
  var rect        = scene.create({ t: 'object', parent: rect_obj, x: w2/2, y: bb-5,   w: w1+40, h:  60+20, px: 0.5, py: 0.0,                       interactive: false });
  var rect_fill   = scene.create({ t: 'rect',   parent:     rect, x: rect.w/2, y:rect.h/2, w: w1-35, h:  60-35, px: 0.5, py: 0.5, fillColor: "#ffA500", interactive: false });

  function onPercent3(pc) { doImageBlur(rect, pc); }
  var slider3     = new slider(rect_obj, onPercent3, rect_obj.w/2, rect_obj.h - bb, 300, b2, 0.5, 1.0);

  // - - - - - - - - - - - - - - - - - - - - - -  p - - - - - - - - - - - - - - - - - - - - - - - - - - -
  //
  // Create COMBO + BLUR Slider
  //
  var combo_obj   = scene.create({ t: 'rect',  parent:        bg,   x: x2,              y: y2, w: w2, h: h2, px: 0.5, py: 0.5, lineColor: "#444", lineWidth: lw, fillColor: "#0000" });
  var combo_image = scene.create({ t: 'image', parent: combo_obj,   x: w2/2,            y:        10, w: w1, h:              h1, px: 0.5, py: 0.0, url: URL, interactive: false, stretchX: STRETCH, stretchY: STRETCH });
  var combo_text  = scene.create({ t: 'text',  parent: combo_image, x: combo_image.w/2, y:  combo_obj.h/2, w: combo_obj.w, h: 100,px: 0.5, py: 0.5,
                                      pixelSize: 44, textColor:'#00f', text:  'Blurring', interactive: false  });

  function onPercent4(pc) { doImageBlur(combo_image, pc); }
  var slider4     = new slider(combo_obj, onPercent4, combo_obj.w/2, combo_obj.h - bb, 300, b2, 0.5, 1.0);

  //var pc25 = scene.create({ t: 'rect', parent: bg, fillColor: '#0000', lineColor: '#0F0', lineWidth: 2, x: scene, y: 0, w: 100, h: 100, interactive: false }); 
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  var blurShader = scene.create({  t:'shaderResource',
                        fragment: base + "/BlurShader.frg",
                        uniforms:
                              {
                                  "u_direction"   : "vec2",
                                  "u_kernelRadius": "float",
                                  "s_texture"     : "sampler2D"
                              } });

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  var titleBlurDX = 1.0;
  var titleBlurPC = 0.0;

  var timer = setInterval( () =>
  {
    var max_val = 50;

    titleBlurPC += (0.5 * titleBlurDX);

    if(titleBlurDX > 0 && titleBlurPC > max_val)
    {
      titleBlurPC = max_val;
      titleBlurDX = -1;
    }
    else
    if(titleBlurDX < 0 && titleBlurPC < 0.0)
    {
      titleBlurPC = 0;
      titleBlurDX = 1;
    }

    doImageBlur(title_obj, titleBlurPC);

  }, 10);

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  function doImageBlur(obj, pc)
  {
    var blurAmount   = pc / 30.0;
    var kernelRadius = Math.max(1, blurAmount /4);

    var blurFactor = [1.00, 1.25, 1.50, 1.75, 2.0];
    var blurArray  = [];

    // Create SHADER config for "gaussian" blur - kinda ... (looks good)
    //
    blurFactor.map(f =>
    {
      blurArray.push(
      {
            name: "Pass 1",
          shader: blurShader,
        uniforms: {
                    u_kernelRadius: kernelRadius * f,
                    u_direction:    [blurAmount  * f, 0]  // HORIZONTAL
                  }
      });

      blurArray.push(
      {
            name: "Pass 2",
          shader: blurShader,
        uniforms: {
                    u_kernelRadius:     kernelRadius * f,
                    u_direction:    [0, blurAmount   * f]  // VERTICAL
                  }
      });
    });

      obj.effect = blurArray;
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

}).catch(function importFailed(err) {
  console.error('Import for BlurShader2.js failed: ' + err);
});