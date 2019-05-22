"use strict";

px.import("px:scene.1.js").then(function (scene) {

  if (scene.capabilities.graphics.gif != 1)
   	{
	console.error("Gif support is disabled");
	return;
	}
  var basePackageUri = "http://www.sparkui.org/examples/gallery/";px.getPackageBaseFilePath();
  var url = basePackageUri + "/images/gifs/Spark_equalizerSVG.gif";

  var imgres = scene.create({t:'imageAResource', url:url, parent: scene.root});
  
  var i = scene.create({ t: "imageA", resource:imgres,  w:400, h:225, stretchX:1, stretchY:1, parent: scene.root });
  var it = void 0;
  i.ready.then(function (imgres) {
    
    var iw = scene.create({ t: "imageA", url: url, parent: scene.root, stretchX: 1 });
    iw.ready.then(function (o) {
      iw.x = i.w;iw.w = i.w * 2;
    });
    var ih = scene.create({ t: "imageA", url: url, parent: scene.root, stretchY: 1 });
    ih.ready.then(function (o) {
      ih.y = i.h;ih.h = i.h * 2;
    });
    it = scene.create({ t: "imageA", url: url, parent: scene.root, stretchX: 2, stretchY: 2 });
    it.ready.then(function (o) {
      it.x = i.w;it.y = i.h;it.x = i.w;it.w = i.w * 2;it.y = i.h;it.h = i.h * 2;
    });
  });

  scene.root.on("onChar", function (e) {
    if (it) {
      switch (e.charCode) {
        case '0'.charCodeAt(0):
          it.stretchX = 0;it.stretchY = 0;
          break;
        case '1'.charCodeAt(0):
          it.stretchX = 1;it.stretchY = 1;
          break;
        case '2'.charCodeAt(0):
          it.stretchX = 2;it.stretchY = 2;
          break;
      }
    }
  });
}).catch(function (e) {
  console.error("Import failed for fancy.js: " + e);
});
