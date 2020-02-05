"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function set(target, property, value, receiver) { if (typeof Reflect !== "undefined" && Reflect.set) { set = Reflect.set; } else { set = function set(target, property, value, receiver) { var base = _superPropBase(target, property); var desc; if (base) { desc = Object.getOwnPropertyDescriptor(base, property); if (desc.set) { desc.set.call(receiver, value); return true; } else if (!desc.writable) { return false; } } desc = Object.getOwnPropertyDescriptor(receiver, property); if (desc) { if (!desc.writable) { return false; } desc.value = value; Object.defineProperty(receiver, property, desc); } else { _defineProperty(receiver, property, value); } return true; }; } return set(target, property, value, receiver); }

function _set(target, property, value, receiver, isStrict) { var s = set(target, property, value, receiver || target); if (!s && isStrict) { throw new Error('failed to set property'); } return value; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function (global, factory) {
  (typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : global.ux = factory();
})(void 0, function () {
  'use strict';

  var events = ['timeupdate', 'error', 'ended', 'loadeddata', 'canplay', 'play', 'playing', 'pause', 'loadstart', 'seeking', 'seeked', 'encrypted'];

  var Mediaplayer =
  /*#__PURE__*/
  function (_lng$Component) {
    _inherits(Mediaplayer, _lng$Component);

    function Mediaplayer() {
      _classCallCheck(this, Mediaplayer);

      return _possibleConstructorReturn(this, _getPrototypeOf(Mediaplayer).apply(this, arguments));
    }

    _createClass(Mediaplayer, [{
      key: "_construct",
      value: function _construct() {
        this._skipRenderToTexture = false;
      }
    }, {
      key: "_init",
      value: function _init() {
        //re-use videotag if already there
        var videoEls = document.getElementsByTagName('video');
        if (videoEls && videoEls.length > 0) this.videoEl = videoEls[0];else {
          this.videoEl = document.createElement('video');
          this.videoEl.setAttribute('id', 'video-player');
          this.videoEl.style.position = 'absolute';
          this.videoEl.style.zIndex = '1';
          this.videoEl.style.display = 'none';
          this.videoEl.setAttribute('width', '100%');
          this.videoEl.setAttribute('height', '100%');
          this.videoEl.style.visibility = this.textureMode ? 'hidden' : 'visible';
          document.body.appendChild(this.videoEl);
        }

        if (this.textureMode && !this._skipRenderToTexture) {
          this._createVideoTexture();
        }

        this.eventHandlers = [];
      }
    }, {
      key: "_registerListeners",
      value: function _registerListeners() {
        var _this = this;

        events.forEach(function (event) {
          var handler = function handler(e) {
            _this.fire(event, {
              videoElement: _this.videoEl,
              event: e
            });
          };

          _this.eventHandlers.push(handler);

          _this.videoEl.addEventListener(event, handler);
        });
      }
    }, {
      key: "_deregisterListeners",
      value: function _deregisterListeners() {
        var _this2 = this;

        events.forEach(function (event, index) {
          _this2.videoEl.removeEventListener(event, _this2.eventHandlers[index]);
        });
        this.eventHandlers = [];
      }
    }, {
      key: "_attach",
      value: function _attach() {
        this._registerListeners();
      }
    }, {
      key: "_detach",
      value: function _detach() {
        this._deregisterListeners();
      }
    }, {
      key: "_createVideoTexture",
      value: function _createVideoTexture() {
        var stage = this.stage;
        var gl = stage.gl;
        var glTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, glTexture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        this.videoTexture.options = {
          source: glTexture,
          w: this.videoEl.width,
          h: this.videoEl.height
        };
      }
    }, {
      key: "_startUpdatingVideoTexture",
      value: function _startUpdatingVideoTexture() {
        var _this3 = this;

        if (this.textureMode && !this._skipRenderToTexture) {
          var stage = this.stage;

          if (!this._updateVideoTexture) {
            this._updateVideoTexture = function () {
              if (_this3.videoTexture.options.source && _this3.videoEl.videoWidth && _this3.active) {
                var gl = stage.gl;
                var currentTime = new Date().getTime(); // When BR2_PACKAGE_GST1_PLUGINS_BAD_PLUGIN_DEBUGUTILS is not set in WPE, webkitDecodedFrameCount will not be available.
                // We'll fallback to fixed 30fps in this case.

                var frameCount = _this3.videoEl.webkitDecodedFrameCount;
                var mustUpdate = frameCount ? _this3._lastFrame !== frameCount : _this3._lastTime < currentTime - 30;

                if (mustUpdate) {
                  _this3._lastTime = currentTime;
                  _this3._lastFrame = frameCount;

                  try {
                    gl.bindTexture(gl.TEXTURE_2D, _this3.videoTexture.options.source);
                    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
                    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, _this3.videoEl);
                    _this3._lastFrame = _this3.videoEl.webkitDecodedFrameCount;
                    _this3.videoTextureView.visible = true;
                    _this3.videoTexture.options.w = _this3.videoEl.videoWidth;
                    _this3.videoTexture.options.h = _this3.videoEl.videoHeight;
                    var expectedAspectRatio = _this3.videoTextureView.w / _this3.videoTextureView.h;
                    var realAspectRatio = _this3.videoEl.videoWidth / _this3.videoEl.videoHeight;

                    if (expectedAspectRatio > realAspectRatio) {
                      _this3.videoTextureView.scaleX = realAspectRatio / expectedAspectRatio;
                      _this3.videoTextureView.scaleY = 1;
                    } else {
                      _this3.videoTextureView.scaleY = expectedAspectRatio / realAspectRatio;
                      _this3.videoTextureView.scaleX = 1;
                    }
                  } catch (e) {
                    console.error('texImage2d video', e);

                    _this3._stopUpdatingVideoTexture();

                    _this3.videoTextureView.visible = false;
                  }

                  _this3.videoTexture.source.forceRenderUpdate();
                }
              }
            };
          }

          if (!this._updatingVideoTexture) {
            stage.on('frameStart', this._updateVideoTexture);
            this._updatingVideoTexture = true;
          }
        }
      }
    }, {
      key: "_stopUpdatingVideoTexture",
      value: function _stopUpdatingVideoTexture() {
        if (this.textureMode) {
          var stage = this.stage;
          stage.removeListener('frameStart', this._updateVideoTexture);
          this._updatingVideoTexture = false;
          this.videoTextureView.visible = false;

          if (this.videoTexture.options.source) {
            var gl = stage.gl;
            gl.bindTexture(gl.TEXTURE_2D, this.videoTexture.options.source);
            gl.clearColor(0, 0, 0, 1);
            gl.clear(gl.COLOR_BUFFER_BIT);
          }
        }
      }
    }, {
      key: "updateSettings",
      value: function updateSettings() {
        var _this4 = this;

        var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        // The Component that 'consumes' the media player.
        this._consumer = settings.consumer;

        if (this._consumer && this._consumer.getMediaplayerSettings) {
          // Allow consumer to add settings.
          settings = Object.assign(settings, this._consumer.getMediaplayerSettings());
        }

        if (!lng.Utils.equalValues(this._stream, settings.stream)) {
          if (settings.stream && settings.stream.keySystem) {
            navigator.requestMediaKeySystemAccess(settings.stream.keySystem.id, settings.stream.keySystem.config).then(function (keySystemAccess) {
              return keySystemAccess.createMediaKeys();
            }).then(function (createdMediaKeys) {
              return _this4.videoEl.setMediaKeys(createdMediaKeys);
            }).then(function () {
              if (settings.stream && settings.stream.src) _this4.open(settings.stream.src);
            })["catch"](function () {
              console.error('Failed to set up MediaKeys');
            });
          } else if (settings.stream && settings.stream.src) {
            if (!window.Hls) {
              window.Hls =
              /*#__PURE__*/
              function () {
                function Hls() {
                  _classCallCheck(this, Hls);
                }

                _createClass(Hls, null, [{
                  key: "isSupported",
                  value: function isSupported() {
                    console.warn("hls-light not included");
                    return false;
                  }
                }]);

                return Hls;
              }();
            }

            if (ux.Ui.hasOption("hls") && Hls.isSupported()) {
              if (!this._hls) this._hls = new Hls({
                liveDurationInfinity: true
              });

              this._hls.loadSource(settings.stream.src);

              this._hls.attachMedia(this.videoEl);

              this.videoEl.style.display = "block";
            } else {
              this.open(settings.stream.src);
            }
          } else {
            this.close();
          }

          this._stream = settings.stream;
        }

        this._setHide(settings.hide);

        this._setVideoArea(settings.videoPos);
      }
    }, {
      key: "_setHide",
      value: function _setHide(hide) {
        if (this.textureMode) {
          this.tag("Video").setSmooth('alpha', hide ? 0 : 1);
        } else {
          this.videoEl.style.visibility = hide ? 'hidden' : 'visible';
        }
      }
    }, {
      key: "open",
      value: function open(url) {
        console.log('Playing stream', url);

        if (this.application.noVideo) {
          console.log('noVideo option set, so ignoring: ' + url);
          return;
        }

        if (this.videoEl.getAttribute('src') === url) return this.reload();
        this.videoEl.setAttribute('src', url);
        this.videoEl.style.display = 'block';
      }
    }, {
      key: "close",
      value: function close() {
        // We need to pause first in order to stop sound.
        this.videoEl.pause();
        this.videoEl.removeAttribute('src'); // force load to reset everything without errors

        this.videoEl.load();

        this._clearSrc();

        this.videoEl.style.display = 'none';
      }
    }, {
      key: "playPause",
      value: function playPause() {
        if (this.isPlaying()) {
          this.doPause();
        } else {
          this.doPlay();
        }
      }
    }, {
      key: "isPlaying",
      value: function isPlaying() {
        return this._getState() === "Playing";
      }
    }, {
      key: "doPlay",
      value: function doPlay() {
        this.videoEl.play();
      }
    }, {
      key: "doPause",
      value: function doPause() {
        this.videoEl.pause();
      }
    }, {
      key: "reload",
      value: function reload() {
        var url = this.videoEl.getAttribute('src');
        this.close();
        this.videoEl.src = url;
      }
    }, {
      key: "getPosition",
      value: function getPosition() {
        return Promise.resolve(this.videoEl.currentTime);
      }
    }, {
      key: "setPosition",
      value: function setPosition(pos) {
        this.videoEl.currentTime = pos;
      }
    }, {
      key: "getDuration",
      value: function getDuration() {
        return Promise.resolve(this.videoEl.duration);
      }
    }, {
      key: "seek",
      value: function seek(time) {
        var absolute = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        if (absolute) {
          this.videoEl.currentTime = time;
        } else {
          this.videoEl.currentTime += time;
        }
      }
    }, {
      key: "_setVideoArea",
      value: function _setVideoArea(videoPos) {
        if (lng.Utils.equalValues(this._videoPos, videoPos)) {
          return;
        }

        this._videoPos = videoPos;

        if (this.textureMode) {
          this.videoTextureView.patch({
            smooth: {
              x: videoPos[0],
              y: videoPos[1],
              w: videoPos[2] - videoPos[0],
              h: videoPos[3] - videoPos[1]
            }
          });
        } else {
          var precision = this.stage.getRenderPrecision();
          this.videoEl.style.left = Math.round(videoPos[0] * precision) + 'px';
          this.videoEl.style.top = Math.round(videoPos[1] * precision) + 'px';
          this.videoEl.style.width = Math.round((videoPos[2] - videoPos[0]) * precision) + 'px';
          this.videoEl.style.height = Math.round((videoPos[3] - videoPos[1]) * precision) + 'px';
        }
      }
    }, {
      key: "_fireConsumer",
      value: function _fireConsumer(event, args) {
        if (this._consumer) {
          this._consumer.fire(event, args);
        }
      }
    }, {
      key: "_equalInitData",
      value: function _equalInitData(buf1, buf2) {
        if (!buf1 || !buf2) return false;
        if (buf1.byteLength != buf2.byteLength) return false;
        var dv1 = new Int8Array(buf1);
        var dv2 = new Int8Array(buf2);

        for (var i = 0; i != buf1.byteLength; i++) {
          if (dv1[i] != dv2[i]) return false;
        }

        return true;
      }
    }, {
      key: "error",
      value: function error(args) {
        this._fireConsumer('$mediaplayerError', args);

        this._setState("");

        return "";
      }
    }, {
      key: "loadeddata",
      value: function loadeddata(args) {
        this._fireConsumer('$mediaplayerLoadedData', args);
      }
    }, {
      key: "play",
      value: function play(args) {
        this._fireConsumer('$mediaplayerPlay', args);
      }
    }, {
      key: "playing",
      value: function playing(args) {
        this._fireConsumer('$mediaplayerPlaying', args);

        this._setState("Playing");
      }
    }, {
      key: "canplay",
      value: function canplay(args) {
        this.videoEl.play();

        this._fireConsumer('$mediaplayerStart', args);
      }
    }, {
      key: "loadstart",
      value: function loadstart(args) {
        this._fireConsumer('$mediaplayerLoad', args);
      }
    }, {
      key: "seeked",
      value: function seeked(args) {
        this._fireConsumer('$mediaplayerSeeked', {
          currentTime: this.videoEl.currentTime,
          duration: this.videoEl.duration || 1
        });
      }
    }, {
      key: "seeking",
      value: function seeking(args) {
        this._fireConsumer('$mediaplayerSeeking', {
          currentTime: this.videoEl.currentTime,
          duration: this.videoEl.duration || 1
        });
      }
    }, {
      key: "durationchange",
      value: function durationchange(args) {
        this._fireConsumer('$mediaplayerDurationChange', args);
      }
    }, {
      key: "encrypted",
      value: function encrypted(args) {
        var video = args.videoElement;
        var event = args.event; // FIXME: Double encrypted events need to be properly filtered by Gstreamer

        if (video.mediaKeys && !this._equalInitData(this._previousInitData, event.initData)) {
          this._previousInitData = event.initData;

          this._fireConsumer('$mediaplayerEncrypted', args);
        }
      }
    }, {
      key: "skipRenderToTexture",
      set: function set(v) {
        this._skipRenderToTexture = v;
      }
    }, {
      key: "textureMode",
      set: function set(v) {
        return this._textureMode = v;
      },
      get: function get() {
        return this._textureMode;
      }
    }, {
      key: "videoView",
      get: function get() {
        return this.tag("Video");
      }
    }, {
      key: "videoTextureView",
      get: function get() {
        return this.tag("Video").tag("VideoTexture");
      }
    }, {
      key: "videoTexture",
      get: function get() {
        return this.videoTextureView.texture;
      }
    }], [{
      key: "_template",
      value: function _template() {
        return {
          Video: {
            VideoWrap: {
              VideoTexture: {
                visible: false,
                pivot: 0.5,
                texture: {
                  type: lng.textures.StaticTexture,
                  options: {}
                }
              }
            }
          }
        };
      }
    }, {
      key: "_states",
      value: function _states() {
        return [
        /*#__PURE__*/
        function (_this5) {
          _inherits(Playing, _this5);

          function Playing() {
            _classCallCheck(this, Playing);

            return _possibleConstructorReturn(this, _getPrototypeOf(Playing).apply(this, arguments));
          }

          _createClass(Playing, [{
            key: "$enter",
            value: function $enter() {
              this._startUpdatingVideoTexture();
            }
          }, {
            key: "$exit",
            value: function $exit() {
              this._stopUpdatingVideoTexture();
            }
          }, {
            key: "timeupdate",
            value: function timeupdate() {
              this._fireConsumer('$mediaplayerProgress', {
                currentTime: this.videoEl.currentTime,
                duration: this.videoEl.duration || 1
              });
            }
          }, {
            key: "ended",
            value: function ended(args) {
              this._fireConsumer('$mediaplayerEnded', args);

              this._setState("");
            }
          }, {
            key: "pause",
            value: function pause(args) {
              this._fireConsumer('$mediaplayerPause', args);

              this._setState("Playing.Paused");
            }
          }, {
            key: "_clearSrc",
            value: function _clearSrc() {
              this._fireConsumer('$mediaplayerStop', {});

              this._setState("");
            }
          }], [{
            key: "_states",
            value: function _states() {
              return [
              /*#__PURE__*/
              function (_this6) {
                _inherits(Paused, _this6);

                function Paused() {
                  _classCallCheck(this, Paused);

                  return _possibleConstructorReturn(this, _getPrototypeOf(Paused).apply(this, arguments));
                }

                return Paused;
              }(this)];
            }
          }]);

          return Playing;
        }(this)];
      }
    }]);

    return Mediaplayer;
  }(lng.Component);

  var NoopMediaplayer =
  /*#__PURE__*/
  function (_lng$Component2) {
    _inherits(NoopMediaplayer, _lng$Component2);

    function NoopMediaplayer() {
      _classCallCheck(this, NoopMediaplayer);

      return _possibleConstructorReturn(this, _getPrototypeOf(NoopMediaplayer).apply(this, arguments));
    }

    _createClass(NoopMediaplayer, [{
      key: "open",
      value: function open(url) {
        console.log('Playing stream', url);
      }
    }, {
      key: "close",
      value: function close() {}
    }, {
      key: "playPause",
      value: function playPause() {
        if (this.isPlaying()) {
          this.doPause();
        } else {
          this.doPlay();
        }
      }
    }, {
      key: "isPlaying",
      value: function isPlaying() {
        return this._getState() === "Playing";
      }
    }, {
      key: "doPlay",
      value: function doPlay() {}
    }, {
      key: "doPause",
      value: function doPause() {}
    }, {
      key: "reload",
      value: function reload() {}
    }, {
      key: "getPosition",
      value: function getPosition() {
        return Promise.resolve(0);
      }
    }, {
      key: "setPosition",
      value: function setPosition(pos) {}
    }, {
      key: "getDuration",
      value: function getDuration() {
        return Promise.resolve(0);
      }
    }, {
      key: "seek",
      value: function seek(time) {
        var absolute = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      }
    }, {
      key: "updateSettings",
      value: function updateSettings() {
        var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      }
    }], [{
      key: "_template",
      value: function _template() {
        return {
          Video: {
            w: 1920,
            h: 1080
          }
        };
      }
    }, {
      key: "_states",
      value: function _states() {
        return [
        /*#__PURE__*/
        function (_this7) {
          _inherits(Playing, _this7);

          function Playing() {
            _classCallCheck(this, Playing);

            return _possibleConstructorReturn(this, _getPrototypeOf(Playing).apply(this, arguments));
          }

          _createClass(Playing, null, [{
            key: "_states",
            value: function _states() {
              return [
              /*#__PURE__*/
              function (_this8) {
                _inherits(Paused, _this8);

                function Paused() {
                  _classCallCheck(this, Paused);

                  return _possibleConstructorReturn(this, _getPrototypeOf(Paused).apply(this, arguments));
                }

                return Paused;
              }(this)];
            }
          }]);

          return Playing;
        }(this)];
      }
    }]);

    return NoopMediaplayer;
  }(lng.Component);

  var ScaledImageTexture =
  /*#__PURE__*/
  function (_lng$textures$ImageTe) {
    _inherits(ScaledImageTexture, _lng$textures$ImageTe);

    function ScaledImageTexture(stage) {
      var _this9;

      _classCallCheck(this, ScaledImageTexture);

      _this9 = _possibleConstructorReturn(this, _getPrototypeOf(ScaledImageTexture).call(this, stage));
      _this9._scalingOptions = undefined;
      _this9.precision = 1;
      return _this9;
    }

    _createClass(ScaledImageTexture, [{
      key: "_getLookupId",
      value: function _getLookupId() {
        var opts = this._scalingOptions;
        return "".concat(this._src, "-").concat(opts.type, "-").concat(opts.width, "-").concat(opts.height);
      }
    }, {
      key: "_getSourceLoader",
      value: function _getSourceLoader() {
        var src = this._src;

        if (this.stage.getOption('srcBasePath')) {
          var fc = src.charCodeAt(0);

          if (src.indexOf("//") === -1 && (fc >= 65 && fc <= 90 || fc >= 97 && fc <= 122 || fc == 46)) {
            // Alphabetical or dot: prepend base path.
            src = this.stage.getOption('srcBasePath') + src;
          }
        }

        if (this.stage.application.useImageServer) {
          src = this._getImageServerSrc(src);
        } else {
          this.resizeMode = ScaledImageTexture._convertScalingOptions(this._scalingOptions);
        }

        var platform = this.stage.platform;
        return function (cb) {
          return platform.loadSrcTexture({
            src: src,
            hasAlpha: this._hasAlpha
          }, cb);
        };
      }
    }, {
      key: "_getImageServerSrc",
      value: function _getImageServerSrc(src) {
        if (this._scalingOptions && this._precision !== 1) {
          var opts = lng.Utils.clone(this._scalingOptions);

          if (opts.width) {
            opts.width = Math.round(opts.width * this._precision);
          }

          if (opts.height) {
            opts.height = Math.round(opts.height * this._precision);
          }

          src = ScaledImageTexture.getImageUrl(src, opts);
        } else {
          src = ScaledImageTexture.getImageUrl(src, this._scalingOptions);
        }

        return src;
      }
    }, {
      key: "getNonDefaults",
      value: function getNonDefaults() {
        var obj = _get(_getPrototypeOf(ScaledImageTexture.prototype), "getNonDefaults", this).call(this);

        if (this._src) {
          obj.src = this._src;
        }

        return obj;
      }
    }, {
      key: "scalingOptions",
      set: function set(options) {
        if (!lng.Utils.equalValues(this._scalingOptions, options)) {
          this._scalingOptions = options;

          this._changed();
        }
      }
    }, {
      key: "precision",
      get: function get() {
        return this._customPrecision;
      },
      set: function set(v) {
        this._customPrecision = v;

        _set(_getPrototypeOf(ScaledImageTexture.prototype), "precision", this.stage.getRenderPrecision() * this._customPrecision, this, true);
      }
    }], [{
      key: "_convertScalingOptions",
      value: function _convertScalingOptions(options) {
        var opts = lng.Utils.clone(options);

        switch (options.type) {
          case "crop":
            opts.type = "cover";
            break;

          case "fit":
          case "parent":
          case "exact":
          case "height":
          case "portrait":
          case "width":
          case "landscape":
          case "auto":
          default:
            opts.type = "contain";
            break;
        }

        opts.w = opts.w || opts.width || 0;
        opts.h = opts.h || opts.height || 0;
        return opts;
      }
    }, {
      key: "getImageUrl",
      value: function getImageUrl(url) {
        var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        return this._getCdnProtocol() + "://cdn.metrological.com/image" + this.getQueryString(url, opts);
      }
    }, {
      key: "_getCdnProtocol",
      value: function _getCdnProtocol() {
        return lng.Utils.isWeb && location.protocol === "https:" ? "https" : "http";
      }
    }, {
      key: "getQueryString",
      value: function getQueryString(url, opts) {
        var key = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "url";
        var str = "?operator=".concat(encodeURIComponent('metrological'));
        var keys = Object.keys(opts);
        keys.forEach(function (key) {
          str += "&" + encodeURIComponent(key) + "=" + encodeURIComponent("" + opts[key]);
        });
        str += "&".concat(key, "=").concat(encodeURIComponent(url));
        return str;
      }
    }]);

    return ScaledImageTexture;
  }(lng.textures.ImageTexture);

  var Ui =
  /*#__PURE__*/
  function (_lng$Application) {
    _inherits(Ui, _lng$Application);

    function Ui(options) {
      var _this10;

      _classCallCheck(this, Ui);

      options.defaultFontFace = options.defaultFontFace || "RobotoRegular";
      _this10 = _possibleConstructorReturn(this, _getPrototypeOf(Ui).call(this, options));
      _this10._options = options;
      return _this10;
    }

    _createClass(Ui, [{
      key: "_active",
      value: function _active() {
        this.tag('Mediaplayer').skipRenderToTexture = this._options.skipRenderToTexture;
      }
    }, {
      key: "startApp",
      value: function startApp(appClass) {
        this._setState("App.Loading", [appClass]);
      }
    }, {
      key: "stopApp",
      value: function stopApp() {}
    }, {
      key: "_handleBack",
      value: function _handleBack() {
        if (lng.Utils.isWeb) {
          window.close();
        }
      }
    }, {
      key: "loadPlatformFonts",
      value: function loadPlatformFonts(fonts) {
        if (lng.Utils.isNode && !lng.Utils.isSpark) {
          // Font loading not supported. Fonts should be installed in Linux system and then they can be picked up by cairo.
          return Promise.resolve();
        }

        if (lng.Utils.isSpark) {
          var ret = this.stage.platform.loadFonts(fonts);
          return Promise.all(ret.promises).then(function () {
            return ret.fontResources;
          });
        }
      }
    }, {
      key: "_getFocused",
      value: function _getFocused() {
        return this.tag("App");
      }
    }, {
      key: "_setFocusSettings",
      value: function _setFocusSettings(settings) {
        settings.clearColor = this.stage.getOption('clearColor');
        settings.mediaplayer = {
          consumer: null,
          stream: null,
          hide: false,
          videoPos: [0, 0, 1920, 1080]
        };
      }
    }, {
      key: "_handleFocusSettings",
      value: function _handleFocusSettings(settings) {
        if (this._clearColor !== settings.clearColor) {
          this._clearColor = settings.clearColor;
          this.stage.setClearColor(settings.clearColor);
        }

        if (this.tag("Mediaplayer").attached) {
          this.tag("Mediaplayer").updateSettings(settings.mediaplayer);
        }
      }
    }, {
      key: "useImageServer",
      get: function get() {
        return !Ui.hasOption("noImageServer");
      }
    }, {
      key: "mediaplayer",
      get: function get() {
        return this.tag("Mediaplayer");
      }
    }], [{
      key: "_template",
      value: function _template() {
        var mediaPlayerType = NoopMediaplayer;

        if (lng.Utils.isWeb) {
          mediaPlayerType = Mediaplayer;
        } else if (lng.Utils.isSpark && lng.Stage.platform.supportsMediaPlayer()) {
          mediaPlayerType = lng.Stage.platform.createMediaPlayer();
        }

        return {
          Mediaplayer: {
            type: mediaPlayerType,
            textureMode: Ui.hasOption('texture')
          },
          AppWrapper: {}
        };
      }
    }, {
      key: "loadFonts",
      value: function loadFonts(fonts) {
        var fontFaces = fonts.map(function (_ref) {
          var family = _ref.family,
              url = _ref.url,
              descriptors = _ref.descriptors;
          return new FontFace(family, "url(".concat(url, ")"), descriptors);
        });
        fontFaces.forEach(function (fontFace) {
          document.fonts.add(fontFace);
        });
        return Promise.all(fontFaces.map(function (ff) {
          return ff.load();
        })).then(function () {
          return fontFaces;
        });
      }
    }, {
      key: "getPath",
      value: function getPath(relPath) {
        return this._staticFilesPath + "static-ux/" + relPath;
      }
    }, {
      key: "getFonts",
      value: function getFonts() {
        return [{
          family: 'RobotoRegular',
          url: Ui.getPath('fonts/roboto-regular.ttf'),
          descriptors: {}
        }, {
          family: 'Material-Icons',
          url: Ui.getPath('fonts/Material-Icons.ttf'),
          descriptors: {}
        }];
      }
    }, {
      key: "_states",
      value: function _states() {
        return [
        /*#__PURE__*/
        function (_this11) {
          _inherits(App, _this11);

          function App() {
            _classCallCheck(this, App);

            return _possibleConstructorReturn(this, _getPrototypeOf(App).apply(this, arguments));
          }

          _createClass(App, [{
            key: "stopApp",
            value: function stopApp() {
              this._setState("");
            }
          }], [{
            key: "_states",
            value: function _states() {
              return [
              /*#__PURE__*/
              function (_this12) {
                _inherits(Loading, _this12);

                function Loading() {
                  _classCallCheck(this, Loading);

                  return _possibleConstructorReturn(this, _getPrototypeOf(Loading).apply(this, arguments));
                }

                _createClass(Loading, [{
                  key: "$enter",
                  value: function $enter(context, appClass) {
                    this._startApp(appClass);
                  }
                }, {
                  key: "_startApp",
                  value: function _startApp(appClass) {
                    var _this13 = this;

                    this._currentApp = {
                      type: appClass,
                      fontFaces: []
                    }; // Preload fonts.

                    var fonts = this._currentApp.type.getFonts().concat(Ui.getFonts());

                    var fn = lng.Utils.isWeb ? Ui.loadFonts(fonts) : this.loadPlatformFonts(fonts);
                    fn.then(function (fontFaces) {
                      _this13._currentApp.fontFaces = fontFaces;
                    })["catch"](function (e) {
                      console.warn('Font loading issues: ' + e);
                    })["finally"](function () {
                      _this13._done();
                    });
                  }
                }, {
                  key: "_done",
                  value: function _done() {
                    this._setState("App.Started");
                  }
                }]);

                return Loading;
              }(this),
              /*#__PURE__*/
              function (_this14) {
                _inherits(Started, _this14);

                function Started() {
                  _classCallCheck(this, Started);

                  return _possibleConstructorReturn(this, _getPrototypeOf(Started).apply(this, arguments));
                }

                _createClass(Started, [{
                  key: "$enter",
                  value: function $enter() {
                    this.tag("AppWrapper").children = [{
                      ref: "App",
                      type: this._currentApp.type
                    }];
                  }
                }, {
                  key: "$exit",
                  value: function $exit() {
                    this.tag("AppWrapper").children = [];
                  }
                }]);

                return Started;
              }(this)];
            }
          }]);

          return App;
        }(this)];
      }
    }, {
      key: "getProxyUrl",
      value: function getProxyUrl(url) {
        var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        return this._getCdnProtocol() + "://cdn.metrological.com/proxy" + this.getQueryString(url, opts);
      }
    }, {
      key: "getImage",
      value: function getImage(url) {
        var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        return {
          type: ScaledImageTexture,
          src: url,
          scalingOptions: opts
        };
      }
    }, {
      key: "getImageUrl",
      value: function getImageUrl(url) {
        var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        throw new Error("{src: Ui.getImageUrl(...)} is deprecated. Please use {texture: Ui.getImage(...)} instead.");
      }
    }, {
      key: "getQrUrl",
      value: function getQrUrl(url) {
        var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        return this._getCdnProtocol() + "://cdn.metrological.com/qr" + this.getQueryString(url, opts, "q");
      }
    }, {
      key: "_getCdnProtocol",
      value: function _getCdnProtocol() {
        return lng.Utils.isWeb && location.protocol === "https:" ? "https" : "http";
      }
    }, {
      key: "hasOption",
      value: function hasOption(name) {
        if (lng.Utils.isNode) {
          return false;
        }

        return new URL(document.location.href).searchParams.has(name);
      }
    }, {
      key: "getOption",
      value: function getOption(name) {
        if (lng.Utils.isNode) {
          return undefined;
        }

        return new URL(document.location.href).searchParams.get(name);
      }
    }, {
      key: "getQueryString",
      value: function getQueryString(url, opts) {
        var key = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "url";
        var str = "?operator=".concat(encodeURIComponent(this.getOption('operator') || 'metrological'));
        var keys = Object.keys(opts);
        keys.forEach(function (key) {
          str += "&" + encodeURIComponent(key) + "=" + encodeURIComponent("" + opts[key]);
        });
        str += "&".concat(key, "=").concat(encodeURIComponent(url));
        return str;
      }
    }, {
      key: "staticFilesPath",
      set: function set(path) {
        this._staticFilesPath = path;
      }
    }]);

    return Ui;
  }(lng.Application);

  Ui._staticFilesPath = "./";

  var App =
  /*#__PURE__*/
  function (_lng$Component3) {
    _inherits(App, _lng$Component3);

    function App() {
      _classCallCheck(this, App);

      return _possibleConstructorReturn(this, _getPrototypeOf(App).apply(this, arguments));
    }

    _createClass(App, [{
      key: "getPath",
      value: function getPath(relPath) {
        return App.getPath(this.constructor, relPath);
      }
    }], [{
      key: "g",
      value: function g(c) {
        return c.seekAncestorByType(this);
      }
      /**
       * Returns all fonts to be preloaded before entering this app.
       * @returns {{family: string, url: string, descriptors: {}}[]}
       */

    }, {
      key: "getFonts",
      value: function getFonts() {
        return [];
      }
    }, {
      key: "getPath",
      value: function getPath(relPath) {
        return Ui._staticFilesPath + "static/" + relPath;
      }
    }, {
      key: "identifier",
      get: function get() {
        throw new Error("Please supply an identifier in the App definition file.");
      }
    }]);

    return App;
  }(lng.Component);

  var PlayerButton =
  /*#__PURE__*/
  function (_lng$Component4) {
    _inherits(PlayerButton, _lng$Component4);

    function PlayerButton() {
      _classCallCheck(this, PlayerButton);

      return _possibleConstructorReturn(this, _getPrototypeOf(PlayerButton).apply(this, arguments));
    }

    _createClass(PlayerButton, [{
      key: "_focus",
      value: function _focus() {
        this._setState("Selected");
      }
    }, {
      key: "_unfocus",
      value: function _unfocus() {
        this._setState("");
      }
    }, {
      key: "icon",
      set: function set(source) {
        this.tag("Icon").src = Ui.getPath("tools/player/img/".concat(source));
      }
    }, {
      key: "active",
      set: function set(v) {
        this.alpha = v ? 1 : 0.3;
      },
      get: function get() {
        return this.alpha === 1;
      }
    }], [{
      key: "_template",
      value: function _template() {
        var o = this.options;
        return {
          w: o.w,
          h: o.h,
          Background: {
            x: -1,
            y: -1,
            texture: lng.Tools.getRoundRect(o.w, o.h, 4, 0, 0, true),
            color: o.colors.deselected
          },
          Icon: {
            x: o.w / 2,
            y: o.h / 2,
            mount: 0.5,
            color: o.colors.selected
          }
        };
      }
    }, {
      key: "_states",
      value: function _states() {
        return [
        /*#__PURE__*/
        function (_this15) {
          _inherits(Selected, _this15);

          function Selected() {
            _classCallCheck(this, Selected);

            return _possibleConstructorReturn(this, _getPrototypeOf(Selected).apply(this, arguments));
          }

          _createClass(Selected, [{
            key: "$enter",
            value: function $enter() {
              this.tag("Background").color = this.constructor.options.colors.selected;
              this.tag("Icon").color = this.constructor.options.colors.deselected;
            }
          }, {
            key: "$exit",
            value: function $exit() {
              this.tag("Background").color = this.constructor.options.colors.deselected;
              this.tag("Icon").color = this.constructor.options.colors.selected;
            }
          }]);

          return Selected;
        }(this)];
      }
    }, {
      key: "_buildOptions",
      value: function _buildOptions() {
        return {
          colors: {
            selected: 0xFFFFFFFF,
            deselected: 0xFF606060
          },
          w: 60,
          h: 60
        };
      }
    }, {
      key: "options",
      get: function get() {
        if (!this._options) {
          this._options = this._buildOptions();
        }

        return this._options;
      }
    }]);

    return PlayerButton;
  }(lng.Component);

  var PlayerControls =
  /*#__PURE__*/
  function (_lng$Component5) {
    _inherits(PlayerControls, _lng$Component5);

    function PlayerControls() {
      _classCallCheck(this, PlayerControls);

      return _possibleConstructorReturn(this, _getPrototypeOf(PlayerControls).apply(this, arguments));
    }

    _createClass(PlayerControls, [{
      key: "showButtons",
      value: function showButtons(previous, next) {
        var o = this.constructor.options;
        var buttons = [];
        if (previous) buttons.push("Previous");
        buttons = buttons.concat(o.buttons);
        if (next) buttons.push("Next");

        this._setActiveButtons(buttons);
      }
    }, {
      key: "_setActiveButtons",
      value: function _setActiveButtons(buttons) {
        var _this16 = this;

        var o = this.constructor.options;
        var x = 0;
        this._activeButtons = [];
        this.tag("Buttons").children.map(function (button) {
          button.active = buttons.indexOf(button.ref) !== -1;
          button.x = x;

          if (button.active) {
            _this16._activeButtons.push(button);
          }

          x += button.renderWidth + o.margin;
        });
        this.tag("Title").x = x + 20;

        this._checkActiveButton();
      }
    }, {
      key: "_setup",
      value: function _setup() {
        this._setState("Play");
      }
    }, {
      key: "_init",
      value: function _init() {
        this.showButtons(false, false);

        this._setState("Play");
      }
    }, {
      key: "_checkActiveButton",
      value: function _checkActiveButton() {
        // After changing the active buttons, make sure that an active button is selected.
        var index = this._activeButtonIndex;

        if (index === -1) {
          if (this._index >= this._activeButtons.length) {
            this._index = this._activeButtons.length - 1;
          }
        }

        this._setState(this._activeButtons[index].ref);
      }
    }, {
      key: "_handleLeft",
      value: function _handleLeft() {
        var index = this._activeButtonIndex;

        if (index > 0) {
          index--;
        }

        this._setState(this._activeButtons[index].ref);
      }
    }, {
      key: "_handleRight",
      value: function _handleRight() {
        var index = this._activeButtonIndex;

        if (index < this._activeButtons.length - 1) {
          index++;
        }

        this._setState(this._activeButtons[index].ref);
      }
    }, {
      key: "_handleEnter",
      value: function _handleEnter() {
        this.signal('press' + this._activeButton.ref);
      }
    }, {
      key: "_getFocused",
      value: function _getFocused() {
        return this.tag(this._getState());
      }
    }, {
      key: "title",
      set: function set(title) {
        this.tag("Title").text = title || "";
      }
    }, {
      key: "_activeButtonIndex",
      get: function get() {
        var button = this.tag("Buttons").getByRef(this._getState());

        if (!button.active) {
          button = this.tag("Play");
        }

        return this._activeButtons.indexOf(button);
      }
    }, {
      key: "_activeButton",
      get: function get() {
        return this._activeButtons[this._activeButtonIndex];
      }
    }, {
      key: "paused",
      set: function set(v) {
        this.tag("Play").icon = v ? "play.png" : "pause.png";
      }
    }], [{
      key: "_template",
      value: function _template() {
        return {
          Buttons: {
            Previous: {
              type: this.PlayerButton,
              icon: "prev.png"
            },
            Play: {
              type: this.PlayerButton,
              icon: "play.png"
            },
            Next: {
              type: this.PlayerButton,
              icon: "next.png"
            }
          },
          Title: {
            text: {
              fontSize: 46,
              lineHeight: 56,
              maxLines: 1,
              shadow: true
            },
            y: 2
          }
        };
      }
    }, {
      key: "_states",
      value: function _states() {
        return [
        /*#__PURE__*/
        function (_this17) {
          _inherits(Previous, _this17);

          function Previous() {
            _classCallCheck(this, Previous);

            return _possibleConstructorReturn(this, _getPrototypeOf(Previous).apply(this, arguments));
          }

          return Previous;
        }(this),
        /*#__PURE__*/
        function (_this18) {
          _inherits(Play, _this18);

          function Play() {
            _classCallCheck(this, Play);

            return _possibleConstructorReturn(this, _getPrototypeOf(Play).apply(this, arguments));
          }

          return Play;
        }(this),
        /*#__PURE__*/
        function (_this19) {
          _inherits(Next, _this19);

          function Next() {
            _classCallCheck(this, Next);

            return _possibleConstructorReturn(this, _getPrototypeOf(Next).apply(this, arguments));
          }

          return Next;
        }(this)];
      }
    }, {
      key: "_buildOptions",
      value: function _buildOptions() {
        return {
          buttons: ["Play"],
          margin: 10
        };
      }
    }, {
      key: "PlayerButton",
      get: function get() {
        return PlayerButton;
      }
    }, {
      key: "options",
      get: function get() {
        if (!this._options) {
          this._options = this._buildOptions();
        }

        return this._options;
      }
    }]);

    return PlayerControls;
  }(lng.Component);

  var PlayerProgress =
  /*#__PURE__*/
  function (_lng$Component6) {
    _inherits(PlayerProgress, _lng$Component6);

    function PlayerProgress() {
      _classCallCheck(this, PlayerProgress);

      return _possibleConstructorReturn(this, _getPrototypeOf(PlayerProgress).apply(this, arguments));
    }

    _createClass(PlayerProgress, [{
      key: "setProgress",
      value: function setProgress(currentTime, duration) {
        this._progress = currentTime / Math.max(duration, 1);
        this.tag("CurrentTime").text = Player.formatTime(currentTime);
        this.tag("Duration").text = Player.formatTime(duration);
      }
    }, {
      key: "_alter",
      value: function _alter() {}
    }, {
      key: "_setup",
      value: function _setup() {
        this._alter();
      }
    }, {
      key: "_init",
      value: function _init() {
        this.tag("Active").texture = {
          type: lng.textures.SourceTexture,
          textureSource: this.tag("Total").texture.source
        };
      }
    }, {
      key: "_progress",
      set: function set(v) {
        var now = Date.now();
        var estimation = 0;

        if (!this._last || this._last < now - 1000) {
          estimation = 500;
        } else {
          estimation = now - this._last;
        }

        this._last = now;
        var x = v * 1720;
        estimation *= 0.001;
        this.tag("Total").setSmooth('x', x, {
          timingFunction: 'linear',
          duration: estimation
        });
        this.tag("Total").setSmooth('texture.x', x, {
          timingFunction: 'linear',
          duration: estimation
        });
        this.tag("Active").setSmooth('texture.w', Math.max(x, 0.0001)
        /* force clipping */
        , {
          timingFunction: 'linear',
          duration: estimation
        });
      }
    }], [{
      key: "_template",
      value: function _template() {
        return {
          Progress: {
            forceZIndexContext: true,
            Total: {
              x: -1,
              y: -1,
              texture: lng.Tools.getRoundRect(1720, 10, 4),
              color: 0xFF606060,
              Scroller: {
                x: 0,
                y: 6,
                mount: 0.5,
                w: 16,
                h: 16,
                zIndex: 2,
                Shadow: {
                  texture: lng.Tools.getShadowRect(16, 16, 8),
                  mount: 0.5,
                  x: 8,
                  y: 8,
                  color: 0xFF000000
                },
                Main: {
                  texture: lng.Tools.getRoundRect(16, 16, 8),
                  mount: 0.5,
                  x: 8,
                  y: 8,
                  color: 0xFFF1F1F1
                }
              }
            },
            Active: {
              x: -1,
              y: -1,
              color: 0xFFF1F1F1
            },
            CurrentTime: {
              x: 0,
              y: 21,
              text: {
                fontSize: 28,
                lineHeight: 34,
                maxLines: 1,
                shadow: true,
                text: "00:00"
              }
            },
            Duration: {
              x: 1720,
              mountX: 1,
              y: 21,
              text: {
                fontSize: 28,
                lineHeight: 34,
                maxLines: 1,
                shadow: true,
                text: "00:00"
              }
            }
          }
        };
      }
    }, {
      key: "formatTime",
      value: function formatTime(seconds) {
        var hours = Math.floor(seconds / 3600);
        seconds -= hours * 3600;
        var minutes = Math.floor(seconds / 60);
        seconds -= minutes * 60;
        seconds = Math.floor(seconds);
        var parts = [];
        if (hours) parts.push(hours);
        parts.push(minutes);
        parts.push(seconds);
        return parts.map(function (number) {
          return number < 10 ? "0" + number : "" + number;
        }).join(":");
      }
    }]);

    return PlayerProgress;
  }(lng.Component);

  var Player =
  /*#__PURE__*/
  function (_lng$Component7) {
    _inherits(Player, _lng$Component7);

    function Player() {
      _classCallCheck(this, Player);

      return _possibleConstructorReturn(this, _getPrototypeOf(Player).apply(this, arguments));
    }

    _createClass(Player, [{
      key: "_setItem",
      value: function _setItem(item) {
        this.tag("Progress").setProgress(0, 0);
        this._item = item;
        this._stream = item.stream;
        this.tag("Controls").title = item.title;
        this._index = this._items.indexOf(item);
        this.tag("Controls").showButtons(this._index > 0, this._index < this._items.length - 1);
        this.application.updateFocusSettings();
      }
    }, {
      key: "_setInterfaceTimeout",
      value: function _setInterfaceTimeout() {
        var _this20 = this;

        if (this._timeout) {
          clearTimeout(this._timeout);
        }

        this._timeout = setTimeout(function () {
          _this20._hide();
        }, 8000);
      }
    }, {
      key: "_init",
      value: function _init() {
        this._setState("Controls");
      }
    }, {
      key: "_focus",
      value: function _focus() {
        this._setInterfaceTimeout();
      }
    }, {
      key: "_unfocus",
      value: function _unfocus() {
        clearTimeout(this._timeout);
      }
    }, {
      key: "$mediaplayerEnded",
      value: function $mediaplayerEnded() {
        this._pressNext();
      }
    }, {
      key: "play",
      value: function play(_ref2) {
        var item = _ref2.item,
            _ref2$items = _ref2.items,
            items = _ref2$items === void 0 ? [item] : _ref2$items;
        this._items = items;

        this._setItem(item);

        return !!this._stream;
      }
    }, {
      key: "pressPrevious",
      value: function pressPrevious() {
        var index = this._index - 1;

        if (index < 0) {
          this._index = this._items.length - 1;
        }

        this._setItem(this._items[index]);
      }
    }, {
      key: "_pressNext",
      value: function _pressNext() {
        if (!this._items.length) {
          return this.signal('playerStop');
        }

        var index = (this._index + 1) % this._items.length;

        this._setItem(this._items[index]);
      }
    }, {
      key: "pressPlay",
      value: function pressPlay() {
        this.application.mediaplayer.playPause();
      }
    }, {
      key: "$mediaplayerPause",
      value: function $mediaplayerPause() {
        this.tag("Controls").paused = true;
      }
    }, {
      key: "$mediaplayerPlay",
      value: function $mediaplayerPlay() {
        this.tag("Controls").paused = false;
      }
    }, {
      key: "$mediaplayerStop",
      value: function $mediaplayerStop() {
        this.signal('playerStop');
      }
    }, {
      key: "$mediaplayerProgress",
      value: function $mediaplayerProgress(_ref3) {
        var currentTime = _ref3.currentTime,
            duration = _ref3.duration;
        this.tag("Progress").setProgress(currentTime, duration);
      }
    }, {
      key: "_captureKey",
      value: function _captureKey() {
        this._setInterfaceTimeout();

        return false;
      }
    }, {
      key: "_hide",
      value: function _hide() {
        this._setState("Hidden");
      }
    }, {
      key: "_getFocused",
      value: function _getFocused() {
        return this.tag("Controls");
      }
    }, {
      key: "_setFocusSettings",
      value: function _setFocusSettings(settings) {
        settings.mediaplayer.consumer = this;
      }
    }, {
      key: "getMediaplayerSettings",
      value: function getMediaplayerSettings() {
        if (this._stream.link) {
          // Backwards compatibility.
          this._stream.src = this._stream.link;
        }

        return {
          stream: this._stream
        };
      }
    }], [{
      key: "_template",
      value: function _template() {
        return {
          Gradient: {
            x: 0,
            y: 1080,
            h: 300,
            w: 1920,
            mountY: 1,
            colorTop: 0x00101010,
            colorBottom: 0xE6101010,
            rect: true
          },
          Controls: {
            x: 99,
            y: 890,
            type: this.PlayerControls,
            signals: {
              pressPlay: true,
              pressPrevious: true,
              pressNext: "_pressNext"
            }
          },
          Progress: {
            x: 99,
            y: 970,
            type: this.PlayerProgress
          }
        };
      }
    }, {
      key: "formatTime",
      value: function formatTime(seconds) {
        var hours = Math.floor(seconds / 3600);
        seconds -= hours * 3600;
        var minutes = Math.floor(seconds / 60);
        seconds -= minutes * 60;
        seconds = Math.floor(seconds);
        var parts = [];
        if (hours) parts.push(hours);
        parts.push(minutes);
        parts.push(seconds);
        return parts.map(function (number) {
          return number < 10 ? "0" + number : "" + number;
        }).join(":");
      }
    }, {
      key: "_states",
      value: function _states() {
        return [
        /*#__PURE__*/
        function (_this21) {
          _inherits(Hidden, _this21);

          function Hidden() {
            _classCallCheck(this, Hidden);

            return _possibleConstructorReturn(this, _getPrototypeOf(Hidden).apply(this, arguments));
          }

          _createClass(Hidden, [{
            key: "$enter",
            value: function $enter(_ref4) {
              var prevState = _ref4.prevState;
              this._prevState = prevState;
              this.setSmooth('alpha', 0);
            }
          }, {
            key: "$exit",
            value: function $exit() {
              this._setInterfaceTimeout();

              this.setSmooth('alpha', 1);
            }
          }, {
            key: "_captureKey",
            value: function _captureKey() {
              this._setState(this._prevState);
            }
          }]);

          return Hidden;
        }(this),
        /*#__PURE__*/
        function (_this22) {
          _inherits(Controls, _this22);

          function Controls() {
            _classCallCheck(this, Controls);

            return _possibleConstructorReturn(this, _getPrototypeOf(Controls).apply(this, arguments));
          }

          return Controls;
        }(this)];
      }
    }, {
      key: "PlayerControls",
      get: function get() {
        return PlayerControls;
      }
    }, {
      key: "PlayerProgress",
      get: function get() {
        return PlayerProgress;
      }
    }]);

    return Player;
  }(lng.Component);

  var obj = {
    Player: Player,
    PlayerButton: PlayerButton,
    PlayerControls: PlayerControls,
    PlayerProgress: PlayerProgress
  };

  var Light3dComponent =
  /*#__PURE__*/
  function (_lng$Component8) {
    _inherits(Light3dComponent, _lng$Component8);

    function Light3dComponent(stage) {
      var _this23;

      _classCallCheck(this, Light3dComponent);

      _this23 = _possibleConstructorReturn(this, _getPrototypeOf(Light3dComponent).call(this, stage));

      _this23.patch({
        __create: true,
        Main: {
          x: -1,
          y: -1,
          shader: {
            type: lng.shaders.Light3d,
            fudge: 0.3
          },
          renderToTexture: true,
          Wrapper: {
            x: 1,
            y: 1,
            clipping: true,
            Content: {}
          }
        }
      });

      _this23._shaderZ = 0;
      _this23._shaderZ0 = 0;
      _this23._shaderZ1 = 0;
      _this23._shaderRx = 0;
      _this23._shaderRx0 = 0;
      _this23._shaderRx1 = 0;
      _this23._shaderRy = 0;
      _this23._shaderRy0 = 0;
      _this23._shaderRy1 = 0;
      _this23._focusedZ = -150;

      _this23._createAnimations();

      _this23.transition('lightShader.strength', {
        duration: 0.2
      });

      _this23.transition('lightShader.ambient', {
        duration: 0.2
      });

      return _this23;
    }

    _createClass(Light3dComponent, [{
      key: "_createAnimations",
      value: function _createAnimations() {
        this._anims = {
          neutral: this.animation({
            duration: 0.4,
            actions: [{
              p: 'shaderZ0',
              merger: lng.StageUtils.mergeNumbers,
              v: {
                0: 0,
                0.5: -140,
                1: -150
              }
            }]
          }),
          left: this._createAnimation('x', -1, 0),
          right: this._createAnimation('x', 1, 1),
          up: this._createAnimation('y', -1, 0),
          down: this._createAnimation('y', 1, 0)
        };
      }
    }, {
      key: "_createAnimation",
      value: function _createAnimation(axis, sign, idx) {
        return this.animation({
          duration: 0.4,
          stopDuration: 0.2,
          actions: [{
            p: 'shaderR' + axis + idx,
            merger: lng.StageUtils.mergeNumbers,
            v: {
              0: 0,
              0.3: -0.20 * sign,
              1: 0
            }
          }, {
            p: 'shaderZ' + idx,
            merger: lng.StageUtils.mergeNumbers,
            v: {
              0: 0,
              0.5: this._focusedZ + 10,
              1: this._focusedZ
            }
          }]
        });
      }
    }, {
      key: "_recalc",
      value: function _recalc() {
        this.tag('Main').shader.rx = this._shaderRx0 + this._shaderRx1 + this._shaderRx;
        this.tag('Main').shader.ry = this._shaderRy0 + this._shaderRy1 + this._shaderRy;
        this.tag('Main').shader.z = this._shaderZ0 + this._shaderZ1 + this._shaderZ;
        this.tag('Main').shader.pivotZ = this._shaderZ0 + this._shaderZ1 + this._shaderZ;
      }
    }, {
      key: "leftEnter",
      value: function leftEnter() {
        this._anims['left'].start();

        this._enable3dShader();
      }
    }, {
      key: "leftExit",
      value: function leftExit() {
        this.neutralExit();
      }
    }, {
      key: "rightEnter",
      value: function rightEnter() {
        this._anims['right'].start();

        this._enable3dShader();
      }
    }, {
      key: "rightExit",
      value: function rightExit() {
        this.neutralExit();
      }
    }, {
      key: "upEnter",
      value: function upEnter() {
        this._anims['up'].start();

        this._enable3dShader();
      }
    }, {
      key: "upExit",
      value: function upExit() {
        this.neutralExit();
      }
    }, {
      key: "downEnter",
      value: function downEnter() {
        this._anims['down'].start();

        this._enable3dShader();
      }
    }, {
      key: "downExit",
      value: function downExit() {
        this.neutralExit();
      }
    }, {
      key: "neutralEnter",
      value: function neutralEnter() {
        this._anims['neutral'].start();

        this._enable3dShader();
      }
    }, {
      key: "neutralExit",
      value: function neutralExit() {
        this._anims['up'].stop();

        this._anims['down'].stop();

        this._anims['left'].stop();

        this._anims['right'].stop();

        this._anims['neutral'].stop();

        this._disable3dShader();
      }
    }, {
      key: "_enable3dShader",
      value: function _enable3dShader() {
        this.patch({
          smooth: {
            'lightShader.strength': 0.4,
            'lightShader.ambient': 0.6
          }
        });
      }
    }, {
      key: "_disable3dShader",
      value: function _disable3dShader() {
        this.patch({
          smooth: {
            'lightShader.strength': 0,
            'lightShader.ambient': 1
          }
        });
      }
    }, {
      key: "focusedZ",
      get: function get() {
        return this._focusedZ;
      },
      set: function set(v) {
        this._focusedZ = v;

        this._createAnimations();
      }
    }, {
      key: "w",
      set: function set(v) {
        this.tag('Main').w = v + 2;
        this.tag('Wrapper').w = v;
      }
    }, {
      key: "h",
      set: function set(v) {
        this.tag('Main').h = v + 2;
        this.tag('Wrapper').h = v;
      }
    }, {
      key: "lightShader",
      get: function get() {
        return this.tag('Main').shader;
      },
      set: function set(v) {
        this.tag('Main').shader = v;
      }
    }, {
      key: "content",
      get: function get() {
        return this.tag('Content');
      },
      set: function set(v) {
        this.tag('Content').patch(v, true);
      }
    }, {
      key: "shaderZ",
      get: function get() {
        return this._shaderZ;
      },
      set: function set(v) {
        this._shaderZ = v;

        this._recalc();
      }
    }, {
      key: "shaderZ0",
      get: function get() {
        return this._shaderZ0;
      },
      set: function set(v) {
        this._shaderZ0 = v;

        this._recalc();
      }
    }, {
      key: "shaderZ1",
      get: function get() {
        return this._shaderZ1;
      },
      set: function set(v) {
        this._shaderZ1 = v;

        this._recalc();
      }
    }, {
      key: "shaderRx",
      get: function get() {
        return this._shaderRx;
      },
      set: function set(v) {
        this._shaderRx = v;

        this._recalc();
      }
    }, {
      key: "shaderRx0",
      get: function get() {
        return this._shaderRx0;
      },
      set: function set(v) {
        this._shaderRx0 = v;

        this._recalc();
      }
    }, {
      key: "shaderRx1",
      get: function get() {
        return this._shaderRx1;
      },
      set: function set(v) {
        this._shaderRx1 = v;

        this._recalc();
      }
    }, {
      key: "shaderRy",
      get: function get() {
        return this._shaderRy;
      },
      set: function set(v) {
        this._shaderRy = v;

        this._recalc();
      }
    }, {
      key: "shaderRy0",
      get: function get() {
        return this._shaderRy0;
      },
      set: function set(v) {
        this._shaderRy0 = v;

        this._recalc();
      }
    }, {
      key: "shaderRy1",
      get: function get() {
        return this._shaderRy1;
      },
      set: function set(v) {
        this._shaderRy1 = v;

        this._recalc();
      }
    }]);

    return Light3dComponent;
  }(lng.Component);

  var obj$1 = {
    Light3dComponent: Light3dComponent
  };
  var template = {
    keyWidth: 74,
    keyHeight: 74,
    horizontalSpacing: 8,
    verticalSpacing: 12,
    layouts: {
      'ABC': {
        rows: [{
          keys: [{
            c: 'A'
          }, {
            c: 'B'
          }, {
            c: 'C'
          }, {
            c: 'D'
          }, {
            c: 'E'
          }, {
            c: 'F'
          }, {
            c: 'G'
          }, {
            action: 'backspace',
            w: 148,
            patch: {
              mountY: 0.33,
              text: {
                text: '',
                fontFace: 'Material-Icons',
                fontSize: 55
              }
            }
          }]
        }, {
          keys: [{
            c: 'H'
          }, {
            c: 'I'
          }, {
            c: 'J'
          }, {
            c: 'K'
          }, {
            c: 'L'
          }, {
            c: 'M'
          }, {
            c: 'N'
          }, {
            action: 'toggleToLayout',
            toLayout: '#123',
            w: 148,
            c: '#123'
          }]
        }, {
          keys: [{
            c: 'O'
          }, {
            c: 'P'
          }, {
            c: 'Q'
          }, {
            c: 'R'
          }, {
            c: 'S'
          }, {
            c: 'T'
          }, {
            c: 'U'
          }]
        }, {
          keys: [{
            c: 'V'
          }, {
            c: 'W'
          }, {
            c: 'X'
          }, {
            c: 'Y'
          }, {
            c: 'Z'
          }, {
            c: '-'
          }, {
            c: '\''
          }]
        }, {
          keys: [{
            action: 'space',
            c: 'space',
            w: 183
          }, {
            action: 'delete',
            c: 'delete',
            w: 183
          }, {
            action: 'ok',
            c: 'ok',
            w: 183
          }]
        }]
      },
      '#123': {
        rows: [{
          keys: [{
            c: '1'
          }, {
            c: '2'
          }, {
            c: '3'
          }, {
            c: '&'
          }, {
            c: '#'
          }, {
            c: '('
          }, {
            c: ')'
          }, {
            action: 'backspace',
            w: 148,
            patch: {
              mountY: 0.33,
              text: {
                text: '',
                fontFace: 'Material-Icons',
                fontSize: 55
              }
            }
          }]
        }, {
          keys: [{
            c: '4'
          }, {
            c: '5'
          }, {
            c: '6'
          }, {
            c: '@'
          }, {
            c: '!'
          }, {
            c: '?'
          }, {
            c: ':'
          }, {
            action: 'toggleToLayout',
            toLayout: 'ABC',
            w: 148,
            c: 'ABC'
          }]
        }, {
          keys: [{
            c: '7'
          }, {
            c: '8'
          }, {
            c: '9'
          }, {
            c: '0'
          }, {
            c: '.'
          }, {
            c: '_'
          }, {
            c: '\"'
          }]
        }, {
          keys: [{
            action: 'space',
            c: 'space',
            w: 183
          }, {
            action: 'delete',
            c: 'delete',
            w: 183
          }, {
            action: 'ok',
            c: 'ok',
            w: 183
          }]
        }]
      }
    }
  };

  var KeyboardButton =
  /*#__PURE__*/
  function (_lng$Component9) {
    _inherits(KeyboardButton, _lng$Component9);

    function KeyboardButton() {
      _classCallCheck(this, KeyboardButton);

      return _possibleConstructorReturn(this, _getPrototypeOf(KeyboardButton).apply(this, arguments));
    }

    _createClass(KeyboardButton, [{
      key: "_update",
      value: function _update() {
        this.patch(this._getPatch(this._key));
      }
    }, {
      key: "_getPatch",
      value: function _getPatch(key) {
        var content = key.patch || {
          text: {
            text: key.c,
            fontFace: 'RobotoRegular',
            textAlign: 'center',
            fontSize: 36
          }
        };
        return {
          Background: {
            texture: lng.Tools.getRoundRect(this.w, this.h, 7, 0, 0xffffffff, true, 0xffffffff)
          },
          Content: _objectSpread({
            mountX: 0.5,
            mountY: 0.4,
            x: this.w / 2,
            y: this.h / 2
          }, content)
        };
      }
    }, {
      key: "_focus",
      value: function _focus() {
        this.patch({
          Background: {
            smooth: {
              colorTop: 0xff3777ee,
              colorBottom: 0xff2654a8
            }
          }
        });
      }
    }, {
      key: "_unfocus",
      value: function _unfocus() {
        this.patch({
          Background: {
            smooth: {
              colorTop: 0x80e8e8e8,
              colorBottom: 0x80d1d1d1
            }
          }
        });
      }
    }, {
      key: "_firstActive",
      value: function _firstActive() {
        this._update();
      }
    }, {
      key: "action",
      set: function set(v) {
        this._action = v;
      },
      get: function get() {
        return this._action;
      }
    }, {
      key: "c",
      get: function get() {
        return this.key.c;
      }
    }, {
      key: "key",
      set: function set(v) {
        this._key = v;

        if (this.active) {
          this._update();
        }
      },
      get: function get() {
        return this._key;
      }
    }], [{
      key: "_template",
      value: function _template() {
        return {
          Background: {
            colorTop: 0x80e8e8e8,
            colorBottom: 0x80d1d1d1
          },
          Content: {}
        };
      }
    }]);

    return KeyboardButton;
  }(lng.Component);

  var Keyboard =
  /*#__PURE__*/
  function (_lng$Component10) {
    _inherits(Keyboard, _lng$Component10);

    function Keyboard() {
      _classCallCheck(this, Keyboard);

      return _possibleConstructorReturn(this, _getPrototypeOf(Keyboard).apply(this, arguments));
    }

    _createClass(Keyboard, [{
      key: "_construct",
      value: function _construct() {
        this._template = template;
      }
    }, {
      key: "_getFocused",
      value: function _getFocused() {
        return this.currentKey;
      }
    }, {
      key: "_navigate",
      value: function _navigate(dir, value) {
        dir = dir === 'up' || dir === 'down' ? 'vertical' : 'horizontal';

        if (dir === 'horizontal' && this.colIndex + value < this.rowLength && this.colIndex + value > -1) {
          this.previous = null;
          return this.colIndex += value;
        } else if (dir === 'vertical' && this.rowIndex + value < this.rows.length && this.rowIndex + value > -1) {
          var currentColIndex = this.colIndex;
          var targetRow = this.rowIndex + value;

          if (this.previous && this.previous.row === targetRow) {
            var tmp = this.previous.col;
            this.previous.col = this.colIndex;
            this.colIndex = tmp;
          } else {
            var _targetRow = this.children[this.rowIndex + value];
            var targetItems = _targetRow.children;
            var ck = this.currentKey;
            var target = 0;

            for (var i = 0; i < targetItems.length; i++) {
              var ckx = this.children[this.rowIndex].x + ck.x;
              var tix = _targetRow.x + targetItems[i].x;
              target = i;

              if (ckx >= tix && ckx <= tix + targetItems[i].w || tix >= ckx && tix <= ckx + ck.w) {
                break;
              }
            }

            this.colIndex = target;
          }

          this.previous = {
            col: currentColIndex,
            row: this.rowIndex
          };
          return this.rowIndex += value;
        }

        return false;
      }
    }, {
      key: "_update",
      value: function _update() {
        var _this24 = this;

        if (this._layout && this.keyboardTemplate.layouts[this._layout] === undefined) {
          console.error("Configured layout \"".concat(this.layout, "\" does not exist. Reverting to \"").concat(Object.keys(this.keyboardTemplate.layouts)[0], "\""));
          this._layout = null;
        }

        if (!this._layout) {
          this._layout = Object.keys(this.keyboardTemplate.layouts)[0];
        }

        var _this$keyboardTemplat = this.keyboardTemplate,
            keyWidth = _this$keyboardTemplat.keyWidth,
            keyHeight = _this$keyboardTemplat.keyHeight,
            _this$keyboardTemplat2 = _this$keyboardTemplat.horizontalSpacing,
            horizontalSpacing = _this$keyboardTemplat2 === void 0 ? 0 : _this$keyboardTemplat2,
            _this$keyboardTemplat3 = _this$keyboardTemplat.verticalSpacing,
            verticalSpacing = _this$keyboardTemplat3 === void 0 ? 0 : _this$keyboardTemplat3,
            layouts = _this$keyboardTemplat.layouts;
        this.children = layouts[this._layout].rows.map(function (row, rowIndex) {
          var keyOffset = 0;
          var _row$x = row.x,
              x = _row$x === void 0 ? 0 : _row$x,
              _row$rowVerticalSpaci = row.rowVerticalSpacing,
              rowVerticalSpacing = _row$rowVerticalSpaci === void 0 ? verticalSpacing : _row$rowVerticalSpaci,
              _row$rowHorizontalSpa = row.rowHorizontalSpacing,
              rowHorizontalSpacing = _row$rowHorizontalSpa === void 0 ? horizontalSpacing : _row$rowHorizontalSpa,
              _row$keys = row.keys,
              keys = _row$keys === void 0 ? [] : _row$keys;
          return {
            y: keyHeight * rowIndex + rowIndex * rowVerticalSpacing,
            x: x,
            children: keys.map(function (key) {
              key = Object.assign({
                action: 'input'
              }, key);
              var prevOffset = keyOffset;
              var _key = key,
                  _key$w = _key.w,
                  w = _key$w === void 0 ? keyWidth : _key$w,
                  _key$h = _key.h,
                  h = _key$h === void 0 ? keyHeight : _key$h,
                  action = _key.action,
                  toLayout = _key.toLayout;
              keyOffset += w + rowHorizontalSpacing;
              return {
                key: key,
                action: action,
                toLayout: toLayout,
                x: prevOffset,
                w: w,
                h: h,
                type: _this24.keyboardButton
              };
            })
          };
        });
      }
    }, {
      key: "reset",
      value: function reset() {
        this.colIndex = 0;
        this.rowIndex = 0;
        this._value = '';
        this.previous = null;
      }
    }, {
      key: "_init",
      value: function _init() {
        this.reset();

        this._update();
      }
    }, {
      key: "_handleRight",
      value: function _handleRight() {
        return this._navigate('right', 1);
      }
    }, {
      key: "_handleLeft",
      value: function _handleLeft() {
        return this._navigate('left', -1);
      }
    }, {
      key: "_handleUp",
      value: function _handleUp() {
        return this._navigate('up', -1);
      }
    }, {
      key: "_handleDown",
      value: function _handleDown() {
        return this._navigate('down', 1);
      }
    }, {
      key: "_handleEnter",
      value: function _handleEnter() {
        var key = this.currentKey;

        switch (key.action) {
          case 'input':
            this.value += key.c;
            break;

          case 'backspace':
            this.value = this.value.slice(0, -1);
            break;

          case 'space':
            if (this.value.length > 0) {
              this.value += ' ';
            }

            break;

          case 'delete':
            this.value = '';
            break;

          case 'toggleToLayout':
            this.layout = key.toLayout;
            break;

          default:
            this.signal(key.action, key);
            break;
        }
      }
    }, {
      key: "template",
      set: function set(v) {
        this._template = v;
      }
    }, {
      key: "keyboardTemplate",
      get: function get() {
        return this._template;
      }
    }, {
      key: "keyboardButton",
      get: function get() {
        return KeyboardButton;
      }
    }, {
      key: "maxCharacters",
      get: function get() {
        return 40;
      }
    }, {
      key: "value",
      set: function set(v) {
        if (v.length < this.maxCharacters) {
          this._value = v;
          this.signal('valueChanged', {
            value: v
          });
        }
      },
      get: function get() {
        return this._value;
      }
    }, {
      key: "rows",
      get: function get() {
        return this.children;
      }
    }, {
      key: "rowLength",
      get: function get() {
        return this.rows[this.rowIndex].children.length;
      }
    }, {
      key: "currentKey",
      get: function get() {
        return this.children[this.rowIndex].children[this.colIndex] || null;
      }
    }, {
      key: "layout",
      set: function set(layout) {
        this._layout = layout;

        this._update();
      },
      get: function get() {
        return this._layout;
      }
    }], [{
      key: "_template",
      value: function _template() {
        return {};
      }
    }]);

    return Keyboard;
  }(lng.Component);

  var template$1 = {
    keyWidth: 64,
    keyHeight: 84,
    horizontalSpacing: 8,
    verticalSpacing: 12,
    layouts: {
      'ABC': {
        rows: [{
          keys: [{
            c: 'Q'
          }, {
            c: 'W'
          }, {
            c: 'E'
          }, {
            c: 'R'
          }, {
            c: 'T'
          }, {
            c: 'Y'
          }, {
            c: 'U'
          }, {
            c: 'I'
          }, {
            c: 'O'
          }, {
            c: 'P'
          }]
        }, {
          x: 34,
          keys: [{
            c: 'A'
          }, {
            c: 'S'
          }, {
            c: 'D'
          }, {
            c: 'F'
          }, {
            c: 'G'
          }, {
            c: 'H'
          }, {
            c: 'J'
          }, {
            c: 'K'
          }, {
            c: 'L'
          }]
        }, {
          keys: [{
            action: 'toggleToLayout',
            toLayout: 'abc',
            c: 'Aa',
            w: 98
          }, {
            c: 'Z'
          }, {
            c: 'X'
          }, {
            c: 'C'
          }, {
            c: 'V'
          }, {
            c: 'B'
          }, {
            c: 'N'
          }, {
            c: 'M'
          }, {
            action: 'backspace',
            w: 98,
            patch: {
              mountY: 0.33,
              text: {
                text: '',
                fontFace: 'Material-Icons',
                fontSize: 55
              }
            }
          }]
        }, {
          keys: [{
            action: 'toggleToLayout',
            toLayout: '#123',
            w: 136,
            c: '#123'
          }, {
            c: ','
          }, {
            action: 'space',
            c: '',
            w: 276
          }, {
            c: '.'
          }, {
            action: 'hideKeyboard',
            w: 136,
            patch: {
              mountY: 0.33,
              text: {
                text: '',
                fontFace: 'Material-Icons',
                fontSize: 55
              }
            }
          }]
        }]
      },
      'abc': {
        rows: [{
          keys: [{
            c: 'q'
          }, {
            c: 'w'
          }, {
            c: 'e'
          }, {
            c: 'r'
          }, {
            c: 't'
          }, {
            c: 'y'
          }, {
            c: 'u'
          }, {
            c: 'i'
          }, {
            c: 'o'
          }, {
            c: 'p'
          }]
        }, {
          x: 34,
          keys: [{
            c: 'a'
          }, {
            c: 's'
          }, {
            c: 'd'
          }, {
            c: 'f'
          }, {
            c: 'g'
          }, {
            c: 'h'
          }, {
            c: 'j'
          }, {
            c: 'k'
          }, {
            c: 'l'
          }]
        }, {
          keys: [{
            action: 'toggleToLayout',
            toLayout: 'ABC',
            c: 'aA',
            w: 98
          }, {
            c: 'z'
          }, {
            c: 'x'
          }, {
            c: 'c'
          }, {
            c: 'v'
          }, {
            c: 'b'
          }, {
            c: 'n'
          }, {
            c: 'm'
          }, {
            action: 'backspace',
            w: 98,
            patch: {
              mountY: 0.33,
              text: {
                text: '',
                fontFace: 'Material-Icons',
                fontSize: 55
              }
            }
          }]
        }, {
          keys: [{
            action: 'toggleToLayout',
            toLayout: '#123',
            w: 136,
            c: '#123'
          }, {
            c: ','
          }, {
            action: 'space',
            c: '',
            w: 276
          }, {
            c: '.'
          }, {
            action: 'hideKeyboard',
            w: 136,
            patch: {
              mountY: 0.33,
              text: {
                text: '',
                fontFace: 'Material-Icons',
                fontSize: 55
              }
            }
          }]
        }]
      },
      '#123': {
        rows: [{
          keys: [{
            c: '1'
          }, {
            c: '2'
          }, {
            c: '3'
          }, {
            c: '4'
          }, {
            c: '5'
          }, {
            c: '6'
          }, {
            c: '7'
          }, {
            c: '8'
          }, {
            c: '9'
          }, {
            c: '0'
          }]
        }, {
          x: 34,
          keys: [{
            c: '@'
          }, {
            c: '#'
          }, {
            c: '€'
          }, {
            c: '_'
          }, {
            c: '&'
          }, {
            c: '-'
          }, {
            c: '+'
          }, {
            c: '('
          }, {
            c: ')'
          }]
        }, {
          keys: [{
            action: 'toggleToLayout',
            toLayout: '{&=',
            c: '{&=',
            w: 98
          }, {
            c: '*'
          }, {
            c: '\"'
          }, {
            c: '\''
          }, {
            c: ':'
          }, {
            c: ';'
          }, {
            c: '!'
          }, {
            c: '?'
          }, {
            action: 'backspace',
            w: 98,
            patch: {
              mountY: 0.33,
              text: {
                text: '',
                fontFace: 'Material-Icons',
                fontSize: 55
              }
            }
          }]
        }, {
          keys: [{
            action: 'toggleToLayout',
            toLayout: 'ABC',
            w: 136,
            c: 'ABC'
          }, {
            c: ','
          }, {
            action: 'space',
            c: '',
            w: 276
          }, {
            c: '.'
          }, {
            action: 'hideKeyboard',
            w: 136,
            patch: {
              mountY: 0.33,
              text: {
                text: '',
                fontFace: 'Material-Icons',
                fontSize: 55
              }
            }
          }]
        }]
      },
      '{&=': {
        rows: [{
          keys: [{
            c: '~'
          }, {
            c: '\`'
          }, {
            c: '|'
          }, {
            c: "\u2022"
          }, {
            c: '√'
          }, {
            c: 'π'
          }, {
            c: "\xF7"
          }, {
            c: "\xD7"
          }, {
            c: '¶'
          }, {
            c: '∆'
          }]
        }, {
          keys: [{
            c: '£'
          }, {
            c: '¥'
          }, {
            c: '€'
          }, {
            c: '¢'
          }, {
            c: '^'
          }, {
            c: '°'
          }, {
            c: '='
          }, {
            c: '{'
          }, {
            c: '}'
          }, {
            c: 'a'
          }]
        }, {
          keys: [{
            action: 'toggleToLayout',
            toLayout: '#123',
            c: '#123',
            w: 98
          }, {
            c: '%'
          }, {
            c: '©'
          }, {
            c: '®'
          }, {
            c: '™'
          }, {
            c: "\u2713"
          }, {
            c: '['
          }, {
            c: ']'
          }, {
            action: 'backspace',
            w: 98,
            patch: {
              mountY: 0.33,
              text: {
                text: '',
                fontFace: 'Material-Icons',
                fontSize: 55
              }
            }
          }]
        }, {
          keys: [{
            action: 'toggleToLayout',
            toLayout: 'ABC',
            w: 136,
            c: 'ABC'
          }, {
            c: '<'
          }, {
            action: 'space',
            c: '',
            w: 276
          }, {
            c: '>'
          }, {
            action: 'hideKeyboard',
            w: 136,
            patch: {
              mountY: 0.33,
              text: {
                text: '',
                fontFace: 'Material-Icons',
                fontSize: 55
              }
            }
          }]
        }]
      }
    }
  };
  var obj$2 = {
    Keyboard: Keyboard,
    KeyboardButton: KeyboardButton,
    SimpleKeyboardTemplate: template,
    AdvancedKeyboardTemplate: template$1
  };

  var ItemList =
  /*#__PURE__*/
  function (_lng$Component11) {
    _inherits(ItemList, _lng$Component11);

    function ItemList() {
      _classCallCheck(this, ItemList);

      return _possibleConstructorReturn(this, _getPrototypeOf(ItemList).apply(this, arguments));
    }

    _createClass(ItemList, [{
      key: "_navigate",
      value: function _navigate(dir) {
        var ori = this.orientation;

        if ((dir === 'right' || dir === 'left') && ori === 'horizontal' || (dir === 'up' || dir === 'down') && ori === 'vertical') {
          var length = this.items.length;
          var currentIndex = this._index;
          var targetIndex = currentIndex + 1;

          if (dir === 'left' || dir === 'up') {
            targetIndex = currentIndex - 1;
          }

          if (targetIndex > -1 && targetIndex < length) {
            this._index = targetIndex;
          } else if (this.jump || this.jumpToStart || this.jumpToEnd) {
            if (targetIndex < 0 && this.jumpToEnd) {
              this._index = targetIndex + length;
            } else if (targetIndex === length && this.jumpToStart) {
              this._index = 0;
            }
          } else {
            return false;
          }

          if (currentIndex !== this._index) {
            this.indexChanged({
              index: this._index,
              previousIndex: currentIndex
            });
          }
        }

        return false;
      }
    }, {
      key: "setIndex",
      value: function setIndex(targetIndex) {
        if (targetIndex > -1 && targetIndex < this.items.length) {
          var currentIndex = this._index;
          this._index = targetIndex;
          this.indexChanged({
            index: this._index,
            previousIndex: currentIndex
          });
        }
      }
    }, {
      key: "indexChanged",
      value: function indexChanged(event) {
        this.signal('indexChanged', event);
      }
    }, {
      key: "_getFocused",
      value: function _getFocused() {
        return this;
      }
    }, {
      key: "_construct",
      value: function _construct() {
        this._index = 0;
      }
    }, {
      key: "_init",
      value: function _init() {
        this._setState('Empty');
      }
    }, {
      key: "items",
      set: function set(items) {
        this.tag('Wrapper').children = items;
        this._index = 0;

        if (items.length > 0) {
          this._setState('Filled');
        } else {
          this._setState('Empty');
        }
      },
      get: function get() {
        return this.tag('Wrapper').children;
      }
    }, {
      key: "currentItem",
      get: function get() {
        return this.items[this._index];
      }
    }, {
      key: "length",
      get: function get() {
        return this.items.length;
      }
    }, {
      key: "orientation",
      set: function set(v) {
        this._orientation = v;

        if (v === 'horizontal') {
          this.tag('Wrapper').patch({
            flex: {
              direction: 'row'
            }
          });
        } else {
          this.tag('Wrapper').patch({
            flex: {
              direction: 'column'
            }
          });
        }
      },
      get: function get() {
        return this._orientation || 'horizontal';
      }
    }, {
      key: "jump",
      set: function set(bool) {
        this._jump = bool;
      },
      get: function get() {
        return this._jump || false;
      }
    }, {
      key: "jumpToStart",
      set: function set(bool) {
        this._jumpToStart = bool;
      },
      get: function get() {
        return this._jumpToStart !== undefined ? this._jumpToStart : this.jump;
      }
    }, {
      key: "jumpToEnd",
      set: function set(bool) {
        this._jumpToEnd = bool;
      },
      get: function get() {
        return this._jumpToEnd !== undefined ? this._jumpToEnd : this.jump;
      }
    }], [{
      key: "_template",
      value: function _template() {
        return {
          Wrapper: {
            flex: {
              direction: 'row'
            }
          }
        };
      }
    }, {
      key: "_states",
      value: function _states() {
        return [
        /*#__PURE__*/
        function (_this25) {
          _inherits(Empty, _this25);

          function Empty() {
            _classCallCheck(this, Empty);

            return _possibleConstructorReturn(this, _getPrototypeOf(Empty).apply(this, arguments));
          }

          return Empty;
        }(this),
        /*#__PURE__*/
        function (_this26) {
          _inherits(Filled, _this26);

          function Filled() {
            _classCallCheck(this, Filled);

            return _possibleConstructorReturn(this, _getPrototypeOf(Filled).apply(this, arguments));
          }

          _createClass(Filled, [{
            key: "_getFocused",
            value: function _getFocused() {
              return this.currentItem;
            }
          }, {
            key: "_handleRight",
            value: function _handleRight() {
              return this._navigate('right');
            }
          }, {
            key: "_handleLeft",
            value: function _handleLeft() {
              return this._navigate('left');
            }
          }, {
            key: "_handleUp",
            value: function _handleUp() {
              return this._navigate('up');
            }
          }, {
            key: "_handleDown",
            value: function _handleDown() {
              return this._navigate('down');
            }
          }]);

          return Filled;
        }(this)];
      }
    }]);

    return ItemList;
  }(lng.Component);

  var obj$3 = {
    ItemList: ItemList
  };

  var Slider =
  /*#__PURE__*/
  function (_lng$Component12) {
    _inherits(Slider, _lng$Component12);

    function Slider() {
      _classCallCheck(this, Slider);

      return _possibleConstructorReturn(this, _getPrototypeOf(Slider).apply(this, arguments));
    }

    _createClass(Slider, [{
      key: "_getItemCenterPosition",
      value: function _getItemCenterPosition(item) {
        if (this.orientation === 'horizontal') {
          return item.finalX + item.finalW * 0.5;
        }

        return item.finalY + item.finalH * 0.5;
      }
    }, {
      key: "_getScrollPosition",
      value: function _getScrollPosition(position) {
        var s = this._fullSize;
        var viewportSize = this.viewportSize;
        var marginStart = this.marginStart;
        var marginEnd = this.marginEnd;
        var maxDistanceStart = 0.5 * viewportSize - marginStart;
        var maxDistanceEnd = 0.5 * viewportSize - marginEnd;

        if (position < maxDistanceStart || s < viewportSize - (marginStart + marginEnd)) {
          position = maxDistanceStart;
        } else if (position > s - maxDistanceEnd) {
          position = s - maxDistanceEnd;
        }

        return position - 0.5 * viewportSize;
      }
    }, {
      key: "_navigate",
      value: function _navigate(dir) {
        var ori = this.orientation;

        if ((dir === 'right' || dir === 'left') && ori === 'horizontal' || (dir === 'up' || dir === 'down') && ori === 'vertical') {
          var length = this.items.length;
          var currentIndex = this._index;
          var targetIndex = currentIndex + 1;

          if (dir === 'left' || dir === 'up') {
            targetIndex = currentIndex - 1;
          }

          if (targetIndex > -1 && targetIndex < length) {
            this._index = targetIndex;
          } else if (this.jump || this.jumpToStart || this.jumpToEnd) {
            if (targetIndex < 0 && this.jumpToEnd) {
              this._index = targetIndex + length;
            } else if (targetIndex === length && this.jumpToStart) {
              this._index = 0;
            }
          }

          if (currentIndex !== this._index) {
            this.indexChanged({
              index: this._index,
              previousIndex: currentIndex,
              length: this.items.length
            });
          }

          this.scrollToFocus();
        }

        return false;
      }
    }, {
      key: "scrollToFocus",
      value: function scrollToFocus(immediate) {
        if (this.currentItem) {
          var focusPosition = this._getItemCenterPosition(this.currentItem);

          var scrollPosition = this._getScrollPosition(focusPosition);

          if (this._scrollTransition.isRunning()) {
            this._scrollTransition.reset(-scrollPosition, 0.1);
          } else {
            this._scrollTransition.start(-scrollPosition);
          }

          if (immediate) {
            this._scrollTransition.finish();
          }
        }
      }
    }, {
      key: "setIndex",
      value: function setIndex(targetIndex) {
        var immediate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        if (targetIndex > -1 && targetIndex < this.items.length) {
          var currentIndex = this._index;
          this._index = targetIndex;
          this.indexChanged({
            index: this._index,
            previousIndex: currentIndex,
            immediate: immediate
          });
          this.scrollToFocus(immediate);
        }
      }
    }, {
      key: "indexChanged",
      value: function indexChanged(event) {
        this.signal('indexChanged', event);
      }
    }, {
      key: "_getFocused",
      value: function _getFocused() {
        return this;
      }
    }, {
      key: "_reset",
      value: function _reset() {
        this._index = 0;
      }
    }, {
      key: "_construct",
      value: function _construct() {
        this._index = 0;
        this._scrollTransitionSettings = this.stage.transitions.createSettings({});
      }
    }, {
      key: "_init",
      value: function _init() {
        var _this27 = this;

        var wrapper = this.tag('Wrapper');
        var or = this.orientation === 'horizontal' ? 'x' : 'y';
        wrapper.transition(or, this._scrollTransitionSettings);
        this._scrollTransition = wrapper.transition(or);

        wrapper.onAfterUpdate = function () {
          if (_this27.orientation === 'horizontal') {
            _this27._fullSize = wrapper.finalW;
          } else {
            _this27._fullSize = wrapper.finalH;
          }
        };

        this._setState('Empty');
      }
    }, {
      key: "items",
      set: function set(items) {
        this._reset();

        this.tag('Wrapper').children = items;
        this.scrollToFocus(true);

        if (items.length > 0) {
          this._setState('Filled');
        } else {
          this._setState('Empty');
        }
      },
      get: function get() {
        return this.tag('Wrapper').children;
      }
    }, {
      key: "currentItem",
      get: function get() {
        return this.items[this._index];
      }
    }, {
      key: "index",
      get: function get() {
        return this._index;
      }
    }, {
      key: "orientation",
      set: function set(v) {
        this._orientation = v;

        if (v === 'horizontal') {
          this.tag('Wrapper').patch({
            flex: {
              direction: 'row'
            }
          });
        } else {
          this.tag('Wrapper').patch({
            flex: {
              direction: 'column'
            }
          });
        }
      },
      get: function get() {
        return this._orientation || 'horizontal';
      }
    }, {
      key: "margin",
      set: function set(v) {
        this._margin = v;
      },
      get: function get() {
        return this._margin || 0;
      }
    }, {
      key: "marginStart",
      set: function set(v) {
        this._marginStart = v;
      },
      get: function get() {
        return this._marginStart || this.margin;
      }
    }, {
      key: "marginEnd",
      set: function set(v) {
        this._marginEnd = v;
      },
      get: function get() {
        return this._marginEnd || this.margin;
      }
    }, {
      key: "jump",
      set: function set(bool) {
        this._jump = bool;
      },
      get: function get() {
        return this._jump || false;
      }
    }, {
      key: "jumpToStart",
      set: function set(bool) {
        this._jumpToStart = bool;
      },
      get: function get() {
        return this._jumpToStart !== undefined ? this._jumpToStart : this.jump;
      }
    }, {
      key: "jumpToEnd",
      set: function set(bool) {
        this._jumpToEnd = bool;
      },
      get: function get() {
        return this._jumpToEnd !== undefined ? this._jumpToEnd : this.jump;
      }
    }, {
      key: "scrollTransitionSettings",
      get: function get() {
        return this._scrollTransitionSettings;
      }
    }, {
      key: "scrollTransition",
      set: function set(v) {
        this._scrollTransitionSettings.patch(v);
      },
      get: function get() {
        return this._scrollTransition;
      }
    }, {
      key: "viewportSize",
      get: function get() {
        return this.orientation === 'horizontal' ? this.w : this.h;
      }
    }], [{
      key: "_template",
      value: function _template() {
        return {
          Wrapper: {
            flex: {
              direction: 'row'
            }
          }
        };
      }
    }, {
      key: "_states",
      value: function _states() {
        return [
        /*#__PURE__*/
        function (_this28) {
          _inherits(Empty, _this28);

          function Empty() {
            _classCallCheck(this, Empty);

            return _possibleConstructorReturn(this, _getPrototypeOf(Empty).apply(this, arguments));
          }

          return Empty;
        }(this),
        /*#__PURE__*/
        function (_this29) {
          _inherits(Filled, _this29);

          function Filled() {
            _classCallCheck(this, Filled);

            return _possibleConstructorReturn(this, _getPrototypeOf(Filled).apply(this, arguments));
          }

          _createClass(Filled, [{
            key: "_getFocused",
            value: function _getFocused() {
              return this.currentItem;
            }
          }, {
            key: "_handleRight",
            value: function _handleRight() {
              return this._navigate('right');
            }
          }, {
            key: "_handleLeft",
            value: function _handleLeft() {
              return this._navigate('left');
            }
          }, {
            key: "_handleUp",
            value: function _handleUp() {
              return this._navigate('up');
            }
          }, {
            key: "_handleDown",
            value: function _handleDown() {
              return this._navigate('down');
            }
          }]);

          return Filled;
        }(this)];
      }
    }]);

    return Slider;
  }(lng.Component);

  var obj$4 = {
    Slider: Slider
  };
  var tools = {
    player: obj,
    effects: obj$1,
    keyboard: obj$2,
    itemlist: obj$3,
    slider: obj$4
  }; // Exposes the ux namespace for apps.

  var ux$1 = {
    Ui: Ui,
    App: App,
    tools: tools
  };

  if (typeof window !== "undefined") {
    window.ux = ux$1;
  }

  return ux$1;
});