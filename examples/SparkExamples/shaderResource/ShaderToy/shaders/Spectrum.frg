//
// https://www.shadertoy.com/view/wlSBzD
//
// "Spectrum Response Functions" by Martijn Steinrucken aka BigWings/CountFrolic - 2020
// The MIT License
// Copyright © 2020 Martijn Steinrucken
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
// Email: countfrolic@gmail.com
// Twitter: @The_ArtOfCode
// YouTube: youtube.com/TheArtOfCodeIsCool
// Facebook: https://www.facebook.com/groups/theartofcode/
//
// Two versions of a spectrum function: one using smoothsteps and the other
// using best-fit 9th degree polynomials which isn't as accurate, but should
// be significantly faster. 
// Function inputs range from 0 to 1, 
// which corresponds to roughly 380 to 720 nanometers
//
// I figured perhaps it could be useful to someone!

#define S smoothstep

vec3 Spectrum(float x) {
    // https://www.shadertoy.com/view/wlSBzD
	float r, g, b;
    
    r = x<.16 ? S(0., .16, x)*.169 :
    	x<.22 ? S(.22, .16, x)*.134+.035 :
    	x<.41 ? S(.22, .41, x)*.098+.035 :
    	x<.64 ? S(.41,.64,x)*.851+.133 :
    			S(1., .64, x)*.984;
    
    g = x<.05 ? 0. :
    	x<.15 ? S(.05, .15, x)*.047 :
    	x<.45 ? S(.15, .45, x)*.882+.047 :
    	x<.70 ? S(.70, .45, x)*.796+.133 :
    			S(1.0, .70, x)*.133;
    
    b = x<.18 ? S(0.0, .18, x)*.5 :
    	x<.22 ? S(.22, .18, x)*.1+.4 :
    	x<.35 ? S(.22, .35, x)*.059+.4 :
    	x<.54 ? S(.54, .35, x)*.334+.125 :
    	x<.60 ? S(.54, .60, x)*.169+.125 :
    	x<.69 ? S(.69, .60, x)*.243+.051 :
    	x<.72 ? S(.69, .72, x)*.043+.051 :
    	x<.89 ? S(.89, .72, x)*.094 : 0.;
    
    return vec3(r,g,b);
}

vec3 SpectrumPoly(float x) {
    // https://www.shadertoy.com/view/wlSBzD
    return (vec3( 1.220023e0,-1.933277e0, 1.623776e0)
          +(vec3(-2.965000e1, 6.806567e1,-3.606269e1)
          +(vec3( 5.451365e2,-7.921759e2, 6.966892e2)
          +(vec3(-4.121053e3, 4.432167e3,-4.463157e3)
          +(vec3( 1.501655e4,-1.264621e4, 1.375260e4)
          +(vec3(-2.904744e4, 1.969591e4,-2.330431e4)
          +(vec3( 3.068214e4,-1.698411e4, 2.229810e4)
          +(vec3(-1.675434e4, 7.594470e3,-1.131826e4)
          + vec3( 3.707437e3,-1.366175e3, 2.372779e3)
            *x)*x)*x)*x)*x)*x)*x)*x)*x;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = fragCoord/iResolution.xy;
    vec3 col = vec3(0);
    vec3 spectrum = mod(iTime, 2.)<1. ? Spectrum(uv.x) : SpectrumPoly(uv.x);
    
    col = spectrum*S(.3, .7, uv.y);
    col += S(.01, .0, abs(spectrum-uv.y*2.));
    
    fragColor = vec4(col,1.0);
}