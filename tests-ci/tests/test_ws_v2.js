'use strict';

let imports = {
  scene: 'px:scene.1.js',
  ws: 'ws',
  assert: '../test-run/assert.js',
  manual: '../test-run/tools_manualTests.js'
};

const importsPromise = px.import(imports);

module.exports.beforeStart = () => importsPromise;

importsPromise.then(im => {
  imports = im;
  imports.assert = imports.assert.assert;
  if (imports && imports.manual.getManualTestValue() === true) {
    imports.manual.runTestsManually(module.exports.tests, module.exports.beforeStart);
  }
});

const child_url = `${px.getPackageBaseFilePath()}/helpers/test_childAppWs.js`;
const echo_server_url = 'wss://echo.websocket.org';
const echo_message = 'something';
const timeout_ms = 30000;

module.exports.tests = {};

/**
 * WS echo server sends correct message, socket closes correctly.
 * @returns {Promise<string>}
 */
module.exports.tests.test_echo = () => {
  return new Promise(resolve => {
    let got_message = false;
    setTimeout(() => resolve(imports.assert(false, 'timeout')), timeout_ms);

    const s = new imports.ws(echo_server_url);
    s.on('open', () => s.send(echo_message));
    s.on('message', data => {
      if (data !== echo_message) {
        resolve(imports.assert(false, `message: ${data}`))
      } else {
        got_message = true;
        s.closeimmediate();
      }
    });
    s.on('close', () => resolve(imports.assert(got_message, 'disconnected')));
    s.on('error', e => resolve(imports.assert(false, `error: ${e}`)));
  });
};

/**
 * WS socket closes when scene closes.
 * @returns {Promise<string>}
 */
module.exports.tests.test_close = () => {
  return new Promise(resolve => {
    setTimeout(() => resolve(imports.assert(false, 'timeout')), timeout_ms);

    let c = imports.scene.create({
      t: 'scene',
      parent: imports.scene.root, w: imports.scene.w, h: imports.scene.h,
      url: child_url
    });

    return c.ready.then(app => {
      const s = app.api.getWs(echo_server_url);
      s.on('open', () => { let x = c; c = null; x.remove(); x.dispose() });
      s.on('close', () => resolve(imports.assert(c === null, 'disconnected')));
      s.on('error', e => resolve(imports.assert(false, `error: ${e}`)));
    }).catch(() => imports.assert(false, 'close test failed'));
  });
};
