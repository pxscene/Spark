
float sdPlane( vec3 p )
{
	return p.y;
}

float sdBox( vec3 p, vec3 b )
{
  vec3 d = abs(p) - b;
  return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
}

//----------------------------------------------------------------------

float opS( float d1, float d2 )
{
    return max(-d2,d1);
}

vec2 opU( vec2 d1, vec2 d2 )
{
	return (d1.x<d2.x) ? d1 : d2;
}

vec3 opRep( vec3 p, vec3 c )
{
    return mod(p,c)-0.5*c;
}

vec3 opRepXZ( vec3 p, vec3 c )
{
    return vec3(mod(p.x,c.x)-0.5*c.x, p.y, mod(p.z,c.z)-0.5*c.z);
}

// polynomial smooth min (k = 0.1);
float smin( float a, float b, float k )
{
    float h = clamp( 0.5+0.5*(b-a)/k, 0.0, 1.0 );
    return mix( b, a, h ) - k*h*(1.0-h);
}

// exponential smooth min (k = 32);
float smin2( float a, float b, float k )
{
    float res = exp( -k*a ) + exp( -k*b );
    return -log( res )/k;
}

vec3 opTwist( vec3 p )
{
    float  c = cos(10.0*p.y+10.0);
    float  s = sin(10.0*p.y+10.0);
    mat2   m = mat2(c,-s,s,c);
    return vec3(m*p.xz,p.y);
}

vec3 rX(in vec3 p, float a) {
	float c,s;vec3 q=p;
	c = cos(a); s = sin(a);
	return vec3(p.x, c * q.y - s * q.z, s * q.y + c * q.z);
}

vec3 rY(in vec3 p, float a) {
	float c,s;vec3 q=p;
	c = cos(a); s = sin(a);
	return vec3(c * q.x + s * q.z, p.y, -s * q.x + c * q.z);
}

//----------------------------------------------------------------------

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

vec2 map(in vec3 pos) {
    vec2 res = vec2(sdPlane(pos), 1.0);

    // bledng cubes by groups of 9
    float gap = 1.2;

    vec3 cubeSize = vec3(0.5);
    for(float i=-1.; i<=1.; i+=1.) {
        for(float j=-1.; j<=1.; j+=1.) {
            vec3 p = opRepXZ(pos, vec3(gap, 0., gap))+vec3(i*gap, 0., j*gap);
//            vec3 p = pos+vec3(i*gap, 0., j*gap);
            float rotX = iTime+pos.x*0.3;
	        float rotY = iTime+pos.z*0.3;
            vec3 p2 = rY(rX(p, rotX), rotY);

            float dst = sdBox(p2, cubeSize);

            // smooth min
            float a = res.x;
            float b = dst;
            // blending power : 0. to 1.
            float k = .5;
            float h = clamp( 0.5+0.5*(b-a)/k, 0.0, 1.0 );

		    res = vec2(mix( b, a, h ) - k*h*(1.0-h), 3.0);
        }
    }

    return res;
}

vec2 castRay( in vec3 ro, in vec3 rd )
{
    float tmin = 1.0;
    float tmax = 20.0;

#if 0
    float tp1 = (0.0-ro.y)/rd.y; if( tp1>0.0 ) tmax = min( tmax, tp1 );
    float tp2 = (1.6-ro.y)/rd.y; if( tp2>0.0 ) { if( ro.y>1.6 ) tmin = max( tmin, tp2 );
                                                 else           tmax = min( tmax, tp2 ); }
#endif

	float precis = 0.002;
    float t = tmin;
    float m = -1.0;
    for( int i=0; i<50; i++ )
    {
	    vec2 res = map( ro+rd*t );
        if( res.x<precis || t>tmax ) break;
        t += res.x;
	    m = res.y;
    }

    if( t>tmax ) m=-1.0;
    return vec2( t, m );
}


float softshadow( in vec3 ro, in vec3 rd, in float mint, in float tmax )
{
	float res = 1.0;
    float t = mint;
    for( int i=0; i<16; i++ )
    {
		float h = map( ro + rd*t ).x;
        res = min( res, 8.0*h/t );
        t += clamp( h, 0.02, 0.10 );
        if( h<0.001 || t>tmax ) break;
    }
    return clamp( res, 0.0, 1.0 );

}

