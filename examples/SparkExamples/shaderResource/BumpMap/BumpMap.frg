
#ifdef GL_ES
    precision mediump float;
#endif

// attributes from vertex shader
varying vec2 v_uv;

// texture samplers
uniform sampler2D s_texture;  // diffuse map
uniform sampler2D s_normals;  // normal map

// values used for shading algorithm...
uniform vec2 u_resolution;    // resolution of screen
uniform vec3 u_lightPos;      // light position, normalized
uniform vec4 u_lightColor;    // light RGBA -- alpha is intensity
uniform vec4 u_ambientColor;  // ambient RGBA -- alpha is intensity
uniform vec3 u_falloff;       // attenuation coefficients

void main()
{
	// RGBA of our diffuse color
	vec4 DiffuseColor = texture2D(s_texture, v_uv);

	// RGB of our normal map
	vec3 NormalMap = texture2D(s_normals, v_uv).rgb;

	// The delta position of light
	vec3 LightDir = vec3(u_lightPos.xy - (gl_FragCoord.xy / u_resolution.xy), 0.25); //u_lightPos.z);

	// Correct for aspect ratio
	LightDir.x *= u_resolution.x / u_resolution.y;

	// Determine distance (used for attenuation) BEFORE we normalize our LightDir
	float D = length(LightDir);

	// Normalize our vectors
	vec3 N = normalize(NormalMap * 2.0 - 1.0);
	vec3 L = normalize(LightDir);

	// Pre-multiply light color with intensity
	// Then perform "N dot L" to determine our diffuse term
	vec3 Diffuse = (u_lightColor.rgb * u_lightColor.a) * max(dot(N, L), 0.0);
	
	// pre-multiply ambient color with intensity
	vec3 Ambient = u_ambientColor.rgb * u_ambientColor.a;

	// calculate attenuation
	float Attenuation = ( u_falloff.x + (u_falloff.y * D) + (u_falloff.z * D * D) );

	// the calculation which brings it all together
  vec3 Intensity  = Ambient + Diffuse * Attenuation;
	vec3 FinalColor = DiffuseColor.rgb * Intensity;

	gl_FragColor = vec4(FinalColor, DiffuseColor.a);
}
