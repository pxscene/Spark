px.import({       scene: 'px:scene.1.js'
}).then( function importsAreReady(imports)
{
  var scene = imports.scene;
  var root  = imports.scene.root;
  var base  = px.getPackageBaseFilePath();

  var rock   = scene.create({ id: "RockTiles",  t: 'imageResource', url: base + "/images/RockTiles.png"   });

  var hasShaders = true;

  if( scene.capabilities                  == undefined ||
      scene.capabilities.graphics         == undefined ||
      scene.capabilities.graphics.shaders == undefined ||
      scene.capabilities.graphics.shaders < 1)
  {
    // If Shader is not supported...
    hasShaders = false;
    throw "EXPCEPTION - Shaders are not supported in this version of Spark..."
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  var image  = scene.create({ t: 'image', parent: root, resource: rock, interactive: false });
  var output = scene.create({ t: 'rect',  parent: root, w: scene.w, h: scene.h, fillColor: "#888" });

  var shader = scene.create({
    t: 'shaderResource',
    fragment: base + "/shaders/Sanctuary.frg",
    uniforms:
    {
      "u_time"      : "float",
      // texture samplers
      "s_texture" : "sampler2D"
    } });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  Promise.all([output.ready, image.ready, shader.ready])
  .then( () =>
  {
    console.log("#######  UPDATE SHADER");

    output.effect =
    {
        name: "Textured",
      shader: shader,
    uniforms: {
                s_texture: rock
              }
    };
  });

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

}).catch(function importFailed(err) {
  console.error('Import for Sanctuary.js failed: ' + err);
});