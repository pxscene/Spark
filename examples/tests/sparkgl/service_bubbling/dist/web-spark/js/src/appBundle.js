(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.appBundle = factory());
}(this, (function () { 'use strict';

    function serviceCallback(service, ctx) {
        console.log("entered service callback function !!!! " + service);
        return "ALLOW";
    }

    class MyApp extends ux.App {
        static _template() {
            return {
                     Text: {color: 0xff00B74F, text: {text: "Hello World"}}
                }
         };
     
        _init() {
            if (lng.Utils.isSpark) 
            {
                this.application.stage.addServiceProvider(serviceCallback);
            }
            sparkscene.getService('testService');
        }

        _construct() {
        }
    }

    return MyApp;

})));
