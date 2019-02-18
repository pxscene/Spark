'use strict';

let imports = {
  scene: 'px:scene.1.js',
  scr_cap_utils: './helpers/screen_capture_utils.jar',
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

// constants...
const img_url = 'http://www.sparkui.org/examples/gallery/images/spark_logo.png';
const margin = 5;

let overlay = null;
let screenshotDataPNG = null;
let screenshotInfo = null;

const rootRect = () => ({x: 0, y: 0, w: imports.scene.root.w, h: imports.scene.root.h});
const centeredRect = (parent, w, h) => ({x: 0.5 * (parent.w - w), y: 0.5 * (parent.h - h), w: w, h: h});
const imgRect = () => centeredRect(rootRect(), rootRect().w / 2, rootRect().h / 2);
const previewRect = () => ({x: margin, y: margin, w: 0.25 * rootRect().w, h: 0.25 * rootRect().h});
const textRect = () => ({x: 3 * margin + previewRect().w, y: margin, w: 0.15 * rootRect().w, h: previewRect().h});
const overlayRect = () => centeredRect(rootRect(), previewRect().w + textRect().w + 4 * margin, previewRect().h + 2 * margin);

// https://file.io/...
let imgLink = null;

module.exports.tests = {};

module.exports.tests.test01_drawImage = () => {
  const props = {
    t: 'image', parent: imports.scene.root, url: img_url,
  };
  return imports.scene.create(Object.assign(imgRect(), props)).ready.then(
    () => imports.assert(true),
    e => imports.assert(false, `not loaded: ${e}`));
};

module.exports.tests.test02_wait1s = () => {
  return new Promise(resolve => setTimeout(() => resolve(imports.assert(true)), 1000));
};

module.exports.tests.test03_captureScreen = () => {
  const s = imports.scr_cap_utils.capture();
  const png = new imports.scr_cap_utils.PNGImage(s);

  screenshotDataPNG = png;
  return Promise.resolve(imports.assert(png, 'not captured'));
};

module.exports.tests.test04_verifyCapture = () => {
  const d = screenshotDataPNG;
  const w = d.getWidth();
  const h = d.getHeight();
  const bitDepth = d.getBitDepth();
  const colorType = d.getColorType();
  const ok = w > 0 && h > 0 && bitDepth === 8 && colorType === 6;

  screenshotInfo = `PNG\n${w}x${h}\n${bitDepth} bit\ncolorType ${colorType}`;
  return Promise.resolve(imports.assert(ok, `wrong metadata: ${screenshotInfo}`));
};

module.exports.tests.test05_uploadCapture = () => {
  const b = screenshotDataPNG.getBytes();
  return imports.scr_cap_utils.generateOneTimeUrl(b).then(
    _link => imports.assert(imgLink = _link, 'not uploaded'),
    e => imports.assert(false, `not uploaded: ${e}`));
};

module.exports.tests.test06_wait1s = () => {
  return new Promise(resolve => setTimeout(() => resolve(imports.assert(true)), 1000));
};

module.exports.tests.test07_createOverlay = () => {
  const props = {
    t: 'rect', parent: imports.scene.root,
    fillColor: 0x222222ff, lineWidth: 0, a: 0.5
  };
  overlay = imports.scene.create(Object.assign(overlayRect(), props));
  return overlay.ready.then(
    () => imports.assert(true),
    e => imports.assert(false, `no overlay: ${e}`));
};

module.exports.tests.test08_createOverlayText = () => {
  const props = {
    t: 'text', parent: overlay,
    textColor: 0xffffffff, pixelSize: 20, text: screenshotInfo
  };
  return imports.scene.create(Object.assign(textRect(), props)).ready.then(
    () => imports.assert(true),
    e => imports.assert(false, `no overlay text: ${e}`));
};

module.exports.tests.test09_createOverlayImage = () => {
  const props = {
    t: 'image', parent: overlay,
    url: imgLink, stretchX: imports.scene.stretch.STRETCH, stretchY: imports.scene.stretch.STRETCH
  };
  return imports.scene.create(Object.assign(previewRect(), props)).ready.then(
    () => imports.assert(true),
    e => imports.assert(false, `no overlay image: ${e}`));
};

module.exports.tests.test10_showOverlay = () => {
  return overlay.animateTo({a: 1}, 0.2).then(
    () => imports.assert(true),
    e => imports.assert(false, `not animated: ${e}`));
};

module.exports.tests.test11_wait1s = () => {
  return new Promise(resolve => setTimeout(() => resolve(imports.assert(true)), 1000));
};
