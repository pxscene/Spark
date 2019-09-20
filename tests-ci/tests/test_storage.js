'use strict';

let imports = {
  scene: 'px:scene.1.js',
  assert: '../test-run/assert.js',
  manual: '../test-run/tools_manualTests.js'
};

module.exports.tests = {};

module.exports.tests.storagefoo = () => {
  return Promise.resolve(true);
};
