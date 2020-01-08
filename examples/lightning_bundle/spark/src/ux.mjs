import lng from "wpe-lightning-spark";
import fetch from "node-fetch";
const Headers = fetch.Headers;


const events = ['timeupdate', 'error', 'ended', 'loadeddata', 'canplay', 'play', 'playing', 'pause', 'loadstart', 'seeking', 'seeked', 'encrypted'];

class Mediaplayer extends lng.Component {

    _construct(){
        this._skipRenderToTexture = false;
    }

    static _template() {
        return {
            Video: {
                VideoWrap: {
                    VideoTexture: {
                        visible: false,
                        pivot: 0.5,
                        texture: {type: lng.textures.StaticTexture, options: {}}
                    }
                }
            }
        };
    }

    set skipRenderToTexture (v) {
        this._skipRenderToTexture = v;
    }

    set textureMode(v) {
        return this._textureMode = v;
    }

    get textureMode() {
        return this._textureMode;
    }

    get videoView() {
        return this.tag("Video");
    }

    _init() {
        //re-use videotag if already there
        const videoEls = document.getElementsByTagName('video');
        if (videoEls && videoEls.length > 0)
            this.videoEl = videoEls[0];
        else {
            this.videoEl = document.createElement('video');
            this.videoEl.setAttribute('id', 'video-player');
            this.videoEl.style.position = 'absolute';
            this.videoEl.style.zIndex = '1';
            this.videoEl.style.display = 'none';
            this.videoEl.setAttribute('width', '100%');
            this.videoEl.setAttribute('height', '100%');

            this.videoEl.style.visibility = (this.textureMode) ? 'hidden' : 'visible';
            document.body.appendChild(this.videoEl);
        }
        if (this.textureMode && !this._skipRenderToTexture) {
            this._createVideoTexture();
        }

        this.eventHandlers = [];
    }

    _registerListeners() {
        events.forEach(event => {
            const handler = (e) => {
                this.fire(event, {videoElement: this.videoEl, event: e});
            };
            this.eventHandlers.push(handler);
            this.videoEl.addEventListener(event, handler);
        });
    }

    _deregisterListeners() {
        events.forEach((event, index) => {
            this.videoEl.removeEventListener(event, this.eventHandlers[index]);
        });
        this.eventHandlers = [];
    }

    _attach() {
        this._registerListeners();
    }

    _detach() {
        this._deregisterListeners();
    }

    _createVideoTexture() {
        const stage = this.stage;

        const gl = stage.gl;
        const glTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, glTexture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        this.videoTexture.options = {source: glTexture, w: this.videoEl.width, h: this.videoEl.height};
    }

