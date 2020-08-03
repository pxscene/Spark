// Flight over Bespin - yamahabob
// Borrowed most of this code from inigo quilez et al
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.

#define PI 3.141592654


//HUGH
//HUGH
//HUGH

#define PNOISE
#ifdef PNOISE
float iqhash( float n )
{
    return fract(sin(n)*43758.5453);
}

float noise( vec3 x )
{
    // The noise function returns a value in the range -1.0f -> 1.0f
    vec3 p = floor(x);
    vec3 f = fract(x);

    f       = f*f*(3.0-2.0*f);
    float n = p.x + p.y*57.0 + 113.0*p.z;
    return mix( mix(mix( iqhash(n+0.0  ), iqhash(n+1.0  ),f.x),
                    mix( iqhash(n+57.0 ), iqhash(n+58.0 ),f.x),f.y),
                mix(mix( iqhash(n+113.0), iqhash(n+114.0),f.x),
                    mix( iqhash(n+170.0), iqhash(n+171.0),f.x),f.y),f.z);
}
#endif

//HUGH
//HUGH
//HUGH

// General functions
mat3 rx90 = mat3( 1.0, 0.0, 0.0,
                  0.0, 0.0, 1.0,
                  0.0,-1.0, 0.0 );

mat3 ry90 = mat3( 0.0, 0.0,-1.0,
                  0.0, 1.0, 0.0,
                  1.0, 0.0, 0.0 );

mat3 rz90 = mat3( 0.0,-1.0, 0.0,
                  1.0, 0.0, 0.0,
                  0.0, 0.0, 1.0 );

mat3 rotX( float a )
{
	return mat3(1.0,    0.0,    0.0,
              0.0, cos(a),-sin(a),
              0.0, sin(a), cos(a) );
}

mat3 rotY( float a )
{
	return mat3(cos(a), 0.0, sin(a),
                 0.0, 1.0,    0.0,
             -sin(a), 0.0, cos(a) );
}

mat3 rotZ( float a )
{
	return mat3(cos(a),-sin(a), 0.0,
              sin(a), cos(a), 0.0,
                 0.0,    0.0, 1.0 );
}

mat2 rot(float a) {
	return mat2(cos(a),sin(a),-sin(a),cos(a));
}

// -------------------------------------
// Cloud Calculations
// (borrowed from iq)
// -------------------------------------

#define SPEED 5.

float speed;

#ifndef PNOISE
float noise( in vec3 x )
{
    vec3 p = floor(x);
    vec3 f = fract(x);
	//f = f*f*(3.0-2.0*f);
	vec2 uv = (p.xy + vec2(37.0,17.0)*p.z) + f.xy;
	vec2 rg = texture( iChannel0, 0.00390625*uv ).yx;

	return 1.5*mix( rg.x, rg.y, f.z ) - 0.75;
}
#endif


float map5( in vec3 p )
{
	vec3 q = p - vec3(0.0,0.1,1.0)*speed;
	float f;
    f  = 0.50000*noise( q ); q = q*2.02;
    f += 0.25000*noise( q ); q = q*2.03;
    f += 0.12500*noise( q ); q = q*2.01;
    f += 0.06250*noise( q ); q = q*2.02;
    f += 0.03125*noise( q );
	return clamp( -p.y - 0.5 + 1.75*f, 0.0, 1.0 );
}

float map4( in vec3 p )
{
	vec3 q = p - vec3(0.0,0.1,1.0)*speed;
	float f;
    f  = 0.50000*noise( q ); q = q*2.02;
    f += 0.25000*noise( q ); q = q*2.03;
    f += 0.12500*noise( q ); q = q*2.01;
    f += 0.06250*noise( q );
	return clamp( -p.y - 0.5 + 1.75*f, 0.0, 1.0 );
}
float map3( in vec3 p )
{
	vec3 q = p - vec3(0.0,0.1,1.0)*speed;
	float f;
    f  = 0.50000*noise( q ); q = q*2.02;
    f += 0.25000*noise( q ); q = q*2.03;
    f += 0.12500*noise( q );
	return clamp( -p.y - 0.5 + 1.75*f, 0.0, 1.0 );
}
float map2( in vec3 p )
{
	vec3 q = p - vec3(0.0,0.1,1.0)*speed;
	float f;
    f  = 0.50000*noise( q ); q = q*2.02;
    f += 0.25000*noise( q );;
	return clamp( -p.y - 0.5 + 1.75*f, 0.0, 1.0 );
}

