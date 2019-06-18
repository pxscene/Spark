'use strict';

let imports = {
  scene: 'px:scene.1.js',
  ws: 'ws',
};

const importsPromise = px.import(imports);

importsPromise.then(im => imports = im);

module.exports.getWs = url => new imports.ws(url);
