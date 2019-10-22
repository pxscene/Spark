// #version 110  // OpenGL ES 2.0

#ifdef GL_ES
  precision mediump float;
#endif

varying vec2         v_uv;

uniform vec2         u_resolution;
uniform vec4         u_colorVec4;
uniform sampler2D    s_texture;

oops_deliberate_FRAGMENT_bug_test - THIS IS A DELIBERATE ERROR !!
oops_deliberate_FRAGMENT_bug_test - THIS IS A DELIBERATE ERROR !!
oops_deliberate_FRAGMENT_bug_test - THIS IS A DELIBERATE ERROR !!

void main()
{
  vec4 px = texture2D(s_texture, v_uv);

  gl_FragColor = px + u_colorVec4;
}