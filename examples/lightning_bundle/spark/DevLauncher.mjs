import ux from "./src/ux.mjs";
import lng from 'wpe-lightning-spark';
import fetch from "node-fetch";

export default class DevLauncher {

    constructor() {
    }

    launch(appType, lightningOptions, options = {}) {
        this._appType = appType;
        this._options = options;
        return this._start(lightningOptions);
    }

    _handleKey(event) {
        this._ui._receiveKeydown(event);
    }

    _start(lightningOptions = {}) {
        this._openFirewall();
        this._lightningOptions = this._getLightningOptions(lightningOptions);
        return this._startApp();
    }

    _startApp() {
        ux.Ui.staticFilesPath = __dirname + "/";

        this._ui = new ux.Ui(this._lightningOptions);
        this._ui.startApp(this._appType);
    }

    _loadInspector() {
        if (this._options.useInspector) {
            /* Attach the inspector to create a fake DOM that shows where lightning elements can be found. */
            return this.loadScript(DevLauncher._uxPath + "../wpe-lightning/devtools/lightning-inspect.js");
        } else {
            return Promise.resolve();
        }
    }

    _openFirewall() {
        // Fetch app store to ensure that proxy/image servers firewall is opened.
        //fetch(`http://widgets.metrological.com/${encodeURIComponent(ux.Ui.getOption('operator') || 'metrological')}/nl/test`).then(() => {});
    }

    _getLightningOptions(customOptions = {}) {
        let options = {stage: {w: 1920, h: 1080}, debug: false, keys: this._getNavigationKeys()};

        const config = options.stage;
        if (customOptions.h === 720) {
            config['w'] = 1280;
            config['h'] = 720;
            config['precision'] = 0.6666666667;
        } else {
            config['w'] = 1920;
            config['h'] = 1080;

            config.useImageWorker = true;
        }

        options = lng.tools.ObjMerger.merge(options, customOptions);

        return options;
    }

    _getNavigationKeys() {
        return {
            8: "Back",
            13: "Enter",
            27: "Menu",
            37: "Left",
            38: "Up",
            39: "Right",
            40: "Down",
            174: "ChannelDown",
            175: "ChannelUp",
            178: "Stop",
            250: "PlayPause",
            191: "Search", // Use "/" for keyboard
            409: "Search"
        };
    }
}