    _startUpdatingVideoTexture() {
        if (this.textureMode && !this._skipRenderToTexture) {
            const stage = this.stage;
            if (!this._updateVideoTexture) {
                this._updateVideoTexture = () => {
                    if (this.videoTexture.options.source && this.videoEl.videoWidth && this.active) {
                        const gl = stage.gl;

                        const currentTime = (new Date()).getTime();

                        // When BR2_PACKAGE_GST1_PLUGINS_BAD_PLUGIN_DEBUGUTILS is not set in WPE, webkitDecodedFrameCount will not be available.
                        // We'll fallback to fixed 30fps in this case.
                        const frameCount = this.videoEl.webkitDecodedFrameCount;

                        const mustUpdate = (frameCount ? (this._lastFrame !== frameCount) : (this._lastTime < currentTime - 30));

                        if (mustUpdate) {
                            this._lastTime = currentTime;
                            this._lastFrame = frameCount;
                            try {
                                gl.bindTexture(gl.TEXTURE_2D, this.videoTexture.options.source);
                                gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
                                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.videoEl);
                                this._lastFrame = this.videoEl.webkitDecodedFrameCount;
                                this.videoTextureView.visible = true;

                                this.videoTexture.options.w = this.videoEl.videoWidth;
                                this.videoTexture.options.h = this.videoEl.videoHeight;
                                const expectedAspectRatio = this.videoTextureView.w / this.videoTextureView.h;
                                const realAspectRatio = this.videoEl.videoWidth / this.videoEl.videoHeight;
                                if (expectedAspectRatio > realAspectRatio) {
                                    this.videoTextureView.scaleX = (realAspectRatio / expectedAspectRatio);
                                    this.videoTextureView.scaleY = 1;
                                } else {
                                    this.videoTextureView.scaleY = expectedAspectRatio / realAspectRatio;
                                    this.videoTextureView.scaleX = 1;
                                }
                            } catch (e) {
                                console.error('texImage2d video', e);
                                this._stopUpdatingVideoTexture();
                                this.videoTextureView.visible = false;
                            }
                            this.videoTexture.source.forceRenderUpdate();
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

    _stopUpdatingVideoTexture() {
        if (this.textureMode) {
            const stage = this.stage;
            stage.removeListener('frameStart', this._updateVideoTexture);
            this._updatingVideoTexture = false;
            this.videoTextureView.visible = false;

            if (this.videoTexture.options.source) {
                const gl = stage.gl;
                gl.bindTexture(gl.TEXTURE_2D, this.videoTexture.options.source);
                gl.clearColor(0, 0, 0, 1);
                gl.clear(gl.COLOR_BUFFER_BIT);
            }
        }
    }

    updateSettings(settings = {}) {
        // The Component that 'consumes' the media player.
        this._consumer = settings.consumer;

        if (this._consumer && this._consumer.getMediaplayerSettings) {
            // Allow consumer to add settings.
            settings = Object.assign(settings, this._consumer.getMediaplayerSettings());
        }

        if (!lng.Utils.equalValues(this._stream, settings.stream)) {
            if (settings.stream && settings.stream.keySystem) {
                navigator.requestMediaKeySystemAccess(settings.stream.keySystem.id, settings.stream.keySystem.config).then((keySystemAccess) => {
                    return keySystemAccess.createMediaKeys();
                }).then((createdMediaKeys) => {
                    return this.videoEl.setMediaKeys(createdMediaKeys);
                }).then(() => {
                    if (settings.stream && settings.stream.src)
                        this.open(settings.stream.src);
                }).catch(() => {
                    console.error('Failed to set up MediaKeys');
                });
            } else if (settings.stream && settings.stream.src) {
                if(!window.Hls){
                    window.Hls = class Hls{
                        static isSupported(){
                            console.warn("hls-light not included");
                            return false;
                        }
                    };
                }
                if (ux.Ui.hasOption("hls") && Hls.isSupported()) {
                    if (!this._hls) this._hls = new Hls({liveDurationInfinity: true});
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

    _setHide(hide) {
        if (this.textureMode) {
            this.tag("Video").setSmooth('alpha', hide ? 0 : 1);
        } else {
            this.videoEl.style.visibility = hide ? 'hidden' : 'visible';
        }
    }

    open(url) {
        console.log('Playing stream', url);
        if (this.application.noVideo) {
            console.log('noVideo option set, so ignoring: ' + url);
            return;
        }
        if (this.videoEl.getAttribute('src') === url) return this.reload();
        this.videoEl.setAttribute('src', url);

        this.videoEl.style.display = 'block';
    }

    close() {
        // We need to pause first in order to stop sound.
        this.videoEl.pause();
        this.videoEl.removeAttribute('src');

        // force load to reset everything without errors
        this.videoEl.load();

        this._clearSrc();

        this.videoEl.style.display = 'none';
    }

    playPause() {
        if (this.isPlaying()) {
            this.doPause();
        } else {
            this.doPlay();
        }
    }

    isPlaying() {
        return (this._getState() === "Playing");
    }

    doPlay() {
        this.videoEl.play();
    }

    doPause() {
        this.videoEl.pause();
    }

    reload() {
        var url = this.videoEl.getAttribute('src');
        this.close();
        this.videoEl.src = url;
    }

    getPosition() {
        return Promise.resolve(this.videoEl.currentTime);
    }

    setPosition(pos) {
        this.videoEl.currentTime = pos;
    }

    getDuration() {
        return Promise.resolve(this.videoEl.duration);
    }

    seek(time, absolute = false) {
        if(absolute) {
            this.videoEl.currentTime = time;
        }
        else {
            this.videoEl.currentTime += time;
        }
    }

    get videoTextureView() {
        return this.tag("Video").tag("VideoTexture");
    }

    get videoTexture() {
        return this.videoTextureView.texture;
    }

    _setVideoArea(videoPos) {
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
            const precision = this.stage.getRenderPrecision();
            this.videoEl.style.left = Math.round(videoPos[0] * precision) + 'px';
            this.videoEl.style.top = Math.round(videoPos[1] * precision) + 'px';
            this.videoEl.style.width = Math.round((videoPos[2] - videoPos[0]) * precision) + 'px';
            this.videoEl.style.height = Math.round((videoPos[3] - videoPos[1]) * precision) + 'px';
        }
    }

    _fireConsumer(event, args) {
        if (this._consumer) {
            this._consumer.fire(event, args);
        }
    }

    _equalInitData(buf1, buf2) {
        if (!buf1 || !buf2) return false;
        if (buf1.byteLength != buf2.byteLength) return false;
        const dv1 = new Int8Array(buf1);
        const dv2 = new Int8Array(buf2);
        for (let i = 0 ; i != buf1.byteLength ; i++)
            if (dv1[i] != dv2[i]) return false;
        return true;
    }

    error(args) {
        this._fireConsumer('$mediaplayerError', args);
        this._setState("");
        return "";
    }

    loadeddata(args) {
        this._fireConsumer('$mediaplayerLoadedData', args);
    }

    play(args) {
        this._fireConsumer('$mediaplayerPlay', args);
    }

    playing(args) {
        this._fireConsumer('$mediaplayerPlaying', args);
        this._setState("Playing");
    }

    canplay(args) {
        this.videoEl.play();
        this._fireConsumer('$mediaplayerStart', args);
    }

    loadstart(args) {
        this._fireConsumer('$mediaplayerLoad', args);
    }

    seeked(args) {
        this._fireConsumer('$mediaplayerSeeked', {
            currentTime: this.videoEl.currentTime,
            duration: this.videoEl.duration || 1
        });
    }

    seeking(args) {
        this._fireConsumer('$mediaplayerSeeking', {
            currentTime: this.videoEl.currentTime,
            duration: this.videoEl.duration || 1
        });
    }

    durationchange(args) {
        this._fireConsumer('$mediaplayerDurationChange', args);
    }

    encrypted(args) {
        const video = args.videoElement;
        const event = args.event;
        // FIXME: Double encrypted events need to be properly filtered by Gstreamer
        if (video.mediaKeys && !this._equalInitData(this._previousInitData, event.initData)) {
            this._previousInitData = event.initData;
            this._fireConsumer('$mediaplayerEncrypted', args);
        }
    }

    static _states() {
        return [
            class Playing extends this {
                $enter() {
                    this._startUpdatingVideoTexture();
                }
                $exit() {
                    this._stopUpdatingVideoTexture();
                }
                timeupdate() {
                    this._fireConsumer('$mediaplayerProgress', {
                        currentTime: this.videoEl.currentTime,
                        duration: this.videoEl.duration || 1
                    });
                }
                ended(args) {
                    this._fireConsumer('$mediaplayerEnded', args);
                    this._setState("");
                }
                pause(args) {
                    this._fireConsumer('$mediaplayerPause', args);
                    this._setState("Playing.Paused");
                }
                _clearSrc() {
                    this._fireConsumer('$mediaplayerStop', {});
                    this._setState("");
                }
                static _states() {
                    return [
                        class Paused extends this {
                        }
                    ]
                }
            }
        ]
    }

}

class NoopMediaplayer extends lng.Component {

    static _template() {
        return {
            Video: {
                w: 1920, h: 1080
            }
        };
    }

    open(url) {
        console.log('Playing stream', url);
    }

    close() {
    }

    playPause() {
        if (this.isPlaying()) {
            this.doPause();
        } else {
            this.doPlay();
        }
    }

    isPlaying() {
        return (this._getState() === "Playing");
    }

    doPlay() {
    }

    doPause() {
    }

    reload() {
    }

    getPosition() {
        return Promise.resolve(0);
    }

    setPosition(pos) {
    }

    getDuration() {
        return Promise.resolve(0);
    }

    seek(time, absolute = false) {
    }

    updateSettings(settings = {}) {
    }

    static _states() {
        return [
            class Playing extends this {
                static _states() {
                    return [
                        class Paused extends this {
                        }
                    ]
                }
            }
        ]
    }

}

class ScaledImageTexture extends lng.textures.ImageTexture {

    constructor(stage) {
        super(stage);

        this._scalingOptions = undefined;
        this.precision = 1;
    }

    set scalingOptions(options) {
        if (!lng.Utils.equalValues(this._scalingOptions, options)) {
            this._scalingOptions = options;
            this._changed();
        }
    }

    _getLookupId() {
        const opts = this._scalingOptions;
        return `${this._src}-${opts.type}-${opts.width}-${opts.height}`;
    }

    _getSourceLoader() {
        let src = this._src;
        if (this.stage.getOption('srcBasePath')) {
            var fc = src.charCodeAt(0);
            if ((src.indexOf("//") === -1) && ((fc >= 65 && fc <= 90) || (fc >= 97 && fc <= 122) || fc == 46)) {
                // Alphabetical or dot: prepend base path.
                src = this.stage.getOption('srcBasePath') + src;
            }
        }

        if (this.stage.application.useImageServer) {
            src = this._getImageServerSrc(src);
        } else {
            this.resizeMode = ScaledImageTexture._convertScalingOptions(this._scalingOptions);
        }

        const platform = this.stage.platform;
        return function(cb) {
            return platform.loadSrcTexture({src: src, hasAlpha: this._hasAlpha}, cb);
        }
    }

    static _convertScalingOptions(options) {
        const opts = lng.Utils.clone(options);
        switch(options.type) {
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

    get precision() {
        return this._customPrecision;
    }

    set precision(v) {
        this._customPrecision = v;
        super.precision = this.stage.getRenderPrecision() * this._customPrecision;
    }

    _getImageServerSrc(src) {
        if (this._scalingOptions && (this._precision !== 1)) {
            const opts = lng.Utils.clone(this._scalingOptions);
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

    static getImageUrl(url, opts = {}) {
        return this._getCdnProtocol() + "://cdn.metrological.com/image" + this.getQueryString(url, opts);
    }

    static _getCdnProtocol() {
        return lng.Utils.isWeb && location.protocol === "https:" ? "https" : "http";
    }

    static getQueryString(url, opts, key = "url") {
        let str = `?operator=${encodeURIComponent('metrological')}`;
        const keys = Object.keys(opts);
        keys.forEach(key => {
            str += "&" + encodeURIComponent(key) + "=" + encodeURIComponent("" + opts[key]);
        });
        str += `&${key}=${encodeURIComponent(url)}`;
        return str;
    }

    getNonDefaults() {
        const obj = super.getNonDefaults();
        if (this._src) {
            obj.src = this._src;
        }
        return obj;
    }

}

class Ui extends lng.Application {

    constructor(options) {
        options.defaultFontFace = options.defaultFontFace || "RobotoRegular";
        super(options);
        this._options = options;
    }

    static _template() {
        let mediaPlayerType = NoopMediaplayer;
        if (lng.Utils.isWeb) {
            mediaPlayerType = Mediaplayer;
        }
        else if (lng.Utils.isSpark) {
            mediaPlayerType = lng.Stage.platform.createMediaPlayer();
        }

        return {
            Mediaplayer: {type: mediaPlayerType, textureMode: Ui.hasOption('texture')},
            AppWrapper: {}
        };
    }

    static set staticFilesPath(path) {
        this._staticFilesPath = path;
    }

    get useImageServer() {
        return !Ui.hasOption("noImageServer");
    }

    get mediaplayer() {
        return this.tag("Mediaplayer");
    }

    _active() {
        this.tag('Mediaplayer').skipRenderToTexture = this._options.skipRenderToTexture;
    }

    startApp(appClass) {
        this._setState("App.Loading", [appClass]);
    }

    stopApp() {
    }

    _handleBack() {
        if (lng.Utils.isWeb) {
            window.close();
        }
    }

    loadPlatformFonts(fonts) {
        if (lng.Utils.isNode && !lng.Utils.isSpark) {
            // Font loading not supported. Fonts should be installed in Linux system and then they can be picked up by cairo.
            return Promise.resolve();
        }

        if (lng.Utils.isSpark) {
            let ret = this.stage.platform.loadFonts(fonts);
            return Promise.all(ret.promises).then(() => {return ret.fontResources});
        }
    }

    static loadFonts(fonts) {
        const fontFaces = fonts.map(({family, url, descriptors}) => new FontFace(family, `url(${url})`, descriptors));
        fontFaces.forEach(fontFace => {
            document.fonts.add(fontFace);
        });
        return Promise.all(fontFaces.map(ff => ff.load())).then(() => {return fontFaces});
    }

    static getPath(relPath) {
        return this._staticFilesPath + "static-ux/" + relPath;
    }

    static getFonts() {
        return [
            {family: 'RobotoRegular', url: Ui.getPath('fonts/roboto-regular.ttf'), descriptors: {}},
            {family: 'Material-Icons', url: Ui.getPath('fonts/Material-Icons.ttf'), descriptors: {}}
        ]
    }

    static _states() {
        return [
            class App extends this {
                stopApp() {
                    this._setState("");
                }
                static _states() {
                    return [
                        class Loading extends this {
                            $enter(context, appClass) {
                                this._startApp(appClass);
                            }
                            _startApp(appClass) {
                                this._currentApp = {
                                    type: appClass,
                                    fontFaces: []
                                };

                                // Preload fonts.
                                const fonts = this._currentApp.type.getFonts().concat(Ui.getFonts());
                                let fn = lng.Utils.isWeb ? Ui.loadFonts(fonts): this.loadPlatformFonts(fonts);
                                fn.then((fontFaces) => {
                                    this._currentApp.fontFaces = fontFaces;
                                }).catch((e) => {
                                    console.warn('Font loading issues: ' + e);
                                }).finally(()=>{
                                    this._done();
                                });
                            }
                            _done() {
                                this._setState("App.Started");
                            }
                        },
                        class Started extends this {
                            $enter() {
                                this.tag("AppWrapper").children = [{ref: "App", type: this._currentApp.type}];
                            }
                            $exit() {
                                this.tag("AppWrapper").children = [];
                            }
                        }
                    ]
                }
            }
        ]
    }

    _getFocused() {
        return this.tag("App");
    }

    _setFocusSettings(settings) {
        settings.clearColor = this.stage.getOption('clearColor');
        settings.mediaplayer = {
            consumer: null,
            stream: null,
            hide: false,
            videoPos: [0, 0, 1920, 1080]
        };
    }

    _handleFocusSettings(settings) {
        if (this._clearColor !== settings.clearColor) {
            this._clearColor = settings.clearColor;
            this.stage.setClearColor(settings.clearColor);
        }

        if (this.tag("Mediaplayer").attached) {
            this.tag("Mediaplayer").updateSettings(settings.mediaplayer);
        }
    }

    static getProxyUrl(url, opts = {}) {
        return this._getCdnProtocol() + "://cdn.metrological.com/proxy" + this.getQueryString(url, opts);
    }

    static getImage(url, opts = {}) {
        return {type: ScaledImageTexture, src: url, scalingOptions: opts};
    }

    static getImageUrl(url, opts = {}) {
        throw new Error("{src: Ui.getImageUrl(...)} is deprecated. Please use {texture: Ui.getImage(...)} instead.");
    }

    static getQrUrl(url, opts = {}) {
        return this._getCdnProtocol() + "://cdn.metrological.com/qr" + this.getQueryString(url, opts, "q");
    }

    static _getCdnProtocol() {
        return lng.Utils.isWeb && location.protocol === "https:" ? "https" : "http";
    }

    static hasOption(name) {
        if (lng.Utils.isNode) {
            return false;
        }

        return new URL(document.location.href).searchParams.has(name);
    }

    static getOption(name) {
        if (lng.Utils.isNode) {
            return undefined;
        }

        return new URL(document.location.href).searchParams.get(name);
    }

    static getQueryString(url, opts, key = "url") {
        let str = `?operator=${encodeURIComponent(this.getOption('operator') || 'metrological')}`;
        const keys = Object.keys(opts);
        keys.forEach(key => {
            str += "&" + encodeURIComponent(key) + "=" + encodeURIComponent("" + opts[key]);
        });
        str += `&${key}=${encodeURIComponent(url)}`;
        return str;
    }


}

Ui._staticFilesPath = "./";

class App extends lng.Component {

    static g(c) {
        return c.seekAncestorByType(this);
    }

    /**
     * Returns all fonts to be preloaded before entering this app.
     * @returns {{family: string, url: string, descriptors: {}}[]}
     */
    static getFonts() {
        return [];
    }

    getPath(relPath) {
        return App.getPath(this.constructor, relPath);
    }

    static getPath(relPath) {
        return Ui._staticFilesPath + "static/" + relPath;
    }

    static get identifier() {
        throw new Error("Please supply an identifier in the App definition file.");
    }

}

class PlayerButton extends lng.Component {

    static _template() {
        const o = this.options;
        return {
            w: o.w, h: o.h,
            Background: {x: -1, y: -1, texture: lng.Tools.getRoundRect(o.w, o.h, 4, 0, 0, true), color: o.colors.deselected},
            Icon: {x: o.w/2, y: o.h/2, mount: 0.5, color: o.colors.selected}
        };
    }

    set icon(source) {
        this.tag("Icon").src = Ui.getPath(`tools/player/img/${source}`);
    }

    set active(v) {
        this.alpha = v ? 1 : 0.3;
    }

    get active() {
        return this.alpha === 1;
    }

    static _states() {
        return [
            class Selected extends this {
                $enter() {
                    this.tag("Background").color = this.constructor.options.colors.selected;
                    this.tag("Icon").color = this.constructor.options.colors.deselected;
                }
                $exit() {
                    this.tag("Background").color = this.constructor.options.colors.deselected;
                    this.tag("Icon").color = this.constructor.options.colors.selected;
                }
            }
        ]
    }

    _focus() {
        this._setState("Selected");
    }

    _unfocus() {
        this._setState("");
    }

    static get options() {
        if (!this._options) {
            this._options = this._buildOptions();
        }
        return this._options;
    }

    static _buildOptions() {
        return {
            colors: {
                selected: 0xFFFFFFFF,
                deselected: 0xFF606060
            },
            w: 60,
            h: 60
        };
    }

}

class PlayerControls extends lng.Component {

    static _template() {
        return {
            Buttons: {
                Previous: {type: this.PlayerButton, icon: "prev.png"},
                Play: {type: this.PlayerButton, icon: "play.png"},
                Next: {type: this.PlayerButton, icon: "next.png"}
            },
            Title: {text: {fontSize: 46, lineHeight: 56, maxLines: 1, shadow: true}, y: 2}
        };
    }

    static get PlayerButton() {
        return PlayerButton;
    }

    showButtons(previous, next) {
        const o = this.constructor.options;
        let buttons = [];
        if (previous) buttons.push("Previous");
        buttons = buttons.concat(o.buttons);
        if (next) buttons.push("Next");
        this._setActiveButtons(buttons);
    }

    set title(title) {
        this.tag("Title").text = title || "";
    }

    get _activeButtonIndex() {
        let button = this.tag("Buttons").getByRef(this._getState());
        if (!button.active) {
            button = this.tag("Play");
        }
        return this._activeButtons.indexOf(button);
    }

    get _activeButton() {
        return this._activeButtons[this._activeButtonIndex];
    }

    _setActiveButtons(buttons) {
        const o = this.constructor.options;

        let x = 0;
        this._activeButtons = [];
        this.tag("Buttons").children.map(button => {
            button.active = (buttons.indexOf(button.ref) !== -1);
            button.x = x;
            if (button.active) {
                this._activeButtons.push(button);
            }
            x += button.renderWidth + o.margin;
        });
        this.tag("Title").x = x + 20;


        this._checkActiveButton();
    }

    _setup() {
        this._setState("Play");
    }

    _init() {
        this.showButtons(false, false);
        this._setState("Play");
    }

    _checkActiveButton() {
        // After changing the active buttons, make sure that an active button is selected.
        let index = this._activeButtonIndex;
        if (index === -1) {
            if (this._index >= this._activeButtons.length) {
                this._index = this._activeButtons.length - 1;
            }
        }
        this._setState(this._activeButtons[index].ref);
    }

    _handleLeft() {
        let index = this._activeButtonIndex;
        if (index > 0) {
            index--;
        }
        this._setState(this._activeButtons[index].ref);
    }

    _handleRight() {
        let index = this._activeButtonIndex;
        if (index < this._activeButtons.length - 1) {
            index++;
        }
        this._setState(this._activeButtons[index].ref);
    }

    _handleEnter() {
        this.signal('press' + this._activeButton.ref);
    }


    set paused(v) {
        this.tag("Play").icon = v ? "play.png" : "pause.png";
    }

    static _states() {
        return [
            class Previous extends this {
            },
            class Play extends this {
            },
            class Next extends this {
            }
        ]
    }

    _getFocused() {
        return this.tag(this._getState());
    }

    static get options() {
        if (!this._options) {
            this._options = this._buildOptions();
        }
        return this._options;
    }

    static _buildOptions() {
        return {
            buttons: ["Play"],
            margin: 10
        };
    }

}

class PlayerProgress extends lng.Component {

    static _template() {
        return {
            Progress: {
                forceZIndexContext: true,
                Total: {
                    x: -1, y: -1, texture: lng.Tools.getRoundRect(1720, 10, 4), color: 0xFF606060,
                    Scroller: {
                        x: 0, y: 6, mount: 0.5, w: 16, h: 16, zIndex: 2,
                        Shadow: {
                            texture: lng.Tools.getShadowRect(16, 16, 8),
                            mount: 0.5,
                            x: 8,
                            y: 8,
                            color: 0xFF000000
                        },
                        Main: {texture: lng.Tools.getRoundRect(16, 16, 8), mount: 0.5, x: 8, y: 8, color: 0xFFF1F1F1}
                    }
                },
                Active: {x: -1, y: -1, color: 0xFFF1F1F1},
                CurrentTime: {
                    x: 0,
                    y: 21,
                    text: {fontSize: 28, lineHeight: 34, maxLines: 1, shadow: true, text: "00:00"}
                },
                Duration: {
                    x: 1720,
                    mountX: 1,
                    y: 21,
                    text: {fontSize: 28, lineHeight: 34, maxLines: 1, shadow: true, text: "00:00"}
                }
            }
        };
    }

    set _progress(v) {
        const now = Date.now();
        let estimation = 0;
        if (!this._last || (this._last < now - 1000)) {
            estimation = 500;
        } else {
            estimation = now - this._last;
        }
        this._last = now;
        const x = v * 1720;

        estimation *= 0.001;
        this.tag("Total").setSmooth('x', x, {timingFunction: 'linear', duration: estimation});
        this.tag("Total").setSmooth('texture.x', x, {timingFunction: 'linear', duration: estimation});
        this.tag("Active").setSmooth('texture.w', Math.max(x, 0.0001) /* force clipping */, {
            timingFunction: 'linear',
            duration: estimation
        });
    }

    setProgress(currentTime, duration) {
        this._progress = currentTime / Math.max(duration, 1);
        this.tag("CurrentTime").text = Player.formatTime(currentTime);
        this.tag("Duration").text = Player.formatTime(duration);
    }

    static formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        seconds -= hours * 3600;
        const minutes = Math.floor(seconds / 60);
        seconds -= minutes * 60;
        seconds = Math.floor(seconds);
        const parts = [];
        if (hours) parts.push(hours);
        parts.push(minutes);
        parts.push(seconds);
        return parts.map(number => (number < 10 ? "0" + number : "" + number)).join(":");
    }

    _alter() {
    }

    _setup() {
        this._alter();
    }

    _init() {
        this.tag("Active").texture = {
            type: lng.textures.SourceTexture,
            textureSource: this.tag("Total").texture.source
        };
    }

}

class Player extends lng.Component {

    static _template() {
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
                signals: {pressPlay: true, pressPrevious: true, pressNext: "_pressNext"}
            },
            Progress: {x: 99, y: 970, type: this.PlayerProgress}
        };
    }

    static get PlayerControls() {
        return PlayerControls;
    }

    static get PlayerProgress() {
        return PlayerProgress;
    }

    _setItem(item) {
        this.tag("Progress").setProgress(0, 0);
        this._item = item;
        this._stream = item.stream;
        this.tag("Controls").title = item.title;

        this._index = this._items.indexOf(item);
        this.tag("Controls").showButtons(this._index > 0, this._index < this._items.length - 1);

        this.application.updateFocusSettings();
    }

    static formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        seconds -= hours * 3600;
        const minutes = Math.floor(seconds / 60);
        seconds -= minutes * 60;
        seconds = Math.floor(seconds);
        const parts = [];
        if (hours) parts.push(hours);
        parts.push(minutes);
        parts.push(seconds);
        return parts.map(number => (number < 10 ? "0" + number : "" + number)).join(":");
    }

    _setInterfaceTimeout() {
        if (this._timeout) {
            clearTimeout(this._timeout);
        }
        this._timeout = setTimeout(() => {
            this._hide();
        }, 8000);
    }

    _init() {
        this._setState("Controls");
    }

    _focus() {
        this._setInterfaceTimeout();
    }

    _unfocus() {
        clearTimeout(this._timeout);
    }

    $mediaplayerEnded() {
        this._pressNext();
    }

    play({item, items = [item]}) {
        this._items = items;
        this._setItem(item);
        return !!this._stream;
    }

    pressPrevious() {
        const index = this._index - 1;
        if (index < 0) {
            this._index = this._items.length - 1;
        }
        this._setItem(this._items[index]);
    }

    _pressNext() {
        if (!this._items.length) {
            return this.signal('playerStop');
        }
        const index = (this._index + 1) % this._items.length;
        this._setItem(this._items[index]);
    }

    pressPlay() {
        this.application.mediaplayer.playPause();
    }

    $mediaplayerPause() {
        this.tag("Controls").paused = true;
    }

    $mediaplayerPlay() {
        this.tag("Controls").paused = false;
    }

    $mediaplayerStop() {
        this.signal('playerStop');
    }

    $mediaplayerProgress({currentTime, duration}) {
        this.tag("Progress").setProgress(currentTime, duration);
    }

    _captureKey() {
        this._setInterfaceTimeout();
        return false;
    }

    _hide() {
        this._setState("Hidden");
    }

    static _states() {
        return [
            class Hidden extends this {
                $enter({prevState}) {
                    this._prevState = prevState;
                    this.setSmooth('alpha', 0);
                }
                $exit() {
                    this._setInterfaceTimeout();
                    this.setSmooth('alpha', 1);
                }
                _captureKey() {
                    this._setState(this._prevState);
                }
            },
            class Controls extends this {
            }
        ];
    }

    _getFocused() {
        return this.tag("Controls");
    }

    _setFocusSettings(settings) {
        settings.mediaplayer.consumer = this;
    }

    getMediaplayerSettings() {
        if (this._stream.link) {
            // Backwards compatibility.
            this._stream.src = this._stream.link;
        }

        return {
            stream: this._stream
        };
    }


}

const obj = {
    Player,
    PlayerButton,
    PlayerControls,
    PlayerProgress
};

class Light3dComponent extends lng.Component {

    constructor(stage) {
        super(stage);

        this.patch({
            __create: true,
            Main: {
                x: -1,
                y: -1,
                shader: {type: lng.shaders.Light3d, fudge: 0.3},
                renderToTexture: true,
                Wrapper: {
                    x: 1,
                    y: 1,
                    clipping: true,
                    Content: {}
                }
            }
        });

        this._shaderZ = 0;
        this._shaderZ0 = 0;
        this._shaderZ1 = 0;

        this._shaderRx = 0;
        this._shaderRx0 = 0;
        this._shaderRx1 = 0;

        this._shaderRy = 0;
        this._shaderRy0 = 0;
        this._shaderRy1 = 0;

        this._focusedZ = -150;
        this._createAnimations();

        this.transition('lightShader.strength', {duration: 0.2});
        this.transition('lightShader.ambient', {duration: 0.2});
    }

    get focusedZ() {
        return this._focusedZ;
    }

    set focusedZ(v) {
        this._focusedZ = v;
        this._createAnimations();
    }

    _createAnimations() {
        this._anims = {
            neutral: this.animation({
                duration: 0.4, actions: [
                    {p: 'shaderZ0', merger: lng.StageUtils.mergeNumbers, v: {0: 0, 0.5: -140, 1: -150}}
                ]
            }),
            left: this._createAnimation('x', -1, 0),
            right: this._createAnimation('x', 1, 1),
            up: this._createAnimation('y', -1, 0),
            down: this._createAnimation('y', 1, 0)
        };
    }

    _createAnimation(axis, sign, idx) {
        return this.animation({
            duration: 0.4, stopDuration: 0.2, actions: [
                {p: 'shaderR' + axis + idx, merger: lng.StageUtils.mergeNumbers, v: {0: 0, 0.3: -0.20 * sign, 1: 0}},
                {
                    p: 'shaderZ' + idx,
                    merger: lng.StageUtils.mergeNumbers,
                    v: {0: 0, 0.5: this._focusedZ + 10, 1: this._focusedZ}
                }
            ]
        });
    }

    set w(v) {
        this.tag('Main').w = v + 2;
        this.tag('Wrapper').w = v;
    }

    set h(v) {
        this.tag('Main').h = v + 2;
        this.tag('Wrapper').h = v;
    }

    get lightShader() {
        return this.tag('Main').shader;
    }

    set lightShader(v) {
        this.tag('Main').shader = v;
    }

    get content() {
        return this.tag('Content');
    }

    set content(v) {
        this.tag('Content').patch(v, true);
    }

    _recalc() {
        this.tag('Main').shader.rx = this._shaderRx0 + this._shaderRx1 + this._shaderRx;
        this.tag('Main').shader.ry = this._shaderRy0 + this._shaderRy1 + this._shaderRy;
        this.tag('Main').shader.z = this._shaderZ0 + this._shaderZ1 + this._shaderZ;
        this.tag('Main').shader.pivotZ = this._shaderZ0 + this._shaderZ1 + this._shaderZ;
    }

    get shaderZ() {
        return this._shaderZ;
    }

    set shaderZ(v) {
        this._shaderZ = v;
        this._recalc();
    }

    get shaderZ0() {
        return this._shaderZ0;
    }

    set shaderZ0(v) {
        this._shaderZ0 = v;
        this._recalc();
    }

    get shaderZ1() {
        return this._shaderZ1;
    }

    set shaderZ1(v) {
        this._shaderZ1 = v;
        this._recalc();
    }

    get shaderRx() {
        return this._shaderRx;
    }

    set shaderRx(v) {
        this._shaderRx = v;
        this._recalc();
    }

    get shaderRx0() {
        return this._shaderRx0;
    }

    set shaderRx0(v) {
        this._shaderRx0 = v;
        this._recalc();
    }

    get shaderRx1() {
        return this._shaderRx1;
    }

    set shaderRx1(v) {
        this._shaderRx1 = v;
        this._recalc();
    }

    get shaderRy() {
        return this._shaderRy;
    }

    set shaderRy(v) {
        this._shaderRy = v;
        this._recalc();
    }

    get shaderRy0() {
        return this._shaderRy0;
    }

    set shaderRy0(v) {
        this._shaderRy0 = v;
        this._recalc();
    }

    get shaderRy1() {
        return this._shaderRy1;
    }

    set shaderRy1(v) {
        this._shaderRy1 = v;
        this._recalc();
    }

    leftEnter() {
        this._anims['left'].start();
        this._enable3dShader();
    }

    leftExit() {
        this.neutralExit();
    }

    rightEnter() {
        this._anims['right'].start();
        this._enable3dShader();
    }

    rightExit() {
        this.neutralExit();
    }

    upEnter() {
        this._anims['up'].start();
        this._enable3dShader();
    }

    upExit() {
        this.neutralExit();
    }

    downEnter() {
        this._anims['down'].start();
        this._enable3dShader();
    }

    downExit() {
        this.neutralExit();
    }

    neutralEnter() {
        this._anims['neutral'].start();
        this._enable3dShader();
    }

    neutralExit() {
        this._anims['up'].stop();
        this._anims['down'].stop();
        this._anims['left'].stop();
        this._anims['right'].stop();
        this._anims['neutral'].stop();
        this._disable3dShader();
    }

    _enable3dShader() {
        this.patch({smooth: {'lightShader.strength': 0.4, 'lightShader.ambient': 0.6}});
    }

    _disable3dShader() {
        this.patch({smooth: {'lightShader.strength': 0, 'lightShader.ambient': 1}});
    }


}

const obj$1 = {
    Light3dComponent
};

const template = {
    keyWidth: 74,
    keyHeight: 74,
    horizontalSpacing: 8,
    verticalSpacing: 12,
    layouts: {
        'ABC': {
            rows: [
                {
                    keys: [
                        {c: 'A'},
                        {c: 'B'},
                        {c: 'C'},
                        {c: 'D'},
                        {c: 'E'},
                        {c: 'F'},
                        {c: 'G'},
                        {action: 'backspace', w: 148, patch: {mountY: 0.33, text: {text: '', fontFace: 'Material-Icons', fontSize: 55}}}
                    ]
                },
                {
                    keys: [
                        {c: 'H'},
                        {c: 'I'},
                        {c: 'J'},
                        {c: 'K'},
                        {c: 'L'},
                        {c: 'M'},
                        {c: 'N'},
                        {action: 'toggleToLayout', toLayout: '#123', w: 148, c: '#123'}
                    ]
                },
                {
                    keys: [
                        {c: 'O'},
                        {c: 'P'},
                        {c: 'Q'},
                        {c: 'R'},
                        {c: 'S'},
                        {c: 'T'},
                        {c: 'U'}
                    ]
                },
                {
                    keys: [
                        {c: 'V'},
                        {c: 'W'},
                        {c: 'X'},
                        {c: 'Y'},
                        {c: 'Z'},
                        {c: '-'},
                        {c: '\''}
                    ]
                },
                {
                    keys: [
                        {action: 'space', c: 'space', w: 183},
                        {action: 'delete', c: 'delete', w: 183},
                        {action: 'ok', c: 'ok', w: 183}
                    ]
                }
            ]
        },
        '#123': {
            rows: [
                {
                    keys: [
                        {c: '1'},
                        {c: '2'},
                        {c: '3'},
                        {c: '&'},
                        {c: '#'},
                        {c: '('},
                        {c: ')'},
                        {action: 'backspace', w: 148, patch: {mountY: 0.33, text: {text: '', fontFace: 'Material-Icons', fontSize: 55}}}
                    ]
                },
                {
                    keys: [
                        {c: '4'},
                        {c: '5'},
                        {c: '6'},
                        {c: '@'},
                        {c: '!'},
                        {c: '?'},
                        {c: ':'},
                        {action: 'toggleToLayout', toLayout: 'ABC', w: 148, c: 'ABC'}
                    ]
                },
                {
                    keys: [
                        {c: '7'},
                        {c: '8'},
                        {c: '9'},
                        {c: '0'},
                        {c: '.'},
                        {c: '_'},
                        {c: '\"'}
                    ]
                },
                {
                    keys: [
                        {action: 'space', c: 'space', w: 183},
                        {action: 'delete', c: 'delete', w: 183},
                        {action: 'ok', c: 'ok', w: 183}
                    ]
                }
            ]
        }
    }
};

class KeyboardButton extends lng.Component {
    static _template() {
        return {
            Background: {colorTop: 0x80e8e8e8, colorBottom: 0x80d1d1d1},
            Content: {}
        };
    }

    set action(v) {
        this._action = v;
    }

    get action() {
        return this._action;
    }

    get c() {
        return this.key.c;
    }

    set key(v) {
        this._key = v;
        if(this.active) {
            this._update();
        }
    }

    _update() {
        this.patch(this._getPatch(this._key));
    }
    
    _getPatch(key) {
        let content = key.patch || {text: {text: key.c, fontFace: 'RobotoRegular', textAlign: 'center', fontSize: 36}};
        return {
            Background: {texture: lng.Tools.getRoundRect(this.w, this.h, 7, 0, 0xffffffff, true, 0xffffffff)},
            Content: {mountX: 0.5, mountY: 0.4, x: this.w/2, y: this.h/2, ...content}
        };
    }

    get key() {
        return this._key;
    }

    _focus() {
        this.patch({
            Background: {smooth: {colorTop: 0xff3777ee, colorBottom: 0xff2654a8}}
        });
    }

    _unfocus() {
        this.patch({
            Background: {smooth: {colorTop: 0x80e8e8e8, colorBottom: 0x80d1d1d1}}
        });
    }

    _firstActive() {
        this._update();
    }
}

class Keyboard extends lng.Component {
    static _template() {
        return {

        };
    }

    _construct() {
        this._template = template;
    }

    set template(v) {
        this._template = v;
    }

    get keyboardTemplate() {
        return this._template;
    }

    get keyboardButton() {
        return KeyboardButton;
    }

    get maxCharacters() {
        return 40;
    }

    set value(v) {
        if(v.length < this.maxCharacters) {
            this._value = v;
            this.signal('valueChanged', {value: v});
        }
    }

    get value() {
        return this._value;
    }

    get rows() {
        return this.children;
    }

    get rowLength() {
        return this.rows[this.rowIndex].children.length;
    }

    get currentKey() {
        return this.children[this.rowIndex].children[this.colIndex] || null;
    }

    set layout(layout) {
        this._layout = layout;
        this._update();
    }

    get layout() {
        return this._layout;
    }

    _getFocused() {
        return this.currentKey;
    }

    _navigate(dir, value) {
        dir = (dir === 'up' || dir === 'down') ? 'vertical' : 'horizontal';
        if(dir === 'horizontal' && this.colIndex + value < this.rowLength && this.colIndex + value > -1) {
            this.previous = null;
            return this.colIndex += value;
        }
        else if(dir === 'vertical' && this.rowIndex + value < this.rows.length && this.rowIndex + value > -1) {
            const currentColIndex = this.colIndex;
            const targetRow = this.rowIndex + value;
            if(this.previous && this.previous.row === targetRow) {
                const tmp = this.previous.col;
                this.previous.col = this.colIndex;
                this.colIndex = tmp;
            }
            else {
                const targetRow = this.children[(this.rowIndex + value)];
                const targetItems = targetRow.children;
                const ck = this.currentKey;
                let target = 0;
                for(let i = 0; i < targetItems.length; i++) {
                    const ckx = this.children[this.rowIndex].x + ck.x;
                    const tix = targetRow.x + targetItems[i].x;
                    target = i;
                    if((ckx >= tix && ckx <= tix + targetItems[i].w) || (tix >= ckx && tix <= ckx + ck.w)) {
                        break;
                    }
                }
                this.colIndex = target;
            }
            this.previous = {col: currentColIndex, row: this.rowIndex};
            return this.rowIndex += value;
        }
        return false;
    }

    _update() {
        if(this._layout && this.keyboardTemplate.layouts[this._layout] === undefined) {
            console.error(`Configured layout "${this.layout}" does not exist. Reverting to "${Object.keys(this.keyboardTemplate.layouts)[0]}"`);
            this._layout = null;
        }
        if(!this._layout) {
            this._layout = Object.keys(this.keyboardTemplate.layouts)[0];
        }
        const {keyWidth, keyHeight, horizontalSpacing = 0, verticalSpacing = 0, layouts} = this.keyboardTemplate;

        this.children = layouts[this._layout].rows.map((row, rowIndex) => {
            let keyOffset = 0;
            const {x = 0, rowVerticalSpacing = verticalSpacing, rowHorizontalSpacing = horizontalSpacing, keys = []} = row;
            return {y: keyHeight * rowIndex + (rowIndex * rowVerticalSpacing), x,
                children: keys.map((key) => {
                    key = Object.assign({action: 'input'}, key);
                    const prevOffset = keyOffset;
                    const {w = keyWidth, h = keyHeight, action, toLayout} = key;
                    keyOffset += w + rowHorizontalSpacing;
                    return {key, action, toLayout, x: prevOffset, w, h, type: this.keyboardButton}
                })
            };
        });
    }

    reset() {
        this.colIndex = 0;
        this.rowIndex = 0;
        this._value = '';
        this.previous = null;
    }

    _init() {
        this.reset();
        this._update();
    }

    _handleRight() {
        return this._navigate('right', 1);
    }

    _handleLeft() {
        return this._navigate('left', -1);
    }

    _handleUp() {
        return this._navigate('up', -1);
    }

    _handleDown() {
        return this._navigate('down', 1);
    }

    _handleEnter() {
        const key = this.currentKey;
        switch(key.action) {
            case 'input':
                this.value += key.c;
                break;
            case 'backspace':
                this.value = this.value.slice(0, -1);
                break
            case 'space':
                if(this.value.length > 0){
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
}

const template$1 = {
    keyWidth: 64,
    keyHeight: 84,
    horizontalSpacing: 8,
    verticalSpacing: 12,
    layouts: {
        'ABC': {
            rows: [
                {
                    keys: [
                        {c: 'Q'},
                        {c: 'W'},
                        {c: 'E'},
                        {c: 'R'},
                        {c: 'T'},
                        {c: 'Y'},
                        {c: 'U'},
                        {c: 'I'},
                        {c: 'O'},
                        {c: 'P'}
                    ]
                },
                {
                    x: 34,
                    keys: [
                        {c: 'A'},
                        {c: 'S'},
                        {c: 'D'},
                        {c: 'F'},
                        {c: 'G'},
                        {c: 'H'},
                        {c: 'J'},
                        {c: 'K'},
                        {c: 'L'}
                    ]
                },
                {
                    keys: [
                        {action: 'toggleToLayout', toLayout: 'abc', c: 'Aa', w: 98},
                        {c: 'Z'},
                        {c: 'X'},
                        {c: 'C'},
                        {c: 'V'},
                        {c: 'B'},
                        {c: 'N'},
                        {c: 'M'},
                        {action: 'backspace', w: 98, patch: {mountY: 0.33, text: {text: '', fontFace: 'Material-Icons', fontSize: 55}}}
                    ]
                },
                {
                    keys: [
                        {action: 'toggleToLayout', toLayout: '#123', w: 136, c: '#123'},
                        {c: ','},
                        {action: 'space', c: '', w: 276},
                        {c: '.'},
                        {action: 'hideKeyboard', w: 136, patch: {mountY: 0.33, text: {text: '', fontFace: 'Material-Icons', fontSize: 55}}}
                    ]
                }
            ]
        },
        'abc': {
            rows: [
                {
                    keys: [
                        {c: 'q'},
                        {c: 'w'},
                        {c: 'e'},
                        {c: 'r'},
                        {c: 't'},
                        {c: 'y'},
                        {c: 'u'},
                        {c: 'i'},
                        {c: 'o'},
                        {c: 'p'}
                    ]
                },
                {
                    x: 34,
                    keys: [
                        {c: 'a'},
                        {c: 's'},
                        {c: 'd'},
                        {c: 'f'},
                        {c: 'g'},
                        {c: 'h'},
                        {c: 'j'},
                        {c: 'k'},
                        {c: 'l'}
                    ]
                },
                {
                    keys: [
                        {action: 'toggleToLayout', toLayout: 'ABC', c: 'aA', w: 98},
                        {c: 'z'},
                        {c: 'x'},
                        {c: 'c'},
                        {c: 'v'},
                        {c: 'b'},
                        {c: 'n'},
                        {c: 'm'},
                        {action: 'backspace', w: 98, patch: {mountY: 0.33, text: {text: '', fontFace: 'Material-Icons', fontSize: 55}}}
                    ]
                },
                {
                    keys: [
                        {action: 'toggleToLayout', toLayout: '#123', w: 136, c: '#123'},
                        {c: ','},
                        {action: 'space', c: '', w: 276},
                        {c: '.'},
                        {action: 'hideKeyboard', w: 136, patch: {mountY: 0.33, text: {text: '', fontFace: 'Material-Icons', fontSize: 55}}}
                    ]
                }
            ]
        },
        '#123': {
            rows: [
                {
                    keys: [
                        {c: '1'},
                        {c: '2'},
                        {c: '3'},
                        {c: '4'},
                        {c: '5'},
                        {c: '6'},
                        {c: '7'},
                        {c: '8'},
                        {c: '9'},
                        {c: '0'}
                    ]
                },
                {
                    x: 34,
                    keys: [
                        {c: '@'},
                        {c: '#'},
                        {c: '€'},
                        {c: '_'},
                        {c: '&'},
                        {c: '-'},
                        {c: '+'},
                        {c: '('},
                        {c: ')'}
                    ]
                },
                {
                    keys: [
                        {action: 'toggleToLayout', toLayout: '{&=', c: '{&=', w: 98},
                        {c: '*'},
                        {c: '\"'},
                        {c: '\''},
                        {c: ':'},
                        {c: ';'},
                        {c: '!'},
                        {c: '?'},
                        {action: 'backspace', w: 98, patch: {mountY: 0.33, text: {text: '', fontFace: 'Material-Icons', fontSize: 55}}}
                    ]
                },
                {
                    keys: [
                        {action: 'toggleToLayout', toLayout: 'ABC', w: 136, c: 'ABC'},
                        {c: ','},
                        {action: 'space', c: '', w: 276},
                        {c: '.'},
                        {action: 'hideKeyboard', w: 136, patch: {mountY: 0.33, text: {text: '', fontFace: 'Material-Icons', fontSize: 55}}}
                    ]
                }
            ]
        },
        '{&=': {
            rows: [
                {
                    keys: [
                        {c: '~'},
                        {c: '\`'},
                        {c: '|'},
                        {c: '\u2022'},
                        {c: '√'},
                        {c: 'π'},
                        {c: '\u00f7'},
                        {c: '\u00d7'},
                        {c: '¶'},
                        {c: '∆'}
                    ]
                },
                {
                    keys: [
                        {c: '£'},
                        {c: '¥'},
                        {c: '€'},
                        {c: '¢'},
                        {c: '^'},
                        {c: '°'},
                        {c: '='},
                        {c: '{'},
                        {c: '}'},
                        {c: 'a'}
                    ]
                },
                {
                    keys: [
                        {action: 'toggleToLayout', toLayout: '#123', c: '#123', w: 98},
                        {c: '%'},
                        {c: '©'},
                        {c: '®'},
                        {c: '™'},
                        {c: '\u2713'},
                        {c: '['},
                        {c: ']'},
                        {action: 'backspace', w: 98, patch: {mountY: 0.33, text: {text: '', fontFace: 'Material-Icons', fontSize: 55}}}
                    ]
                },
                {
                    keys: [
                        {action: 'toggleToLayout', toLayout: 'ABC', w: 136, c: 'ABC'},
                        {c: '<'},
                        {action: 'space', c: '', w: 276},
                        {c: '>'},
                        {action: 'hideKeyboard', w: 136, patch: {mountY: 0.33, text: {text: '', fontFace: 'Material-Icons', fontSize: 55}}}
                    ]
                }
            ]
        }
    }
};

const obj$2 = {
    Keyboard,
    KeyboardButton,
    SimpleKeyboardTemplate: template,
    AdvancedKeyboardTemplate: template$1
};

class ItemList extends lng.Component {
    static _template() {
        return {
            Wrapper: {
                flex: {direction: 'row'}
            }
        };
    }

    set items(items) {
        this.tag('Wrapper').children = items;
        this._index = 0;
        if(items.length > 0) {
            this._setState('Filled');
        }
        else {
            this._setState('Empty');
        }
    }

    get items() {
        return this.tag('Wrapper').children
    }

    get currentItem() {
        return this.items[this._index];
    }

    get length() {
        return this.items.length;
    }

    set orientation(v) {
        this._orientation = v;
        if(v === 'horizontal') {
            this.tag('Wrapper').patch({flex: {direction: 'row'}});
        }
        else {
            this.tag('Wrapper').patch({flex: {direction: 'column'}});
        }
    }

    get orientation() {
        return this._orientation || 'horizontal';
    }

    set jump(bool) {
        this._jump = bool;
    }

    get jump() {
        return this._jump || false;
    }

    set jumpToStart(bool) {
        this._jumpToStart = bool;
    }

    get jumpToStart() {
        return this._jumpToStart !== undefined ? this._jumpToStart : this.jump;
    }

    set jumpToEnd(bool) {
        this._jumpToEnd = bool;
    }

    get jumpToEnd() {
        return this._jumpToEnd !== undefined ? this._jumpToEnd : this.jump;
    }

    _navigate(dir) {
        const ori = this.orientation;
        if(((dir === 'right' || dir === 'left') && ori === 'horizontal') || ((dir === 'up' || dir === 'down') && ori === 'vertical')) {
            const length = this.items.length;
            const currentIndex = this._index;
            let targetIndex = currentIndex + 1;
            if(dir === 'left' || dir === 'up') {
                targetIndex = currentIndex - 1;
            }

            if(targetIndex > -1 && targetIndex < length) {
                this._index = targetIndex;
            }
            else if(this.jump || (this.jumpToStart || this.jumpToEnd)) {
                if(targetIndex < 0 && this.jumpToEnd) {
                    this._index = targetIndex + length;
                }
                else if(targetIndex === length && this.jumpToStart){
                    this._index = 0;
                }
            }
            else {
                return false;
            }

            if(currentIndex !== this._index) {
                this.indexChanged({index: this._index, previousIndex: currentIndex});
            }
        }
        return false;
    }

    setIndex(targetIndex) {
        if(targetIndex > -1 && targetIndex < this.items.length) {
            const currentIndex = this._index;
            this._index = targetIndex;
            this.indexChanged({index: this._index, previousIndex: currentIndex});
        }
    }

    indexChanged(event) {
        this.signal('indexChanged', event);
    }

    _getFocused() {
        return this;
    }

    _construct() {
        this._index = 0;
    }

    _init() {
        this._setState('Empty');
    }

    static _states() {
        return [
            class Empty extends this {
            },
            class Filled extends this {
                _getFocused() {
                    return this.currentItem;
                }
                _handleRight() {
                    return this._navigate('right');
                }

                _handleLeft() {
                    return this._navigate('left');
                }

                _handleUp() {
                    return this._navigate('up');
                }

                _handleDown() {
                    return this._navigate('down');
                }
            }
        ]
    }
}

const obj$3 = {
    ItemList
};

class Slider extends lng.Component {
    static _template() {
        return {
            Wrapper: {
                flex: {direction: 'row'}
            }
        }
    }

    set items(items) {
        this._reset();
        this.tag('Wrapper').children = items;
        this.scrollToFocus(true);
        if(items.length > 0) {
            this._setState('Filled');
        }
        else {
            this._setState('Empty');
        }
    }

    get items() {
        return this.tag('Wrapper').children;
    }

    get currentItem() {
        return this.items[this._index];
    }

    get index() {
        return this._index;
    }

    set orientation(v) {
        this._orientation = v;
        if(v === 'horizontal') {
            this.tag('Wrapper').patch({flex: {direction: 'row'}});
        }
        else {
            this.tag('Wrapper').patch({flex: {direction: 'column'}});
        }
    }

    get orientation() {
        return this._orientation || 'horizontal';
    }

    set margin(v) {
        this._margin = v;
    }

    get margin() {
        return this._margin || 0;
    }

    set marginStart(v) {
        this._marginStart = v;
    }

    get marginStart() {
        return this._marginStart || this.margin;
    }

    set marginEnd(v) {
        this._marginEnd = v;
    }

    get marginEnd() {
        return this._marginEnd || this.margin;
    }

    set jump(bool) {
        this._jump = bool;
    }

    get jump() {
        return this._jump || false;
    }

    set jumpToStart(bool) {
        this._jumpToStart = bool;
    }

    get jumpToStart() {
        return this._jumpToStart !== undefined ? this._jumpToStart : this.jump;
    }

    set jumpToEnd(bool) {
        this._jumpToEnd = bool;
    }

    get jumpToEnd() {
        return this._jumpToEnd !== undefined ? this._jumpToEnd : this.jump;
    }

    get scrollTransitionSettings() {
        return this._scrollTransitionSettings;
    }

    set scrollTransition(v) {
        this._scrollTransitionSettings.patch(v);
    }

    get scrollTransition() {
        return this._scrollTransition;
    }

    get viewportSize() {
        return this.orientation === 'horizontal' ? this.w : this.h;
    }

    _getItemCenterPosition(item) {
        if(this.orientation === 'horizontal') {
            return item.finalX + (item.finalW * 0.5);
        }
        return item.finalY + (item.finalH * 0.5);
    }

    _getScrollPosition(position) {
        const s = this._fullSize;

        const viewportSize = this.viewportSize;
        const marginStart = this.marginStart;
        const marginEnd = this.marginEnd;

        const maxDistanceStart = 0.5 * viewportSize - marginStart;
        const maxDistanceEnd = 0.5 * viewportSize - marginEnd;
        if((position < maxDistanceStart) || (s < viewportSize - (marginStart + marginEnd))) {
            position = maxDistanceStart;
        }
        else if(position > s - maxDistanceEnd) {
            position = s - maxDistanceEnd;
        }
        return position - 0.5 * viewportSize;
    }

    _navigate(dir) {
        const ori = this.orientation;
        if(((dir === 'right' || dir === 'left') && ori === 'horizontal') || ((dir === 'up' || dir === 'down') && ori === 'vertical')) {
            const length = this.items.length;
            const currentIndex = this._index;
            let targetIndex = currentIndex + 1;
            if(dir === 'left' || dir === 'up') {
                targetIndex = currentIndex - 1;
            }

            if(targetIndex > -1 && targetIndex < length) {
                this._index = targetIndex;
            }
            else if(this.jump || (this.jumpToStart || this.jumpToEnd)) {
                if(targetIndex < 0 && this.jumpToEnd) {
                    this._index = targetIndex + length;
                }
                else if(targetIndex === length && this.jumpToStart){
                    this._index = 0;
                }
            }

            if(currentIndex !== this._index) {
                this.indexChanged({index: this._index, previousIndex: currentIndex, length: this.items.length});
            }
            this.scrollToFocus();
        }
        return false;
    }

    scrollToFocus(immediate) {
        if(this.currentItem) {
            const focusPosition = this._getItemCenterPosition(this.currentItem);
            const scrollPosition = this._getScrollPosition(focusPosition);
            if(this._scrollTransition.isRunning()) {
                this._scrollTransition.reset(-scrollPosition, 0.1);
            }
            else {
                this._scrollTransition.start(-scrollPosition);
            }
            if(immediate) {
                this._scrollTransition.finish();
            }
        }
    }

    setIndex(targetIndex, immediate = false) {
        if(targetIndex > -1 && targetIndex < this.items.length) {
            const currentIndex = this._index;
            this._index = targetIndex;
            this.indexChanged({index: this._index, previousIndex: currentIndex, immediate});
            this.scrollToFocus(immediate);
        }
    }

    indexChanged(event) {
        this.signal('indexChanged', event);
    }

    _getFocused() {
        return this;
    }

    _reset() {
        this._index = 0;
    }

    _construct() {
        this._index = 0;
        this._scrollTransitionSettings = this.stage.transitions.createSettings({});
    }

    _init() {
        const wrapper = this.tag('Wrapper');
        const or = this.orientation === 'horizontal' ? 'x' : 'y';
        wrapper.transition(or, this._scrollTransitionSettings);
        this._scrollTransition = wrapper.transition(or);
        wrapper.onAfterUpdate = () => {
            if(this.orientation === 'horizontal') {
                this._fullSize = wrapper.finalW;
            }
            else {
                this._fullSize = wrapper.finalH;
            }
        };
        this._setState('Empty');
    }

    static _states() {
        return [
            class Empty extends this {
            },
            class Filled extends this {
                _getFocused() {
                    return this.currentItem;
                }
                _handleRight() {
                    return this._navigate('right');
                }

                _handleLeft() {
                    return this._navigate('left');
                }

                _handleUp() {
                    return this._navigate('up');
                }

                _handleDown() {
                    return this._navigate('down');
                }
            }
        ]
    }
}

const obj$4 = {
    Slider
};

const tools = {
    player: obj,
    effects: obj$1,
    keyboard: obj$2,
    itemlist: obj$3,
    slider: obj$4
};

// Exposes the ux namespace for apps.

const ux$1 = {
    Ui,
    App,
    tools
};

if (typeof window !== "undefined") {
    window.ux = ux$1;
}

export default ux$1;
