(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.appBundle = factory());
}(this, (function () { 'use strict';

    class MyApp extends ux.App {
        static _template() {
            return {
              UsingShorthand: {
                x: 250,
                y: 70,
                src: 'https://www.sparkui.org/examples/gallery/images/ball.png',
              },
              UsingTexture: {
                x: 250,
                y: 350,
                texture: {
                  type: lng.textures.ImageTexture,
                  src: 'https://www.sparkui.org/examples/gallery/images/ball.png',
                },
              },
            };
        }
    }

    MyApp.COLORS = {
        BACKGROUND: 0xff282e32
    };

    return MyApp;

})));