vec3 sundir = normalize( vec3(-0.5,-0.1,-1.0) );

vec4 integrate( in vec4 sum, in float dif, in float den, in vec3 bgcol, in float t )
{
    // lighting
    vec3 lin = vec3(0.65,0.68,0.7)*1.2 + 0.5*vec3(0.7, 0.5, 0.3)*dif;
    vec4 col = vec4( mix( 1.15*vec3(1.0,0.95,0.8), vec3(0.65), den ), den );
    col.xyz *= lin;
    col.xyz = mix( col.xyz, bgcol, 1.0-exp(-0.004*t*t) );
    // front to back blending
    col.a *= 0.4;
    col.rgb *= col.a;
    return sum + col*(1.0-sum.a);
}

#define MARCH(STEPS,MAPLOD) for(int i=0; i<STEPS; i++) { vec3  pos = ro + t*rd; if( pos.y<-3. || pos.y>1.2 || sum.a > 0.99 ) break; float den = MAPLOD( pos ); if( den>0.1 ) { float dif = clamp((den - MAPLOD(pos+0.5*sundir))*2., 0.0, 1.0 ); sum = integrate( sum, dif, den, bgcol, t ); } t += max(0.2,0.03*t); }

vec4 raymarch( in vec3 ro, in vec3 rd, in vec3 bgcol )
{
	vec4 sum = vec4(0.0);

	float t = 0.0;

    MARCH(25,map4);
    MARCH(20,map3);
    MARCH(15,map2);
    MARCH(15,map2);

    return clamp( sum, 0.0, 1.0 );
}

mat3 lookat( vec3 fw, vec3 up ){
	fw=normalize(fw);vec3 rt=normalize(cross(fw,normalize(up)));return mat3(rt,cross(rt,fw),fw);
}

mat3 setCamera( in vec3 fw )
{
	vec3 cw = normalize( fw );
	vec3 cp = vec3( 0.0, 1.0, 0.0 );
	vec3 cu = vec3( -cw.z, 0.0, cw.x );
	vec3 cv = normalize( cross(cu,cw) );
    return mat3( cu, cv, cw );
}

vec3 cloudRender( in vec3 ro, in vec3 rd )
{
    // background sky
	float sun = clamp( dot(sundir,rd), 0.0, 1.0 );
	vec3 col = 0.9*vec3(0.949,0.757,0.525) - rd.y*0.2*vec3(0.949,0.757,0.525);// + 0.15*0.5;
	col += 0.8*vec3(1.0,.6,0.1)*pow( sun, 20.0 );

    // clouds
    vec4 res = raymarch( ro, rd, col );
    col = col*(1.0-res.w) + res.xyz;

    // sun glare
	col += 0.1*vec3(0.949,0.757,0.525)*pow( sun, 3.0 );

    return col;
}


// =========== Ship Calculations ===========

float time;
vec3 shippos;
mat3 shipltow;
mat2 shiptilt;

// the flight path

vec3 shippath( float t )
{
    return vec3( 5.*sin( 0.9*t ), 2.5*sin( 0.6*t ), 0. );
}

vec3 shipvel( float t )
{
    return vec3( 5.*0.9*cos( 0.9*t ), 2.5*0.6*cos( 0.6*t ), 15. );
}

vec3 shipacc( float t )
{
    return vec3( -4.*0.9*0.9*sin( 0.9*(t)), -2.5*0.6*0.6*sin( 0.6*t ), 0. );
}


// distance functions for basic shapes

float sdPlane( vec3 p, vec4 n ) { return dot(p,n.xyz) + n.w; }

float sdSphere( vec3 p, float s ) { return length(p)-s; }

float sdBox( vec3 p, vec3 b ) { vec3 d = abs(p) - b; return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0)); }

float sdHexPrism( vec3 p, vec2 h ) { vec3 q = abs(p); return max(q.z-h.y,max((q.x*0.866025+q.y*0.5),q.y)-h.x); }

