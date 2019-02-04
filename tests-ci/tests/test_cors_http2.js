px.import({
  scene: 'px:scene.1.js',
  http2: 'http2',
  url: 'url',
  assert: '../test-run/assert.js',
  manual: '../test-run/tools_manualTests.js'
})
.then(imports => {

  const http2 = imports.http2;
  const URL = imports.url;
  const assert = imports.assert.assert;
  const manual = imports.manual;
  const manualTest = manual.getManualTestValue();
  const this_url = px.getPackageBaseFilePath();
  const agent = new http2.Agent();

  const testURL = 'https://server.test-cors.org/server?id=8470626&status=200';
  const testCookie = '__utma=11676977.838379967.1534154213.1534154213.1534154213.1;';
  const custOriginParam = 'response_headers=Access-Control-Allow-Origin%3A%20';

  module.exports.http_request = (url, cookie) => {
    return new Promise((resolve, reject) => {
      let opt = URL.parse(url);
      opt.agent = agent;
      if (cookie) {
        opt.headers = {cookie:cookie};
      }
      let req = http2.request(opt, resolve);
      req.on('response', resolve);
      req.on('error', reject);
      req.on('blocked', reject);
      req.end();
    });
  };

  module.exports.tests = {
    passOriginAllowed: () => {
      return new Promise(resolve => {
        module.exports.http_request(`${testURL}&enable=true&credentials=false`).then(() => {
          resolve(assert(true));
        }, e => {
          resolve(assert(false, `blocked ${e}`));
        });
      });
    },
    passAnonymousNoCredentials: () => {
      return new Promise(resolve => {
        module.exports.http_request(`${testURL}&enable=true&credentials=false&${custOriginParam}%2A`).then(() => {
          resolve(assert(true));
        }, e => {
          resolve(assert(false, `blocked ${e}`));
        });
      });
    },
    passNullNoCredentials: () => {
      return new Promise(resolve => {
        module.exports.http_request(`${testURL}&enable=true&credentials=false&${custOriginParam}null`).then(() => {
          resolve(assert(true));
        }, e => {
          resolve(assert(false, `blocked ${e}`));
        });
      });
    },
    blockFoobarAllowed: () => {
      return new Promise(resolve => {
        module.exports.http_request(`${testURL}&enable=true&credentials=false&${custOriginParam}foo.bar`).then(() => {
          resolve(assert(false, 'not blocked'));
        }, () => {
          resolve(assert(true));
        });
      });
    },
    blockEmptyAllowed: () => {
      return new Promise(resolve => {
        module.exports.http_request(`${testURL}&enable=true&credentials=false&${custOriginParam}`).then(() => {
          resolve(assert(false, 'not blocked'));
        }, () => {
          resolve(assert(true));
        });
      });
    },
    blockServerSentNoHeaders: () => {
      return new Promise(resolve => {
        module.exports.http_request(`${testURL}&enable=false&credentials=false`).then(() => {
          resolve(assert(false, 'not blocked'));
        }, () => {
          resolve(assert(true));
        });
      });
    },
    passWithCredentials: () => {
      return new Promise(resolve => {
        module.exports.http_request(`${testURL}&enable=true&credentials=true`, testCookie).then(() => {
          resolve(assert(true));
        }, e => {
          resolve(assert(false, `blocked ${e}`));
        });
      });
    },
    blockWithCredentialsServerSentNoCredentialsHeaders: () => {
      return new Promise(resolve => {
        module.exports.http_request(`${testURL}&enable=true&credentials=false`, testCookie).then(() => {
          resolve(assert(false, 'not blocked'));
        }, () => {
          resolve(assert(true));
        });
      });
    },
    passSameOrigin: () => {
      return new Promise(resolve => {
        if (this_url && this_url.indexOf('http') === 0) {
          module.exports.http_request(this_url).then(() => {
            resolve(assert(true));
          }, e => {
            resolve(assert(false, `blocked ${e}`));
          });
        } else {
          resolve(assert(true));
        }
      });
    }
  };

  if (manualTest === true) {
    manual.runTestsManually(module.exports.tests, module.exports.beforeStart);
  }
});
