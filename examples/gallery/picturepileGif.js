"use strict";

px.import("px:scene.1.js").then(function (scene) {

  if (scene.capabilities.graphics.gif != 1)
   	{
	console.error("Gif support is disabled");
	return;
	}
  var basePackageUri =  px.getPackageBaseFilePath();
  function randomInt(from, to) {
	var range = to-from;
	return Math.round(Math.random()*range + from);
}
function getImageURL() {
  var urls = [
    "IMG_1.gif",
    "IMG_2.gif",
    "IMG_3.gif",
    "IMG_4.gif",
    "IMG_5.gif",
    "IMG_6.gif",
    "IMG_7.gif",
    "IMG_8.gif",
    "IMG_9.gif",
    "IMG_10.gif",
    "IMG_11.gif",
    "IMG_12.gif"
  ];
	return basePackageUri+"/images/gifs/"+
    urls[randomInt(0,urls.length-1)];
}

  var i = scene.create({ t: "imageA", url: getImageURL(), parent: scene.root });
  var it = void 0;

  i.ready.then(function () {
    var iw = scene.create({ t: "imageA", url: getImageURL(), parent: scene.root, stretchX: 1 });
    iw.ready.then(function (o) {
      iw.x = i.w;iw.w = i.w * 2;
    });
    var ih = scene.create({ t: "imageA", url: getImageURL(), parent: scene.root, stretchY: 1 });
    ih.ready.then(function (o) {
      ih.y = i.h;ih.h = i.h * 2;
    });
    it = scene.create({ t: "imageA", url: getImageURL(), parent: scene.root, stretchX: 2, stretchY: 2 });
    it.ready.then(function (o) {
      it.x = i.w;it.y = i.h;it.x = i.w;it.w = i.w * 2;it.y = i.h;it.h = i.h * 2;
    });
  });
  
}).catch(function (e) {
  console.error("Import failed for fancy.js: " + e);
});
