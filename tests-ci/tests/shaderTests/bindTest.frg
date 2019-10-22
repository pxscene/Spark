// #version 110  // OpenGL ES 2.0

#ifdef GL_ES
  precision mediump float;
#endif

varying vec2 v_uv;

uniform vec2        u_resolution;

uniform float       u_time;
uniform sampler2D   s_texture0;
uniform sampler2D   s_texture1;
uniform sampler2D   s_texture2;
uniform sampler2D   s_texture3;

#define iResolution u_resolution
#define iTime       u_time
#define iChannel0   s_texture0
#define iChannel1   s_texture1
#define iChannel2   s_texture2
#define iChannel3   s_texture3

#define texture     texture2D
#define textureLod  texture2D

void mainImage(out vec4, in vec2);
void main(void) { mainImage(gl_FragColor, gl_FragCoord.xy); }

float w = 0.2;

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = fragCoord.xy / iResolution.xy;

    float g = 1.5;
    vec4 gamma = vec4(g, g, g, 1.0);

    vec4 color0 = pow(texture(iChannel0, uv), gamma);
    vec4 color1 = texture(iChannel1, uv);
    vec4 color2 = texture(iChannel2, uv * 3.);
    vec4 color3 = texture(iChannel3, uv);

    float duration = 2.0;
    float t = mod(float(iTime), duration) /  duration;

    float correction = mix(w, -w, t);
    float choose     = smoothstep(t  - w, t + w, uv.x + correction); // clamped ramp

    fragColor = mix(color1, color0, choose); // lerp

    fragColor +=  vec4(color2.rgb, 0.15);
    fragColor +=  vec4(color3.rgb, 0.5);
}
