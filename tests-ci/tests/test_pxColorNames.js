"use strict";
px.import({scene:"px:scene.1.js",
           assert:"../test-run/assert.js",
           manual:"../test-run/tools_manualTests.js"}).then( function ready(imports) {

var scene  = imports.scene;
var root   = imports.scene.root;
var assert = imports.assert.assert;
var manual = imports.manual;

var manualTest = manual.getManualTestValue();

root.w = 800;
root.h = 300;

function hasCapabilities()
{
  if( scene.capabilities                 == undefined ||
      scene.capabilities.graphics        == undefined ||
      scene.capabilities.graphics.colors == undefined)
  {
    return false; // "Oh NO ... cssColors is not supported in this build."
  }
  return true;
}

module.exports.beforeStart = function() {
  console.log("test_pxColorNames beforeStart()!");

  var promise = new Promise(function(resolve,reject) {
    resolve("Ready");
  });
  return promise;
}

var tests = {

  test1: function()
  {
    if(hasCapabilities() == false)
    {
      return Promise.resolve(["test1 - SKIPPED ...  color is not supported in this build."]);
    }

    return new Promise(function(resolve, reject)
    {
      var rect = scene.create({ t: 'rect', parent: root, fillColor: "#000", x: 0, y: 0, w: 100, h: 100 });
      rect.ready.then(function(o)
      {
        var results = [];

        var color, value;
        colorNames.map( clrObj =>
        {
            color = clrObj.color;
            value = clrObj.value;

            rect.fillColor = color;

            console.log("TEST1 >>  fillColor:  '"+color+"' ("+value+") == " + rect.fillColor);

            results.push(assert(rect.fillColor === value," fillColor: '"+color+"' ("+value+") != " + rect.fillColor ));
        });

        resolve(results);
      },
      function() // reject
      {
        reject(["test1 - REJECT ...  color test failed. (unknown)"]);
      });
    })
  },

  test2: function()
  {
    if(hasCapabilities() == false)
    {
      return Promise.resolve(["test2 - SKIPPED ...  color is not supported in this build."]);
    }

    return new Promise(function(resolve, reject)
    {
      var rect = scene.create({ t: 'rect', parent: root, fillColor: "#000", x: 0, y: 0, w: 100, h: 100 });
      rect.ready.then(function(o)
      {
        var results = [];
        rect.fillColor = "#fff8"; // RGB A

        results.push(assert(rect.fillColor === 0xFFFFFF88," fillColor: " + rect.fillColor ));

        resolve(results);
      },
      function() // reject
      {
        reject(["test2 - REJECT ...  color test failed. (unknown)"]);
      });
    });
  },

    test3: function()
    {
      if(hasCapabilities() == false)
      {
        return Promise.resolve(["test3 - SKIPPED ...  color is not supported in this build."]);
      }

      return new Promise(function(resolve, reject)
      {
        var rect = scene.create({ t: 'rect', parent: root, fillColor: "#000", x: 0, y: 0, w: 100, h: 100 });
        rect.ready.then(function(o)
        {
          var results = [];
          rect.fillColor = "#ffffff88"; // RRGGBB A

          results.push(assert(rect.fillColor === 0xFFFFFF88," fillColor: " + rect.fillColor ));

          resolve(results);
        },
        function() // reject
        {
          reject(["test3 - REJECT ...  color test failed. (unknown)"]);
        })
      });
    }
}

module.exports.tests = tests;

if(manualTest === true) {

  manual.runTestsManually(tests, module.exports.beforeStart);
}

}).catch( function importFailed(err){
  console.log("err: "+err);
  console.error("Import for test_pxColorNames.js failed: " + err)
});


