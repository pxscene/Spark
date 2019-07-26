px.import({       scene: 'px:scene.1.js'
}).then( function importsAreReady(imports)
{
  module.exports.wantsClearscreen = function()
  {
    return true; // return 'false' to skip system black/blank draw
  };

  var scene = imports.scene;
  var root  = imports.scene.root;

  if( scene.capabilities                  == undefined ||
      scene.capabilities.graphics         == undefined ||
      scene.capabilities.graphics.shaders == undefined ||
      scene.capabilities.graphics.shaders < 1)
  {
    // If Shader is not supported...
    throw "EXPCEPTION - Shaders are not supported in this version of Spark..."
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  var frag_src = `data:text/plain,

                varying vec2 v_uv;

                uniform vec2        u_resolution;
                uniform float       u_time;
                uniform sampler2D   s_texture;

                void main()
                {
                  // Time varying pixel color
                  vec3 col = 0.5 + 0.5 * cos(u_time + v_uv.xyx + vec3(0,2,4));

                  // Output to screen
                  gl_FragColor = vec4(col,1.0);
                }
                `;

   // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  var ww = scene.w;
  var hh = scene.h;

  var xx = ww * 0.50;
  var yy = hh * 0.50;

  const spark_svg = "data:image/svg," + '<svg height="571" viewBox="0 0 575.806 571" width="575.806" xmlns="http://www.w3.org/2000/svg"><path d="m83.797 283.5-80.912-140.5 80.912-140.5h161.826l80.913 140.5-80.913 140.5z" fill="#e6e7e8" stroke="#5d6d65" stroke-width="5"/><path d="m101.463 252-63.262-109 63.262-109h126.495l63.262 109-63.262 109z" fill="#f16268" opacity=".75"/><path d="m223.755 41 59.044 102-59.044 102h-118.089l-59.044-102 59.044-102h118.414m8.081-15h-8.406-118.089-8.406l-4.21 7.454-59.045 102.116-4.226 7.346 4.226 7.323 59.044 102.256 4.211 7.505h8.406 118.089 8.406l4.21-7.493 59.044-102.137 4.226-7.355-4.226-7.328-59.043-102.219z" fill="#5d6d65"/><path d="m83.799 568.5-80.912-140.5 80.912-140.5h161.826l80.914 140.5-80.914 140.5z" fill="#e6e7e8" stroke="#5d6d65" stroke-width="5"/><path d="m101.465 533-63.262-109.499 63.262-109.501h126.496l63.262 109.501-63.262 109.499z" fill="#faef5f" opacity=".75"/><path d="m223.758 321 59.044 102.001-59.044 101.999h-118.09l-59.044-101.999 59.044-102.001h118.412m8.084-14h-8.406-118.09-8.406l-4.21 7.181-59.044 101.98-4.226 7.278 4.226 7.289 59.043 102.012 4.21 7.26h8.406 118.09 8.406l4.21-7.267 59.044-102.021 4.226-7.299-4.226-7.3-59.044-101.933z" fill="#5d6d65"/><path d="m330.181 425.5-80.913-140 80.913-140h161.824l80.913 140-80.913 140z" fill="#e6e7e8" stroke="#5d6d65" stroke-width="5"/><path d="m347.846 394-63.263-109.5 63.263-109.5h126.495l63.262 109.5-63.262 109.5z" fill="#f89958" opacity=".75"/><path d="m470.138 182 59.044 102-59.044 102h-118.089l-59.044-102 59.044-102h118.031m8.464-14h-8.406-118.089-8.406l-4.21 7.205-59.044 101.992-4.226 7.283 4.226 7.292 59.044 101.99 4.21 7.237h8.406 118.089 8.406l4.21-7.242 59.044-102.011 4.226-7.292-4.226-7.297-59.044-101.954z" fill="#5d6d65"/><path d="m285.83 428-22.434-39 22.434-39h44.867l22.434 39-22.434 39z" fill="#5d6d66"/><path d="m207.694 272.275 47.116-27.195 74.838 129.592-47.116 27.196z" fill="#5c6d65"/><path d="m97.708 312-15.824-27 15.824-27h31.646l15.824 27-15.824 27z" fill="#5d6d66"/><path d="m115.58 258.5h150v54h-150z" fill="#5c6d65"/><path d="m297.438 197-15.824-27 15.824-27h31.646l15.824 27-15.824 27z" fill="#5d6d66"/><path d="m254.324 325.59-47.116-27.195 74.838-129.593 47.116 27.196z" fill="#5c6d65"/></svg>';
  const spark_res = scene.create({ t: "imageResource", url: spark_svg, w: 512, h: 512});

  var bg    = scene.create({ t: 'rect',   parent: root, x: 0,  y: 0,  w: ww,  h: hh, fillColor: '#126', interactive: false});
  var image = scene.create({ t: 'image',  parent: root, x: xx, y: yy, w: 512, h: 512, px: 0.5, py: 0.5, resource: spark_res,          interactive: false });

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  var colorsShader   = scene.create({
        t: 'shaderResource',
    fragment: frag_src,
    uniforms:
    {
      "u_time"     : "float",
      "s_texture"  : "sampler2D",
    }
    });

  colorsShader.ready.then( () =>
  {
    bg.effect = { shader: colorsShader };
  });

  scene.on("onResize", function (e)
  {
    updateSize(e.w, e.h);
  });

  function updateSize(w, h)
  {
    bg.w = w;
    bg.h = h;

    image.x = w/2;
    image.y = h/2;
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

}).catch(function importFailed(err) {
  console.error('Import for CloudScene.js failed: ' + err);
});
