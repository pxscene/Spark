
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
#ifdef GL_ES
    precision mediump float;
#endif

uniform vec2        u_resolution;
uniform vec4        u_mouse;

uniform float       u_time;
uniform sampler2D   s_texture;

#define iResolution u_resolution
#define iTime       u_time
#define iChannel0   s_texture

// #define fragCoord   gl_FragCoord
// #define fragColor   gl_FragColor
#define iMouse      u_mouse

#define texture     texture2D
#define textureLod  texture2D

void mainImage(out vec4, in vec2);
void main(void) { mainImage(gl_FragColor, gl_FragCoord.xy); }
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 uv = fragCoord.xy / iResolution.xy;

    vec4 waterColor = vec4(1.0);
    float reflactionY = 0.46;
    if(uv.y <= reflactionY)
    {
        float oy = uv.y;
        uv.y = 2.0*reflactionY - uv.y;
        //uv.x = uv.x - ((uv.x-0.5)*0.2) * (1.0-oy/reflactionY);
        uv.y = uv.y + sin(1./(oy-reflactionY)+iTime*5.0)*0.003;
        waterColor = vec4(0.7,0.85, 1.0,1.0);
    }

    fragColor = texture(iChannel0, uv) * waterColor;
}

