px.import({       scene: 'px:scene.1.js'
}).then( function importsAreReady(imports)
{
  var scene = imports.scene;
  var root  = imports.scene.root;
  var base  = px.getPackageBaseFilePath();

  var fragmentSrc = `uniform vec2  u_resolution;
                      varying vec2  v_uv;

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
                        color += texture2D(image, uv + (off2 / resolChrution)) * 0.09447039785044732;
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

                        // gl_FragColor = blur5(s_texture, v_uv, u_resolution, u_direction );


                        // gl_FragColor = blur13(s_texture, v_uv, u_resolution, vec2(0, 2.5) );
                        // vec4 px1 = texture2D(s_texture, v_uv);
                        // vec4 px2 = vec4(1.0, 0.0, 0.0, 1.0);
                        // gl_FragColor = mix(px1, px2, 0.5);
                      }`;

  var rect  = scene.create({ id: "myRect",  t: 'rect', parent: root, fillColor: '#ff8', x: 10, y: 10, w: 1260, h: 700, cx: 1260/2, cy: 700/2, interactive: false});
  var image = scene.create({ id: "myImage", t: 'image', parent: rect, x: 100, y: 100, sx: 0.5, sy: 0.5, url: base + "/bbc_test.png", interactive: false });
    // var text  = scene.create({ t: 'text', x:20, y: 20,  w: 800, h: 20, parent: rect,
    //                 pixelSize: 54, textColor:'#000', text:  'Resource Testing 123 !!', interactive: false });

  var text0  = scene.create({ t: 'text', x:120, y: 220,  w: 300, h: 60, parent: image,
    pixelSize: 94, textColor:'#00F', text:  'Blurry !!', interactive: false });

  var fx0 = null;
  var fx1 = null;

    image.ready.then( () =>
    {
      image.w = image.resource.w;
      image.h = image.resource.h;
    })

  var kernelRadius = 0;
  var blurAmount   = 0;

  setTimeout( () =>
  {
       // http://127.0.0.1/testShaderUrl.js

      fx1 = scene.create({  t:'shaderResource',
         //   vertex: base + "/testShaderV.txt",
        //  fragment: "data:text/plain," + fragmentSrc,
        // fragment: base + "/testShaderF.txt",
        fragment: "http://127.0.0.1/testShaderF.txt",
        uniforms:
              {
                  "u_direction"   : "vec2",
                  "u_kernelRadius": "float",
                  "s_texture"     : "sampler2D"
              } });

              fx1.ready.then( () =>
              {
                  // fx1.u_resolution = [image.w, image.h];
                  // fx1.u_kernelRadius = 1;
                  // fx1.u_direction  = [0, 1.5];

              //    image.effect = fx1;// [fx1, fx1, fx1];
/*
                image.effect =
               //  [
                  {  "shader": fx1,
                    "uniforms": [
                                { u_direction:    [blurAmount,0] },  // HORIZONTAL
                                { u_kernelRadius: kernelRadius   }
                              ]
                  };
                //    {  shader: fx1,
                //     uniforms: [
                //                 { u_direction:    [0, blurAmount] },  // VERTICAL
                //                 { u_kernelRadius: kernelRadius   }
                //               ]
                //    }
                //  ];
*/
              setInterval( () =>
              {
                    if(false) // DIRECT
                    {
                      fx1.u_direction    = [blurAmount,0]; //[0, blurAmount];
                      fx1.u_kernelRadius = kernelRadius;

                      console.log(" BLUR MORE ... Amount: " + blurAmount + " Radius: " + kernelRadius);

                      image.effect = fx1; // force redraw
                    }


                    blurAmount  += 0.1;
                    kernelRadius = Math.max(1, blurAmount /4);


                    if(true) // OBJECT
                    {
                      if(true)
                      {
                        image.effect =
                        {
                            name: "Pass 0",
                          shader: fx1,
                        uniforms: [
                                    { u_kernelRadius: kernelRadius   },
                                    { u_direction:    [blurAmount,0] },  // HORIZONTAL
                                  ]
                        };
                      }
                      else // ARRAY
                      {

                        image.effect =
                        [
                          {
                              name: "Pass 1",
                            shader: fx1,
                          uniforms: [
                                      { u_kernelRadius: kernelRadius   },
                                      { u_direction:    [blurAmount, 0] }  // HORIZONTAL
                                    ]
                          },
                          {
                              name: "Pass 2",
                            shader: fx1,
                          uniforms: [
                                      { u_kernelRadius: 4.8   },
                                      { u_direction:    [0, blurAmount] }  // VERTICAL
                                    ]
                          }
                        ];
                      }//FALSE
                    }//ENDIF
              },200);

              }); // READY

      }, 2000);

}).catch(function importFailed(err) {
  console.error('Import for testShadeUrl.js failed: ' + err);
});