'use strict';

let imports = {
  scene: 'px:scene.1.js',
  ws: 'ws',
  assert: '../test-run/assert.js',
  manual: '../test-run/tools_manualTests.js'
};

module.exports.tests = {};

module.exports.tests.wsfoo = () => {
  return Promise.resolve(true);
};
