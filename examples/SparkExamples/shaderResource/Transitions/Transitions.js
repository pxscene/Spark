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

// https://www.shadertoy.com/view/MtsfD7   <<<< VORTEX


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

  // https://www.shadertoy.com/view/Ml3XR2
  const zoomblur_src = `data:text/plain,` + hdr +
  `
    //modified zoom blur from http://transitions.glsl.io/transition/b86b90161503a0023231
    const float strength = 0.3;
    const float PI = 3.141592653589793;

    float Linear_ease(in float begin, in float change, in float duration, in float time) {
        return change * time / duration + begin;
    }

    float Exponential_easeInOut(in float begin, in float change, in float duration, in float time)
    {
        if (time == 0.0)
            return begin;
        else if (time == duration)
            return begin + change;
        time = time / (duration / 2.0);
        if (time < 1.0)
            return change / 2.0 * pow(2.0, 10.0 * (time - 1.0)) + begin;
        return change / 2.0 * (-pow(2.0, -10.0 * (time - 1.0)) + 2.0) + begin;
    }

    float Sinusoidal_easeInOut(in float begin, in float change, in float duration, in float time) {
        return -change / 2.0 * (cos(PI * time / duration) - 1.0) + begin;
    }

    float random(in vec3 scale, in float seed) {
        return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);
    }

    vec3 crossFade(in vec2 uv, in float dissolve) {
        return mix(texture2D(s_texture0, uv).rgb, texture2D(s_texture1, uv).rgb, dissolve);
    }

    void main(void)
    {
        vec2 texCoord = gl_FragCoord.xy / u_resolution.xy;
        // float progress = sin(iTime*0.5) * 0.5 + 0.5;

        float progress = u_percent;

        // Linear interpolate center across center half of the image
        vec2 center = vec2(Linear_ease(0.5, 0.0, 1.0, progress),0.5);
        float dissolve = Exponential_easeInOut(0.0, 1.0, 1.0, progress);

        // Mirrored sinusoidal loop. 0->strength then strength->0
        float strength = Sinusoidal_easeInOut(0.0, strength, 0.5, progress);

        vec3 color = vec3(0.0);
        float total = 0.0;
        vec2 toCenter = center - texCoord;

        /* randomize the lookup values to hide the fixed number of samples */
        float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0)*0.5;

        for (float t = 0.0; t <= 20.0; t++)
        {
            float percent = (t + offset) / 20.0;
            float weight = 1.0 * (percent - percent * percent);
            color += crossFade(texCoord + toCenter * percent * strength, dissolve) * weight;
            total += weight;
        }

        gl_FragColor = vec4(color / total, 1.0);
    }
  `
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  // https://www.shadertoy.com/view/4tX3W4
  const portal2_src = `data:text/plain,` + hdr +
  `
    // "Portal" 2 Menu Box Flip
    // Copyleft {c} 2015 Michael Pohoreski

    // In case you are wondering about these "ShaderToy #define Shims" ...
    // my original WebGL shader had these uniforms and varyings.
    // We can use a simple shim to make it ShaderToy Friendly. :-)
    //precision mediump float;
    //uniform mediump float     unTime;
    //uniform mediump float     unDuration;
    //uniform         sampler2D utDiffuse1;
    //uniform         sampler2D utDiffuse2;
    //uniform lowp    vec2      uvResolution;
    //varying lowp    vec2      vvTexCoord;

    #define vvTexCoord gl_FragCoord.xy / u_resolution.xy
    #define unTime     u_percent // iTime
    #define unDuration 10.0
    #define utDiffuse1 s_texture0
    #define utDiffuse2 s_texture1

    const float n = 8.;                              // number boxes
    const float s = 1. / n;                          // box size in texels
    const float pi = 3.14159265358979;
    const float _90 = 0.5 * pi;                      // 90 degrees

    void main(void)
    {
      vec2  p = vvTexCoord;
     // p.y = 1. - p.y; // Shader Toy
  //  float t = min( 1., 2. *     unTime                 / unDuration); // one-time
//      float t = min( 1., 2. * mod(unTime,0.5*unDuration) / unDuration); // repeat

      float t = u_percent;

      vec2  b = mod( p, s );                       // offset in box
      vec2  i = floor( p / s );                    // box#
      float cells = (2.*n - 2.);
      float delay = (i.x + i.y) / cells;
      t -= 0.5*delay;
      float a = _90*t;                             // 90 degrees * t
      float rate = (cells - (i.x + i.y)) / cells;
      rate *= n/2.;                                // how fast first cell turns
      rate += n/2.;                                // how fast last cell turns: min 2.0
      a *= rate;
      a = min( _90, a );
      a = max( 0.0, a );
      float ca = cos(a);
      float sa = sin(a);
      const float w = 0.5*s;                            // half box size in world space
      vec2 l = vec2( -w,  w );                          // pre top-left
      vec2 m = vec2(  w,  w );                          // pre top-right
      vec2 r = vec2(  w, -w );                          // pre bot-right
      vec2 L = vec2( l.x*ca - l.y*sa, l.x*sa+ l.y*ca ); // post top-left
      vec2 M = vec2( m.x*ca - m.y*sa, m.x*sa+ m.y*ca ); // post top-right
      vec2 R = vec2( r.x*ca - r.y*sa, r.x*sa+ r.y*ca ); // post bot-right
      float Fx = b.x - w;

      if( Fx < M.x )
      {
          float dx = Fx - L.x;
          float dy = tan(a)*dx;                    // y1-y0=m(x1-x0)
          float d = sqrt( (dx*dx) + (dy*dy) );
          p.x = i.x*s + d;
          gl_FragColor = texture2D(utDiffuse1,p);
      }
      else
      {                                     // image2 rotating towards
          float ex = Fx - M.x;
          float ey = tan(a + _90)*ex;
          float e = sqrt( (ex*ex) + (ey*ey) );
          p.x = i.x*s + e;
          gl_FragColor = texture2D(utDiffuse2,p);
      }
    }
  `;

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  // https://www.shadertoy.com/view/ltBcD3
  const portal2flip_src = `data:text/plain,` + hdr +
  `
    // inspired by shader from VoidChicken
    // https://www.shadertoy.com/view/XtdXR2
    // ... and portal of course ;)

    vec2 plane(vec3 p, vec3 d, vec3 normal)
    {
        vec3  up    = vec3(0,1,0);
        vec3  right = cross(up, normal);
        float dn    = dot(d, normal);
        float pn    = dot(p, normal);

        vec3 hit = p - d / dn * pn;

        vec2 uv;
        uv.x = dot(hit, right);
        uv.y = dot(hit, up);

        return uv;
    }

    void main(void)
    {
        vec2 xy = gl_FragCoord.xy - u_resolution.xy / 2.0;
        float grid_width = 64.0;
        xy /= grid_width;

        vec2 grid = floor(xy);
        xy = mod(xy, 1.0) - 0.5;

        float alpha = 0.0;//iMouse.x / u_resolution.x;
        //float time = iTime*1.0 - (grid.y - grid.x)*0.1;
        float time = u_percent*1.0 - (grid.y - grid.x)*0.1;

      //  time = mod(time, 6.0);

        alpha +=       smoothstep(0.0, 1.0, time);
        alpha += 1.0 - smoothstep(3.0, 4.0, time);
        alpha = abs(mod(alpha, 2.0)-1.0);

        float side = step(0.5, alpha);

        alpha   = radians(alpha*180.0);
        vec4 n  = vec4(cos(alpha),0,sin(alpha),-sin(alpha));
        vec3 d  = vec3(1.0,xy.y,xy.x);
        vec3 p  = vec3(-1.0+n.w/4.0,0,0);
        vec2 uv = plane(p, d, n.xyz);

        uv += 0.5;
        if (uv.x<0.0||uv.y<0.0||uv.x>1.0||uv.y>1.0)
        {
            gl_FragColor *= 0.0;
            return;
        }

        vec2 guv   = (grid*grid_width) / u_resolution.xy+0.5;
        vec2 scale =  vec2(grid_width) / u_resolution.xy;
        vec4 c1    = texture2D(s_texture0, guv + vec2(1.0-uv.x,uv.y) * scale);
        vec4 c2    = texture2D(s_texture1, guv + vec2(uv.x,uv.y)     * scale);

        gl_FragColor = mix(c1, c2, side);
    }
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
    }
  `
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
    }
  `
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  // https://www.shadertoy.com/view/MstBzf

  const noisefade_src = `data:text/plain,` + hdr +
  `
    float seed = 16.0;
    float sinNoise(vec2 uv)
    {
        return fract(abs(sin(uv.x * 180.0 + uv.y * 3077.0) * 53703.27));
    }

    float valueNoise(vec2 uv, float scale)
    {
        vec2 luv = fract(uv * scale);
        vec2 luvs = smoothstep(0.0, 1.0, fract(uv * scale));
        vec2 id = floor(uv * scale);
        float tl = sinNoise(id + vec2(0.0, 1.0));
        float tr = sinNoise(id + vec2(1.0, 1.0));
        float t = mix(tl, tr, luvs.x);

        float bl = sinNoise(id + vec2(0.0, 0.0));
        float br = sinNoise(id + vec2(1.0, 0.0));
        float b = mix(bl, br, luvs.x);

        return mix(b, t, luvs.y) * 2.0 - 1.0;
    }

    void main( void )
    {
        // Normalized pixel coordinates (from 0 to 1)
        vec2 uv = gl_FragCoord.xy/u_resolution.xy;

        uv.y /= u_resolution.x/u_resolution.y;

        float sinN = sinNoise(uv);

        float scale = 4.0;

        float fractValue = 0.0;
        float amp = 1.0;
        for(int i = 0; i < 16; i++)
        {
          fractValue += valueNoise(uv, float(i + 1) * scale) * amp;
            amp /= 2.0;
        }

        fractValue /= 2.0;
        fractValue += 0.5;

        // float time = mix(-0.5, 1.0, cos(iTime)/2.0 +0.5);
        float time = mix(-0.5, 1.0, u_percent);

        //time = 1.0;
        float cutoff = smoothstep(time+ 0.1, time- 0.1, fractValue);

        vec4 col = mix(texture2D(s_texture0, uv), texture2D(s_texture1, uv), cutoff);

        // Output to screen
        gl_FragColor = vec4(col);
    }
  `

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  // https://www.shadertoy.com/view/Xs3cDn

  const dots_src = `data:text/plain,` + hdr +
  `
    void main( void )
    {
        vec2 uv = gl_FragCoord.xy/u_resolution.xy;
        vec2 p = uv*2.0 - 1.0;
        float as = u_resolution.y/u_resolution.x;

        vec3 col1 = texture2D(s_texture0,uv).rgb;
        vec3 col2 = texture2D(s_texture1,uv).rgb;

      //  float g = sin(iTime)*2.2;
        float g = u_percent;

        float a = clamp(cos(p.x*200.0)-cos(p.y*200.0*as)+g+1.0,0.0,1.0);
        a = pow(a,10.0);
        vec3 col = mix(col1,col2,a);

        // Output to screen
        gl_FragColor = vec4(col,1.0);
    }
  `

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  // https://www.shadertoy.com/view/Xd3yzs

  // Needs NOISE texture loaded
  //
  const blocks_src = `data:text/plain,` + hdr +
  `
    const vec3 kWhite = vec3(1.0, 1.0, 1.0);

    // Pixel Size.
    const float kPixelSize = 8.0;

    // How wide the pixelized "wave" is.
    const float kTransitionSpread = 0.15;

    // How fast the wave moves.
    const float kTransitionSpeed = 0.5;

    const float kTransitionIntensity = 16.0;

    void main( void )
    {
        // Normalized pixel coordinates (from 0 to 1)
        vec2 uv = gl_FragCoord.xy/u_resolution.xy;

        // Figure out which pixelated "cell" each fragment belongs to.
        vec2 noise_cell = floor(gl_FragCoord / kPixelSize);
        vec2 noise_uv = noise_cell / (iChannelResolution[0].xy);

        float noise = texture(s_texture0, noise_uv).x * kTransitionSpread;
        float progress = (u_percent * kTransitionSpeed) + noise_uv.y + noise;
        float peak = cos(progress) * kTransitionIntensity;

        // How much of the first image vs the second should this fragment show.
        float transition = clamp(peak, 0.0, 1.0);

        // Final transition mix
        vec3 img1 = texture2D(s_texture1, uv).xyz;
        vec3 img2 = texture2D(s_texture2, uv).xyz;
        vec3 col = mix(img1, img2, transition);

        // Output to screen
        gl_FragColor = vec4(col,1.0);
    }
  `

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  const blob_src = `data:text/plain,` + hdr +
  `
  //
  // Description : Array and textureless GLSL 2D simplex noise function.
  //      Author : Ian McEwan, Ashima Arts.
  //  Maintainer : stegu
  //     Lastmod : 20110822 (ijm)
  //     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
  //               Distributed under the MIT License. See LICENSE file.
  //               https://github.com/ashima/webgl-noise
  //               https://github.com/stegu/webgl-noise
  //

  vec3 mod289(vec3 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }

  vec2 mod289(vec2 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }

  vec3 permute(vec3 x) {
    return mod289(((x*34.0)+1.0)*x);
  }

  float snoise(vec2 v)
  {
    const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                        0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                       -0.577350269189626,  // -1.0 + 2.0 * C.x
                        0.024390243902439); // 1.0 / 41.0
  // First corner
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);

  // Other corners
    vec2 i1;
    //i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0
    //i1.y = 1.0 - i1.x;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    // x0 = x0 - 0.0 + 0.0 * C.xx ;
    // x1 = x0 - i1 + 1.0 * C.xx ;
    // x2 = x0 - 1.0 + 2.0 * C.xx ;
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;

  // Permutations
    i = mod289(i); // Avoid truncation effects in permutation
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
      + i.x + vec3(0.0, i1.x, 1.0 ));

    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;

  // Gradients: 41 points uniformly over a line, mapped onto a diamond.
  // The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)

    vec3 x  = 2.0 * fract(p * C.www) - 1.0;
    vec3 h  = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;

  // Normalise gradients implicitly by scaling m
  // Approximation of: m *= inversesqrt( a0*a0 + h*h );
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

  // Compute final noise value at P
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main(void)
  {
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;

    vec2 pos = uv;

    pos.x = snoise(vec2(pos.x * 2.0));

    float noise = snoise(pos);

    vec4 texture1 = texture2D(s_texture0, uv);
    vec4 texture2 = texture2D(s_texture1, uv);

    //float step = sin(iTime);

    float step = u_percent;

    gl_FragColor = texture1 * smoothstep(step, step, noise) +
                   texture2 * (1.0 - smoothstep(step, step, noise));
  }
  `

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  const circle_src = `data:text/plain,` + hdr +
  `
    void main( void )
    {
      vec2 uv0 = (gl_FragCoord.xy - u_resolution.xy * 0.5) / u_resolution.y;
      vec2 uv1 = gl_FragCoord.xy / u_resolution.xy;

      // input circle radius
      // float inputRadius = (1.0 + sin(iTime)) * 0.5;
      float inputRadius = u_percent;//(1.0 + sin(u_percent)) * 0.5;

      float l = length(uv0);
      float a = smoothstep(inputRadius + 0.005, inputRadius, l);
      vec4 c0 = texture2D(s_texture0, uv0) * a;
      vec4 c1 = texture2D(s_texture1, uv1) * a;

      // Output to screen
      gl_FragColor =  c1 + vec4(c0.rgb, 1.0);

      //gl_FragColor = mix(vec4(c0.rgb, 1.0), vec4(c1.rgb, 1.0), 0.5); // lerp

    }

  `
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  const wipe_src = `data:text/plain,` + hdr +
  `
    float w = 0.1;      // Blend width

    uniform float       u_wipeDX;    // HORIZONTAL wipe component
    uniform float       u_wipeDY;    // VERTICAL   wipe component

    void main(void)
    {
      vec2 uv = gl_FragCoord.xy / u_resolution.xy;

      vec4 color0 = texture2D(s_texture0, uv);
      vec4 color1 = texture2D(s_texture1, uv);

      float correction = mix(w, -w, u_percent);

      float px = smoothstep((u_percent - w),
                            (u_percent + w),
                            (uv.x * u_wipeDX) +
                            (uv.y * u_wipeDY) + correction); // clamped ramp

      gl_FragColor = mix(color1, color0, px); // lerp
    }`;

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  var STRETCH = scene.stretch.STRETCH;

  var rate = 1.0;
  var ar   = 16/9;

  var w1 = scene.w;
  var h1 = w1 / ar;

  var x1 = (scene.w * 0.5);
  var y1 = (scene.h * 0.5);

  var bg     = scene.create({ t: 'object', parent: root, w: w1, h: h1, fillColor: '#126', x: x1, y: y1, px: 0.5, py: 0.5, focus: true, id: "Foo" });
  var Image1 = scene.create({ t: 'image',  parent:   bg, w: w1, h: h1, url: base + "/images/ireland_landscapeHD.jpg", interactive: false, stretchX: STRETCH, stretchY: STRETCH });
  var Image2 = scene.create({ t: 'image',  parent:   bg, w: w1, h: h1, url: base + "/images/Cliffs_of_MoherHD.jpg"  , interactive: false, stretchX: STRETCH, stretchY: STRETCH });

  var title_box = scene.create({ t: 'rect',    parent: root,      w: 280, h: 50, x: x1, y: scene.h* 0.95, px: 0.5, py: 1.0, interactive: false, fillColor: "#000A", a: 0.0 });
  var title_txt = scene.create({ t: 'textBox', parent: title_box, w: 280, h: 50,
                    pixelSize: 24, textColor: '#fff',  text: 'Title', interactive: false,
                    alignVertical:   scene.alignVertical.CENTER,
                    alignHorizontal: scene.alignHorizontal.CENTER});

  var pc  = 0.0;
  var dir = 1.0;

  var style_idx = 0;
  const style =
  [
    {name: "Horizontal", dx: 1, dy: 0, max: 1.0, min: 0.0},
    {name: "Vertical",   dx: 0, dy: 1, max: 1.0, min: 0.0},
    {name: "Diagonal",   dx: 1, dy: 1, max: 1.9, min: 0.0},
  ]

  var shader_idx = 0;
  const shaders =
  [
      { name: "Wipe",         src: wipe_src,        max: 1.00,  min:  0.00,  rate: 3.0 },
      { name: "Blobs",        src: blob_src,        max: 1.05,  min: -1.05,  rate: 4.0 },
      // { name: "Noise Fade",   src: noisefade_src,   max: 1.00,  min:  0.00,  rate: 1.0 },
      // { name: "Dots",         src: dots_src,     max: 1.00,  min:  0.00,  rate: 2.0 },
      { name: "Swap",         src: swap_src,        max: 1.00,  min:  0.00,  rate: 4.5 },
      { name: "Portal2",      src: portal2_src,     max: 1.00,  min:  0.00,  rate: 2.0 },
      // { name: "Portal2 Flip", src: portal2flip_src, max: 1.10,  min: -1.00,  rate: 4.2 },
      { name: "Cube",         src: cube_src,        max: 1.00,  min:  0.00,  rate: 4.5 },
      { name: "Zoom Blur",    src: zoomblur_src,    max: 1.00,  min:  0.00,  rate: 4.0 },
    //  { name: "Circle",      src: circle_src,     max: 1.00,  min:  0.00,  rate: 1.0 },
  ];

  var wipeShader = null;

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  function createShader(shader, texture0 = null, texture1 = null)
  {
    wipeShader = scene.create({
                t: 'shaderResource',
          fragment: shader,
          uniforms:
          {
            "u_time"     : "float",
            "u_percent"  : "float",
            "u_wipeDX"   : "float",
            "u_wipeDY"   : "float",
            "s_texture0" : "sampler2D",
            "s_texture1" : "sampler2D"
          }
        });

    // Set the SHADER effect on the 'bg' object
    wipeShader.ready
    .then(
    (o) =>
    {
      bg.effect =
      {
          name:  "wipes",
          shader: wipeShader,
          uniforms:
          {
            s_texture0: texture0,
            s_texture1: texture1,
          }
      }
    },
    (o) =>
    {
      console.log("Shader Compilation - FAILED >> " + shaders[shader_idx].name + " >> " + wipeShader.loadStatus.glError );
    });
  };

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  Promise.all([bg.ready, Image1.ready, Image2.ready]).then( () =>
  {
    createShader( shaders[shader_idx].src, Image2.resource, Image1.resource );
    showTitle( shaders[shader_idx].name);

    setInterval( () =>
    {
      if(wipeShader)
      {
        // var name = style[index].name;

        var dx  = style[style_idx].dx;
        var dy  = style[style_idx].dy;
        var min = style[style_idx].min;
        var max = style[style_idx].max;

        var dt  = shaders[shader_idx].rate;
            min = shaders[shader_idx].min;
            max = shaders[shader_idx].max;

        pc += (0.003 * dt * dir);

        // Clamp
        if( pc > max )
        {
          dir *= -1; pc = max; // TOGGLE
        }
        if( pc < min )
        {
          dir *= -1; pc = min; // TOGGLE
        }

        // Update Uniforms
        bg.effect =
        {
            shader: wipeShader,
            uniforms:
            {
              u_wipeDX:   dx,
              u_wipeDY:   dy,
              u_percent:  pc
            }
        }
      }
    }, 32);
  });

  scene.on("onResize", function (e)
  {
    updateSize(e.w, e.h);
  });

  function updateSize(w, h)
  {
    var x1 = w * 0.5;
    var y1 = h * 0.5;

    // Screen
    var ws = (w > 0) ? w : 1;
    var hs = (h > 0) ? h : 1;

    // Image
    var wi = (Image1.resource.w > 0) ? Image1.resource.w : 1;
    var hi = (Image1.resource.h > 0) ? Image1.resource.h : 1;

    // Scale factor
    var sw =  ws/wi;
    var sh =  hs/hi;

    var sf = Math.min(sw, sh);

    w1 = wi * sf;
    h1 = hi * sf;

    // Re-size
        bg.w = w1;       bg.h = h1;
    Image1.w = w1;   Image1.h = h1;
    Image2.w = w1;   Image2.h = h1;

    // Re-position
        bg.x = x1;       bg.y = y1;
    Image1.x = x1;   Image1.y = y1;
    Image2.x = x1;   Image2.y = y1;

    title_box.x = ws * 0.50;
    title_box.y = hs * 0.95;

    wipeShader.u_resolution = [w1, h1];
  }

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

  bg.on('onKeyUp', function(e)
  {
      if(e.keyCode == keys.SPACE)
      {
        style_idx = ((style_idx + 1) < (style.length)) ? (style_idx + 1) : 0;

        showTitle(style[style_idx].name);
      }
      else
      if(e.keyCode == keys.LEFT) // < PREV
      {
        console.log( " PREV shader ")
        console.log( " PREV shader ")
        console.log( " PREV shader ")

        shader_idx = ((shader_idx - 1) < 0) ? (shaders.length - 1) : (shader_idx - 1);
        showTitle(shaders[shader_idx].name);

        createShader( shaders[shader_idx].src, Image2.resource, Image1.resource );

        showTitle( shaders[shader_idx].name);
      }
      else
      if(e.keyCode == keys.RIGHT) // > NEXT
      {
        console.log( " NEXT shader ")
        console.log( " NEXT shader ")
        console.log( " NEXT shader ")

        shader_idx = ((shader_idx + 1) < (shaders.length)) ? (shader_idx + 1) : 0;
        showTitle(shaders[shader_idx].name);

        createShader( shaders[shader_idx].src, Image2.resource, Image1.resource );

        showTitle( shaders[shader_idx].name);
      }
  });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

}).catch(function importFailed(err) {
  console.error('Import for Transitions.js failed: ' + err);
});
