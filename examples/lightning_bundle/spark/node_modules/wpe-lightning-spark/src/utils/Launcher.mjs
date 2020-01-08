/* eslint-disable import/no-unresolved,valid-jsdoc,no-unused-vars,no-undef,import/extensions */
import fs from 'fs';
import http from 'http';
import https from 'https';
import fetch from 'node-fetch';
import lng from "wpe-lightning";
import SparkPlatform from "wpe-lightning-spark/src/platforms/spark/SparkPlatform";

const _fs = fs;
const _http = http;
const _https = https;
const Headers = fetch.Headers;

lng.Stage.platform = SparkPlatform;

/**
 * Convenience utility for setting up and launching
 *  a Lightning application on the Spark platform.
 *
 *  This launcher encapsulates binding the Spark
 *  environment constructs to the application instance.
 *
 *  It should be included, generally, as part of index.js
 *  or other entry point script, so that all the necessary
 *  bindings have occured before any application code is
 *  parsed or executed.
 *
 *  see examples for usage
 *
 */
export default class Launcher {

    /**
     * Launch application instance
     *
     *
     * @param appType - the type of the application.
     * @param options - options to pass to application's constructor.
     * @param launchCallback - a call back that will be passed the
     *                         created application
     *
     * @returns - the result of the callback function
     *
     */
    static launchApplication(
        appType,
        options = {},
        launchCallback = () => {}) {

        let app = new appType(
            Object.assign(
                {
                    stage: {
                        w: 1280, h: 720,
                        precision: 0.6666666667,
                        clearColor: 0x00000000,
                        canvas2d: false,
                    },
                    debug: false,
                    keys: {},
                },
                options));

        const sv = sparkview;
        sv.on('onKeyDown', event => {
            // normalize the key event to match web structure
            const f = event.flags;
            const keyEvent = {
                keyCode: event.keyCode,
                altKey: f === 48 || f === 56,
                ctrlKey: f === 16 || f === 48 || f === 24 || f === 56,
                shiftKey: f === 8 || f === 136 || f === 24 || f === 56,
                sparkEvent: event,
            };
            app._receiveKeydown(keyEvent);
        });

        const sc = sparkscene;
        sc.on('onClose', () => {
            app.destroy();
            app = null;
        });

        // reach into the app and get its platform instance
        // in order to load the fonts
        const preLoadFonts = Promise.all(
            app.stage.platform.loadFonts(appType.getFonts()).promises);

        return preLoadFonts.then(() => launchCallback(app));
    }
}
