/*

pxCore Copyright 2005-2018 John Robinson

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

Author: Hugh Fitzpatrick

*/

"use strict";

px.import({       scene: 'px:scene.1.js',
}).then( function importsAreReady(imports)
{
  var scene = imports.scene;
  var root  = imports.scene.root;

  const HC = scene.alignHorizontal.CENTER;
  const VC = scene.alignVertical.CENTER;

  let font = scene.create({ t: "fontResource",  url: "FreeSans.ttf" });

  var offset = 0; // starting Color

  var x = 0, y = 0;

  /*
  The first 11 terms of the Fibonacci sequence are 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89
  */

  let fibnos = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89 ];

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  var bg = scene.create({ t: "rect", parent: root, w: scene.w, h: scene.w, fillColor: "#000" });

  let title = scene.create( { t: "textBox", parent: bg, x: 0, y: 80, w: scene.w, h: 50, interactive: false,
                            textColor: "#ffc", pixelSize: 30, text: "Fibonacci Gameboard", font: font,
                            alignHorizontal: HC, alignVertical: VC});

  //  Create the Fibonacci Gameboard resource...
  var halfRes = fibBoard( {fib: fibnos, colors: ["#ccc","#888"] }) ; // half the board

  var w  = halfRes.w;
  var h  = halfRes.h;

  var ss = 1.0;

  var board = scene.create({ t: "object", parent: bg,  w: w, h: h*2, sx: ss, sy: ss, cx: h, cy: h/2, px: 0.5, py: 0.40, draw: false});
  var top   = scene.create({ t: "image",  parent: board, resource: halfRes, x: 0, y: 0, w: w, h: h, cx: h, cy: h/2});
  var bot   = scene.create({ t: "image",  parent: board, resource: halfRes, x: 0, y: h, w: w, h: h, cx: h, cy: h/2, r: 180});

  Promise.all([title.ready, board.ready, top.ready, bot.ready])
  .then( o =>
  {
    board.x = (scene.w/2);
    board.y = (scene.h/2);

    board.painting = false;

    // Dump the intermediate images and resource
    top     = null;
    bot     = null;
    halfRes = null;

    board.draw = true;
  })

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  function fibRow(h, nos, colors)
  {
    var row = "";

    var dx = x; // Initial coordinates
    var dy = y; // Initial coordinates

    nos.map( (fib, n) =>
    {
      var dw  = fib; // WIDTH
      var dh  = h;   // HEIGHT
      var clr = colors[( (n + offset) % 2)];// alternate color

      var square = '<rect fill="'+clr+'" x="'+dx+'"  y="'+dy+'"  width="'+dw+'" height="'+dh+'"/>';
      row += square

      dx += dw;
    })

    x = dx; // reset for next row half

    return row;
  }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  function fibBoard(params)
  {
    var ROWS = "";
    var HH   = 0;

    // Fibonacci numbers mirrored  [ INCREASING | DECREASING ]
    let up = params.fib;
    let dn = up.slice().reverse();

    // Compose SVG for ROWs !
    dn.map( fib =>
    {
      var hh = fib; // height for this row per fibonacci number

      // ROW - left and right sides
      var lhs = fibRow(hh, dn, params.colors);
      var rhs = fibRow(hh, up, params.colors);

      x  = 0; // reset for next row
      y += hh;

      ROWS += (lhs + rhs);
      HH   += hh;

      offset = (offset++ >= 1 ) ? 0 : 1;
    });

    // Compose SVG image for this half
    var svg = 'data:image/svg,<svg transform = "scale(1.0 1.0)"">' + ROWS + '</svg>';
    var res = scene.create({ t: "imageResource", url: svg } );

    return res;
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

}).catch(function importFailed(err) {
  console.error("Import for fibBoard.js failed: " + err);
});
