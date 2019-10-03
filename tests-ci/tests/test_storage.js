'use strict';

let imports = {
  scene: 'px:scene.1.js',
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

const child_url = `${px.getPackageBaseFilePath()}/helpers/test_childAppStorage.js`;
const tiny_url = 'https://is.gd/tFDMQi'; // -> https://www.sparkui.org/tests-ci/tests/helpers/test_childAppStorage.js

module.exports.tests = {};

/**
 * 'storage'.
 * Scene's 'storage' prop is not null.
 * @returns {Promise<string>}
 */
module.exports.tests.test01_getStorage = () => {
  const storage = imports.scene.storage;

  return Promise.resolve(imports.assert(storage, 'no storage'));
};

/**
 * 'setItem' / 'getItem'.
 * Set items via 'setItem'. Get items via 'getItem', got the same values as set, for non existing - <noValue>.
 * @returns {Promise<string>}
 */
module.exports.tests.test02_setItem_getItem = () => {
  const storage = imports.scene.storage;
  const noValue = imports.scene.capabilities.storage === 1 ? "" : undefined;

  storage.setItem('key1', 'value1');
  storage.setItem('key2', 'value2');
  const value1 = storage.getItem('key1');
  const value2 = storage.getItem('key2');
  const valueNotExisting = storage.getItem('keyNotExisting');

  return Promise.resolve(imports.assert(
    value1 === 'value1' && value2 === 'value2' && valueNotExisting === noValue,
    'setItem/getItem doesn\'t work'));
};

/**
 * 'setItem' / 'getItem'.
 * Set items via 'setItem'. Replace them via 'setItem'. Get items via 'getItem', values changed.
 * @returns {Promise<string>}
 */
module.exports.tests.test03_updateItems = () => {
  const storage = imports.scene.storage;

  storage.setItem('key1', 'value1');
  storage.setItem('key2', 'value2');
  const value1 = storage.getItem('key1');
  const value2 = storage.getItem('key2');
  storage.setItem('key1', 'value3');
  storage.setItem('key2', 'value4');
  const value3 = storage.getItem('key1');
  const value4 = storage.getItem('key2');

  return Promise.resolve(imports.assert(
    value1 === 'value1' && value2 === 'value2' && value3 === 'value3' && value4 === 'value4',
    'update doesn\'t work'));
};

/**
 * 'clear'.
 * Set items via 'setItem'. Clear all via 'clear'. Get items via 'getItem', all are <noValue>.
 * @returns {Promise<string>}
 */
module.exports.tests.test04_clear = () => {
  const storage = imports.scene.storage;
  const noValue = imports.scene.capabilities.storage === 1 ? "" : undefined;

  storage.setItem('key1', 'value1');
  storage.setItem('key2', 'value2');
  storage.setItem('key3', 'value3');
  storage.setItem('key4', 'value4');
  storage.clear();
  const value1 = storage.getItem('key1');
  const value2 = storage.getItem('key2');
  const value3 = storage.getItem('key3');
  const value4 = storage.getItem('key4');

  return Promise.resolve(imports.assert(
    value1 === noValue && value2 === noValue && value3 === noValue && value4 === noValue,
    'clear doesn\'t work'));
};

/**
 * 'removeItem'.
 * Clear. Set items via 'setItem'. Remove some via 'removeItem'. Get items via 'getItem', removed are <noValue>.
 * @returns {Promise<string>}
 */
module.exports.tests.test05_removeItem = () => {
  const storage = imports.scene.storage;
  const noValue = imports.scene.capabilities.storage === 1 ? "" : undefined;

  storage.clear();
  storage.setItem('key1', 'value1');
  storage.setItem('key2', 'value2');
  storage.setItem('key3', 'value3');
  storage.setItem('key4', 'value4');
  storage.removeItem('key1');
  storage.removeItem('key3');
  const value1 = storage.getItem('key1');
  const value2 = storage.getItem('key2');
  const value3 = storage.getItem('key3');
  const value4 = storage.getItem('key4');

  return Promise.resolve(imports.assert(
    value1 === noValue && value2 === 'value2' && value3 === noValue && value4 === 'value4',
    'removeItem doesn\'t work'));
};

/**
 * 'getItems'.
 * Clear. 'getItems' gives []. Set items via 'setItem'. 'getItems' gives an array with items as set.
 * @returns {Promise<string>}
 */
module.exports.tests.test06_getItems = () => {
  const storage = imports.scene.storage;

  storage.clear();
  const valueClear = storage.getItems();
  storage.setItem('key1', 'value1');
  storage.setItem('key2', 'value2');
  const value = storage.getItems();

  return Promise.resolve(imports.assert(
    valueClear.length === 0 && value.length === 2 &&
    value[0].key === 'key1' && value[0].value === 'value1' &&
    value[1].key === 'key2' && value[1].value === 'value2',
    'getItems doesn\'t work'));
};

/**
 * 'getItems' (by prefix).
 * Clear. Set items via 'setItem'. 'getItems' with prefix arg gives an array with items having a given prefix.
 * @returns {Promise<string>}
 */
module.exports.tests.test07_getItemsPrefix = () => {
  const storage = imports.scene.storage;

  storage.clear();
  storage.setItem('key1', 'value1');
  storage.setItem('prefix1_key1', 'prefix1_value1');
  storage.setItem('key2', 'value2');
  storage.setItem('prefix1_key2', 'prefix1_value2');
  const value = storage.getItems('prefix1');

  return Promise.resolve(imports.assert(
    value.length === 2 &&
    value[0].key === 'prefix1_key1' && value[0].value === 'prefix1_value1' &&
    value[1].key === 'prefix1_key2' && value[1].value === 'prefix1_value2',
    'getItems with prefix doesn\'t work'));
};

/**
 * 'capabilities'.
 * Scene's 'capabilities.storage' prop is 1.
 * @returns {Promise<string>}
 */
module.exports.tests.test08_capabilities = () => {
  const capabilities = imports.scene.capabilities;

  return Promise.resolve(imports.assert(capabilities &&
    (capabilities.storage === 1 || capabilities.storage === 2),
    'capabilities wrong'));
};

/**
 * Apps with the same origin share the same storage.
 * Set items. Create child scene, add items in its storage. Get items via 'getItem', got all items combined.
 * @returns {Promise<string>}
 */
module.exports.tests.test09_childAppUsesSameStorage = () => {
  const storage = imports.scene.storage;

  storage.clear();
  storage.setItem('key1', '123');
  storage.setItem('key2', '456');

  const new_scene = imports.scene.create({
    t: 'scene',
    parent: imports.scene.root,
    w: imports.scene.w, h: imports.scene.h,
    url: child_url
  });

  return new_scene.ready.then(s => {
    const child = s.api.getStorage();

    child.setItem('key3', '789');
    const value1 = child.getItem('key1');
    const value2 = child.getItem('key2');
    const value3 = child.getItem('key3');

    return imports.assert(
      value1 === '123' && value2 === '456' && value3 === '789',
      'child app storage differs');
  }).catch(() => imports.assert(false, 'child app test failed'));
};

/**
 * Apps can't exceed quota.
 * Create child scene with quota set via 'permissions'. Set items (by child) exceeding quota fails.
 * @returns {Promise<string>}
 */
module.exports.tests.test10_childAppStoragePermissions = () => {
  const storage = imports.scene.storage;
  const noValue = imports.scene.capabilities.storage === 1 ? "" : undefined;

  storage.clear();
  storage.setItem('key1', 'abc');
  storage.setItem('key2', 'def');

  const new_scene = imports.scene.create({
    t: 'scene',
    parent: imports.scene.root,
    w: imports.scene.w, h: imports.scene.h,
    url: child_url,
    permissions: {
      'url' : {
        'allow' : [ '*' ]
      },
      "storage": {
        "allow": 10
      }
    }
  });

  return new_scene.ready.then(s => {
    const child = s.api.getStorage();

    try {
      child.setItem('key3', 'ghi');
      return imports.assert(false, 'set over quota');
    } catch (ignored) {
    }

    const value1 = child.getItem('key1');
    const value2 = child.getItem('key2');
    const value3 = child.getItem('key3');

    return imports.assert(
      value1 === 'abc' && value2 === 'def' && value3 === noValue,
      'child app storage differs');
  }).catch(() => imports.assert(false, 'child app permissions quota test failed'));
};

/**
 * Random apps have 0 quota.
 * Create child scene (random origin). Child scene's 'storage' is null.
 * @returns {Promise<string>}
 */
module.exports.tests.test11_arbitraryAppQuota = () => {
  const new_scene = imports.scene.create({
    t: 'scene',
    parent: imports.scene.root,
    w: imports.scene.w, h: imports.scene.h,
    url: tiny_url
  });

  return new_scene.ready.then(s => {
    const child = s.api.getStorage();

    return imports.assert(child === null, 'arbitrary app storage is not null');
  }).catch(() => imports.assert(false, 'arbitrary app test failed'));
};

/**
 * Quota test.
 * Set items (by child app) exceeding quota fails, not exceeding - succeeds. Remove frees space.
 * @returns {Promise<string>}
 */
module.exports.tests.test12_quota = () => {
  const new_scene = imports.scene.create({
    t: 'scene',
    parent: imports.scene.root,
    w: imports.scene.w, h: imports.scene.h,
    url: child_url,
    permissions: {
      'url' : {
        'allow' : [ '*' ]
      },
      "storage": {
        "allow": 20
      }
    }
  });

  return new_scene.ready.then(s => {
    const child = s.api.getStorage();

    child.clear();
    child.setItem('1234', '5678');
    child.setItem('9012', '3456');
    // len 16
    try {
      child.setItem('7890', '1234');
      return imports.assert(false, 'set over quota');
    } catch (ignored) {
    }
    // len 16
    child.removeItem('1234');
    // len 8
    try {
      child.setItem('7890', '1234');
    } catch (ignored) {
      return imports.assert(false, 'set under quota after remove');
    }
    // len 16
    try {
      child.setItem('5678', '9012');
      return imports.assert(false, 'set over quota again');
    } catch (ignored) {
    }
    // len 16
    child.clear();
    // len 0
    try {
      child.setItem('1234567890', '1234567890');
    } catch (ignored) {
      return imports.assert(false, 'set equal to quota');
    }
    // len 20

    return imports.assert(true);
  }).catch(() => imports.assert(false, 'child app quota test failed'));
};

/**
 * Dot/bracket notation.
 * 'setItem'/'getItem' can be replaced with Dot/bracket notation.
 * @returns {Promise<string>}
 */
module.exports.tests.test13_dot_bracket_notation = () => {
  const storage = imports.scene.storage;
  const noValue = imports.scene.capabilities.storage === 1 ? "" : undefined;

  if (imports.scene.capabilities.storage === 1) {
    return Promise.resolve(imports.assert(true));
  }

  storage.clear();
  storage['k1'] = 123;
  storage.k2 = "456";
  delete storage.k2;
  storage.k3 = "";
  storage['k4'] = " ";
  storage.k5 = null;
  storage['k6'] = [1,2];
  storage.k7 = {a:1,b:2};

  return Promise.resolve(imports.assert(
    storage.k1 === '123' &&
    storage['k2'] === '456' &&
    storage.k3 === '' &&
    storage['k4'] === ' ' &&
    storage['k5'] === '' &&
    storage.k6 === '' &&
    storage['k7'] === '' &&
    storage['NO SUCH'] === noValue &&
    storage.NO_SUCH === noValue,
    'Dot/bracket notation doesn\'t work'));
};
