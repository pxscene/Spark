(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.appBundle = factory());
}(this, (function () { 'use strict';

    class MyApp extends ux.App {
        static _template() {
            return {
                BackgroundImage: { src: MyApp.getPath("background.png"), scaleX:2, scaleY:2},
                MainImage: { src: MyApp.getPath("rockies.jpeg")}
            };
        }

        _handleUp(){
            this.tag("BackgroundImage").scaleX = 1;
            this.tag("BackgroundImage").scaleY = 1;
        }

        _handleDown(){
            this.tag("BackgroundImage").scaleX = 2;
            this.tag("BackgroundImage").scaleY = 2;
        }
    }

    MyApp.COLORS = {
        BACKGROUND: 0xff282e32
    };

    return MyApp;

})));
