
// Shadertoy - https://www.shadertoy.com/view/llySW3

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 ratio;
    ratio.x = iResolution.x / iResolution.y;
    ratio.y = 1.0;
    vec2 uv = fragCoord.xy / iResolution.xy;
    uv -= 0.5; // center coordinates
    uv *= ratio;

    // calculate circles
    float distance1 = sin(length(uv - vec2(-cos(iTime * 5.0) * 0.05, -sin(iTime * 5.0) * 0.05)) * (30.0 + abs(sin(iTime) * 100.0)));
    float distance2 = sin(length(uv - vec2(+cos(iTime * 5.0) * 0.05, +sin(iTime * 5.0) * 0.05)) * 100.0);

    fragColor.rgb = vec3(distance1 * distance2);
    fragColor.a = 1.0;

    // calculate rotating color grading
    float angleRad = iTime;
    vec2 sc;
    sc.x = cos(angleRad);
    sc.y = sin(angleRad);
    mat2 m = mat2(sc.y, sc.x, -sc.x, sc.y);

    uv = m * uv;
    vec4 color1 = vec4(1, 0.4, 0.0, 1);
    vec4 color2 = vec4(0.1, 0.8, 0.9, 1);
    fragColor += mix(color1, color2, uv.y);
}