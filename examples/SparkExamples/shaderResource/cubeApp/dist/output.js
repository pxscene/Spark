/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./cubeApp.js":
/*!********************!*\
  !*** ./cubeApp.js ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports) {

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

  Author:   Hugh Fitzpatrick
  Version:  1.0
     Date:  11/12/2019
*/

px.import({       scene: 'px:scene.1.js',
                   keys: 'px:tools.keys.js'
}).then( function importsAreReady(imports)
{
  // module.exports.wantsClearscreen = function()
  // {
  //   return true; // return 'false' to skip system black/blank draw
  // };

  var scene = imports.scene;
  var root  = imports.scene.root;
  var keys  = imports.keys;

  var base  = px.getPackageBaseFilePath();

  if( scene.capabilities                  == undefined ||
      scene.capabilities.graphics         == undefined ||
      scene.capabilities.graphics.shaders == undefined ||
      scene.capabilities.graphics.shaders < 1)
  {
    // If Shader is not supported...
    throw "EXPCEPTION - Shaders are not supported in this version of Spark..."
  }

  const hdr =
  `
    #ifdef GL_ES
      precision mediump float;
    #endif

    uniform vec2        u_resolution;
    uniform sampler2D   s_texture0;
    uniform sampler2D   s_texture1;
    uniform float       u_percent;   // Wipe coverage
  `

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  //https://www.shadertoy.com/view/Mll3Rf
  const swap_src = `data:text/plain,` + hdr +
  `
    #define from s_texture0
    #define to s_texture1
    #define resolution (u_resolution.xy)

    float progress;
    float reflection = .4;
    float perspective = .2;
    float depth = 3.;

    const vec4 black = vec4(0.0, 0.0, 0.0, 1.0);
    const vec2 boundMin = vec2(0.0, 0.0);
    const vec2 boundMax = vec2(1.0, 1.0);

    bool inBounds (vec2 p)
    {
      return all(lessThan(boundMin, p)) && all(lessThan(p, boundMax));
    }

    vec2 project (vec2 p)
    {
      return p * vec2(1.0, -1.2) + vec2(0.0, -0.02);
    }

    vec4 bgColor (vec2 p, vec2 pfr, vec2 pto)
    {
      vec4 c = black;
      pfr = project(pfr);
      if (inBounds(pfr)) {
        c += mix(black, texture2D(from, pfr), reflection * mix(1.0, 0.0, pfr.y));
      }
      pto = project(pto);
      if (inBounds(pto)) {
        c += mix(black, texture2D(to, pto), reflection * mix(1.0, 0.0, pto.y));
      }
      return c;
    }

    void main(void)
    {
      progress = u_percent; //sin(iTime*.5)*.5+.5;

      vec2 p = gl_FragCoord.xy / resolution.xy;
      //if (iMouse.z>0.) progress = iMouse.x/u_resolution.x;

      vec2 pfr, pto = vec2(-1.);

      float size = mix(1.0, depth, progress);
      float persp = perspective * progress;
      pfr = (p + vec2(-0.0, -0.5)) * vec2(size/(1.0-perspective*progress), size/(1.0-size*persp*p.x)) + vec2(0.0, 0.5);

      size = mix(1.0, depth, 1.-progress);
      persp = perspective * (1.-progress);
      pto = (p + vec2(-1.0, -0.5)) * vec2(size/(1.0-perspective*(1.0-progress)), size/(1.0-size*persp*(0.5-p.x))) + vec2(1.0, 0.5);

      bool fromOver = progress < 0.5;

      if (fromOver) {
        if (inBounds(pfr)) {
          gl_FragColor = texture2D(from, pfr);
        }
        else if (inBounds(pto)) {
          gl_FragColor = texture2D(to, pto);
        }
        else {
          gl_FragColor = bgColor(p, pfr, pto);
        }
      }
      else {
        if (inBounds(pto)) {
          gl_FragColor = texture2D(to, pto);
        }
        else if (inBounds(pfr)) {
          gl_FragColor = texture2D(from, pfr);
        }
        else {
          gl_FragColor = bgColor(p, pfr, pto);
        }
      }

      // gl_FragColor = vec4(u_percent, 0.0, 0.0, 0.2); //JUNK
      // gl_FragColor = texture2D(from, pfr);
    }
  `;

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  //https://www.shadertoy.com/view/Mll3Rf
  const cube_src = `data:text/plain,` + hdr +
  `
    float progress   = 0.0;
    float persp      = 0.7;
    float unzoom     = 0.3;
    float reflection = 0.4;
    float floating   = 3.0;

    vec2 project (vec2 p)
    {
      return p * vec2(1, -1.2) + vec2(0, -floating/100.);
    }

    bool inBounds (vec2 p)
    {
      return all(lessThan(vec2(0), p)) && all(lessThan(p, vec2(1)));
    }

    vec4 bgColor (vec2 p, vec2 pfr, vec2 pto)
    {
        vec4 c = vec4(0, 0, 0, 1);
        pfr = project(pfr);
        if (inBounds(pfr))
        {
          c += mix(vec4(0), texture2D(s_texture0, pfr), reflection * mix(1., 0., pfr.y));
        }
        pto = project(pto);
        if (inBounds(pto))
        {
          c += mix(vec4(0), texture2D(s_texture1, pto), reflection * mix(1., 0., pto.y));
        }
        return c;
    }

    // p : the position
    // persp : the perspective in [ 0, 1 ]
    // center : the xcenter in [0, 1] \ 0.5 excluded
    vec2 xskew (vec2 p, float persp, float center)
    {
        float x = mix(p.x, 1.-p.x, center);
        return (
          (
              vec2( x, (p.y - .5*(1.-persp) * x) / (1.+(persp-1.)*x) )
              - vec2(.5-distance(center, .5), 0)
          )
          * vec2(.5 / distance(center, .5) * (center<0.5 ? 1. : -1.), 1.)
          + vec2(center<0.5 ? 0. : 1., .0)
        );
    }

    void main(void)
    {
      // if (iMouse.z>0.) progress = iMouse.x/u_resolution.x;

        progress = u_percent;

        vec2 op = gl_FragCoord.xy / u_resolution.xy;
        float uz = unzoom * 2.0*(0.5-distance(0.5, progress));
        vec2 p = -uz*0.5+(1.0+uz) * op;
        vec2 fromP = xskew(
          (p - vec2(progress, 0.0)) / vec2(1.0-progress, 1.0),
          1.0-mix(progress, 0.0, persp),
          0.0
        );
        vec2 toP = xskew(
          p / vec2(progress, 1.0),
          mix(pow(progress, 2.0), 1.0, persp),
          1.0
        );
        if (inBounds(fromP))
        {
          gl_FragColor = texture2D(s_texture0, fromP);
        }
        else if (inBounds(toP))
        {
          gl_FragColor = texture2D(s_texture1, toP);
        }
        else
        {
          gl_FragColor = bgColor(op, fromP, toP);
        }

       // gl_FragColor = vec4(u_percent, 1.0, 0.0, 0.25); //JUNK
    }
  `;

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  var STRETCH = scene.stretch.STRETCH;

  var rate = 1.0;
  var ar   = 16/9;

  var w1 = scene.w;
  var h1 = w1 / ar;

  var x1 = (scene.w * 0.5);
  var y1 = (scene.h * 0.5);

  // var url1        = "https://raw.githubusercontent.com/FitzerIRL/SparkExamples/master/EqualizerSVG/dist/output.js";
  // var url2        = "https://px-apps.sys.comcast.net/px_apps/RDKapps/RDKintro/dist/output.js";

  // var url1        = "https://raw.githubusercontent.com/FitzerIRL/SparkExamples/master/shaderResource/ShaderToy/ShaderToy.js"

  var url1 = "https://www.sparkui.org/examples/gallery/gallery.js";
  var url2 = "https://www.sparkui.org/examples/gallery/dynamics.js";

  // var url1        = base + "/exampleScene1.js";
  // var url2        = base + "/exampleScene2.js";

  var screenshotLHS = null;
  var screenshotRHS   = null;

  var container   = scene.create({ t: 'object', parent: root,      x: x1, y: y1,  w: w1, h: h1, fillColor: '#126', px: 0.5, py: 0.5, id: "Container Obj" });
  var bg          = scene.create({ t: 'object', parent: root,      x: x1, y: y1,  w: w1, h: h1, fillColor: '#126', px: 0.5, py: 0.5, id: "Background Obj" });
  var scene2      = scene.create({ t: 'scene',  parent: container, x: w1, y: 0, w: scene.w, h: scene.h, url: url2, stretchX: STRETCH, stretchY: STRETCH, id: "TestScene2" });
  var scene1      = scene.create({ t: 'scene',  parent: container, x: 0, y: 0, w: scene.w, h: scene.h, url: url1, stretchX: STRETCH, stretchY: STRETCH, id: "TestScene1" });
  
  var title_box   = scene.create({ t: 'rect',    parent: root,      w: 280, h: 50, x: x1, y: h1* 0.95, px: 0.5, py: 1.0, interactive: false, fillColor: "#000A", a: 0.0 });
  var title_txt   = scene.create({ t: 'textBox', parent: title_box, w: 280, h: 50,
                    pixelSize: 24, textColor: '#fff',  text: 'Title', interactive: false,
                    alignVertical:   scene.alignVertical.CENTER,
                    alignHorizontal: scene.alignHorizontal.CENTER});

  var timer     = null;
  var pc        = 0.0;
  var dir       = 1.0;

  var shader_idx = 0;
  const shaders  =
  [
      { name: "Swap",  src: swap_src, shader: null,  max: 1.00,  min:  0.00,  rate:  9 },
      { name: "Cube",  src: cube_src, shader: null,  max: 1.00,  min:  0.00,  rate: 15 },
  ];

  var current = scene1;

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  function screenshot(o)
  {
    var ss = o.screenshot("image/image");

    // console.log( " o >> WxH: " + o.w + " x " + o.h)

    ss.x = 0;
    ss.y = 0;
    ss.w = o.w;
    ss.h = o.h;

    ss.parent = root;

    ss.stretchX = STRETCH;
    ss.stretchY = STRETCH;

    return ss;
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  function createShader(src)
  {
    return new Promise(function(resolve, reject)
    {
      var shader = scene.create({
                   t: 'shaderResource',
            fragment: src,
            uniforms:
            {
              "u_time"     : "float",
              "u_percent"  : "float",
              "s_texture0" : "sampler2D",
              "s_texture1" : "sampler2D"
            }
          });

      // Shader ready yet ?
      shader.ready.then(
      (o) =>
      {
        resolve(shader);
      },
      (o) =>
      {
        console.log("Shader Compilation - FAILED >> " + shaders[shader_idx].name + " >> " + shader.loadStatus.glError );
        resolve("SHADER BAD");
      });

    }); // PROMISE
  };

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  Promise.all([bg.ready, scene1.ready, scene2.ready]).then( () =>
  {
    createShader(shaders[0].src ).then( (o) => { console.log("Shader >> " + shaders[0].name + " ... READY"); shaders[0].shader = o; });
    createShader(shaders[1].src ).then( (o) => { console.log("Shader >> " + shaders[1].name + " ... READY"); shaders[1].shader = o; });
  });

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  function finishTimer(o)
  {
    console.log("finishTimer() ... o.id = " + o.id);
    console.log("finishTimer() ... o.id = " + o.id);
    console.log("finishTimer() ... o.id = " + o.id);

    clearInterval(timer);
    timer = null;
    dir  *= -1;
  }

  function swapToScene(from, to)
  {
    console.log( "swapToScene()  From: "+from.id+" >>>  " + to.id );
    console.log( "swapToScene()  From: "+from.id+" >>>  " + to.id );
    console.log( "swapToScene()  From: "+from.id+" >>>  " + to.id );

    if(screenshotLHS) screenshotLHS.remove(); // remove from scene
    if(screenshotRHS) screenshotRHS.remove(); // remove from scene

    screenshotLHS = screenshot(scene1);  // synchronous call
    screenshotRHS = screenshot(scene2);  // synchronous call

    screenshotLHS.x = scene.w;    // Hide OFFSCREEN on RHS
    screenshotRHS.x = scene.w;    // Hide OFFSCREEN on RHS

    // Hide scenes
    scene1.draw  = false;
    scene2.draw  = false;

    return new Promise(function(resolve, reject)
    {
      var fx = shaders[shader_idx];

      if(fx && fx.shader)
      {
        bg.effect =
        {
          name:   fx.name,
          shader: fx.shader,
          uniforms:
          {
            u_percent:  pc,
            s_texture0: screenshotLHS.resource,  // FROM
            s_texture1: screenshotRHS.resource,  // TO
          }
        }
      }
      else
      {
        console.log( "NOT >>>  Using shader = " + fx );
        resolve("BAD SHADER");
        return;
      }

      timer = setInterval( () =>
      {
        if(fx.shader)
        {
          var rate   = fx.rate;
          var minVal = fx.min;
          var maxVal = fx.max;

          pc += (0.003 * rate * dir);

          // Complete
          if( pc > maxVal )
          {
            finishTimer(to);
            pc = maxVal;

            resolve(to);
          }
          else
          if( pc < minVal )
          {
            finishTimer(to);
            pc = minVal;

            resolve(to);
          }

          // console.log("toggleScene() ... ASSIGN >> Shader: '" + fx.name + "'  PC  = " + pc);

          // Update Uniforms
          bg.effect =
          {
                name: fx.name,
              shader: fx.shader,
              uniforms:
              {
                u_percent: pc
              }
          }
        }
        else
        {
          console.log("ERROR:  >> NO Shader = '" + fx.name + "'  PC  = " + pc);
          finishTimer(to);
        }

      }, 32); // TIMER

    });// new PROMISE
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  scene.on("onResize", function (e)
  {
    updateSize(e.w, e.h);
  });

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  function updateSize(w, h)
  {
    var x1 = w * 0.5;
    var y1 = h * 0.5;

    // Screen
    var ws = (w > 0) ? w : 1;
    var hs = (h > 0) ? h : 1;

    // Image
    var wi = (screenshotLHS.resource.w > 0) ? screenshotLHS.resource.w : 1;
    var hi = (screenshotLHS.resource.h > 0) ? screenshotLHS.resource.h : 1;

    // Scale factor
    var sw =  ws/wi;
    var sh =  hs/hi;

    var sf = Math.min(sw, sh);

    w1 = wi * sf;
    h1 = hi * sf;

    // Re-size
             bg.w = w1;            bg.h = h1;
    screenshotLHS.w = w1;   screenshotLHS.h = h1;
      screenshotRHS.w = w1;     screenshotRHS.h = h1;

    // Re-position
             bg.x = x1;            bg.y = y1;
    screenshotLHS.x = x1;   screenshotLHS.y = y1;
      screenshotRHS.x = x1;     screenshotRHS.y = y1;

    title_box.x = ws * 0.50;
    title_box.y = hs * 0.95;

    shader.u_resolution = [w1, h1];
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  function showTitle(title)
  {
    title_txt.text = title;

    title_box.animateTo({ a: 1.0 }, 0.25).then
    (
      setTimeout( () =>
      {
        title_box.animateTo({ a: 0.0 }, 0.5);
      }, 2000)
    );
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  root.on('onKeyUp', function(e)
  {
      if(e.keyCode == keys.SPACE)
      {
        var last = current;
        var next = (current == scene1) ? scene2 : scene1;

        bg.draw = true;
        swapToScene(current, next).then( o =>
        {
          console.log("swapToScene() - DONE ... o.id = " + o.id);

          current       = o;
          current.focus = true;
          current.draw  = true;
          current.moveToFront();

          bg.draw = false;

          current.x = 0; current.y = 0;
        });
      }
      else
      if(e.keyCode == keys.LEFT) // < PREV
      {
        console.log( " PREV shader ")
        console.log( " PREV shader ")
        console.log( " PREV shader ")

        shader_idx = ((shader_idx - 1) < 0) ? (shaders.length - 1) : (shader_idx - 1);
        showTitle(shaders[shader_idx].name);
      }
      else
      if(e.keyCode == keys.RIGHT) // > NEXT
      {
        console.log( " NEXT shader ")
        console.log( " NEXT shader ")
        console.log( " NEXT shader ")

        shader_idx = ((shader_idx + 1) < (shaders.length)) ? (shader_idx + 1) : 0;
        showTitle(shaders[shader_idx].name);
      }
  });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

}).catch(function importFailed(err) {
  console.error('Import for cubeApp.js failed: ' + err);
});


/***/ }),

/***/ 0:
/*!**************************!*\
  !*** multi ./cubeApp.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /Users/hfitzp200/XRE2/temp_SparkExamples/SparkExamples/shaderResource/cubeApp/cubeApp.js */"./cubeApp.js");


/***/ })

/******/ });
//# sourceMappingURL=output.js.map