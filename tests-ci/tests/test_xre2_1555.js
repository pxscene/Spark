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
    let rtLogLevel = process.env.RT_LOG_LEVEL ? process.env.RT_LOG_LEVEL : 'warn';
    setLoggingLevel(rtLogLevel);

    let doScreenshot = false;
    let manualTest = manual.getManualTestValue();

// Use fontUrls to load from web
    let fontUrlStart = 'http://www.pxscene.org/examples/px-reference/fonts/';
    let IndieFlower = 'IndieFlower.ttf';
    let DejaVu = 'DejaVuSans.ttf';
    let InvalidFontName = 'InvalidFontName.ttf';

// Test widget
    let textBox = scene.create({
        t: 'textBox',
        parent: root,
        x: 15, y: 70,
        pixelSize: 30,
        text: 'textBox scene'
    });

// Load some fontResources
    let IndieFlower_font = scene.create({t: 'fontResource', url: fontUrlStart + IndieFlower});
    let DejaVu_font = scene.create({t: 'fontResource', url: fontUrlStart + DejaVu});
// font that does not exist should fail to load
    let Invalid_font = scene.create({t: 'fontResource', url: fontUrlStart + InvalidFontName});

// beforeStart will verify we have the correct resolutions for the fontResources that were preloaded
    let beforeStart = function () {

        return new Promise(function (resolve, reject) {
            let results = [];
            let message;
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

    // Generic test function
    let testFunc = function (params) {
        return new Promise(function (resolve, reject) {

            let results = [];
            let message;

            let timer = setTimeout(function() {
                message = params.name + ' never got promise!';
                logger.message('debug', message);
                results.push(assert(false, message));
                resolve(results);
            }, 3000);

            try {
                textBox.font = params.font;
            } catch (exception) {
                message = params.name + ': ' +  params.exception.message;
                results = assert(params.exception.assert, message);
                logger.message('debug', message);
                resolve(results);
            }
            textBox.ready.then(function () {
                message = params.name + ': ' +  params.fulfilled.message;
                results = assert(params.fulfilled.assert, message);
                logger.message('debug', message);
            }, function () {
                message = params.name + ': ' +  params.rejected.message;
                results = assert(params.rejected.assert, message);
                logger.message('debug', message);
            }).then(function () {
                clearTimeout(timer);
                resolve(results);
            })
        });
    };

    let tests = {

        setTextBoxFontToInvalidValue: function () {
            return testFunc({
                    name: 'setTextBoxFontToInvalidValue',
                    font: 30,
                    exception: {assert: false, message: 'exception was received'},
                    fulfilled: {assert: false, message: 'expected rejection but received resolution'},
                    rejected: {assert: true, message: 'expected and received rejection'}
                }
            );
        },

        // DISABLED BECAUSE IT WILL CRASH SPARK WITHOUT THE XRE-1555 PATCH (due to the missing type validation)
        //
        // setTextBoxFontToInvalidObject: function () {
        //     return testFunc({
        //             name: 'setTextBoxFontToInvalidObject',
        //             font: {description: 'pxFont'},
        //             exception: {assert: false, message: 'exception was received'},
        //             fulfilled: {assert: false, message: 'expected rejection but received resolution'},
        //             rejected: {assert: true, message: 'expected and received rejection'}
        //         }
        //     );
        // },

        // setTextBoxFontToWrongScene: function () {
        //     return testFunc({
        //             name: 'setTextBoxFontToWrongScene',
        //             font: scene.create({t: 'rect', parent: root}),
        //             exception: {assert: false, message: 'exception was received'},
        //             fulfilled: {assert: false, message: 'expected rejection but received resolution'},
        //             rejected: {assert: true, message: 'expected and received rejection'}
        //         }
        //     );
        // },

        setTextBoxFontToInvalidFont: function () {
            return testFunc({
                    name: 'setTextBoxFontToInvalidFont',
                    font: Invalid_font,
                    exception: {assert: false, message: 'exception was received'},
                    fulfilled: {assert: false, message: 'expected rejection but received resolution'},
                    rejected: {assert: true, message: 'expected and received rejection'}
                }
            );
        },

        setTextBoxFontToValidFont: function () {
            return testFunc({
                    name: 'setTextBoxFontToValidFont',
                    font: IndieFlower_font,
                    exception: {assert: false, message: 'exception was received'},
                    fulfilled: {assert: true, message: 'expected and received resolution'},
                    rejected: {assert: false, message: 'expected resolution but received rejection'}
                }
            );
        },
    };

    module.exports.beforeStart = beforeStart;
    module.exports.tests = tests;

    if (manualTest === true) {
        manual.runTestsManually(tests, beforeStart);
    }

}).catch(function importFailed(err) {
    console.error('Import for test_xre2_1555.js failed: ' + err)
});
