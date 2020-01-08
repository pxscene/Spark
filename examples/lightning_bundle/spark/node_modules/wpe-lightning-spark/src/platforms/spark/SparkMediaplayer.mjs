import lng from "wpe-lightning/src/lightning.mjs";

export default class SparkMediaplayer extends lng.Component {

    _construct(){
        this._skipRenderToTexture = false;
    }

    static _supportedEvents()
    {
        return ['onProgressUpdate', 'onEndOfStream'];
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

        let proxyServer = "";
        if (sparkQueryParams && sparkQueryParams.sparkProxyServer) {
            proxyServer = sparkQueryParams.sparkProxyServer;
        }

        this.videoEl = sparkscene.create({
            t: "video",
            id: "video-player",
            autoPlay: "false",
            proxy:proxyServer
        });

        this.eventHandlers = [];
    }

    _registerListeners() {
        SparkMediaplayer._supportedEvents().forEach(event => {
            const handler = (e) => {
                this.fire(event, {videoElement: this.videoEl, event: e});
            };
            this.eventHandlers.push(handler);
            this.videoEl.on(event, handler);
        });
    }

    _deregisterListeners() {
        SparkMediaplayer._supportedEvents().forEach((event, index) => {
            this.videoEl.delListener(event, this.eventHandlers[index]);
        });
        this.eventHandlers = [];
    }

    _attach() {
        this._registerListeners();
    }

    _detach() {
        this._deregisterListeners();
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
                this.open(settings.stream.src);
                this._setHide(settings.hide);
                this._setVideoArea(settings.videoPos);
                this.doPlay();
            } else {
                this.close();
            }
            this._stream = settings.stream;
        }
    }

    _setHide(hide) {
        this.videoEl.a = hide ? 0 : 1;
    }

    open(url) {
        console.log('Playing stream', url);
        if (this.application.noVideo) {
            console.log('noVideo option set, so ignoring: ' + url);
            return;
        }
        if (this.videoEl.url === url) return this.reload();
        this.videoEl.url = url;
    }

    close() {
        this.videoEl.stop();
        this._clearSrc();
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
        var url = this.videoEl.url;
        this.close();
        this.videoEl.url = url;
    }

    getPosition() {
        return Promise.resolve(this.videoEl.position);
    }

    setPosition(pos) {
        this.videoEl.position = pos;
    }

    getDuration() {
        return Promise.resolve(this.videoEl.duration);
    }

    seek(time, absolute = false) {
        if(absolute) {
            this.videoEl.position = time;
        }
        else {
            this.videoEl.setPositionRelative(time);
        }
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
            this.videoEl.x = Math.round(videoPos[0] * precision) + 'px';
            this.videoEl.y = Math.round(videoPos[1] * precision) + 'px';
            this.videoEl.w = Math.round((videoPos[2] - videoPos[0]) * precision) + 'px';
            this.videoEl.h = Math.round((videoPos[3] - videoPos[1]) * precision) + 'px';
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
            currentTime: this.videoEl.position,
            duration: this.videoEl.duration || 1
        });
    }

    seeking(args) {
        this._fireConsumer('$mediaplayerSeeking', {
            currentTime: this.videoEl.position,
            duration: this.videoEl.duration || 1
        });
    }

    onEndOfStream(args) {
        this._fireConsumer('$mediaplayerEnded', args);
        this._setState("");
    }

    onProgressUpdate(args) {
        this._fireConsumer('$mediaplayerProgress', {
            currentTime: this.videoEl.position,
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