float sdCapsule( vec3 p, vec3 a, vec3 b, float r ) { vec3 pa = p-a, ba = b-a; return length( pa - ba*clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 )) - r; }

float sdConeSection( in vec3 p, in float h, in float r1, in float r2 )
{
    float d1 = -p.y - h;
    float q = p.y - h;
    float si = 0.5*(r1-r2)/h;
    float d2 = max( sqrt( dot(p.xz,p.xz)*(1.0-si*si)) + q*si - r2, q );
    return length(max(vec2(d1,d2),0.0)) + min(max(d1,d2), 0.);
}

float length8( vec3 d ) { vec3 q = pow( d, vec3(8.) ); return pow( q.x + q.y + q.z, 0.125 ); }

float sdTorus82( vec3 p, vec2 t ) { vec2 q = vec2(length(p.xz)-t.x,p.y); return length8(vec3(q,0.))-t.y; }

float sdCylinder( vec3 p, vec3 c ) { return length(p.xz-c.xy)-c.z; }

float sdCappedCylinder( vec3 p, vec2 h ) { vec2 d = abs(vec2(length(p.xz),p.y)) - h; return min(max(d.x,d.y),0.0) + length(max(d,0.0)); }

vec2 min2( vec2 d1, vec2 d2 ) { return ( d1.x < d2.x ) ? d1 : d2; }

vec2 max2( vec2 d1, vec2 d2 ) { return ( d1.x > d2.x ) ? d1 : d2; }

float smin( float a, float b, float k ) { float h = clamp( 0.5+0.5*(b-a)/k, 0.0, 1.0 ); return mix( b, a, h ) - k*h*(1.0-h); }

vec2 smin( vec2 a, vec2 b, float k ) { float h = clamp( 0.5+0.5*(b.x-a.x)/k, 0.0, 1.0 ); return mix( b, a, h ) - k*h*(1.0-h); }


// texture functions

float noise( float s )
{
    vec2 uv = vec2( s, s );
    return texture( iChannel0, uv ).x;
}

float cubicPulse( float c, float w, float x )
{
    x = abs(x - c);
    if( x>w ) return 0.0;
    x /= w;
    return 1.0 - x*x*(3.0-2.0*x);
}

// plate texture
float texPlates( vec2 uv )
{
    vec2 n = vec2( 10., 4. );
    vec2 sec = floor( uv*n );
    vec2 suv = uv*n - sec;

    float s1 = noise( 0.3*( uv.x + sec.y/n.y ) );
    float s2 = 0.3*s1+0.5;
    float s3 = noise( 0.4*sec.y/n.y );
    float luma = 0.5*(1. - cubicPulse( s3, 0.03, suv.x )) + 0.5;
    luma *= mix(1.0, s2, smoothstep(0.0, 1.0, suv.y));
    luma *= 0.5*smoothstep( 0.0, 0.005*n.y, min( suv.y, 1.-suv.y)) + 0.5;
	return clamp(luma, 0., 1.);
}

// circular hull texture
vec3 texHull( vec3 p )
{
    vec2 uv;
    uv.x = atan(p.z, p.x)/PI;
    float d = length(p.xz);
    uv.y = 0.925 - 0.5*d;
    vec3 shipCol1 = 0.9*vec3(0.729, 0.694, 0.627);
    vec3 shipCol2 = 0.4*vec3(0.6, 0.537, 0.447);
    return texPlates( uv ) * mix(shipCol1, shipCol2, cubicPulse( 0., 0.5, uv.x ));
}

// ship world to local transformation

vec3 shipw2l( vec3 p )
{
    p.z = -p.z;
    p = shipltow*(p - shippos);
    p.zy *= shiptilt;
	return p;
}

// ship distance evaluation where p is in world coords

