
float w = 0.1; // Blend width

uniform float u_percent;
uniform float u_vertical;

uniform float u_useHorizontal;
uniform float u_useVertical;

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = fragCoord.xy / iResolution.xy;

    float g = 1.05;
    vec4 gamma = vec4(g, g, g, 1.0);

    vec4 color0 = pow(texture(iChannel0, uv), gamma);
    vec4 color1 = texture(iChannel1, uv);

    float correction = mix(w, -w, u_percent);

    float px = smoothstep((u_percent  - w),
                          (u_percent + w),
                          (uv.x * u_useHorizontal) +
                          (uv.y * u_useVertical)   + correction); // clamped ramp

    fragColor = mix(color1, color0, px); // lerp
}