vec3 calcNormal( in vec3 pos )
{
	vec3 eps = vec3( 0.001, 0.0, 0.0 );
	vec3 nor = vec3(
	    map(pos+eps.xyy).x - map(pos-eps.xyy).x,
	    map(pos+eps.yxy).x - map(pos-eps.yxy).x,
	    map(pos+eps.yyx).x - map(pos-eps.yyx).x );
	return normalize(nor);
}

float calcAO( in vec3 pos, in vec3 nor )
{
	float occ = 0.0;
    float sca = 1.0;
    for( int i=0; i<5; i++ )
    {
        float hr = 0.01 + 0.12*float(i)/4.0;
        vec3 aopos =  nor * hr + pos;
        float dd = map( aopos ).x;
        occ += -(dd-hr)*sca;
        sca *= 0.95;
    }
    return clamp( 1.0 - 3.0*occ, 0.0, 1.0 );
}




vec3 render( in vec3 ro, in vec3 rd )
{
    vec3 col = vec3(0.8, 0.9, 1.0);
    vec2 res = castRay(ro,rd);
    float t = res.x;
	float m = res.y;
    if( m>-0.5 )
    {
        vec3 pos = ro + t*rd;
        vec3 nor = calcNormal( pos );
        vec3 ref = reflect( rd, nor );

        // material
		col = 0.45 + 0.3*sin( vec3(0.05,0.08,0.10)*(m-1.0) );

        if( m<1.5 )
        {

            float f = mod( floor(5.0*pos.z) + floor(5.0*pos.x), 2.0);
            col = 0.4 + 0.1*f*vec3(1.0);
        }

        // lighitng
        float occ = calcAO( pos, nor );
		vec3  lig = normalize( vec3(-0.6, 0.7, -0.5) );
		float amb = clamp( 0.5+0.5*nor.y, 0.0, 1.0 );
        float dif = clamp( dot( nor, lig ), 0.0, 1.0 );
        float bac = clamp( dot( nor, normalize(vec3(-lig.x,0.0,-lig.z))), 0.0, 1.0 )*clamp( 1.0-pos.y,0.0,1.0);
        float dom = smoothstep( -0.1, 0.1, ref.y );
        float fre = pow( clamp(1.0+dot(nor,rd),0.0,1.0), 2.0 );
		float spe = pow(clamp( dot( ref, lig ), 0.0, 1.0 ),16.0);

//        dif *= softshadow( pos, lig, 0.02, 2.5 );
//        dom *= softshadow( pos, ref, 0.02, 2.5 );

		vec3 brdf = vec3(0.0);
        brdf += 1.20*dif*vec3(1.00,0.90,0.60);
		brdf += 1.20*spe*vec3(1.00,0.90,0.60)*dif;
        brdf += 0.30*amb*vec3(0.50,0.70,1.00)*occ;
        brdf += 0.40*dom*vec3(0.50,0.70,1.00)*occ;
        brdf += 0.30*bac*vec3(0.25,0.25,0.25)*occ;
        brdf += 0.40*fre*vec3(1.00,1.00,1.00)*occ;
		brdf += 0.02;
		col = col*brdf;

    	col = mix( col, vec3(0.8,0.9,1.0), 1.0-exp( -0.0005*t*t ) );

    }

	return vec3( clamp(col,0.0,1.0) );
}

mat3 setCamera( in vec3 ro, in vec3 ta, float cr )
{
	vec3 cw = normalize(ta-ro);
	vec3 cp = vec3(sin(cr), cos(cr),0.0);
	vec3 cu = normalize( cross(cw,cp) );
	vec3 cv = normalize( cross(cu,cw) );
    return mat3( cu, cv, cw );
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 q = fragCoord.xy/iResolution.xy;
    vec2 p = -1.0+2.0*q;
	p.x *= iResolution.x/iResolution.y;
    vec2 mo = iMouse.xy/iResolution.xy;

	float time = 15.0 + iTime;

	// camera
//	vec3 ro = vec3( -0.5+3.5*cos(0.1*time + 6.0*mo.x), 1.0 + 2.0*mo.y, 0.5 + 3.5*sin(0.1*time + 6.0*mo.x) );
	vec3 ro = vec3( 0., 8.0, 0.5 + 3.5);
	vec3 ta = vec3( -0.5, -0.4, 0.5 );

	// camera-to-world transformation
    mat3 ca = setCamera( ro, ta, 0.0 );

    // ray direction
	vec3 rd = ca * normalize( vec3(p.xy,2.0) );

    // render
    vec3 col = render( ro, rd );

	col = pow( col, vec3(0.4545) );

    fragColor=vec4( col, 1.0 );
}