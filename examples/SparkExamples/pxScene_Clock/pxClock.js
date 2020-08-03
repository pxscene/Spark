/*
   pxClock - written by Hugh Fitzpatrick,  Copyright 2005-2017 John Robinson

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at
     http://www.apache.org/licenses/LICENSE-2.0
   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Version 1.03
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

px.import({  scene: 'px:scene.1.js',
              keys: 'px:tools.keys.js'
}).then( function importsAreReady(imports)
{
  module.exports.wantsClearscreen = function()
  {
    return false; // skip clearscreen by framework... using opaque bg.
  };

  var scene = imports.scene;
  var keys  = imports.keys;
  var root  = scene.root;

  var base = px.getPackageBaseFilePath();

  var fontRes = scene.create({ t: "fontResource", url: "FreeSans.ttf" });

  var bg = scene.create({ t: "rect", parent: root, fillColor: 0x14141FF, x: 0, y: 0, w:  800, h: 600 });

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  var factor = 1.0; // accelerate time !

  var UPDATE_TIMER = null;
  var bRunning     = false;
  var bCaptionig   = false;
  var bSetting     = false;
  var bResetting   = false;
  var bClockSet    = false;
  var bCenterMode  = false;  // NOTE:  Used to locate the (cx, cy) of the hands empirically

  var ccx =  26;
  var ccy = 189;

  var clock = scene.create({ t: "object", parent: root, x: 0, y: 0, w: 400, h: 400, interactive: true  });

  var x2 = clock.w / 2;
  var y2 = clock.h / 2;

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  var caption = null;

  var dial      = scene.create({t: "image", interactive: false, url: base + "/images/Dial.png",   parent: clock, });//x: bg.w/2, y: 100});
  var gear1     = scene.create({t: "image", interactive: false, url: base + "/images/Gear.png",   parent: clock, a: 0.9});
  var gear2     = scene.create({t: "image", interactive: false, url: base + "/images/Gear.png",   parent: clock, a: 0.9});

  var sec_hand  = scene.create({t: "image", interactive: false, url: base + "/images/Seconds_hand.png", parent: clock});
  var min_hand  = scene.create({t: "image", interactive: false, url: base + "/images/Minutes_hand.png", parent: clock});
  var hrs_hand  = scene.create({t: "image", interactive: false, url: base + "/images/Hours_hand.png",   parent: clock});

  var button1   = scene.create({t: "image", url: base + "/images/button.png", parent: bg });
  var button2   = scene.create({t: "image", url: base + "/images/button.png", parent: bg });
  var button3   = scene.create({t: "image", url: base + "/images/button.png", parent: bg });
  var button4   = scene.create({t: "image", url: base + "/images/button.png", parent: bg });

  var buttonINC = scene.create({t: "image", url: base + "/images/button75x75.png", parent: bg });
  var buttonDEC = scene.create({t: "image", url: base + "/images/button75x75.png", parent: bg });

  var target    = scene.create({t: "rect", interactive: false, fillColor: 0xFF0000ff, parent: sec_hand, a: 0 });

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  Promise.all([clock.ready, gear1.ready, gear2.ready, dial.ready, sec_hand.ready, min_hand.ready, hrs_hand.ready, 
                button1.ready, button2.ready, button3.ready, target.ready, buttonINC.ready, buttonDEC])
  .catch((err) => {
      console.log(">>> Loading Assets ... err = " + err);
  })
  .then((success, failure) => {

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    //
    // Position the BUTTONS
    //
    var h1 = (button1.resource.h + 20);
    var h5 = h1 * 5;
    var py = (bg.h - h5) / 2;

    var bw = button1.resource.w;
    var bh = button1.resource.h;

    button1.x = 1100;   button1.y = py;
    button2.x = 1100;   button2.y = button1.y + h1;
    button3.x = 1100;   button3.y = button2.y + h1;
    button4.x = 1100;   button4.y = button3.y + h1;

    buttonINC.x = 1100; buttonINC.y = button4.y + h1;
    buttonDEC.x = 1180; buttonDEC.y = button4.y + h1;

    dial.moveForward();
    gear1.moveBackward();
    gear2.moveBackward();
    target.moveToFront();

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    //
    // Create the TEXT for the BUTTONS
    //
    var pts = 22; var clr = 0x000000ff;  var oy = 4;

    scene.create({t:"textBox", text: "START", parent: button1, pixelSize: pts, w: bw, h: bh, x: 0, y: oy,
        alignHorizontal: scene.alignHorizontal.CENTER,
        alignVertical: scene.alignVertical.CENTER, textColor: clr, a: 1.0});

    scene.create({t:"textBox", text: "STOP",  parent: button2, pixelSize: pts, w: bw, h: bh, x: 0, y: oy,
        alignHorizontal: scene.alignHorizontal.CENTER,
        alignVertical: scene.alignVertical.CENTER, textColor: clr, a: 1.0});

    scene.create({t:"textBox", text: "SET", parent: button3, pixelSize: pts, w: bw, h: bh, x: 0, y: oy,
        alignHorizontal: scene.alignHorizontal.CENTER,
        alignVertical: scene.alignVertical.CENTER, textColor: clr, a: 1.0});

    scene.create({t:"textBox", text: "RESET", parent: button4, pixelSize: pts, w: bw, h: bh, x: 0, y: oy,
        alignHorizontal: scene.alignHorizontal.CENTER,
        alignVertical: scene.alignVertical.CENTER, textColor: clr, a: 1.0});

    // Update settings
    bw = buttonINC.resource.w;  bh = buttonINC.resource.h;  pts = 40;  oy = -1;

    scene.create({t:"textBox", text: "+", parent: buttonINC, pixelSize: pts, w: bw, h: bh, x: 0, y: oy,
        alignHorizontal: scene.alignHorizontal.CENTER,
        alignVertical: scene.alignVertical.CENTER, textColor: clr, a: 1.0});

    scene.create({t:"textBox", text: "-", parent: buttonDEC, pixelSize: pts, w: bw, h: bh, x: 0, y: oy,
        alignHorizontal: scene.alignHorizontal.CENTER,
        alignVertical: scene.alignVertical.CENTER, textColor: clr, a: 1.0});

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    //
    // Position the CLOCK
    //
    clock.w = dial.resource.w;
    clock.h = dial.resource.h;

    clock.cx = dial.resource.w / 2;
    clock.cy = dial.resource.h / 2;

    clock.x = 100;
    clock.y = (bg.h - clock.h)/ 2;

    var xx = dial.resource.w / 3 - 20;
    var yy = dial.resource.h / 3 - 20;

    var d = 50;

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    //
    // Position the GEARS
    //
    gear1.x = xx + d;  gear1.y = yy - d;
    gear2.x = xx - d;  gear2.y = yy + d;

    gear1.cx = gear1.resource.w / 2;
    gear1.cy = gear1.resource.h / 2;

    gear2.cx = gear2.resource.w / 2;
    gear2.cy = gear2.resource.h / 2;

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    //
    //  Position hands...
    //
    // Found empirically ... Photoshop + Guides off the dial at 12, 3, 6, 9 o'clock hours
    var x = 176; // dial.resource.w/2;
    var y =  12; // dial.resource.h/4;

    // Position
    sec_hand.x = x;    sec_hand.y = y;
    min_hand.x = x;    min_hand.y = y;
    hrs_hand.x = x;    hrs_hand.y = y;

    // Centers
    sec_hand.cx = ccx;  sec_hand.cy = ccy;
    min_hand.cx = ccx;  min_hand.cy = ccy;
    hrs_hand.cx = ccx;  hrs_hand.cy = ccy;

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    //
    // Create the CAPTION
    //
    caption = scene.create({t:"textBox", text: "Time wasted on a train ! ", parent: clock, pixelSize: 25,
        alignHorizontal: scene.alignHorizontal.CENTER, textColor: 0x888888FF, a: 0.0});

    caption.x = 0
    caption.y = clock.h + 20;
    caption.w = clock.w;
    caption.h = 50;

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    //
    // Centering hands
    //
    target.w  = target.h = 10;

    target.cx = target.w /2;   target.cy = target.h / 2;
    target.x  = sec_hand.cx - target.w /2 ;   target.y  = sec_hand.cy - target.h /2;
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    clock.animateTo({x: (scene.getWidth() - clock.w)/ 2 }, 2.5, scene.animation.EASE_OUT_BOUNCE, scene.animation.OPTION_LOOP, 1);

    updateSize( scene.getWidth(), scene.getHeight() );
  });

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  function setClockTime()
  {
    if(bSetting) return;
    bSetting = true;

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    //  Set time...
    //
    var now = new Date();

    var h = now.getHours();
    var m = now.getMinutes();
    var s = now.getSeconds();

    sec_hand.r = 0; // initially at Noon
    min_hand.r = 0; // initially at Noon
    hrs_hand.r = 0; // initially at Noon

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    //
    // Shortest Route
    //
    var sec_hand_r = (s * (360 / 60)) % 360;  // seconds per degree
    var min_hand_r = (m * (360 / 60)) % 360;  // minutes per degree
    var hrs_hand_r = (h * (360 / 12)) % 360;  // hours   per degree

    sec_hand_r = (sec_hand_r > 180) ? (sec_hand_r - 360) : (sec_hand_r);
    min_hand_r = (min_hand_r > 180) ? (min_hand_r - 360) : (min_hand_r);
    hrs_hand_r = (hrs_hand_r > 180) ? (hrs_hand_r - 360) : (hrs_hand_r);

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    //
    // Animate set time
    //
    var tt = 1.5;
    var sec_promise = sec_hand.animateTo({r: sec_hand_r }, tt, scene.animation.TWEEN_LINEAR, scene.animation.OPTION_LOOP, 1);
    var min_promise = min_hand.animateTo({r: min_hand_r }, tt, scene.animation.TWEEN_LINEAR, scene.animation.OPTION_LOOP, 1);
    var hrs_promise = hrs_hand.animateTo({r: hrs_hand_r }, tt, scene.animation.TWEEN_LINEAR, scene.animation.OPTION_LOOP, 1);

    Promise.all([sec_promise, min_promise, hrs_promise, caption])
    .catch((err) => {
    console.log(">>> Loading Assets ... err = " + err);
    })
    .then((success, failure) =>
    {
      bSetting  = false;
      bClockSet = true;
    });
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  };

  function resetClockTime()
  {
      if(bResetting) return;
      bResetting = true;

      bClockSet = false;
      factor    = 1.0;
      caption.text = "x " + factor + " factor";

      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      //
      // Animate set time
      //
      var tt = 1.5;
      var sec_promise = sec_hand.animateTo({r: 0 }, tt, scene.animation.TWEEN_LINEAR, scene.animation.OPTION_LOOP, 1);
      var min_promise = min_hand.animateTo({r: 0 }, tt, scene.animation.TWEEN_LINEAR, scene.animation.OPTION_LOOP, 1);
      var hrs_promise = hrs_hand.animateTo({r: 0 }, tt, scene.animation.TWEEN_LINEAR, scene.animation.OPTION_LOOP, 1);

      Promise.all([sec_promise, min_promise, hrs_promise, caption])
      .catch((err) => {
        console.log(">>> Resetting Time ... err = " + err);
      })
      .then((success, failure) =>
      {
        bResetting = false;
      });
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  // FACTOR INCREASE
  buttonINC.on("onMouseUp",   function (e) {  buttonINC.y -= 3; });
  buttonINC.on("onMouseDown", function (e)
  {
    buttonINC.y += 3;

    if(!bCenterMode)
    {
        if(factor < 1000)
        {
            factor += 5.5;  // INCREASE xFactor
            updateCaption(" x " + factor + " factor")
        }
    }
  });

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  // FACTOR DECREASE
  buttonDEC.on("onMouseUp",   function (e) {  buttonDEC.y -= 3; });
  buttonDEC.on("onMouseDown", function (e)
  {
    buttonDEC.y += 3;

    if(!bCenterMode)
    {
        if(factor >= 1.5)
        {
            factor -= 0.5;  // DECREASE xFactor
            updateCaption(" x " + factor + " factor")
        }
    }
  });

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  // START
  button1.on("onMouseUp",   function (e) {  button1.y -= 3; });
  button1.on("onMouseDown", function (e)
  {
    button1.y += 3;

    if(bClockSet == false)
    {
       // setClockTime();
    }
    bRunning = true;
  });

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  // STOP
  button2.on("onMouseUp",   function (e) {  button2.y -= 3; });
  button2.on("onMouseDown", function (e)
  {
    button2.y += 3;
    bRunning = false;
  });

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  // SET
  button3.on("onMouseUp",   function (e) {  button3.y -= 3; });
  button3.on("onMouseDown", function (e)
  {
    button3.y += 3;

    if(bSetting == false)
    {
        setClockTime();
    }
  });

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  // RESET
  button4.on("onMouseUp",   function (e) {  button4.y -= 3; });
  button4.on("onMouseDown", function (e)
  {
    button4.y += 3;

    if(bSetting == false)
    {
        resetClockTime();
    }
  });
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  bg.on("onKeyDown", function (e)
  {
      var code = e.keyCode;

      ccx = sec_hand.cx;
      ccy = sec_hand.cy;

      switch (code)
      {
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        case keys.SPACE:
        {
           bCenterMode = !bCenterMode; // TOGGLE

           // Turn ON centering mode
           factor    += bCenterMode ? -400 : 400;
           min_hand.a = bCenterMode ?    0 : 1;
           hrs_hand.a = bCenterMode ?    0 : 1;
           target.a   = bCenterMode ?    1 : 0;
        }
        break;
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

        case keys.UP:
        {
          if(bCenterMode) {  ccy -= 1; }                           // CENTERING MODE
          else            {  if(factor < 1000) factor += 0.5;  }   // INCREASE xFactor
        }
        break;

        case keys.DOWN:
        {
          if(bCenterMode) {  ccy += 1; }                           // CENTERING MODE
          else            {  if(factor >= 1.5) factor -= 0.5;  }   // DECREASE xFactor
        }
        break;

        case keys.LEFT:   if(bCenterMode) { ccx -= 1; } break;
        case keys.RIGHT:  if(bCenterMode) { ccx += 1; } break;
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      }//SWITCH

      if(bCenterMode)
      {
        sec_hand.cx = ccx;   sec_hand.cy = ccy;
        min_hand.cx = ccx;   min_hand.cy = ccy;
        hrs_hand.cx = ccx;   hrs_hand.cy = ccy;

        target.cx = target.w /2;                  target.cy = target.h / 2;
        target.x  = sec_hand.cx - target.w /2 ;   target.y  = sec_hand.cy - target.h /2;

      //  caption.text = "CENTERING MODE >>  ccx:" + ccx + "  ccy: " + ccy;
        updateCaption("CENTERING MODE >>  ccx:" + ccx + "  ccy: " + ccy)
      }
      else
      {
        updateCaption(" x " + factor + " factor")
      }
  });

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  function fadeCaption(aa)
  {
    caption.animateTo({a: aa }, 1.5, scene.animation.TWEEN_LINEAR, scene.animation.OPTION_LOOP, 1)
    .then((success, failure) =>
    {
        bCaptionig = false;
    });
  }

  function updateCaption(txt)
  {
    caption.text = txt;

    if(bCaptionig == false)
    {
        bCaptionig = true;

        // FADE ** IN ** THE CAPTION
        fadeCaption(1.0);
    }
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  bg.on("onKeyUp", function (e)
  {
      if(bCaptionig == true)
      {
        // FADE ** OUT ** THE CAPTION
        fadeCaption(0.0);
      }
  });

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  function updateHands()
  {
    if(bRunning == false) return;

    sec_hand.r += ( (updateInterval_sec * (360/60))       ) * factor;
    min_hand.r += ( (updateInterval_sec * (360/60))/60    ) * factor;
    hrs_hand.r += ( (updateInterval_sec * (360/60))/60/12 ) * factor;

    gear1.r    += ( (updateInterval_sec * (360/60))       ) * factor;
    gear2.r    -= ( (updateInterval_sec * (360/60))       ) * factor;
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  function updateSize(w, h)
  {
    bg.w = w;
    bg.h = h;
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  scene.on("onResize", function(e) { updateSize(e.w,e.h); layout(); });
  scene.on("onClose",  function(e) { clearInterval(UPDATE_TIMER);   });  // cleanup

  var frameRate_hz       = 30;
  var updateInterval_ms  = 1000/frameRate_hz;
  var updateInterval_sec = updateInterval_ms/1000;

  // calls updateHands() in intervals of 1000 ms
  UPDATE_TIMER = setInterval(function()
                 {
                    updateHands();
                 },
                 updateInterval_ms);

  bg.focus = true;

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).catch(function importFailed(err){
   console.error("Import failed for pxClock.js: " + err);
});