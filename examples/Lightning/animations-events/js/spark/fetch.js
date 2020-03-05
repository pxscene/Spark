(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('node-fetch')) :
	typeof define === 'function' && define.amd ? define(['node-fetch'], factory) :
	(global.fetch = factory(global.fetch),global.Headers = global.fetch.Headers);
}(this, (function (fetch) { 'use strict';

	var fetch$1 = (typeof fetch !== 'undefined'?fetch:require('node-fetch'));

	return fetch$1;

})));
