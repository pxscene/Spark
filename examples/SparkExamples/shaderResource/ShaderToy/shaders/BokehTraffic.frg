
#define S(a, b, t) smoothstep(a, b, t)

float Noise(float t){
	return fract(sin(t * 3496.) * 6542.);
}

vec4 Noise14(float t){
	return fract(sin(t * vec4(3496., 143., 1809., 7893.)) * vec4(6542., 2012., 290., 3943.));
}

struct ray{
	vec3 o, d; // origin and direction
};

ray GetRay(vec2 uv, vec3 camPos, vec3 lookat, float zoom){
    ray a;
    a.o = camPos;

    vec3 forward = normalize(lookat-camPos);
    vec3 right = cross(vec3(0,1,0), forward);
    vec3 up = cross(forward, right);
    vec3 center = a.o + forward * zoom;
    vec3 intersect = center + uv.x * right + uv.y * up;

    a.d = normalize(intersect - a.o);

    return a;
}

vec3 ClosestPoint(ray r, vec3 p){
	return r.o + max(0., dot(p-r.o, r.d)) * r.d;
}

float DistRay(ray r, vec3 p){
	return length(p-ClosestPoint(r, p));
}

float Bokeh(ray r, vec3 p, float size, float blur){
	float d = DistRay(r, p);

    size *= length(p);
    float c = S(size, size*(1.-blur), d);
    // Make the outside brighter again
    c *= mix(.6, 1., S(size*.8, size, d));
    return c;

}

vec3 StreetLights(ray r, float t){
    // Offset both sides
    float side = step(r.d.x, 0.);


    // Make it be both sides, free calculations for doubles
    r.d.x = abs(r.d.x);

    // Number of streetlights
    float s = 1./8.; // 8 streetlights
    float m = 0.;
    for(float i = 0.; i < 1.; i += s){
        // ti is used to calculate the position according to time, also has offset for sides
        float ti = fract(t + i + side * s * .5);
        vec3 p = vec3(1.7,2.9,100. - ti * 100.);
    	m += Bokeh(r, p, .05, .15) * ti * ti * ti;
    }

    return vec3(1., .7, .3) * m;
}

vec3 EnvLights(ray r, float t){
    // Offset both sides
    float side = step(r.d.x, 0.);


    // Make it be both sides, free calculations for doubles
    r.d.x = abs(r.d.x);

    // Number of envlights
    float s = 1./20.; // 20 envlights
    vec3 col = vec3(0.);
    for(float i = 0.; i < 1.; i += s){
        // ti is used to calculate the position according to time, also has offset for sides
        float ti = fract(t + i + side * s * .5);
        // Position of environment lights, want them to appear off road
        vec4 n = Noise14(i + side * 100.);
        float fade = ti * ti * ti;

        // Sometimes make lights get obstructed
        float occlusion = sin(ti * 6.28 * 6. * n.w) * .5 + .5;

        fade *= occlusion;

        float x = mix(2.5, 10., n.x);
        float y = mix(.1, 1.6, n.y);

        vec3 p = vec3(x,y,50. - ti * 50.);

        vec3 randCol = n.wzy;

    	col += Bokeh(r, p, .05, .15) * fade * randCol * .8;
    }

    return col;
}

vec3 HeadLights(ray r, float t){

    // Double speed to simulate that those cars are going same speed as you
    t *= 2.;
    // Half width of car
    float w1 = .3;
    // Used to make headlights look more headlight shaped
    float w2 = w1 * 1.2;
    // Number of cars
    float s = 1./35.; // 35 cars
    float m = 0.;
    for(float i = 0.; i < 1.; i += s){

        // Use noise to cancel out random cars
        float n = Noise(i);

        // Skip about 90% of the cars
        if(n > .1) continue;

        // ti is used to calculate the position according to time, also has offset for sides
        float ti = fract(t + i);
        float z = 100.-ti*100.;
        float fade =  ti * ti * ti * ti * ti;
        float focus = S(.9, 1., ti);

        float size = mix(.05, .03, focus);

    	m += Bokeh(r, vec3(-1.-w1,.15,z), size, .15) * fade;
        m += Bokeh(r, vec3(-1.+w1,.15,z), size, .15) * fade;

        m += Bokeh(r, vec3(-1.-w2,.15,z), size, .15) * fade;
        m += Bokeh(r, vec3(-1.+w2,.15,z), size, .15) * fade;

        // Add reflection on the road

        float ref = 0.;
        ref += Bokeh(r, vec3(-1.-w2,-.15,z), size*3., 1.) * fade;
        ref += Bokeh(r, vec3(-1.+w2,-.15,z), size*3., 1.) * fade;

        m += ref * focus;
    }

    return vec3(.9, .9, 1.) * m;
}