vec2 shipDE(vec3 p)
{
    float d1, d2, d3, d4;
    p = shipw2l( p );
    d1 = sdSphere( p, 3.3 ); // the bounding 'hit' sphere
    if ( d1 > 0.2 ) return vec2( d1, 0. );

    // main disk
    vec3 q = p;
    q.y = abs(q.y);
	d1 = sdSphere( q + vec3( 0., 14.78, 0. ), 15. );
    d1 = max( d1, sdSphere( q, 2. ));
    d1 = max( -q.y + 0.06, d1 );
	d2 = max(  q.y - 0.06, sdSphere( q, 1.95 ));
    vec2 vres = vec2( min( d1, d2 ), 1.);

    // centre pylon
    vres = smin( vres, vec2( sdCappedCylinder( p, vec2( 0.45, 0.28 )), 2.), 0.1);

    // front forks
    q = p;
    q.z = abs(q.z);
    q += vec3(1.45, 0., -1.1);
    float front = sdBox( q, vec3( 1.8, 0.09, 0.8 )); // front
    vec3 norm = normalize(vec3(-1.1, 0.0, 2.3));
    q = p;
    q.z = abs(q.z);
    float plane = sdPlane( q, vec4(-norm, 1.92) );
    d1 = max( -plane, front );
    vres = min2( vres, vec2( d1, 3. ));

    // Z crossbar
    d1 = sdHexPrism( p, vec2( 0.26, 2.0 ));
    d2 = sdBox( p, vec3( 0.8, 0.8, 0.6 ));
    vres = min2( vres, vec2( max( -d2, d1 ), 4.));

    // X crossbar
    q = p;
    q.y = abs(q.y);
    q = ry90 * rotZ(0.07) * q + vec3( 0., 0.02, -1.5);
    vres = min2( vres, vec2( max( -abs(p.y) + 0.07, sdHexPrism( q, vec2(0.36, 0.9 ))), 5.));

    // cockpit walkway
    vec3 p1 = vec3(-0.8*sin(0.524), 0.1, -0.8*cos(0.524));
    vec3 p2 = vec3(-2.1*sin(0.524), 0.07, -2.1*cos(0.524));
    vec3 p3 = p2 + vec3(-0.2, 0., 0.);
    vres = min2( vres, vec2( sdCapsule( p, p1, p2, 0.18 ), 6.));
    vres = min2( vres, vec2( sdCapsule( p, p2, p3, 0.18 ), 6.1));

    // cockpit
    q = rz90*(p - p3 + vec3(0.2, 0., 0.));
    vres = min2( vres, vec2( sdConeSection( q, 0.15, 0.18, 0.08), 7. ));

    // side cylinders
    q = vec3( 0., 3.87, 0. );
    q = mod( rx90 * p, q ) - 0.5*q;
    vres = max2( vres, vec2( -sdTorus82( q, vec2( 0.26, 0.09 )), 8.));

    // exhaust ports
    p1 = vec3(0.75, 0., 0.);
    p2 = vec3(0.45, 0., 0.);
    q = p - p1;
    vres = smin( vres, vec2( sdCappedCylinder( q, vec2( 0.14, 0.255 )), 9.), 0.044);
    q -= p2;
    vres = smin( vres, vec2( sdCappedCylinder( q, vec2( 0.14, 0.225 )), 9.), 0.044);
	q = p;
    q.z = -abs(q.z); // reflect
    q = rotY(0.45)*q - p1;
    vres = smin( vres, vec2( sdCappedCylinder( q, vec2( 0.14, 0.255 )), 9.), 0.044);
    q -= p2;
    vres = smin( vres, vec2( sdCappedCylinder( q, vec2( 0.14, 0.225 )), 9.), 0.044);

    // gun port
    q = p + vec3(0.22, 0., 0.);
    vres = min2( vres, vec2( sdCappedCylinder( q, vec2( 0.14, 0.32 )), 9.));

    // gun
    p1 = vec3(-0.22, 0., 0.);
    p2 = p1 + vec3( 0., 0.35, 0.0);
    p3 = vec3(-0.22, 0.33, 0.03);
    vec3 p4 = p3 + vec3(-0.25, 0.04, 0.);
    vec3 p5 = vec3(0., 0.03, 0.);
    q = p;
    q.z = abs(q.z);
    q.y = abs(q.y);
    d1 = sdCapsule( q, p1, p2, 0.06 ); // gun pod
    d1 = min( d1, sdCapsule( q, p3, p4, 0.01 )); // gun 1
    d1 = min( d1, sdCapsule( q, p3 + p5, p4 + p5, 0.01 )); // gun 2
    vres = min2( vres, vec2( d1, 10.));

    // upper dish
    p1 = vec3( -1.1, 0.4, 0.83 );
    p2 = p1 - vec3( -0.05, 0.0, 0.0 );
    p3 = p2 - vec3( -0.1, 0.25, 0.0 );
    q = p - p1;
    d1 = sdSphere( q, 0.2 );
    q = q + vec3( 0.75, -0.1, 0.0 );
    d2 = sdSphere( q, 0.8 );
	d3 = sdSphere( q, 0.81 );
    d4 = sdCapsule( p, p2, p3, 0.03 );
    vres = min2( vres, vec2( min( d4, max( d3, max( -d2, d1 ))), 10.));

    return vres;
}