const colorNames =
[
  { color: "indianred",             value: 0xCD5C5Cff },  // #CD5C5C   // "IndianRed"
  { color: "lightcoral",            value: 0xF08080ff },  // #F08080   // "LightCoral"
  { color: "salmon",                value: 0xFA8072ff },  // #FA8072   // "Salmon"
  { color: "darksalmon",            value: 0xE9967Aff },  // #E9967A   // "DarkSalmon"
  { color: "lightsalmon",           value: 0xFFA07Aff },  // #FFA07A   // "LightSalmon"
  { color: "crimson",               value: 0xDC143Cff },  // #DC143C   // "Crimson"
  { color: "red",                   value: 0xFF0000ff },  // #FF0000   // "Red"
  { color: "firebrick",             value: 0xB22222ff },  // #B22222   // "FireBrick"
  { color: "darkred",               value: 0x8B0000ff },  // #8B0000   // "DarkRed"
  { color: "pink",                  value: 0xFFC0CBff },  // #FFC0CB   // "Pink"
  { color: "lightpink",             value: 0xFFB6C1ff },  // #FFB6C1   // "LightPink"
  { color: "hotpink",               value: 0xFF69B4ff },  // #FF69B4   // "HotPink"
  { color: "deeppink",              value: 0xFF1493ff },  // #FF1493   // "DeepPink"
  { color: "mediumvioletred",       value: 0xC71585ff },  // #C71585   // "MediumVioletRed"
  { color: "palevioletred",         value: 0xDB7093ff },  // #DB7093   // "PaleVioletRed"
  { color: "coral",                 value: 0xFF7F50ff },  // #FF7F50   // "Coral"
  { color: "tomato",                value: 0xFF6347ff },  // #FF6347   // "Tomato"
  { color: "orangered",             value: 0xFF4500ff },  // #FF4500   // "OrangeRed"
  { color: "darkorange",            value: 0xFF8C00ff },  // #FF8C00   // "DarkOrange"
  { color: "orange",                value: 0xFFA500ff },  // #FFA500   // "Orange"
  { color: "gold",                  value: 0xFFD700ff },  // #FFD700   // "Gold"
  { color: "yellow",                value: 0xFFFF00ff },  // #FFFF00   // "Yellow"
  { color: "lightyellow",           value: 0xFFFFE0ff },  // #FFFFE0   // "LightYellow"
  { color: "lemonchiffon",          value: 0xFFFACDff },  // #FFFACD   // "LemonChiffon"
  { color: "lightgoldenrodyellow",  value: 0xFAFAD2ff },  // #FAFAD2   // "LightGoldenrodYellow"
  { color: "papayawhip",            value: 0xFFEFD5ff },  // #FFEFD5   // "PapayaWhip"
  { color: "moccasin",              value: 0xFFE4B5ff },  // #FFE4B5   // "Moccasin"
  { color: "peachpuff",             value: 0xFFDAB9ff },  // #FFDAB9   // "PeachPuff"
  { color: "palegoldenrod",         value: 0xEEE8AAff },  // #EEE8AA   // "PaleGoldenrod"
  { color: "khaki",                 value: 0xF0E68Cff },  // #F0E68C   // "Khaki"
  { color: "darkkhaki",             value: 0xBDB76Bff },  // #BDB76B   // "DarkKhaki"
  { color: "lavender",              value: 0xE6E6FAff },  // #E6E6FA   // "Lavender"
  { color: "thistle",               value: 0xD8BFD8ff },  // #D8BFD8   // "Thistle"
  { color: "plum",                  value: 0xDDA0DDff },  // #DDA0DD   // "Plum"
  { color: "violet",                value: 0xEE82EEff },  // #EE82EE   // "Violet"
  { color: "orchid",                value: 0xDA70D6ff },  // #DA70D6   // "Orchid"
  { color: "fuchsia",               value: 0xFF00FFff },  // #FF00FF   // "Fuchsia"
  { color: "magenta",               value: 0xFF00FFff },  // #FF00FF   // "Magenta"
  { color: "mediumorchid",          value: 0xBA55D3ff },  // #BA55D3   // "MediumOrchid"
  { color: "mediumpurple",          value: 0x9370DBff },  // #9370DB   // "MediumPurple"
  { color: "blueviolet",            value: 0x8A2BE2ff },  // #8A2BE2   // "BlueViolet"
  { color: "darkviolet",            value: 0x9400D3ff },  // #9400D3   // "DarkViolet"
  { color: "darkorchid",            value: 0x9932CCff },  // #9932CC   // "DarkOrchid"
  { color: "darkmagenta",           value: 0x8B008Bff },  // #8B008B   // "DarkMagenta"
  { color: "purple",                value: 0x800080ff },  // #800080   // "Purple"
  { color: "rebeccapurple",         value: 0x663399ff },  // #663399   // "RebeccaPurple"
  { color: "indigo",                value: 0x4B0082ff },  // #4B0082   // "Indigo"
  { color: "mediumslateblue",       value: 0x7B68EEff },  // #7B68EE   // "MediumSlateBlue"
  { color: "slateblue",             value: 0x6A5ACDff },  // #6A5ACD   // "SlateBlue"
  { color: "darkslateblue",         value: 0x483D8Bff },  // #483D8B   // "DarkSlateBlue"
  { color: "greenyellow",           value: 0xADFF2Fff },  // #ADFF2F   // "GreenYellow"
  { color: "chartreuse",            value: 0x7FFF00ff },  // #7FFF00   // "Chartreuse"
  { color: "lawngreen",             value: 0x7CFC00ff },  // #7CFC00   // "LawnGreen"
  { color: "lime",                  value: 0x00FF00ff },  // #00FF00   // "Lime"
  { color: "limegreen",             value: 0x32CD32ff },  // #32CD32   // "LimeGreen"
  { color: "palegreen",             value: 0x98FB98ff },  // #98FB98   // "PaleGreen"
  { color: "lightgreen",            value: 0x90EE90ff },  // #90EE90   // "LightGreen"
  { color: "mediumspringgreen",     value: 0x00FA9Aff },  // #00FA9A   // "MediumSpringGreen"
  { color: "springgreen",           value: 0x00FF7Fff },  // #00FF7F   // "SpringGreen"
  { color: "mediumseagreen",        value: 0x3CB371ff },  // #3CB371   // "MediumSeaGreen"
  { color: "seagreen",              value: 0x2E8B57ff },  // #2E8B57   // "SeaGreen"
  { color: "forestgreen",           value: 0x228B22ff },  // #228B22   // "ForestGreen"
  { color: "green",                 value: 0x008000ff },  // #008000   // "Green"
  { color: "darkgreen",             value: 0x006400ff },  // #006400   // "DarkGreen"
  { color: "yellowgreen",           value: 0x9ACD32ff },  // #9ACD32   // "YellowGreen"
  { color: "olivedrab",             value: 0x6B8E23ff },  // #6B8E23   // "OliveDrab"
  { color: "olive",                 value: 0x808000ff },  // #808000   // "Olive"
  { color: "darkolivegreen",        value: 0x556B2Fff },  // #556B2F   // "DarkOliveGreen"
  { color: "mediumaquamarine",      value: 0x66CDAAff },  // #66CDAA   // "MediumAquamarine"
  { color: "darkseagreen",          value: 0x8FBC8Fff },  // #8FBC8F   // "DarkSeaGreen"
  { color: "lightseagreen",         value: 0x20B2AAff },  // #20B2AA   // "LightSeaGreen"
  { color: "darkcyan",              value: 0x008B8Bff },  // #008B8B   // "DarkCyan"
  { color: "teal",                  value: 0x008080ff },  // #008080   // "Teal"
  { color: "aqua",                  value: 0x00FFFFff },  // #00FFFF   // "Aqua"
  { color: "cyan",                  value: 0x00FFFFff },  // #00FFFF   // "Cyan"
  { color: "lightcyan",             value: 0xE0FFFFff },  // #E0FFFF   // "LightCyan"
  { color: "paleturquoise",         value: 0xAFEEEEff },  // #AFEEEE   // "PaleTurquoise"
  { color: "aquamarine",            value: 0x7FFFD4ff },  // #7FFFD4   // "Aquamarine"
  { color: "turquoise",             value: 0x40E0D0ff },  // #40E0D0   // "Turquoise"
  { color: "mediumturquoise",       value: 0x48D1CCff },  // #48D1CC   // "MediumTurquoise"
  { color: "darkturquoise",         value: 0x00CED1ff },  // #00CED1   // "DarkTurquoise"
  { color: "cadetblue",             value: 0x5F9EA0ff },  // #5F9EA0   // "CadetBlue"
  { color: "steelblue",             value: 0x4682B4ff },  // #4682B4   // "SteelBlue"
  { color: "lightsteelblue",        value: 0xB0C4DEff },  // #B0C4DE   // "LightSteelBlue"
  { color: "powderblue",            value: 0xB0E0E6ff },  // #B0E0E6   // "PowderBlue"
  { color: "lightblue",             value: 0xADD8E6ff },  // #ADD8E6   // "LightBlue"
  { color: "skyblue",               value: 0x87CEEBff },  // #87CEEB   // "SkyBlue"
  { color: "lightskyblue",          value: 0x87CEFAff },  // #87CEFA   // "LightSkyBlue"
  { color: "deepskyblue",           value: 0x00BFFFff },  // #00BFFF   // "DeepSkyBlue"
  { color: "dodgerblue",            value: 0x1E90FFff },  // #1E90FF   // "DodgerBlue"
  { color: "cornflowerblue",        value: 0x6495EDff },  // #6495ED   // "CornflowerBlue"
  { color: "royalblue",             value: 0x4169E1ff },  // #4169E1   // "RoyalBlue"
  { color: "blue",                  value: 0x0000FFff },  // #0000FF   // "Blue"
  { color: "mediumblue",            value: 0x0000CDff },  // #0000CD   // "MediumBlue"
  { color: "darkblue",              value: 0x00008Bff },  // #00008B   // "DarkBlue"
  { color: "navy",                  value: 0x000080ff },  // #000080   // "Navy"
  { color: "midnightblue",          value: 0x191970ff },  // #191970   // "MidnightBlue"
  { color: "cornsilk",              value: 0xFFF8DCff },  // #FFF8DC   // "Cornsilk"
  { color: "blanchedalmond",        value: 0xFFEBCDff },  // #FFEBCD   // "BlanchedAlmond"
  { color: "bisque",                value: 0xFFE4C4ff },  // #FFE4C4   // "Bisque"
  { color: "navajowhite",           value: 0xFFDEADff },  // #FFDEAD   // "NavajoWhite"
  { color: "wheat",                 value: 0xF5DEB3ff },  // #F5DEB3   // "Wheat"
  { color: "burlywood",             value: 0xDEB887ff },  // #DEB887   // "BurlyWood"
  { color: "tan",                   value: 0xD2B48Cff },  // #D2B48C   // "Tan"
  { color: "rosybrown",             value: 0xBC8F8Fff },  // #BC8F8F   // "RosyBrown"
  { color: "sandybrown",            value: 0xF4A460ff },  // #F4A460   // "SandyBrown"
  { color: "goldenrod",             value: 0xDAA520ff },  // #DAA520   // "Goldenrod"
  { color: "darkgoldenrod",         value: 0xB8860Bff },  // #B8860B   // "DarkGoldenrod"
  { color: "peru",                  value: 0xCD853Fff },  // #CD853F   // "Peru"
  { color: "chocolate",             value: 0xD2691Eff },  // #D2691E   // "Chocolate"
  { color: "saddlebrown",           value: 0x8B4513ff },  // #8B4513   // "SaddleBrown"
  { color: "sienna",                value: 0xA0522Dff },  // #A0522D   // "Sienna"
  { color: "brown",                 value: 0xA52A2Aff },  // #A52A2A   // "Brown"
  { color: "maroon",                value: 0x800000ff },  // #800000   // "Maroon"
  { color: "white",                 value: 0xFFFFFFff },  // #FFFFFF   // "White"
  { color: "snow",                  value: 0xFFFAFAff },  // #FFFAFA   // "Snow"
  { color: "honeydew",              value: 0xF0FFF0ff },  // #F0FFF0   // "Honeydew"
  { color: "mintcream",             value: 0xF5FFFAff },  // #F5FFFA   // "MintCream"
  { color: "azure",                 value: 0xF0FFFFff },  // #F0FFFF   // "Azure"
  { color: "aliceblue",             value: 0xF0F8FFff },  // #F0F8FF   // "AliceBlue"
  { color: "ghostwhite",            value: 0xF8F8FFff },  // #F8F8FF   // "GhostWhite"
  { color: "whitesmoke",            value: 0xF5F5F5ff },  // #F5F5F5   // "WhiteSmoke"
  { color: "seashell",              value: 0xFFF5EEff },  // #FFF5EE   // "Seashell"
  { color: "beige",                 value: 0xF5F5DCff },  // #F5F5DC   // "Beige"
  { color: "oldlace",               value: 0xFDF5E6ff },  // #FDF5E6   // "OldLace"
  { color: "floralwhite",           value: 0xFFFAF0ff },  // #FFFAF0   // "FloralWhite"
  { color: "ivory",                 value: 0xFFFFF0ff },  // #FFFFF0   // "Ivory"
  { color: "antiquewhite",          value: 0xFAEBD7ff },  // #FAEBD7   // "AntiqueWhite"
  { color: "linen",                 value: 0xFAF0E6ff },  // #FAF0E6   // "Linen"
  { color: "lavenderblush",         value: 0xFFF0F5ff },  // #FFF0F5   // "LavenderBlush"
  { color: "mistyrose",             value: 0xFFE4E1ff },  // #FFE4E1   // "MistyRose"
  { color: "gainsboro",             value: 0xDCDCDCff },  // #DCDCDC   // "Gainsboro"
  { color: "lightgray",             value: 0xD3D3D3ff },  // #D3D3D3   // "LightGray"
  { color: "lightgrey",             value: 0xD3D3D3ff },  // #D3D3D3   // "LightGrey"
  { color: "silver",                value: 0xC0C0C0ff },  // #C0C0C0   // "Silver"
  { color: "darkgray",              value: 0xA9A9A9ff },  // #A9A9A9   // "DarkGray"
  { color: "darkgrey",              value: 0xA9A9A9ff },  // #A9A9A9   // "DarkGrey"
  { color: "gray",                  value: 0x808080ff },  // #808080   // "Gray"
  { color: "grey",                  value: 0x808080ff },  // #808080   // "Grey"
  { color: "dimgray",               value: 0x696969ff },  // #696969   // "DimGray"
  { color: "dimgrey",               value: 0x696969ff },  // #696969   // "DimGrey"
  { color: "lightslategray",        value: 0x778899ff },  // #778899   // "LightSlateGray"
  { color: "lightslategrey",        value: 0x778899ff },  // #778899   // "LightSlateGrey"
  { color: "slategray",             value: 0x708090ff },  // #708090   // "SlateGray"
  { color: "slategrey",             value: 0x708090ff },  // #708090   // "SlateGrey"
  { color: "darkslategray",         value: 0x2F4F4Fff },  // #2F4F4F   // "DarkSlateGray"
  { color: "darkslategrey",         value: 0x2F4F4Fff },  // #2F4F4F   // "DarkSlateGrey"
  { color: "black",                 value: 0x000000ff },  // #000000   // "Black"

  { color: "#CD5C5C",               value: 0xCD5C5Cff },  // #CD5C5C   // "IndianRed"
  { color: "#F08080",               value: 0xF08080ff },  // #F08080   // "LightCoral"
  { color: "#FA8072",               value: 0xFA8072ff },  // #FA8072   // "Salmon"
  { color: "#E9967A",               value: 0xE9967Aff },  // #E9967A   // "DarkSalmon"
  { color: "#FFA07A",               value: 0xFFA07Aff },  // #FFA07A   // "LightSalmon"
  { color: "#DC143C",               value: 0xDC143Cff },  // #DC143C   // "Crimson"
  { color: "#FF0000",               value: 0xFF0000ff },  // #FF0000   // "Red"
  { color: "#B22222",               value: 0xB22222ff },  // #B22222   // "FireBrick"
  { color: "#8B0000",               value: 0x8B0000ff },  // #8B0000   // "DarkRed"
  { color: "#FFC0CB",               value: 0xFFC0CBff },  // #FFC0CB   // "Pink"
  { color: "#FFB6C1",               value: 0xFFB6C1ff },  // #FFB6C1   // "LightPink"
  { color: "#FF69B4",               value: 0xFF69B4ff },  // #FF69B4   // "HotPink"
  { color: "#FF1493",               value: 0xFF1493ff },  // #FF1493   // "DeepPink"
  { color: "#C71585",               value: 0xC71585ff },  // #C71585   // "MediumVioletRed"
  { color: "#DB7093",               value: 0xDB7093ff },  // #DB7093   // "PaleVioletRed"
  { color: "#FF7F50",               value: 0xFF7F50ff },  // #FF7F50   // "Coral"
  { color: "#FF6347",               value: 0xFF6347ff },  // #FF6347   // "Tomato"
  { color: "#FF4500",               value: 0xFF4500ff },  // #FF4500   // "OrangeRed"
  { color: "#FF8C00",               value: 0xFF8C00ff },  // #FF8C00   // "DarkOrange"
  { color: "#FFA500",               value: 0xFFA500ff },  // #FFA500   // "Orange"
  { color: "#FFD700",               value: 0xFFD700ff },  // #FFD700   // "Gold"
  { color: "#FFFF00",               value: 0xFFFF00ff },  // #FFFF00   // "Yellow"
  { color: "#FFFFE0",               value: 0xFFFFE0ff },  // #FFFFE0   // "LightYellow"
  { color: "#FFFACD",               value: 0xFFFACDff },  // #FFFACD   // "LemonChiffon"
  { color: "#FAFAD2",               value: 0xFAFAD2ff },  // #FAFAD2   // "LightGoldenrodYellow"
  { color: "#FFEFD5",               value: 0xFFEFD5ff },  // #FFEFD5   // "PapayaWhip"
  { color: "#FFE4B5",               value: 0xFFE4B5ff },  // #FFE4B5   // "Moccasin"
  { color: "#FFDAB9",               value: 0xFFDAB9ff },  // #FFDAB9   // "PeachPuff"
  { color: "#EEE8AA",               value: 0xEEE8AAff },  // #EEE8AA   // "PaleGoldenrod"
  { color: "#F0E68C",               value: 0xF0E68Cff },  // #F0E68C   // "Khaki"
  { color: "#BDB76B",               value: 0xBDB76Bff },  // #BDB76B   // "DarkKhaki"
  { color: "#E6E6FA",               value: 0xE6E6FAff },  // #E6E6FA   // "Lavender"
  { color: "#D8BFD8",               value: 0xD8BFD8ff },  // #D8BFD8   // "Thistle"
  { color: "#DDA0DD",               value: 0xDDA0DDff },  // #DDA0DD   // "Plum"
  { color: "#EE82EE",               value: 0xEE82EEff },  // #EE82EE   // "Violet"
  { color: "#DA70D6",               value: 0xDA70D6ff },  // #DA70D6   // "Orchid"
  { color: "#FF00FF",               value: 0xFF00FFff },  // #FF00FF   // "Fuchsia"
  { color: "#FF00FF",               value: 0xFF00FFff },  // #FF00FF   // "Magenta"
  { color: "#BA55D3",               value: 0xBA55D3ff },  // #BA55D3   // "MediumOrchid"
  { color: "#9370DB",               value: 0x9370DBff },  // #9370DB   // "MediumPurple"
  { color: "#8A2BE2",               value: 0x8A2BE2ff },  // #8A2BE2   // "BlueViolet"
  { color: "#9400D3",               value: 0x9400D3ff },  // #9400D3   // "DarkViolet"
  { color: "#9932CC",               value: 0x9932CCff },  // #9932CC   // "DarkOrchid"
  { color: "#8B008B",               value: 0x8B008Bff },  // #8B008B   // "DarkMagenta"
  { color: "#800080",               value: 0x800080ff },  // #800080   // "Purple"
  { color: "#663399",               value: 0x663399ff },  // #663399   // "RebeccaPurple"
  { color: "#4B0082",               value: 0x4B0082ff },  // #4B0082   // "Indigo"
  { color: "#7B68EE",               value: 0x7B68EEff },  // #7B68EE   // "MediumSlateBlue"
  { color: "#6A5ACD",               value: 0x6A5ACDff },  // #6A5ACD   // "SlateBlue"
  { color: "#483D8B",               value: 0x483D8Bff },  // #483D8B   // "DarkSlateBlue"
  { color: "#ADFF2F",               value: 0xADFF2Fff },  // #ADFF2F   // "GreenYellow"
  { color: "#7FFF00",               value: 0x7FFF00ff },  // #7FFF00   // "Chartreuse"
  { color: "#7CFC00",               value: 0x7CFC00ff },  // #7CFC00   // "LawnGreen"
  { color: "#00FF00",               value: 0x00FF00ff },  // #00FF00   // "Lime"
  { color: "#32CD32",               value: 0x32CD32ff },  // #32CD32   // "LimeGreen"
  { color: "#98FB98",               value: 0x98FB98ff },  // #98FB98   // "PaleGreen"
  { color: "#90EE90",               value: 0x90EE90ff },  // #90EE90   // "LightGreen"
  { color: "#00FA9A",               value: 0x00FA9Aff },  // #00FA9A   // "MediumSpringGreen"
  { color: "#00FF7F",               value: 0x00FF7Fff },  // #00FF7F   // "SpringGreen"
  { color: "#3CB371",               value: 0x3CB371ff },  // #3CB371   // "MediumSeaGreen"
  { color: "#2E8B57",               value: 0x2E8B57ff },  // #2E8B57   // "SeaGreen"
  { color: "#228B22",               value: 0x228B22ff },  // #228B22   // "ForestGreen"
  { color: "#008000",               value: 0x008000ff },  // #008000   // "Green"
  { color: "#006400",               value: 0x006400ff },  // #006400   // "DarkGreen"
  { color: "#9ACD32",               value: 0x9ACD32ff },  // #9ACD32   // "YellowGreen"
  { color: "#6B8E23",               value: 0x6B8E23ff },  // #6B8E23   // "OliveDrab"
  { color: "#808000",               value: 0x808000ff },  // #808000   // "Olive"
  { color: "#556B2F",               value: 0x556B2Fff },  // #556B2F   // "DarkOliveGreen"
  { color: "#66CDAA",               value: 0x66CDAAff },  // #66CDAA   // "MediumAquamarine"
  { color: "#8FBC8F",               value: 0x8FBC8Fff },  // #8FBC8F   // "DarkSeaGreen"
  { color: "#20B2AA",               value: 0x20B2AAff },  // #20B2AA   // "LightSeaGreen"
  { color: "#008B8B",               value: 0x008B8Bff },  // #008B8B   // "DarkCyan"
  { color: "#008080",               value: 0x008080ff },  // #008080   // "Teal"
  { color: "#00FFFF",               value: 0x00FFFFff },  // #00FFFF   // "Aqua"
  { color: "#00FFFF",               value: 0x00FFFFff },  // #00FFFF   // "Cyan"
  { color: "#E0FFFF",               value: 0xE0FFFFff },  // #E0FFFF   // "LightCyan"
  { color: "#AFEEEE",               value: 0xAFEEEEff },  // #AFEEEE   // "PaleTurquoise"
  { color: "#7FFFD4",               value: 0x7FFFD4ff },  // #7FFFD4   // "Aquamarine"
  { color: "#40E0D0",               value: 0x40E0D0ff },  // #40E0D0   // "Turquoise"
  { color: "#48D1CC",               value: 0x48D1CCff },  // #48D1CC   // "MediumTurquoise"
  { color: "#00CED1",               value: 0x00CED1ff },  // #00CED1   // "DarkTurquoise"
  { color: "#5F9EA0",               value: 0x5F9EA0ff },  // #5F9EA0   // "CadetBlue"
  { color: "#4682B4",               value: 0x4682B4ff },  // #4682B4   // "SteelBlue"
  { color: "#B0C4DE",               value: 0xB0C4DEff },  // #B0C4DE   // "LightSteelBlue"
  { color: "#B0E0E6",               value: 0xB0E0E6ff },  // #B0E0E6   // "PowderBlue"
  { color: "#ADD8E6",               value: 0xADD8E6ff },  // #ADD8E6   // "LightBlue"
  { color: "#87CEEB",               value: 0x87CEEBff },  // #87CEEB   // "SkyBlue"
  { color: "#87CEFA",               value: 0x87CEFAff },  // #87CEFA   // "LightSkyBlue"
  { color: "#00BFFF",               value: 0x00BFFFff },  // #00BFFF   // "DeepSkyBlue"
  { color: "#1E90FF",               value: 0x1E90FFff },  // #1E90FF   // "DodgerBlue"
  { color: "#6495ED",               value: 0x6495EDff },  // #6495ED   // "CornflowerBlue"
  { color: "#4169E1",               value: 0x4169E1ff },  // #4169E1   // "RoyalBlue"
  { color: "#0000FF",               value: 0x0000FFff },  // #0000FF   // "Blue"
  { color: "#0000CD",               value: 0x0000CDff },  // #0000CD   // "MediumBlue"
  { color: "#00008B",               value: 0x00008Bff },  // #00008B   // "DarkBlue"
  { color: "#000080",               value: 0x000080ff },  // #000080   // "Navy"
  { color: "#191970",               value: 0x191970ff },  // #191970   // "MidnightBlue"
  { color: "#FFF8DC",               value: 0xFFF8DCff },  // #FFF8DC   // "Cornsilk"
  { color: "#FFEBCD",               value: 0xFFEBCDff },  // #FFEBCD   // "BlanchedAlmond"
  { color: "#FFE4C4",               value: 0xFFE4C4ff },  // #FFE4C4   // "Bisque"
  { color: "#FFDEAD",               value: 0xFFDEADff },  // #FFDEAD   // "NavajoWhite"
  { color: "#F5DEB3",               value: 0xF5DEB3ff },  // #F5DEB3   // "Wheat"
  { color: "#DEB887",               value: 0xDEB887ff },  // #DEB887   // "BurlyWood"
  { color: "#D2B48C",               value: 0xD2B48Cff },  // #D2B48C   // "Tan"
  { color: "#BC8F8F",               value: 0xBC8F8Fff },  // #BC8F8F   // "RosyBrown"
  { color: "#F4A460",               value: 0xF4A460ff },  // #F4A460   // "SandyBrown"
  { color: "#DAA520",               value: 0xDAA520ff },  // #DAA520   // "Goldenrod"
  { color: "#B8860B",               value: 0xB8860Bff },  // #B8860B   // "DarkGoldenrod"
  { color: "#CD853F",               value: 0xCD853Fff },  // #CD853F   // "Peru"
  { color: "#D2691E",               value: 0xD2691Eff },  // #D2691E   // "Chocolate"
  { color: "#8B4513",               value: 0x8B4513ff },  // #8B4513   // "SaddleBrown"
  { color: "#A0522D",               value: 0xA0522Dff },  // #A0522D   // "Sienna"
  { color: "#A52A2A",               value: 0xA52A2Aff },  // #A52A2A   // "Brown"
  { color: "#800000",               value: 0x800000ff },  // #800000   // "Maroon"
  { color: "#FFFFFF",               value: 0xFFFFFFff },  // #FFFFFF   // "White"
  { color: "#FFFAFA",               value: 0xFFFAFAff },  // #FFFAFA   // "Snow"
  { color: "#F0FFF0",               value: 0xF0FFF0ff },  // #F0FFF0   // "Honeydew"
  { color: "#F5FFFA",               value: 0xF5FFFAff },  // #F5FFFA   // "MintCream"
  { color: "#F0FFFF",               value: 0xF0FFFFff },  // #F0FFFF   // "Azure"
  { color: "#F0F8FF",               value: 0xF0F8FFff },  // #F0F8FF   // "AliceBlue"
  { color: "#F8F8FF",               value: 0xF8F8FFff },  // #F8F8FF   // "GhostWhite"
  { color: "#F5F5F5",               value: 0xF5F5F5ff },  // #F5F5F5   // "WhiteSmoke"
  { color: "#FFF5EE",               value: 0xFFF5EEff },  // #FFF5EE   // "Seashell"
  { color: "#F5F5DC",               value: 0xF5F5DCff },  // #F5F5DC   // "Beige"
  { color: "#FDF5E6",               value: 0xFDF5E6ff },  // #FDF5E6   // "OldLace"
  { color: "#FFFAF0",               value: 0xFFFAF0ff },  // #FFFAF0   // "FloralWhite"
  { color: "#FFFFF0",               value: 0xFFFFF0ff },  // #FFFFF0   // "Ivory"
  { color: "#FAEBD7",               value: 0xFAEBD7ff },  // #FAEBD7   // "AntiqueWhite"
  { color: "#FAF0E6",               value: 0xFAF0E6ff },  // #FAF0E6   // "Linen"
  { color: "#FFF0F5",               value: 0xFFF0F5ff },  // #FFF0F5   // "LavenderBlush"
  { color: "#FFE4E1",               value: 0xFFE4E1ff },  // #FFE4E1   // "MistyRose"
  { color: "#DCDCDC",               value: 0xDCDCDCff },  // #DCDCDC   // "Gainsboro"
  { color: "#D3D3D3",               value: 0xD3D3D3ff },  // #D3D3D3   // "LightGray"
  { color: "#D3D3D3",               value: 0xD3D3D3ff },  // #D3D3D3   // "LightGrey"
  { color: "#C0C0C0",               value: 0xC0C0C0ff },  // #C0C0C0   // "Silver"
  { color: "#A9A9A9",               value: 0xA9A9A9ff },  // #A9A9A9   // "DarkGray"
  { color: "#A9A9A9",               value: 0xA9A9A9ff },  // #A9A9A9   // "DarkGrey"
  { color: "#808080",               value: 0x808080ff },  // #808080   // "Gray"
  { color: "#808080",               value: 0x808080ff },  // #808080   // "Grey"
  { color: "#696969",               value: 0x696969ff },  // #696969   // "DimGray"
  { color: "#696969",               value: 0x696969ff },  // #696969   // "DimGrey"
  { color: "#778899",               value: 0x778899ff },  // #778899   // "LightSlateGray"
  { color: "#778899",               value: 0x778899ff },  // #778899   // "LightSlateGrey"
  { color: "#708090",               value: 0x708090ff },  // #708090   // "SlateGray"
  { color: "#708090",               value: 0x708090ff },  // #708090   // "SlateGrey"
  { color: "#2F4F4F",               value: 0x2F4F4Fff },  // #2F4F4F   // "DarkSlateGray"
  { color: "#2F4F4F",               value: 0x2F4F4Fff },  // #2F4F4F   // "DarkSlateGrey"
  { color: "#000000",               value: 0x000000ff }   // #000000   // "Black"
];