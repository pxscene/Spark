'use strict';

let imports = {
  scene: 'px:scene.1.js'
};

const importsPromise = px.import(imports);

importsPromise.then(im => imports = im);

module.exports.getStorage = () => imports.scene.storage;
