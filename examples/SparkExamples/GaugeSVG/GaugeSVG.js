/*
  pxCore Copyright 2005-2017 John Robinson

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.

  Author: Hugh Fitzpatrick
*/


function GaugeSVG(scene, params)
{
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Property: READY
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    this._ready = null;
    Object.defineProperty(this, "ready",
    {
        get: function ()    { return this._ready; },
    });

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    if( scene == undefined )
    {
        this._ready = Promise.reject("Oh NO ... SCENE is not defined.");

        return this;
    }

    if( scene.capabilities              == undefined ||
        scene.capabilities.graphics     == undefined ||
        scene.capabilities.graphics.svg == undefined)
    {
        this._ready = Promise.reject("Oh NO ... SVG is not supported in this build.");

        return this;
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Property: PARENT
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    this._parent = (params && params.parent) ? params.parent : scene.root;
    Object.defineProperty(this, "parent",
    {
        set: function (val) { this._parent = val;  guage.parent = this._parent; },
        get: function ()    { return this._parent; },
    });

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Property: ALPHA
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    this._a = (params && params.a) ? params.a : 0;
    Object.defineProperty(this, "a",
    {
        set: function (val) { this._a = val;  guage.a = this._a; },
        get: function ()    { return this._a; },
    });

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Property: POSITION
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    this._x = (params && params.x) ? params.x : 0;
    Object.defineProperty(this, "x",
    {
        set: function (val) { this._x = val;  guage.x = this._x; },
        get: function ()    { return this._x; },
    });

    this._y = (params && params.y) ? params.y : 0;
    Object.defineProperty(this, "y",
    {
        set: function (val) { this._y = val;  guage.y = this._y; },
        get: function ()    { return this._y; },
    });

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Property: ANCHOR
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    this._px = (params && params.px) ? params.px : 0;
    Object.defineProperty(this, "px",
    {
        set: function (val) { this._px = val;  guage.px = this._px; },
        get: function ()    { return this._px; },
    });

    this._py = (params && params.py) ? params.py : 0;
    Object.defineProperty(this, "py",
    {
        set: function (val) { this._py = val;  guage.y = this._py; },
        get: function ()    { return this._py; },
    });

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Property: DIAMETER
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    this._d = (params && params.d) ? params.d : 256;
    Object.defineProperty(this, "d",
    {
        set: function (val) { this._d = val;  },
        get: function ()    { return this._d; },
    });

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Property: WEIGHT (stroke)
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    this._wt = (params && params.wt) ? params.wt : 45;
    Object.defineProperty(this, "wt",
    {
        set: function (val) { this._wt = val;  },
        get: function ()    { return this._wt; },
    });

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Property: TIME (duration)
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    this._t = (params && params.t) ? params.t : 5;
    Object.defineProperty(this, "t",
    {
        set: function (val) { this._t = val;  },
        get: function ()    { return this._t; },
    });

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Property: FOREGROUND COLOR
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    this._fc = (params && params.fc) ? params.fc : "#800";
    Object.defineProperty(this, "fc",
    {
        set: function (val) { this._fc = val;  },
        get: function ()    { return this._fc; },
    });

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Property: BACKGROUND COLOR
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    this._bc = (params && params.bc) ? params.bg : "#111";
    Object.defineProperty(this, "bc",
    {
        set: function (val) { this._bc = val;  },
        get: function ()    { return this._bc; },
    });

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    var TWEEN  = scene.animation.TWEEN_LINEAR;
    var OPTION = scene.animation.OPTION_FASTFORWARD;

    var fc = this._fc; // Background color
    var bc = this._bc; // Background color
    var sw = this._wt; // Stoke Width

    var ww = this._d;  // WxH of the component
    var hh = this._d;

    var halfRing = '<svg viewBox="0 0 '+(ww)+' '+(hh/2)+'">'+
                    '<path fill="none" stroke-width="'+sw+'" '+
                    'stroke="'+fc+'" stroke-linecap="square" '+
                    'd=" m ' + (sw/2) + ' ' + (hh/2) +''+
                    'a 1,1 0 1,1 ' + (ww-sw) +',0 />'+
                    '</svg>';

    var discBG   = '<svg viewBox="0 0 '+(ww)+' '+(hh)+'">'+
                    '<circle fill="none" stroke-width="'+sw+'" '+
                    'stroke="'+bc+'" stroke-linecap="square" '+
                    'r="' + (ww/2-sw/2) + '" cx="' + (hh/2) +'" cy="' + (ww/2) +'" />'+

                    '</svg>';

    var disc     = 'data:image/svg,' + discBG;
    var ring     = 'data:image/svg,' + halfRing;

    var discRes  = scene.create({ t: "imageResource", w: ww, h: hh, url: disc });
    var ringRes  = scene.create({ t: "imageResource", w: ww, h: hh, url: ring });

    var guage    = scene.create({ t: "object", x: this._x, y: this._y, parent: this._parent, r: 90,cx: ww/2, cy: hh/2, w: ww, h: hh, px: this._px, py: this._py});
    var ringBG   = scene.create({ t: "image",  x: 0, y: 0, parent: guage, resource: discRes});


    var obj1     = scene.create({ t: "object", fillColor: "#666", x: 0, y: 0, parent: guage, w: ww, h: hh/2, clip: true, draw: true});
    var ringImg1 = scene.create({ t: "image",  x: 0, y: 0, parent: obj1,  cx: ww/2, cy: hh/2,  r: -180, resource: ringRes});

    var obj2     = scene.create({ t: "object", fillColor: "#028", x: 0, y:hh/2,  parent: guage, w: ww, h: hh/2, clip: true, draw: true});
    var ringImg2 = scene.create({ t: "image",  x: 0, y: -hh/2, parent: obj2, cx: ww/2, cy: hh/2, r: 0, resource: ringRes });

    this._ready = Promise.all([ discRes.ready, ringRes.ready, guage.ready, ringBG.obj,
                                obj1.ready, ringImg1.ready,
                                obj2.ready, ringImg2.ready,  ]);

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    this.setPos = function(val, t)
    {
        if(val < 0)   val = 0;
        if(val > 100) val = 100;

        var vv1 = (1 - val/50) > 0 ? (1 - val/50) : 0;
        var vv2 = (val   - 50) > 0 ? (val   - 50) : 0;

        var rr1 =    vv1 * -180;  //  0% to  50% ... -180 to   0 degrees of arc
        var rr2 = vv2/50 *  180;  // 50% to 100% ...    0 to 180 degrees of arc

        var tt = t;

        if(tt == undefined)
        {
            // Rotate ARC's to visibility
            //
            ringImg1.r = rr1;
            ringImg2.r = rr2;
        }
        else
        {
            var tt = t * (val / 100) / 2; // compute speed relative to 100% fill, over 2 phases

            ringImg1.animateTo( {r: rr1}, tt, TWEEN, OPTION, 1)
            setTimeout(function(o)
            {
                ringImg2.animateTo( {r: rr2}, tt, TWEEN, OPTION, 1);
            }, tt * 1000);
        }
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    this.fillRing = function(t)
    {
        var tt = (t !== undefined) ? (t / 2) : (this._t / 2); // 2 phases

        ringImg1.animateTo( {r: 0 }, tt, TWEEN, OPTION, 1)
        setTimeout(function(o)
        {
            ringImg2.animateTo( {r: 180 }, tt, TWEEN, OPTION, 1)
        }, tt * 1000);
    };

    this.emptyRing = function (t)
    {
        var tt = (t !== undefined) ? (t / 2) : (this._t / 2); // 2 phases

        ringImg2.animateTo( { r: 0 }, tt, TWEEN, OPTION, 1)
        setTimeout(function(o) // 
        {
            ringImg1.animateTo( { r: -180 }, tt, TWEEN, OPTION, 1)
        }, tt * 1000);
    };
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

module.exports = GaugeSVG;

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