// ray marching and rendering

vec2 shipCastRay( in vec3 ro, in vec3 rd )
{
  float tmin = 1.0;
  float tmax = 20.0;

  const float precis = 0.001;
  float t = tmin;
  float m = -1.0;

  for( int i=0; i<50; i++ )
  {
    vec2 res = shipDE( ro+rd*t );
    if( res.x<precis || t>tmax )
      break;
    t += res.x;
    m = res.y;
  }

  if ( t>tmax )
    m=-1.0;
  return vec2( t, m );
}


float softshadow( in vec3 ro, in vec3 rd, in float mint, in float tmax )
{
	float res = 1.0;
  float t = mint;
  for( int i=0; i<16; i++ )
  {
      float h = shipDE( ro + rd*t ).x;
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

  shipDE(pos+eps.xyy).x - shipDE(pos-eps.xyy).x,
  shipDE(pos+eps.yxy).x - shipDE(pos-eps.yxy).x,
  shipDE(pos+eps.yyx).x - shipDE(pos-eps.yyx).x );

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
    float dd = shipDE( aopos ).x;
    occ -= (dd-hr)*sca;
    sca *= 0.95;
  }
  return clamp( 1.0 - 3.0*occ, 0.0, 1.0 );
}

vec3 shipRender( in vec3 ro, in vec3 rd, in vec3 col )
{
    vec2 res = shipCastRay(ro,rd);
    float t = res.x;
    float m = res.y;
    if( m >-0.5 )
    {
        vec3 pos = ro + t*rd;
        vec3 nor = calcNormal( pos );
        vec3 ref = reflect( rd, nor );
        vec2 uv = vec2(0.);
        float luma = 0.;

        vec3 shipCol = 0.9*vec3(0.729, 0.694, 0.627);//vec3(0.5, 0.45, 0.45);

        vec3 q = shipw2l( pos );
        bool isExhaust = false;

        if ( abs(q.y) < 0.06 && m < 3.5 )
        {
          if (q.x < 1.6)
            col = mix(vec3(0.1), shipCol, 0.5 * texture( iChannel0, 0.2*q.xy ).x);
          else
            isExhaust = true;
        }
        else if ( m < 1.1 ) // main disk
        {
          col = texHull( q );
        }
        else if ( m < 2.1 ) // centre pylon
        {
            q = 1.5*(q + vec3(0.22, 0., 0.));
			uv.x = 0.5*(atan(q.z, q.x)/PI);
			uv.y = 1. - length(q.xz);
            luma = texPlates( uv );
        	col = luma * shipCol;
        }
        else if ( m < 3.1 ) // front forks
        {
            uv.x = 0.3*abs(q.z);
            uv.y = 0.25*q.x+0.4;
            luma = texPlates( uv );
        	col = luma * shipCol;
        }
        else if ( m < 4.1 ) // Z crossbar
        {
            uv.x = 0.5*q.x;
            uv.y = -0.8*abs(q.z);
            float luma = texPlates( uv );
        	col = luma * shipCol;
        }
        else if ( m < 5.1 ) // X crossbar
        {
            uv.x = 0.5*q.z;
            uv.y = q.x;
            if (abs(q.z) < 0.12 && abs(q.x) > 0.8 && abs(q.x) < 2.3)
            {
                uv.y *= 0.5;
                col = shipCol * mix( 0.5, 1., 0.5 * texture( iChannel0, 0.2*uv ).x);
            } else
                col = shipCol * texPlates( uv );
        }
        else if ( m < 6.6 ) // cockpit walkway
        {
            uv = rot(0.524)*q.xz;
            uv.x = 0.5*uv.x;
            uv.y = uv.y;
            luma = texPlates( uv );
        	  col = luma * shipCol;
        }
        else if ( m < 7.1 ) // cockpit
        {
            if ( q.y > 0.12 )
              col = vec3(0.03);
            else
              col = shipCol;
        } else if ( m < 8.1 ) // side ports
        {
            col = shipCol;
        } else if ( m < 9.9 ) // exhaust ports and gun port
        {
            col = vec3(0.05);
        } else
        {
          col = shipCol;
        }

        if ( isExhaust )
        {
          // ship exhaust
          float blume = pow( clamp( dot(nor,-rd), 0.0, 1.0), 10. );
          col = clamp( blume + vec3( 0.215, 0.945, 1. ) * (0.5 * cos( 80.*q.z ) + 0.5), 0., 1.);
        }
        else
        {
          // ship hull lighting
          float occ = calcAO( pos, nor );
          vec3  lig = sundir;
          float amb = clamp( 0.5+0.5*nor.y, 0.0, 1.0 );
          float dif = clamp( dot( nor, lig ), 0.0, 1.0 );
          float bac = clamp( dot( nor, normalize(vec3(-lig.x,0.0,-lig.z))), 0.0, 1.0 )*clamp( 1.0-pos.y,0.0,1.0);
          float dom = smoothstep( -0.1, 0.1, ref.y );
          float fre = pow( clamp( 1.0+dot(nor,rd),0.0,1.0), 2.0 );
          float spe = pow( clamp( dot( ref, lig ), 0.0, 1.0 ), 16.0 );

          dif *= softshadow( pos, lig, 0.02, 2.5 );
          dom *= softshadow( pos, ref, 0.02, 2.5 );

          vec3 brdf = vec3(0.0);
          brdf += 1.20*dif*vec3(1.00,0.90,0.60);
          brdf += 1.10*spe*vec3(1.00,0.90,0.60)*dif;
          brdf += 0.30*amb*vec3(0.50,0.70,1.00)*occ;
          brdf += 0.40*dom*vec3(0.50,0.70,1.00)*occ;
          brdf += 0.30*bac*vec3(0.25,0.25,0.25)*occ;
          brdf += 0.40*fre*vec3(1.00,1.00,1.00)*occ;
          brdf += 0.02;
          col = clamp(col*brdf, 0.0, 1.0);

          // Gamma correction
          col = pow( col, vec3(0.4545) );
        }
    }

	return col;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 q = fragCoord.xy/iResolution.xy;
  vec2 p = -1.0+2.0*q;
	p.x *= iResolution.x/iResolution.y;
// vec2 md = iMouse.xy/iResolution.xy - 0.5;

  // render clouds and sky
  speed = iTime * SPEED;

  vec3  ro = 4.0*normalize(vec3( 0.0, 0.3, 5.0));
  vec3  ta = vec3(0.0, -1.0, 0.0);
  mat3  ca = setCamera( ta - ro );
  vec3  rd = ca * normalize( vec3(p.xy,1.0) );
  vec3 col = cloudRender( ro, rd );

    // animate
	time = iTime;
	shippos    = shippath( time );
  vec3 shipv = shipvel( time );
  vec3 shipa = shipacc( time );

	// camera
  //ro = rotY(2.*PI*md.x) * rotX(-0.99*PI*md.y) * vec3( 0.0, 0.0, 9.);
  ro = vec3( 0.0, 0.0, 5.*sin( 0.5*time ) + 13.);

  // camera-to-world transformation
  ca = setCamera( ta - ro );

  // ship direction
  shiptilt = rot( 0.4*shipa.x );
  shipltow = ry90 * setCamera( -normalize( shipv ) );

  // ray direction
  rd = ca * normalize( vec3(p.xy, 1.0) );

  // render ship
  col = shipRender( ro, rd, col );

  fragColor = vec4(col, 1.);

 // fragColor = texture( iChannel0, p );

  // fragColor = vec4( 1. );
}