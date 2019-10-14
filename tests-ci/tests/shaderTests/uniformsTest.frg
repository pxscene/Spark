#version 110  // OpenGL ES 2.0

#ifdef GL_ES
  precision mediump float;
#endif

varying vec2         v_uv;

uniform vec2         u_resolution;

uniform int          u_colorInt;
uniform float        u_colorFloat;

uniform ivec2        u_colorVec2i;
uniform ivec3        u_colorVec3i;
uniform ivec4        u_colorVec4i;

uniform vec2         u_colorVec2f;
uniform vec3         u_colorVec3f;
uniform vec4         u_colorVec4f;

void main()
{
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  //
  // Note:  PASS/FAIL ... any color other that WHITE #fff ... indicates a Set Uniform failure.
  //
  if(u_colorInt <= 0)
  {
    //
    // TEST - setUniform1i()
    //
    gl_FragColor = vec4(1.0, 0.0, 0.0,  1.0); //  was NOT set !  // FAIL:  #f00
  }
  else
  if(u_colorFloat <= 0.0)
  {
    //
    // TEST - setUniform1f()
    //
    gl_FragColor = vec4(0.0, 1.0, 0.0,  1.0); //  was NOT set !  // FAIL:  #0f0
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // TEST - Integer Vectors
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  else
  if( any( notEqual( u_colorVec2i, ivec2(1, 1) ) ))
  {
    //
    // TEST - setUniform2iv()
    //
    gl_FragColor = vec4(0.0, 0.0, 1.0,  1.0); //  was NOT set !  // FAIL:  #00f
  }
  else
  if( any( notEqual( u_colorVec3i, ivec3(1, 1, 1) ) ))
  {
    //
    // TEST - setUniform3iv()
    //
    gl_FragColor = vec4(1.0, 1.0, 0.0,  1.0); //  was NOT set !  // FAIL:  #ff0
  }
  else
  if( any( notEqual( u_colorVec4i, ivec4(1, 1, 1, 1) ) ))
  {
    //
    // TEST - setUniform4iv()
    //
    gl_FragColor = vec4(0.0, 1.0, 0.5,  1.0); //  was NOT set !  // FAIL:  #0f8
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // TEST - Floating Point Vectors
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  else
  if( any( notEqual( u_colorVec2f, vec2(1.0, 1.0) ) ))
  {
    //
    // TEST - setUniform2iv()
    //
    gl_FragColor = vec4(0.5, 0.0, 0.5,  1.0); //  was NOT set !  // FAIL:  #808
  }
  else
  if( any( notEqual( u_colorVec3f, vec3(1.0, 1.0, 1.0) ) ))
  {
    //
    // TEST - setUniform2iv()
    //
    gl_FragColor = vec4(0.5, 0.5, 0.0,  1.0); //  was NOT set !  // FAIL:  #880
  }
  else
  if( any( notEqual( u_colorVec4f, vec4(1.0, 1.0, 1.0, 1.0) ) ))
  {
    //
    // TEST - setUniform2iv()
    //
    gl_FragColor = vec4(0.5, 0.5, 0.5,  1.0); //  was NOT set !  // FAIL:  #888
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // Test - PASSED
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  else
  {
    gl_FragColor = vec4(1.0, 1.0, 1.0,  1.0); // PASS: #fff  (default)
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
}
