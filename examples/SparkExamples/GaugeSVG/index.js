/*
  pxCore Copyright 2005-2017 John Robinson

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

px.import({
        scene: 'px:scene.1.js',
     gaugeSVG: './GaugeSVG.js'
}).then( function importsAreReady(imports)
{
    module.exports.wantsClearscreen = function()
    {
      return true; // return 'false' to skip system black/blank draw
    };

    
    var scene = imports.scene;
    var root  = scene.root;

    var GaugeSVG = imports.gaugeSVG;

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    //
    // EXAMPLE:  Create a variety of Gauges
    //
    var guages =
    [
       {  d: 256, wt: 65, x: 128 + 256 * 2, y: 528, fc: "#080", bc: "#111", t:  10.0, testPos: 90 },
       {  d: 128, wt: 35, x: 128 + 128 * 2, y: 528, fc: "#008", bc: "#111", t:  2.25, testPos: 30 },
       {  d: 64,  wt: 16, x: 128 +  64 * 2, y: 528, fc: "#088", bc: "#111", t:  7.50, testPos: 50 },
       {  d: 32,  wt:  8, x: 128 +  32 * 2, y: 528, fc: "#aaa", bc: "#111", t: 15.00, testPos: 60 },
       {  d: 16,  wt: 10, x: 128 +  16 * 2, y: 528, fc: "#e00", bc: "#111", t: 30.00, testPos: 90 },
    ];

    guages.map( (o, i) =>
    {
        let g = new GaugeSVG(scene, Object.assign({ parent: root, px: 0.5, py: 1.0 }, o) );

        // g.fillRing();
        // setTimeout(() => { g.emptyRing() }, 8000);

       g.setPos( o.testPos, o.t ); // animate to Percentage 'complete'
    });

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    //
    // EXAMPLE:  Stack concentric rings (using px/py anchors) - and only changing dimension
    //
    var watch =
    [
        {  d: 256, wt: 65, x: 928, y: 400, fc: "#d22f30", bc: "#000" , t:  3.0 },
        {  d: 120, wt: 30, x: 928, y: 400, fc: "#c0fa4f", bc: "#000" , t:  6.0 },
        {  d:  52, wt: 13, x: 928, y: 400, fc: "#5dcad9", bc: "#000" , t:  9.0 },
    ];

    watch.map( o =>
    {
        // Apply properties from map() - 'o' - to common properties of 'parent" and anchor 'px/py'
        var g = new GaugeSVG(scene, Object.assign({ parent: root, px: 0.5, py: 0.5 }, o) );
        g.fillRing();
    });
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    var ccx = scene.alignHorizontal.CENTER;
    var ccy = scene.alignVertical.CENTER;

    var title = scene.create({t: 'textBox', parent: root, text: "Gauges SVG", x: 0, y: 60, 
                w: scene.w, h: 60,
    textColor: "#eee", pixelSize: 50, alignHorizontal: ccx, alignVertical: ccy });

    var author = scene.create({t: 'textBox', parent: title, text: "- Hugh Fitzpatrick", x: 0, y: 65, 
    w: scene.w, h: 25, 
    textColor: "#ccc", pixelSize: 15, alignHorizontal: ccx, alignVertical: ccy });

}).catch( function importFailed(err)
{
    console.error("SVG >> Import failed for index.js: " + err);
});
