(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.appBundle = factory());
}(this, (function () { 'use strict';

    class MyApp extends ux.App {
                static _template() {
                    return {
                        MyTexture: {
                            texture: {
                                type: lng.Stage.platform.createApplicationTexture(),
                                id: Math.floor(1000 + Math.random() * 9000),
                                priority: 10,
                                x: 0,
                                y: 0,
                                w: 640,
                                h: 360,
                                cx: 0,
                                cy: 0,
                                sx: 1.0,
                                sy: 1.0,
                                r: 0,
                                a: 1,
                                interactive: true,
                                painting: true,
                                clip: false,
                                mask: false,
                                draw: true,
                                launchParams: {"cmd":"spark", "uri":"https://www.sparkui.org/examples/tests/sparkgl/keybubbling/sparkApp.js"}
                            }
                        }
                    };
                }

                _handleLeft() {
                    const myTexture = this.tag("MyTexture");
                    if (this._searchPressed) {
                        myTexture.texture.setFocus(this._searchPressed = false);
                    } else {
                        myTexture.texture.setFocus(this._searchPressed = true);
                    }
                }
    }

    MyApp.COLORS = {
        BACKGROUND: 0xff282e32
    };

    return MyApp;

})));
