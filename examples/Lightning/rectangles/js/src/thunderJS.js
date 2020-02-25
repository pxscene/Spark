(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.ThunderJS = factory());
}(this, (function () { 'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	// https://github.com/maxogden/websocket-stream/blob/48dc3ddf943e5ada668c31ccd94e9186f02fafbd/ws-fallback.js

	var ws = null;

	if (typeof WebSocket !== 'undefined') {
	  ws = WebSocket;
	} else if (typeof MozWebSocket !== 'undefined') {
	  ws = MozWebSocket;
	} else if (typeof commonjsGlobal !== 'undefined') {
	  ws = commonjsGlobal.WebSocket || commonjsGlobal.MozWebSocket;
	} else if (typeof window !== 'undefined') {
	  ws = window.WebSocket || window.MozWebSocket;
	} else if (typeof self !== 'undefined') {
	  ws = self.WebSocket || self.MozWebSocket;
	}

	var browser = ws||require('ws');

	const requestsQueue = {};
	const listeners = {};

	var requestQueueResolver = data => {
	  if (typeof data === 'string') {
	    data = JSON.parse(data.normalize().replace(/\\x([0-9A-Fa-f]{2})/g, ''));
	  }
	  if (data.id) {
	    const request = requestsQueue[data.id];
	    if (request) {
	      // result can also be null, that's why we check for the existence of the key
	      if ('result' in data) request.resolve(data.result);
	      else request.reject(data.error);
	      delete requestsQueue[data.id];
	    } else {
	      console.log('no pending request found with id ' + data.id);
	    }
	  }
	};

	var notificationListener = data => {
	  if (typeof data === 'string') {
	    data = JSON.parse(data.normalize().replace(/\\x([0-9A-Fa-f]{2})/g, ''));
	  }
	  // determine if we're dealing with a notification
	  if (!data.id && data.method) {
	    // if so, so see if there exist callbacks
	    const callbacks = listeners[data.method];
	    if (callbacks && Array.isArray(callbacks) && callbacks.length) {
	      callbacks.forEach(callback => {
	        callback(data.params);
	      });
	    } else {
	      console.log('no callbacks for ' + data.method);
	    }
	  }
	};

	// defaults
	const protocol = 'ws://';
	const host = 'localhost';
	const endpoint = '/jsonrpc';
	const port = 80;

	var makeWebsocketAddress = options => {
	  return [
	    (options && options.protocol) || protocol,
	    (options && options.host) || host,
	    ':' + ((options && options.port) || port),
	    (options && options.endpoint) || endpoint,
	  ].join('')
	};

	const protocols = 'notification';

	let connection = null;
	let socket = null;

	var connect = options => {
	  return new Promise((resolve, reject) => {
	    if (connection) {
	      resolve(connection);
	    } else {
	      try {
	        if (!socket) {
	          socket = new browser(makeWebsocketAddress(options), protocols);
	          socket.addEventListener('message', message => {
	            requestQueueResolver(message.data);
	          });
	          socket.addEventListener('message', message => {
	            notificationListener(message.data);
	          });
	        }
	        socket.addEventListener('open', () => {
	          connection = socket;
	          resolve(connection);
	        });
	      } catch (e) {
	        reject(e);
	      }
	    }
	  })
	};

	var makeBody = (requestId, plugin, method, params, version) => {
	  // delete possible version key from params
	  params ? delete params.version : null;
	  const body = {
	    jsonrpc: '2.0',
	    id: requestId,
	    method: [plugin, version, method].join('.'),
	  };

	  // params exist (or explicitely false)
	  params || params === false
	    ? // params is not an empty object, or it is a boolean or a number
	      typeof params === 'object' && Object.keys(params).length === 0
	      ? null
	      : (body.params = params)
	    : null;
	  return body
	};

	var getVersion = (versionsConfig, plugin, params) => {
	  const defaultVersion = 1;

	  let version;
	  if ((version = params && params.version)) {
	    return version
	  }
	  return versionsConfig
	    ? versionsConfig[plugin] || versionsConfig.default || defaultVersion
	    : defaultVersion
	};

	let id = 0;

	var makeId = () => {
	  id = id + 1;
	  return id
	};

	var execRequest = (options, body) => {
	  connect(options)
	    .then(connection => {
	      connection.send(JSON.stringify(body));
	    })
	    .catch(console.error);
	};

	var API = options => {
	  return {
	    request(plugin, method, params) {
	      return new Promise((resolve, reject) => {
	        const requestId = makeId();
	        const version = getVersion(options.versions, plugin, params);
	        const body = makeBody(requestId, plugin, method, params, version);

	        if (options.debug) {
	          console.log(' ');
	          console.log('API REQUEST:');
	          console.log(JSON.stringify(body, null, 2));
	          console.log(' ');
	        }

	        requestsQueue[requestId] = {
	          body,
	          resolve,
	          reject,
	        };

	        execRequest(options, body);
	      })
	    },
	  }
	};

	var DeviceInfo = {
	  freeRam(params) {
	    return this.call('systeminfo', params).then(res => {
	      return res.freeram
	    })
	  },
	  version(params) {
	    return this.call('systeminfo', params).then(res => {
	      return res.version
	    })
	  },
	};

	var plugins = {
	  DeviceInfo,
	};

	function listener(plugin, event, callback) {
	  const thunder = this;

	  // register and keep track of the index
	  const index = register.call(this, plugin, event, callback);

	  return {
	    dispose() {
	      const listener_id = makeListenerId(plugin, event);
	      listeners[listener_id].splice(index, 1);

	      if (listeners[listener_id].length === 0) {
	        unregister.call(thunder, plugin, event);
	      }
	    },
	  }
	}

	// construct a unique id for the listener
	const makeListenerId = (plugin, event) => {
	  return ['client', plugin, 'events', event].join('.')
	};

	const register = function(plugin, event, callback) {
	  const listener_id = makeListenerId(plugin, event);

	  // no listener registered for this plugin/event yet
	  if (!listeners[listener_id]) {
	    // create an array to store this plugin/event's callback(s)
	    listeners[listener_id] = [];

	    // request the server to send us notifications for this event
	    const method = 'register';

	    // remove 'event' from the listener_id to send as request id
	    const request_id = listener_id
	      .split('.')
	      .slice(0, -1)
	      .join('.');

	    const params = {
	      event,
	      id: request_id,
	    };
	    this.api
	      .request(plugin, method, params)
	      .then()
	      .catch();
	  }

	  // register the callback
	  listeners[listener_id].push(callback);

	  // return the index of the callback (which can be used to dispose the callback)
	  return listeners[listener_id].length - 1
	};

	const unregister = function(plugin, event) {
	  const listener_id = makeListenerId(plugin, event);

	  delete listeners[listener_id];

	  // request the server to stop sending us notifications for this event
	  const method = 'unregister';

	  // remove 'event' from the listener_id to send as request id
	  const request_id = listener_id
	    .split('.')
	    .slice(0, -1)
	    .join('.');

	  const params = {
	    event,
	    id: request_id,
	  };
	  this.api.request(plugin, method, params);
	};

	let api;

	var thunderJS = options => {
	  api = API(options);
	  return wrapper({ ...thunder(options), ...plugins })
	};

	const resolve = (result, args) => {
	  // make sure we always have a promise
	  if (
	    // not an object so definitely not a promise
	    typeof result !== 'object' ||
	    // an object that doesn't look like a promise
	    (typeof result === 'object' && (!result.then || typeof result.then !== 'function'))
	  ) {
	    result = new Promise((resolve, reject) => {
	      result instanceof Error === false ? resolve(result) : reject(result);
	    });
	  }

	  // see if the last argument is a function (and assume it's the callback)
	  const cb = typeof args[args.length - 1] === 'function' ? args[args.length - 1] : null;
	  if (cb) {
	    result.then(res => cb(null, res)).catch(err => cb(err));
	  } else {
	    return result
	  }
	};

	const thunder = options => ({
	  options,
	  plugin: false,
	  call() {
	    // little trick to set the plugin name when calling from a plugin context (if not already set)
	    const args = [...arguments];
	    if (this.plugin) {
	      if (args[0] !== this.plugin) {
	        args.unshift(this.plugin);
	      }
	    }

	    const plugin = args[0];
	    const method = args[1];

	    if (typeof this[plugin][method] == 'function') {
	      return this[plugin][method](args[2])
	    }

	    return this.api.request.apply(this, args)
	  },
	  registerPlugin(name, plugin) {
	    this[name] = wrapper(Object.assign(Object.create(thunder), plugin, { plugin: name }));
	  },
	  subscribe() {
	    // subscribe to notification
	    // to do
	  },
	  on() {
	    // first make sure the plugin is the first argument (independent from being called as argument style or object style)
	    const args = [...arguments];
	    if (this.plugin) {
	      if (args[0] !== this.plugin) {
	        args.unshift(this.plugin);
	      }
	    }

	    return listener.apply(this, args)
	  },
	  once() {
	    console.log('todo ...');
	  },
	});

	const wrapper = obj => {
	  return new Proxy(obj, {
	    get(target, propKey) {
	      const prop = target[propKey];

	      // return the initialized api object, when key is api
	      if (propKey === 'api') {
	        return api
	      }

	      if (typeof prop !== 'undefined') {
	        if (typeof prop === 'function') {
	          // on, once and subscribe don't need to be wrapped in a resolve
	          if (['on', 'once', 'subscribe'].indexOf(propKey) > -1) {
	            return function(...args) {
	              return prop.apply(this, args)
	            }
	          }
	          return function(...args) {
	            return resolve(prop.apply(this, args), args)
	          }
	        }
	        if (typeof prop === 'object') {
	          return wrapper(
	            Object.assign(Object.create(thunder(target.options)), prop, { plugin: propKey })
	          )
	        }
	        return prop
	      } else {
	        if (target.plugin === false) {
	          return wrapper(
	            Object.assign(Object.create(thunder(target.options)), {}, { plugin: propKey })
	          )
	        }
	        return function(...args) {
	          args.unshift(propKey);
	          return target.call.apply(this, args)
	        }
	      }
	    },
	  })
	};

	return thunderJS;

})));
