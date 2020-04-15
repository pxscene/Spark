(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.appBundle = factory());
}(this, (function () { 'use strict';

    class MyApp extends ux.App {
        static _template() {
            return {
               Text: {color: 0xff00B74F, text: {text: "Animated Image"}},
               ImageTest1: {
                    texture: {
                        type: lng.Stage.platform.createImageAnimatedTexture(),
                        url:"http://www.sparkui.org/examples/gallery/images/apng/elephant.png"
                    }
                }
            };
        }
    }

    MyApp.COLORS = {
        BACKGROUND: 0xff282e32
    };

    return MyApp;

})));
