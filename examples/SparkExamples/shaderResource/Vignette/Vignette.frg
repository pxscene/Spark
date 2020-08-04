uniform vec2      u_resolution;
uniform float     u_intensity; // 5.0
uniform float     u_extent;    // 0.25

uniform vec4      u_color;
uniform sampler2D s_texture;

void main()
{
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;

  uv *= (1.0 - uv.yx);

  float vig = uv.x * uv.y * u_intensity; // multiply for intensity
  vig = pow(vig, u_extent);              // change pow for modifying the extend of the  vignette
  gl_FragColor = u_color * vec4(1.0 - vig);

  // gl_FragColor = vec4( (u_color.r * u_color.a * vig),  // R
  //                      (u_color.g * u_color.a * vig),  // G
  //                      (u_color.b * u_color.a * vig),  // B
  //                      (u_color.a * u_color.a * vig)   // A
}