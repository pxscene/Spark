/**
 * This scripts tests that a text or textBox when assigned to an incorrect font value type
 * will send a rejected promise
 * author: sgladk001c
 */

'use strict';
px.import({
    scene: 'px:scene.1.js',
    log: 'px:tools.../Logger.js',
    assert: '../test-run/assert.js',
    shots: '../test-run/tools_screenshot.js',
    manual: '../test-run/tools_manualTests.js'
}).then(function ready(imports) {

    let scene = imports.scene;
    let root = imports.scene.root;
    let assert = imports.assert.assert;
    let shots = imports.shots;
    let manual = imports.manual;

    let Logger = imports.log.Logger;
    let setLoggingLevel = imports.log.setLoggingLevel;
    let logger = new Logger('XRE2-1555');
    let rtLogLevel = process.env.RT_LOG_LEVEL ? process.env.RT_LOG_LEVEL : 'debug'; // TODO: set 'warn' here!
    setLoggingLevel(rtLogLevel);

    let doScreenshot = false;
    let manualTest = manual.getManualTestValue();

// Use fontUrls to load from web
    let fontUrlStart = 'http://www.pxscene.org/examples/px-reference/fonts/';
    let IndieFlower = 'IndieFlower.ttf';
    let DejaVu = 'DejaVuSans.ttf';
    let InvalidFontName = 'InvalidFontName.ttf';

// The two test widgets
    let FONT_PIXEL_SIZE = 30;
    let textBox = scene.create({
        t: 'textBox',
        parent: root,
        x: 15, y: 70,
        pixelSize: FONT_PIXEL_SIZE,
        text: 'textBox scene'
    });

// Load some fontResources
    let IndieFlower_font = scene.create({t: 'fontResource', url: fontUrlStart + IndieFlower});
    let DejaVu_font = scene.create({t: 'fontResource', url: fontUrlStart + DejaVu});
// font that does not exist should fail to load
    let Invalid_font = scene.create({t: 'fontResource', url: fontUrlStart + InvalidFontName});

    let message;

// beforeStart will verify we have the correct resolutions for the fontResources that were preloaded
    let beforeStart = function () {

        return new Promise(function (resolve, reject) {
            let results = [];
            Promise.all([IndieFlower_font.ready, DejaVu_font.ready]).then(function () {
                message = 'promise resolved received for IndieFlower_font and DejaVu_font';
                results.push(assert(true, message));
                logger.message('debug', message);
            }, function () {
                message = 'rejection not expected for IndieFlower_font or DejaVu_font';
                results.push(assert(false, message));
                logger.message('debug', message);

            })
                .then(function () {
                    Invalid_font.ready.then(function resolve() {
                        message = 'rejection expected for Invalid_font, but promise resolved';
                        results.push(assert(false, message));
                        logger.message('debug', message);
                    }, function () {
                        message = 'rejection expected and received for Invalid_font';
                        results.push(assert(true, message));
                        logger.message('debug', message);

                    }).catch(function (error) {
                        message = 'unexpected exception in beforeStart! ' + error;
                        results.push(assert(false, message));
                        logger.message('debug', message);
                        resolve(results);
                    });
                })
                .then(function () {
                    resolve(results);

                });
        });
    };

    let tests = {
        setTextBoxFontToInvalidValue: function () {
            return new Promise(function (resolve, reject) {
                let results = [];
                try {
                    textBox.font = 30;
                } catch (exeception) {
                    message = 'setTextBoxFontToInvalidValue: exception was received';
                    results = assert(false, message);
                    logger.message('debug', message);
                    resolve(results);
                }
                textBox.ready.then(function () {
                    message = 'setTextBoxFontToInvalidValue: expected rejection but received resolution';
                    results = assert(false, message);
                    logger.message('debug', message);
                }, function () {
                    message = 'setTextBoxFontToInvalidValue: expected and received rejection';
                    results = assert(true, message);
                    logger.message('debug', message);
                }).then(function () {
                    resolve(results);
                })
            });
        },
        setTextBoxFontToInvalidObject: function () {
            return new Promise(function (resolve, reject) {
                let results = [];
                try {
                    textBox.font = {description: 'pxFont'};
                } catch (exeception) {
                    message = 'setTextBoxFontToInvalidObject: exception was received';
                    results = assert(false, message);
                    logger.message('debug', message);
                    resolve(results);
                }
                textBox.ready.then(function () {
                    message = 'setTextBoxFontToInvalidObject: expected rejection but received resolution';
                    results = assert(false, message);
                    logger.message('debug', message);
                }, function () {
                    message = 'setTextBoxFontToInvalidObject: expected and received rejection';
                    results = assert(true, message);
                    logger.message('debug', message);
                }).then(function () {
                    resolve(results);
                })
            });
        },
        setTextBoxFontToWrongScene: function () {
            return new Promise(function (resolve, reject) {
                let results = [];
                try {
                    textBox.font = scene.create({t: 'rect', parent: root});
                } catch (exeception) {
                    message = 'setTextBoxFontToWrongScene: exception was received';
                    results = assert(false, message);
                    logger.message('debug', message);
                    resolve(results);
                }
                textBox.ready.then(function () {
                    message = 'setTextBoxFontToWrongScene: expected rejection but received resolution';
                    results = assert(false, message);
                    logger.message('debug', message);
                }, function () {
                    message = 'setTextBoxFontToWrongScene: expected and received rejection';
                    results = assert(true, message);
                    logger.message('debug', message);
                }).then(function () {
                    resolve(results);
                })
            });
        },
        setTextBoxFontToInvalidFont: function () {
            return new Promise(function (resolve, reject) {
                let results = [];
                try {
                    textBox.font = Invalid_font;
                } catch (exeception) {
                    message = 'setTextBoxFontToInvalidFont: exception was received';
                    results = assert(false, message);
                    logger.message('debug', message);
                    resolve(results);
                }
                textBox.ready.then(function () {
                    message = 'setTextBoxFontToInvalidFont: expected rejection but received resolution';
                    results = assert(false, message);
                    logger.message('debug', message);
                }, function () {
                    message = 'setTextBoxFontToInvalidFont: expected and received rejection';
                    results = assert(true, message);
                    logger.message('debug', message);
                }).then(function () {
                    resolve(results);
                })
            });
        },
        setTextBoxFontToValidFont: function () {
            return new Promise(function (resolve, reject) {
                let results = [];
                try {
                    textBox.font = IndieFlower_font;
                } catch (exeception) {
                    message = 'setTextBoxFontToValidFont: exception was received';
                    results = assert(false, message);
                    logger.message('debug', message);
                    resolve(results);
                }
                textBox.ready.then(function () {
                    message = 'setTextBoxFontToValidFont: expected and received resolution';
                    results = assert(true, message);
                    logger.message('debug', message);
                }, function () {
                    message = 'setTextBoxFontToValidFont: expected resolution but received rejection';
                    results = assert(false, message);
                    logger.message('debug', message);
                }).then(function () {
                    resolve(results);
                })
            });
        }
    };

    module.exports.beforeStart = beforeStart;
    module.exports.tests = tests;

    if (manualTest === true) {
        manual.runTestsManually(tests, beforeStart);
    }

}).catch(function importFailed(err) {
    console.error('Import for test_xre2_1555.js failed: ' + err)
});
