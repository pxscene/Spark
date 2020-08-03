
// Created by sofiane benchaa - sben/2015
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
#define FIELD 20.0
#define HEIGHT 0.7
#define ITERATION 2
#define TONE vec3(0.5,0.2,0.3)

vec2 eq(vec2 p,float t){
	vec2 fx = vec2(0.0);
	fx.x = (sin(p.y+cos(t+p.x*0.2))*cos(p.x-t));
	fx.x *= acos(fx.x);
	fx.x *= -distance(fx.x,0.5)*p.x/p.y;
	fx.y = p.y-fx.x;
	return fx;
}

vec3 computeColor(vec2 p, float t, float hs){
	vec3 color = vec3(0.0);
	vec2 fx = eq(p,t);
	for(int i=0; i<ITERATION; ++i)
	{
		p.x+=p.x;
		color.r += TONE.r/length(fx.y-fx.x-hs);
		fx.x += eq(p,t+float(i+1)).x;
		color.g += TONE.g/length(fx.y-fx.x-hs);
		fx.x += eq(p,t+float(i+2)).x;
		color.b += TONE.b/length(fx.y-fx.x-hs);
	}
	return color;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
	float time = iTime;
	vec2 position = ( fragCoord.xy / iResolution.xy )+0.5;
	float hs = FIELD*(HEIGHT+cos(time)*0.1);
	vec2 p = (position)*FIELD;
	vec3 color = computeColor(p, time, hs);
	fragColor = vec4( color, 1.0 );
}