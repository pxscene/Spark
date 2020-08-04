#ifdef GL_ES
    precision mediump float;
#endif

varying vec2  v_uv;

uniform vec2      u_resolution;
uniform int       u_kernelRadius;
uniform vec2      u_direction;
uniform sampler2D s_texture;

vec4 blur13(sampler2D image, vec2 uv, vec2 resolution, vec2 direction)
{
  vec4 color = vec4(0.0);
  vec2 off1 = vec2(1.4117647058823530) * direction;
  vec2 off2 = vec2(3.2941176470588234) * direction;
  vec2 off3 = vec2(5.1764705882352940) * direction;
  color += texture2D(image, uv) * 0.1964825501511404;
  color += texture2D(image, uv + (off1 / resolution)) * 0.2969069646728344;
  color += texture2D(image, uv - (off1 / resolution)) * 0.2969069646728344;
  color += texture2D(image, uv + (off2 / resolution)) * 0.09447039785044732;
  color += texture2D(image, uv - (off2 / resolution)) * 0.09447039785044732;
  color += texture2D(image, uv + (off3 / resolution)) * 0.010381362401148057;
  color += texture2D(image, uv - (off3 / resolution)) * 0.010381362401148057;
  return color;
}

vec4 blur9(sampler2D image, vec2 uv, vec2 resolution, vec2 direction)
{
  vec4 color = vec4(0.0);
  vec2 off1 = vec2(1.3846153846) * direction;
  vec2 off2 = vec2(3.2307692308) * direction;
  color += texture2D(image, uv) * 0.2270270270;
  color += texture2D(image, uv + (off1 / resolution)) * 0.3162162162;
  color += texture2D(image, uv - (off1 / resolution)) * 0.3162162162;
  color += texture2D(image, uv + (off2 / resolution)) * 0.0702702703;
  color += texture2D(image, uv - (off2 / resolution)) * 0.0702702703;
  return color;
}

vec4 blur5(sampler2D image, vec2 uv, vec2 resolution, vec2 direction)
{
  vec4 color = vec4(0.0);
  vec2 off1  = vec2(1.3333333333333333) * direction;
  color += texture2D(image, uv) * 0.29411764705882354;
  color += texture2D(image, uv + (off1 / resolution)) * 0.35294117647058826;
  color += texture2D(image, uv - (off1 / resolution)) * 0.35294117647058826;
  return color;
}

void main()
{
#if 1
  if (u_kernelRadius == 1)
  {
    gl_FragColor = blur5(s_texture, v_uv, u_resolution, u_direction);
  }
  else if (u_kernelRadius == 2)
  {
      gl_FragColor = blur9(s_texture, v_uv, u_resolution, u_direction);
  }
  else
  {
      gl_FragColor = blur13(s_texture, v_uv, u_resolution, u_direction);
  }

  // gl_FragColor = vec4(gl_FragColor.r * gl_FragColor.a,
  //                     gl_FragColor.g * gl_FragColor.a,
  //                     gl_FragColor.b * gl_FragColor.a,
  //                     gl_FragColor.a );
#else

  vec4      px = texture2D(s_texture, v_uv);
  gl_FragColor = vec4((px.a > 0.5) ? 1.0 : 0.0, 0.0, 0.0, px.a);

#endif

//  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // JUNK
}