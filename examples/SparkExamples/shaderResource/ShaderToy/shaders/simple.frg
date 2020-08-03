
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
  vec4 px = texture2D(s_texture, v_uv);

	fragColor = px + vec4(v_uv.x, v_uv.y, 0.2, 0.015);
}