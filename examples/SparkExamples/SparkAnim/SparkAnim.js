px.import({       scene: 'px:scene.1.js'
}).then( function importsAreReady(imports)
{
  module.exports.wantsClearscreen = function()
  {
    return true; // return 'false' to skip system black/blank draw
  };

  var scene = imports.scene;
  var root  = imports.scene.root;

  var ff = 1; // scale factor

  var ww = 334 * ff;
  var hh = 334 * ff;

  var wg = 290 * ff;
  var hg = 290 * ff;
 
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  const          svg =       'data:image/svg, <svg xmlns="http://www.w3.org/2000/svg"';
  const hex_glue_svg = svg + '<svg enable-background="new 0 0 290 290" width="290" height="290"><path d="m229.119.9h31.647l15.823 27-67.144 115 67.144 116.869-14.211 26.131h-34.794l-65.341-116.124-132.854.125-15.824-27.001 15.824-27h134.719z" fill="#5d6d65"/></svg>';//5d6d65
  const      red_svg = svg + '<svg enable-background="new 0 0 334 334" width="334" height="334"><path d="m86.32 305.645-80.913-139.999 80.913-139.998h161.821l80.912 139.998-80.912 139.999z" fill="#e6e7e8" stroke="#5d6d65" stroke-width="4.9999"/><path d="m103.985 274.145-63.264-109.499 63.264-109.499h126.493l63.261 109.499-63.261 109.499z" fill="#f16268" opacity=".75"/><path d="m226.275 62.147 59.044 101.999-59.044 101.999h-118.087l-59.045-101.999 59.044-101.999h118.029m8.464-14h-8.405-118.087-8.406l-4.21 7.205-59.044 101.992-4.227 7.283 4.227 7.292 59.043 101.988 4.21 7.236h8.406 118.087 8.405l4.211-7.242 59.043-102.009 4.227-7.292-4.227-7.297-59.042-101.953z" fill="#5d6d65"/></svg>';
  const   orange_svg = svg + '<svg enable-background="new 0 0 334 334" width="334" height="334"><path d="m86.32 305.645-80.913-139.999 80.913-139.998h161.821l80.912 139.998-80.912 139.999z" fill="#e6e7e8" stroke="#5d6d65" stroke-width="4.9999"/><path d="m103.985 274.145-63.264-109.499 63.264-109.499h126.493l63.261 109.499-63.261 109.499z" fill="#f89958" opacity=".75"/><path d="m226.275 62.147 59.044 101.999-59.044 101.999h-118.087l-59.045-101.999 59.044-101.999h118.029m8.464-14h-8.405-118.087-8.406l-4.21 7.205-59.044 101.992-4.227 7.283 4.227 7.292 59.043 101.988 4.21 7.236h8.406 118.087 8.405l4.211-7.242 59.043-102.009 4.227-7.292-4.227-7.297-59.042-101.953z" fill="#5d6d65"/></svg>';
  const   yellow_svg = svg + '<svg enable-background="new 0 0 334 334" width="334" height="334"><path d="m86.32 305.645-80.913-139.999 80.913-139.998h161.821l80.912 139.998-80.912 139.999z" fill="#e6e7e8" stroke="#5d6d65" stroke-width="4.9999"/><path d="m103.985 274.145-63.264-109.499 63.264-109.499h126.493l63.261 109.499-63.261 109.499z" fill="#faef5f" opacity=".75"/><path d="m226.275 62.147 59.044 101.999-59.044 101.999h-118.087l-59.045-101.999 59.044-101.999h118.029m8.464-14h-8.405-118.087-8.406l-4.21 7.205-59.044 101.992-4.227 7.283 4.227 7.292 59.043 101.988 4.21 7.236h8.406 118.087 8.405l4.211-7.242 59.043-102.009 4.227-7.292-4.227-7.297-59.042-101.953z" fill="#5d6d65"/></svg>';

  const hex_glue_res = scene.create({ t: "imageResource", w: wg, h: hg, url: hex_glue_svg });
  const      red_res = scene.create({ t: "imageResource", w: ww, h: hh, url:      red_svg });
  const   orange_res = scene.create({ t: "imageResource", w: ww, h: hh, url:   orange_svg });
  const   yellow_res = scene.create({ t: "imageResource", w: ww, h: hh, url:   yellow_svg });

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  var         bg = scene.create({ t: 'rect', parent: root, fillColor: '#000', x: 0, y: 0, w: scene.w, h: scene.h, interactive: false });
  var       logo = scene.create({ t: 'object', parent: bg, fillColor: "#0803", px: 0.5, py: 0.5, x: scene.w/2, y: scene.h/2, w: 500 * ff, h: 500 * ff, interactive: false, a: 0 });
  var  hexes_obj = scene.create({ t: 'object', parent: logo, fillColor: "#ffF8", px: 0.5, py: 0.5, x:  logo.w/2, y:  logo.h/2, w: 500 * ff, h: 500 * ff, interactive: false });

  var orange_obj = scene.create({ t: 'object', parent:  hexes_obj, w: ww, h: hh,                       interactive: false });
  var orange_msk = scene.create({ t: 'image',  parent: orange_obj, w: ww, h: hh, resource: orange_res, interactive: false, mask: true, clip: true, draw: false });
  var orange_img = scene.create({ t: 'image',  parent: orange_obj, w: ww, h: hh, resource: orange_res, interactive: false });

  var    red_obj = scene.create({ t: 'object', parent:  hexes_obj, w: ww, h: hh,                       interactive: false });
  var    red_msk = scene.create({ t: 'image',  parent:    red_obj, w: ww, h: hh, resource: red_res,    interactive: false, mask: true, clip: true, draw: false });
  var    red_img = scene.create({ t: 'image',  parent:    red_obj, w: ww, h: hh, resource: red_res,    interactive: false });

  var yellow_obj = scene.create({ t: 'object', parent:  hexes_obj, w: ww, h: hh,                       interactive: false });
  var yellow_msk = scene.create({ t: 'image',  parent: yellow_obj, w: ww, h: hh, resource: yellow_res, interactive: false, mask: true, clip: true, draw: false });
  var yellow_img = scene.create({ t: 'image',  parent: yellow_obj, w: ww, h: hh, resource: yellow_res, interactive: false });

  var   glue_img = scene.create({ t: 'image',  parent: logo, resource: hex_glue_res, interactive: false, px: 0.5, py: 0.5, x: logo.w/2, y: logo.h/2 });

  var ready = [ orange_img.ready, red_img.ready, yellow_img.ready,
                orange_obj.ready, red_obj.ready, yellow_obj.ready, glue_img.ready];

  Promise.all(ready).then( () =>
  {
    glue_img.w   = glue_img.resource.w;
    glue_img.h   = glue_img.resource.h;
    glue_img.cx  = glue_img.w/2 * 1.25;
    glue_img.cy  = glue_img.h/2;

    // Positioning
    orange_obj.x = (ff * 278);
    orange_obj.y = (ff *  83);
    red_obj.x    = (ff *  34);
    red_obj.y    = (ff * -57);
    yellow_obj.x = (ff *  34);
    yellow_obj.y = (ff * 226);

    // Offsets for Hex images - outside visible mask
    orange_img.x = -orange_img.w;
       red_img.x = +   red_img.w;
       red_img.y = +   red_img.h;
    yellow_img.x = +yellow_img.w;
    yellow_img.y = -yellow_img.h;

    logo.cx      = logo.w/2 * 1.15;
    logo.cy      = logo.h/2;

    // var mk1 = scene.create({ t: 'rect', parent: glue_img, fillColor: '#080',
    //         x: glue_img.w/2 * 1.25, y: glue_img.h/2, w: 12, h: 12, px: 0.5, py: 0.5, interactive: false });

    // var mk2 = scene.create({ t: 'rect', parent: hexes_obj, fillColor: '#008',
    //         x: hexes_obj.w * hexes_obj.px, y: hexes_obj.h * hexes_obj.py, w: 12, h: 12, px: 0.5, py: 0.5, interactive: false });

    // var mk3 = scene.create({ t: 'rect', parent: logo, fillColor: '#000',
    //         x: logo.cx, y: logo.cy, w: 12, h: 12, px: 0.5, py: 0.5, interactive: false });

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    logo.animateTo({ a: 1 }, 0.25).then( () =>
    {
      setTimeout( () =>
      {
        orange_img.animateTo({ x: 0, y: 0 }, 0.45)
           red_img.animateTo({ x: 0, y: 0 }, 0.45)
        yellow_img.animateTo({ x: 0, y: 0 }, 0.45)
      }, 800);

        setTimeout( () =>
        {
        logo.animateTo({ r: 360 }, 0.5)
        //  glue_img.a = 0.2
        }, 800)
    });
  });// PROMISE ALL


}).catch(function importFailed(err) {
  console.error('Import for MyApp.js failed: ' + err);
});