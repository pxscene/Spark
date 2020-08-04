!function(e){var n={};function t(o){if(n[o])return n[o].exports;var r=n[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,t),r.l=!0,r.exports}t.m=e,t.c=n,t.d=function(e,n,o){t.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:o})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,n){if(1&n&&(e=t(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(t.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var r in e)t.d(o,r,function(n){return e[n]}.bind(null,r));return o},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},t.p="",t(t.s=0)}([function(e,n,t){e.exports=t(1)},function(e,n){px.import({scene:"px:scene.1.js",keys:"px:tools.keys.js"}).then((function(n){e.exports.wantsClearscreen=function(){return!0};var t=n.scene,o=n.scene.root,r=n.keys,i=px.getPackageBaseFilePath();if(null==t.capabilities||null==t.capabilities.graphics||null==t.capabilities.graphics.shaders||t.capabilities.graphics.shaders<1)throw"EXPCEPTION - Shaders are not supported in this version of Spark...";var a=t.stretch.STRETCH,s=t.w,l=s/(16/9),c=.5*t.w,u=.5*t.h,p=t.create({t:"object",parent:o,w:s,h:l,fillColor:"#126",x:c,y:u,px:.5,py:.5,focus:!0,id:"Foo"}),f=t.create({t:"image",parent:p,w:s,h:l,url:i+"/images/ireland_landscapeHD.jpg",interactive:!1,stretchX:a,stretchY:a}),x=t.create({t:"image",parent:p,w:s,h:l,url:i+"/images/Cliffs_of_MoherHD.jpg",interactive:!1,stretchX:a,stretchY:a}),m=t.create({t:"rect",parent:o,w:280,h:50,x:c,y:.95*t.h,px:.5,py:1,interactive:!1,fillColor:"#000A",a:0}),d=t.create({t:"textBox",parent:m,w:280,h:50,pixelSize:24,textColor:"#fff",text:"Title",interactive:!1,alignVertical:t.alignVertical.CENTER,alignHorizontal:t.alignHorizontal.CENTER}),v=0,g=1,h=0;const _=[{name:"Horizontal",dx:1,dy:0,max:1,min:0},{name:"Vertical",dx:0,dy:1,max:1,min:0},{name:"Diagonal",dx:1,dy:1,max:1.9,min:0}];var y=0;const b=[{name:"Wipe",src:"data:text/plain,\n    #ifdef GL_ES\n      precision mediump float;\n    #endif\n\n    uniform vec2        u_resolution;\n    uniform sampler2D   s_texture0;\n    uniform sampler2D   s_texture1;\n    uniform float       u_percent;   // Wipe coverage\n  \n    float w = 0.1;      // Blend width\n\n    uniform float       u_wipeDX;    // HORIZONTAL wipe component\n    uniform float       u_wipeDY;    // VERTICAL   wipe component\n\n    void main(void)\n    {\n      vec2 uv = gl_FragCoord.xy / u_resolution.xy;\n\n      vec4 color0 = texture2D(s_texture0, uv);\n      vec4 color1 = texture2D(s_texture1, uv);\n\n      float correction = mix(w, -w, u_percent);\n\n      float px = smoothstep((u_percent - w),\n                            (u_percent + w),\n                            (uv.x * u_wipeDX) +\n                            (uv.y * u_wipeDY) + correction); // clamped ramp\n\n      gl_FragColor = mix(color1, color0, px); // lerp\n    }",max:1,min:0,rate:3},{name:"Blobs",src:"data:text/plain,\n    #ifdef GL_ES\n      precision mediump float;\n    #endif\n\n    uniform vec2        u_resolution;\n    uniform sampler2D   s_texture0;\n    uniform sampler2D   s_texture1;\n    uniform float       u_percent;   // Wipe coverage\n  \n  //\n  // Description : Array and textureless GLSL 2D simplex noise function.\n  //      Author : Ian McEwan, Ashima Arts.\n  //  Maintainer : stegu\n  //     Lastmod : 20110822 (ijm)\n  //     License : Copyright (C) 2011 Ashima Arts. All rights reserved.\n  //               Distributed under the MIT License. See LICENSE file.\n  //               https://github.com/ashima/webgl-noise\n  //               https://github.com/stegu/webgl-noise\n  //\n\n  vec3 mod289(vec3 x) {\n    return x - floor(x * (1.0 / 289.0)) * 289.0;\n  }\n\n  vec2 mod289(vec2 x) {\n    return x - floor(x * (1.0 / 289.0)) * 289.0;\n  }\n\n  vec3 permute(vec3 x) {\n    return mod289(((x*34.0)+1.0)*x);\n  }\n\n  float snoise(vec2 v)\n  {\n    const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0\n                        0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)\n                       -0.577350269189626,  // -1.0 + 2.0 * C.x\n                        0.024390243902439); // 1.0 / 41.0\n  // First corner\n    vec2 i  = floor(v + dot(v, C.yy) );\n    vec2 x0 = v -   i + dot(i, C.xx);\n\n  // Other corners\n    vec2 i1;\n    //i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0\n    //i1.y = 1.0 - i1.x;\n    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);\n    // x0 = x0 - 0.0 + 0.0 * C.xx ;\n    // x1 = x0 - i1 + 1.0 * C.xx ;\n    // x2 = x0 - 1.0 + 2.0 * C.xx ;\n    vec4 x12 = x0.xyxy + C.xxzz;\n    x12.xy -= i1;\n\n  // Permutations\n    i = mod289(i); // Avoid truncation effects in permutation\n    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))\n      + i.x + vec3(0.0, i1.x, 1.0 ));\n\n    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);\n    m = m*m ;\n    m = m*m ;\n\n  // Gradients: 41 points uniformly over a line, mapped onto a diamond.\n  // The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)\n\n    vec3 x  = 2.0 * fract(p * C.www) - 1.0;\n    vec3 h  = abs(x) - 0.5;\n    vec3 ox = floor(x + 0.5);\n    vec3 a0 = x - ox;\n\n  // Normalise gradients implicitly by scaling m\n  // Approximation of: m *= inversesqrt( a0*a0 + h*h );\n    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );\n\n  // Compute final noise value at P\n    vec3 g;\n    g.x  = a0.x  * x0.x  + h.x  * x0.y;\n    g.yz = a0.yz * x12.xz + h.yz * x12.yw;\n    return 130.0 * dot(m, g);\n  }\n\n  void main(void)\n  {\n    // Normalized pixel coordinates (from 0 to 1)\n    vec2 uv = gl_FragCoord.xy / u_resolution.xy;\n\n    vec2 pos = uv;\n\n    pos.x = snoise(vec2(pos.x * 2.0));\n\n    float noise = snoise(pos);\n\n    vec4 texture1 = texture2D(s_texture0, uv);\n    vec4 texture2 = texture2D(s_texture1, uv);\n\n    //float step = sin(iTime);\n\n    float step = u_percent;\n\n    gl_FragColor = texture1 * smoothstep(step, step, noise) +\n                   texture2 * (1.0 - smoothstep(step, step, noise));\n  }\n  ",max:1.05,min:-1.05,rate:4},{name:"Swap",src:"data:text/plain,\n    #ifdef GL_ES\n      precision mediump float;\n    #endif\n\n    uniform vec2        u_resolution;\n    uniform sampler2D   s_texture0;\n    uniform sampler2D   s_texture1;\n    uniform float       u_percent;   // Wipe coverage\n  \n    #define from s_texture0\n    #define to s_texture1\n    #define resolution (u_resolution.xy)\n\n    float progress;\n    float reflection = .4;\n    float perspective = .2;\n    float depth = 3.;\n\n    const vec4 black = vec4(0.0, 0.0, 0.0, 1.0);\n    const vec2 boundMin = vec2(0.0, 0.0);\n    const vec2 boundMax = vec2(1.0, 1.0);\n\n    bool inBounds (vec2 p)\n    {\n      return all(lessThan(boundMin, p)) && all(lessThan(p, boundMax));\n    }\n\n    vec2 project (vec2 p)\n    {\n      return p * vec2(1.0, -1.2) + vec2(0.0, -0.02);\n    }\n\n    vec4 bgColor (vec2 p, vec2 pfr, vec2 pto)\n    {\n      vec4 c = black;\n      pfr = project(pfr);\n      if (inBounds(pfr)) {\n        c += mix(black, texture2D(from, pfr), reflection * mix(1.0, 0.0, pfr.y));\n      }\n      pto = project(pto);\n      if (inBounds(pto)) {\n        c += mix(black, texture2D(to, pto), reflection * mix(1.0, 0.0, pto.y));\n      }\n      return c;\n    }\n\n    void main(void)\n    {\n      progress = u_percent; //sin(iTime*.5)*.5+.5;\n\n      vec2 p = gl_FragCoord.xy / resolution.xy;\n      //if (iMouse.z>0.) progress = iMouse.x/u_resolution.x;\n\n      vec2 pfr, pto = vec2(-1.);\n\n      float size = mix(1.0, depth, progress);\n      float persp = perspective * progress;\n      pfr = (p + vec2(-0.0, -0.5)) * vec2(size/(1.0-perspective*progress), size/(1.0-size*persp*p.x)) + vec2(0.0, 0.5);\n\n      size = mix(1.0, depth, 1.-progress);\n      persp = perspective * (1.-progress);\n      pto = (p + vec2(-1.0, -0.5)) * vec2(size/(1.0-perspective*(1.0-progress)), size/(1.0-size*persp*(0.5-p.x))) + vec2(1.0, 0.5);\n\n      bool fromOver = progress < 0.5;\n\n      if (fromOver) {\n        if (inBounds(pfr)) {\n          gl_FragColor = texture2D(from, pfr);\n        }\n        else if (inBounds(pto)) {\n          gl_FragColor = texture2D(to, pto);\n        }\n        else {\n          gl_FragColor = bgColor(p, pfr, pto);\n        }\n      }\n      else {\n        if (inBounds(pto)) {\n          gl_FragColor = texture2D(to, pto);\n        }\n        else if (inBounds(pfr)) {\n          gl_FragColor = texture2D(from, pfr);\n        }\n        else {\n          gl_FragColor = bgColor(p, pfr, pto);\n        }\n      }\n    }\n  ",max:1,min:0,rate:4.5},{name:"Portal2",src:'data:text/plain,\n    #ifdef GL_ES\n      precision mediump float;\n    #endif\n\n    uniform vec2        u_resolution;\n    uniform sampler2D   s_texture0;\n    uniform sampler2D   s_texture1;\n    uniform float       u_percent;   // Wipe coverage\n  \n    // "Portal" 2 Menu Box Flip\n    // Copyleft {c} 2015 Michael Pohoreski\n\n    // In case you are wondering about these "ShaderToy #define Shims" ...\n    // my original WebGL shader had these uniforms and varyings.\n    // We can use a simple shim to make it ShaderToy Friendly. :-)\n    //precision mediump float;\n    //uniform mediump float     unTime;\n    //uniform mediump float     unDuration;\n    //uniform         sampler2D utDiffuse1;\n    //uniform         sampler2D utDiffuse2;\n    //uniform lowp    vec2      uvResolution;\n    //varying lowp    vec2      vvTexCoord;\n\n    #define vvTexCoord gl_FragCoord.xy / u_resolution.xy\n    #define unTime     u_percent // iTime\n    #define unDuration 10.0\n    #define utDiffuse1 s_texture0\n    #define utDiffuse2 s_texture1\n\n    const float n = 8.;                              // number boxes\n    const float s = 1. / n;                          // box size in texels\n    const float pi = 3.14159265358979;\n    const float _90 = 0.5 * pi;                      // 90 degrees\n\n    void main(void)\n    {\n      vec2  p = vvTexCoord;\n     // p.y = 1. - p.y; // Shader Toy\n  //  float t = min( 1., 2. *     unTime                 / unDuration); // one-time\n//      float t = min( 1., 2. * mod(unTime,0.5*unDuration) / unDuration); // repeat\n\n      float t = u_percent;\n\n      vec2  b = mod( p, s );                       // offset in box\n      vec2  i = floor( p / s );                    // box#\n      float cells = (2.*n - 2.);\n      float delay = (i.x + i.y) / cells;\n      t -= 0.5*delay;\n      float a = _90*t;                             // 90 degrees * t\n      float rate = (cells - (i.x + i.y)) / cells;\n      rate *= n/2.;                                // how fast first cell turns\n      rate += n/2.;                                // how fast last cell turns: min 2.0\n      a *= rate;\n      a = min( _90, a );\n      a = max( 0.0, a );\n      float ca = cos(a);\n      float sa = sin(a);\n      const float w = 0.5*s;                            // half box size in world space\n      vec2 l = vec2( -w,  w );                          // pre top-left\n      vec2 m = vec2(  w,  w );                          // pre top-right\n      vec2 r = vec2(  w, -w );                          // pre bot-right\n      vec2 L = vec2( l.x*ca - l.y*sa, l.x*sa+ l.y*ca ); // post top-left\n      vec2 M = vec2( m.x*ca - m.y*sa, m.x*sa+ m.y*ca ); // post top-right\n      vec2 R = vec2( r.x*ca - r.y*sa, r.x*sa+ r.y*ca ); // post bot-right\n      float Fx = b.x - w;\n\n      if( Fx < M.x )\n      {\n          float dx = Fx - L.x;\n          float dy = tan(a)*dx;                    // y1-y0=m(x1-x0)\n          float d = sqrt( (dx*dx) + (dy*dy) );\n          p.x = i.x*s + d;\n          gl_FragColor = texture2D(utDiffuse1,p);\n      }\n      else\n      {                                     // image2 rotating towards\n          float ex = Fx - M.x;\n          float ey = tan(a + _90)*ex;\n          float e = sqrt( (ex*ex) + (ey*ey) );\n          p.x = i.x*s + e;\n          gl_FragColor = texture2D(utDiffuse2,p);\n      }\n    }\n  ',max:1,min:0,rate:2},{name:"Cube",src:"data:text/plain,\n    #ifdef GL_ES\n      precision mediump float;\n    #endif\n\n    uniform vec2        u_resolution;\n    uniform sampler2D   s_texture0;\n    uniform sampler2D   s_texture1;\n    uniform float       u_percent;   // Wipe coverage\n  \n    float progress   = 0.0;\n    float persp      = 0.7;\n    float unzoom     = 0.3;\n    float reflection = 0.4;\n    float floating   = 3.0;\n\n    vec2 project (vec2 p)\n    {\n      return p * vec2(1, -1.2) + vec2(0, -floating/100.);\n    }\n\n    bool inBounds (vec2 p)\n    {\n      return all(lessThan(vec2(0), p)) && all(lessThan(p, vec2(1)));\n    }\n\n    vec4 bgColor (vec2 p, vec2 pfr, vec2 pto)\n    {\n        vec4 c = vec4(0, 0, 0, 1);\n        pfr = project(pfr);\n        if (inBounds(pfr))\n        {\n          c += mix(vec4(0), texture2D(s_texture0, pfr), reflection * mix(1., 0., pfr.y));\n        }\n        pto = project(pto);\n        if (inBounds(pto))\n        {\n          c += mix(vec4(0), texture2D(s_texture1, pto), reflection * mix(1., 0., pto.y));\n        }\n        return c;\n    }\n\n    // p : the position\n    // persp : the perspective in [ 0, 1 ]\n    // center : the xcenter in [0, 1]  0.5 excluded\n    vec2 xskew (vec2 p, float persp, float center)\n    {\n        float x = mix(p.x, 1.-p.x, center);\n        return (\n          (\n              vec2( x, (p.y - .5*(1.-persp) * x) / (1.+(persp-1.)*x) )\n              - vec2(.5-distance(center, .5), 0)\n          )\n          * vec2(.5 / distance(center, .5) * (center<0.5 ? 1. : -1.), 1.)\n          + vec2(center<0.5 ? 0. : 1., .0)\n        );\n    }\n\n    void main(void)\n    {\n      // if (iMouse.z>0.) progress = iMouse.x/u_resolution.x;\n\n        progress = u_percent;\n\n        vec2 op = gl_FragCoord.xy / u_resolution.xy;\n        float uz = unzoom * 2.0*(0.5-distance(0.5, progress));\n        vec2 p = -uz*0.5+(1.0+uz) * op;\n        vec2 fromP = xskew(\n          (p - vec2(progress, 0.0)) / vec2(1.0-progress, 1.0),\n          1.0-mix(progress, 0.0, persp),\n          0.0\n        );\n        vec2 toP = xskew(\n          p / vec2(progress, 1.0),\n          mix(pow(progress, 2.0), 1.0, persp),\n          1.0\n        );\n        if (inBounds(fromP))\n        {\n          gl_FragColor = texture2D(s_texture0, fromP);\n        }\n        else if (inBounds(toP))\n        {\n          gl_FragColor = texture2D(s_texture1, toP);\n        }\n        else\n        {\n          gl_FragColor = bgColor(op, fromP, toP);\n        }\n    }\n  ",max:1,min:0,rate:4.5},{name:"Zoom Blur",src:"data:text/plain,\n    #ifdef GL_ES\n      precision mediump float;\n    #endif\n\n    uniform vec2        u_resolution;\n    uniform sampler2D   s_texture0;\n    uniform sampler2D   s_texture1;\n    uniform float       u_percent;   // Wipe coverage\n  \n    //modified zoom blur from http://transitions.glsl.io/transition/b86b90161503a0023231\n    const float strength = 0.3;\n    const float PI = 3.141592653589793;\n\n    float Linear_ease(in float begin, in float change, in float duration, in float time) {\n        return change * time / duration + begin;\n    }\n\n    float Exponential_easeInOut(in float begin, in float change, in float duration, in float time)\n    {\n        if (time == 0.0)\n            return begin;\n        else if (time == duration)\n            return begin + change;\n        time = time / (duration / 2.0);\n        if (time < 1.0)\n            return change / 2.0 * pow(2.0, 10.0 * (time - 1.0)) + begin;\n        return change / 2.0 * (-pow(2.0, -10.0 * (time - 1.0)) + 2.0) + begin;\n    }\n\n    float Sinusoidal_easeInOut(in float begin, in float change, in float duration, in float time) {\n        return -change / 2.0 * (cos(PI * time / duration) - 1.0) + begin;\n    }\n\n    float random(in vec3 scale, in float seed) {\n        return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);\n    }\n\n    vec3 crossFade(in vec2 uv, in float dissolve) {\n        return mix(texture2D(s_texture0, uv).rgb, texture2D(s_texture1, uv).rgb, dissolve);\n    }\n\n    void main(void)\n    {\n        vec2 texCoord = gl_FragCoord.xy / u_resolution.xy;\n        // float progress = sin(iTime*0.5) * 0.5 + 0.5;\n\n        float progress = u_percent;\n\n        // Linear interpolate center across center half of the image\n        vec2 center = vec2(Linear_ease(0.5, 0.0, 1.0, progress),0.5);\n        float dissolve = Exponential_easeInOut(0.0, 1.0, 1.0, progress);\n\n        // Mirrored sinusoidal loop. 0->strength then strength->0\n        float strength = Sinusoidal_easeInOut(0.0, strength, 0.5, progress);\n\n        vec3 color = vec3(0.0);\n        float total = 0.0;\n        vec2 toCenter = center - texCoord;\n\n        /* randomize the lookup values to hide the fixed number of samples */\n        float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0)*0.5;\n\n        for (float t = 0.0; t <= 20.0; t++)\n        {\n            float percent = (t + offset) / 20.0;\n            float weight = 1.0 * (percent - percent * percent);\n            color += crossFade(texCoord + toCenter * percent * strength, dissolve) * weight;\n            total += weight;\n        }\n\n        gl_FragColor = vec4(color / total, 1.0);\n    }\n  ",max:1,min:0,rate:4}];var w=null;function C(e,n=null,o=null){(w=t.create({t:"shaderResource",fragment:e,uniforms:{u_time:"float",u_percent:"float",u_wipeDX:"float",u_wipeDY:"float",s_texture0:"sampler2D",s_texture1:"sampler2D"}})).ready.then(e=>{p.effect={name:"wipes",shader:w,uniforms:{s_texture0:n,s_texture1:o}}},e=>{console.log("Shader Compilation - FAILED >> "+b[y].name+" >> "+w.loadStatus.glError)})}function D(e){d.text=e,m.animateTo({a:1},.25).then(setTimeout(()=>{m.animateTo({a:0},.5)},2e3))}Promise.all([p.ready,f.ready,x.ready]).then(()=>{C(b[y].src,x.resource,f.resource),D(b[y].name),setInterval(()=>{if(w){var e=_[h].dx,n=_[h].dy,t=_[h].min,o=_[h].max,r=b[y].rate;t=b[y].min,o=b[y].max,(v+=.003*r*g)>o&&(g*=-1,v=o),v<t&&(g*=-1,v=t),p.effect={shader:w,uniforms:{u_wipeDX:e,u_wipeDY:n,u_percent:v}}}},32)}),t.on("onResize",(function(e){!function(e,n){var t=.5*e,o=.5*n,r=e>0?e:1,i=n>0?n:1,a=f.resource.w>0?f.resource.w:1,c=f.resource.h>0?f.resource.h:1,u=r/a,d=i/c,v=Math.min(u,d);s=a*v,l=c*v,p.w=s,p.h=l,f.w=s,f.h=l,x.w=s,x.h=l,p.x=t,p.y=o,f.x=t,f.y=o,x.x=t,x.y=o,m.x=.5*r,m.y=.95*i,w.u_resolution=[s,l]}(e.w,e.h)})),p.on("onKeyUp",(function(e){e.keyCode==r.SPACE?D(_[h=h+1<_.length?h+1:0].name):e.keyCode==r.LEFT?(console.log(" PREV shader "),console.log(" PREV shader "),console.log(" PREV shader "),y=y-1<0?b.length-1:y-1,D(b[y].name),C(b[y].src,x.resource,f.resource),D(b[y].name)):e.keyCode==r.RIGHT&&(console.log(" NEXT shader "),console.log(" NEXT shader "),console.log(" NEXT shader "),y=y+1<b.length?y+1:0,D(b[y].name),C(b[y].src,x.resource,f.resource),D(b[y].name))}))})).catch((function(e){console.error("Import for Transitions.js failed: "+e)}))}]);
//# sourceMappingURL=output.js.map