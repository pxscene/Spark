
uniform vec2 u_stepSize;

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec4   px = texture2D( s_texture, v_uv );

    vec2 uv = fragCoord.xy / iResolution.xy;

    float alpha  = texture2D( s_texture, v_uv                                     ).a * 4.0; // CENTER
          alpha -= texture2D( s_texture, v_uv + vec2(  u_stepSize.x,        0.0 ) ).a;       // RIGHT
          alpha -= texture2D( s_texture, v_uv + vec2( -u_stepSize.x,        0.0 ) ).a;       // LEFT
          alpha -= texture2D( s_texture, v_uv + vec2(        0.0, u_stepSize.y  ) ).a;       // TOP
          alpha -= texture2D( s_texture, v_uv + vec2(        0.0, -u_stepSize.y ) ).a;       // BOTTOM

  float a = alpha;
  fragColor = vec4( 0.0 * a, 0.0 * a, 0.0 * a, a);

/*
  vec3 irgb = texture2D(s_texture, v_uv).rgb;
  float ResS = u_resolution.x; // 720.;
  float ResT = u_resolution.y; // 720.;

  vec2 stp0 = vec2(1./ResS, 0.);
  vec2 st0p = vec2(0., 1./ResT);
  vec2 stpp = vec2(1./ResS, 1./ResT);
  vec2 stpm = vec2(1./ResS, -1./ResT);

  const vec3 W = vec3(0.2125, 0.7154, 0.0721);

  float i00   = dot(texture2D(s_texture, v_uv).rgb, W);
  float im1m1 = dot(texture2D(s_texture, v_uv-stpp).rgb, W);
  float ip1p1 = dot(texture2D(s_texture, v_uv+stpp).rgb, W);
  float im1p1 = dot(texture2D(s_texture, v_uv-stpm).rgb, W);
  float ip1m1 = dot(texture2D(s_texture, v_uv+stpm).rgb, W);
  float im10  = dot(texture2D(s_texture, v_uv-stp0).rgb, W);
  float ip10  = dot(texture2D(s_texture, v_uv+stp0).rgb, W);
  float i0m1  = dot(texture2D(s_texture, v_uv-st0p).rgb, W);
  float i0p1  = dot(texture2D(s_texture, v_uv+st0p).rgb, W);

  float h = -1.*im1p1 - 2.*i0p1 - 1.*ip1p1 + 1.*im1m1 + 2.*i0m1 + 1.*ip1m1;
  float v = -1.*im1m1 - 2.*im10 - 1.*im1p1 + 1.*ip1m1 + 2.*ip10 + 1.*ip1p1;

  float mag = length(vec2(h, v));

  vec3 target = vec3(mag, mag, mag);

  fragColor = vec4(mix(irgb, target, 1.0),1.);// + texture2D(s_texture, v_uv);

*/
}