vec3 TailLights(ray r, float t){
    // Taillights moving slower because you're driving up to these cars
    t *= .15;
    // Half width of car
    float w1 = .3;
    // Used to make headlights look more headlight shaped
    float w2 = w1 * 1.;
    // Number of cars
    float s = 1./10.; // 15 cars
    // Help give everything a beautiful purple tint
    float m = .1;
    for(float i = 0.; i < 1.; i += s){

        // Use noise to cancel out random cars
        float n = Noise(i);

        // Skip about half the cars
        if(n > .5) continue;

        float lane = step(.25, n); // either 0 or 1 since n is guaranteed to be between 0 and .5
        // ti is used to calculate the position according to time, also has offset for sides
        float ti = fract(t + i);
        float z = 100.-ti*100.;
        float fade =  ti * ti * ti * ti * ti;
        float focus = S(.9, 1., ti);

        float size = mix(.05, .03, focus);
        // Used for when car in our lane needs to move over
        float laneChangeStart = .95;
        float laneChangeEnd = .99;
        float signalStartOffset = .02;
        float laneShift = S(laneChangeEnd, laneChangeStart, ti);
        float x = 1.5 - lane * laneShift;
        float blink = step(0., sin(t *  440.)) * 7.
            					* lane * step(laneChangeStart - signalStartOffset, ti);

    	m += Bokeh(r, vec3(x-w1,.15,z), size, .15) * fade;
        m += Bokeh(r, vec3(x+w1,.15,z), size, .15) * fade;

        m += Bokeh(r, vec3(x-w2,.15,z), size, .15) * fade;
        m += Bokeh(r, vec3(x+w2,.15,z), size, .15) * fade * (1. + blink);

        // Add reflection on the road

        float ref = 0.;
        ref += Bokeh(r, vec3(x-w2,-.15,z), size*3., 1.) * fade;
        ref += Bokeh(r, vec3(x+w2,-.15,z), size*3., 1.) * fade * (1. + blink * .1);

        m += ref * focus;
    }

    return vec3(1., .1, .03) * m;
}

// Improvements, make sure drop isn't middle of box
vec2 Rain(vec2 uv, float t){

    t*=40.;

	vec2 aspectRatio = vec2(3., 1.);
    vec2 st = uv * aspectRatio;

    // Keep track of each raindrop to offset them
    vec2 id = floor(st);

    // The speed of which everything is moving down always
    st.y += t * .23;
    // Calculate noise
    float n = fract(sin(id.x * 76.44 * sin(id.x * 2196.1)) * 3184.2);

    // Offset y using id
    st.y += n;
    uv.y += n;
    //st.x += n * .2;
    //uv.x += n * .2;

    // Recalculate since shifted the boxes
    id = floor(st);

    // Change coordinates from -.5-.5
    st = fract(st)-.5;

    // Each box should be a different speed, multiply by 2pi for entire length of phase
    t += fract(sin(id.x * 76.44 + id.y *  891.21) * 3184.2) * 6.283;

    // For position
    // Use sawtooth wave to go down quick and go up slow
    float y = -sin(t + sin(t + sin(t)*.5)) * .43;
    vec2 p1 = vec2(0., y);

    // offset for where the uv is in relation to where the drop is.
    vec2 o1 = (st-p1)/aspectRatio;

    // Divide to make dot the right shape
    float d = length(o1);

    float m1 = S(.07, .00, d);

    // Make trail of drops that are stationary
    // Change the number of dots in vertical and horizontal locations
    vec2 numDots = vec2(1., 2.);

    // offset for where the uv is in relation to where the drop trail is.
    // -.5 to move the dots away from the center to get full circle
    // Must divide by numdots to keep aspect ratio
    vec2 o2 = (fract(uv * aspectRatio.x * numDots) - .5)/numDots;
    d = length(o2);

    // Smoothstep masks all small dots under big drop
    // .5-st.y is to scale the size of trail drops as big drop lowers
    float m2 = S(.28 * (.5-st.y), .0, d) * S(-.1, .1, st.y -  p1.y);

    // Just for debugging
    //if(st.x > .46 ||st.y>.49) m1 = 1.;
    return vec2(m1 * o1 * 30. + m2 * o2 * 12.);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 uv = fragCoord.xy / iResolution.xy;
    uv -= 0.5;
    uv.x *= iResolution.x/iResolution.y;

    // Allows for mouse scrobble
    vec2 m = iMouse.xy/iResolution.xy;

    // How fast it plays out
    float timeScale = .07;
    float t = iTime * timeScale + m.x;

    vec3 camPos = vec3(.5, .2, 0);
    vec3 lookat = vec3(.5, .2, 1.);

    vec2 rainDistort = Rain(uv*3.2, t) * .5;
    // Add another layer of rain
    rainDistort += Rain(uv * 5., t) *.5;

    // Add a bit of wateryness/wavyness to the drops
    uv.x += sin(uv.y*4053.) * .002;
    uv.y += sin(uv.x*296.) * .001;

    ray r = GetRay(uv - rainDistort * .5, camPos, lookat, 2.);

	vec3 col = StreetLights(r, t);
    col += HeadLights(r, t);
    col += TailLights(r, t);
    col += EnvLights(r, t);

    // Add the sky light
    col += (r.d.y + .6) * vec3(.2, .1, .5);

    // For now just view distortion
    //col = vec3(rainDistort, 0.);

	fragColor = vec4(col, 1);
}