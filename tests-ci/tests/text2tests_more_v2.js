px.import({scene:"px:scene.1.js",
           assert:"../test-run/assert.js",
           shots:"../test-run/tools_screenshot.js",
           manual:"../test-run/tools_manualTests.js"}).then( function ready(imports) {

var scene = imports.scene;
var root = scene.root;
var assert = imports.assert.assert;
var shots = imports.shots;
var manual = imports.manual;

var doScreenshot = shots.getScreenshotEnabledValue();
var manualTest = manual.getManualTestValue();
var timeoutForScreenshot = 40;
var testPlatform=scene.info.build.os;

var basePackageUri = px.getPackageBaseFilePath();

//var textA = "ÉéÈèÇçËëÒòÔôÖöÙùÀàÂâAaBbCcDdEeFfGgHhIiKkLlMmNnOoPpQqRrSsTtVvXxYyZz123456789";
//var longText = textA + "\n" + textA + "\n" + textA;
// "Hello!  How are you?";//
// Use fontUrl to load from web
var fontUrlStart = "https://sparkui.org/examples/fonts/";
var IndieFlower = "IndieFlower.ttf";
var DejaVu = "DejaVuSans.ttf";
var DejaVuSerif = "DejaVuSerif.ttf";
var DancingScript = "DancingScript.ttf";
var DancingScriptBold = "DancingScript-Bold.ttf";
// Different text strings to test
var longText = "Here is a collection of a bunch of randomness, like words, phrases, and sentences that isn't supposed to make any kind of sense whatsoever. I want to test capital AV next to each other here. In generating this, I'm listening to someone talking, trying to make sense of what they are saying, and at the same time dictating to myself what I am going to type along with actually typing it out, recognizing when I make mistakes, and correcting myself when I do.";
var longText2 = "I don't think I'm doing a very good job listening to whoever it is that is doing the talking right now.  It probably would have been a lot easier to just copy and paste something from the net, but I'm a typist, not a person that hunts and pecks to find the appropriate key on the keyboard.  Though I do think I'm probably off of my 30 word per minute speed from way back when.  How much more text is appropriate?  Why do I use words like appropriate when I could just say will do instead?  These and other questions generally go on unanswered.  But looking at the output of this text, I realize that its simply not enough and that I need to add more text; which is making me wonder why I simply didn't copy and paste in the first place.  Ah, yes, the strange musings of a software engineer.";
var longText3 = longText + " " +longText2;
var shortText = "Hello!  How are you?";
var mediumText = "The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog."
var newlineText = "Paragraph\nParagraph longer\nParagraph more";
var newlineLongerText = "Paragraph longer Paragraph longer Paragraph longer\nParagraph longer longer \nParagraph more";
var newlineLongestText = "Paragraph more\nParagraph longer longer \nParagraph longer Paragraph longer Paragraph longer";
var continuousText = "ParagraphParagraphParagraphParagraphParagraphParagraphlongerParagraphmore";
var continuousLongText = "ParagraphParagraphlongerParagraphlongestParagraphmoreParagraphParagraphlongerParagraphlongestParagraphmoreParagraphParagraphlongerParagraphlongestParagraphmoreParagraphParagraphlongerParagraphlongestParagraphmoreParagraphParagraphlongerParagraphlongestParagraphmoreParagraphParagraphlongerParagraphlongestParagraphmoreParagraphParagraphlongerParagraphlongestParagraphmoreParagraphParagraphlongerParagraphlongestParagraphmoreParagraphParagraphlongerParagraphlongestParagraphmoreParagraphParagraphlongerParagraphlongestParagraphmoreParagraphParagraphlongerParagraphlongestParagraphmoreParagraphParagraphlongerParagraphlongestParagraphmoreParagraphParagraphlongerParagraphlongestParagraphmoreParagraphParagraphlongerParagraphlongestParagraphmoreParagraphParagraphlongerParagraphlongestParagraphmoreParagraphParagraphlongerParagraphlongestParagraphmoreParagraphParagraphlongerParagraphlongestParagraphmoreParagraphParagraphlongerParagraphlongestParagraphmoreParagraphParagraphlongerParagraphlongestParagraphmoreParagraphParagraphlongerParagraphlongestParagraphmoreParagraphParagraphlongerParagraphlongestParagraphmoreParagraphParagraphlongerParagraphlongestParagraphmoreParagraphParagraphlongerParagraphlongestParagraphmoreParagraphParagraphlongerParagraphlongestParagraphmoreParagraphParagraphlongerParagraphlongestParagraphmoreParagraphParagraphlongerParagraphlongestParagraphmoreParagraphParagraphlongerParagraphlongestParagraphmoreParagraphParagraphlongerParagraphlongestParagraphmore";
var multilinesText = "Pxscene is an application engine that has been added to the RDK.\n\
It is a scene graph API exposed to a Javascript engine in the ground.\n\
In other words, it allows for set top box applications to be authored in javascript.\n\
The authored javascript has access to the pxscene API for visual elements that are used for composition.";
var wordBoundaryCharsText = "Paragraph Paragraph Paragraph:Paragraph Paragraph&Paragraph Paragraph,Paragraph Paragraph;Paragraph Paragraph.Paragraph Paragraph?Paragraph Paragraph!Paragraph"; // \t/:&,;.?!
root.w=800;
//
// Use the font vars below to preload fonts so that they stay loaded. 

var fontIndieFlower = scene.create({t:"fontResource",url:fontUrlStart+IndieFlower});
var fontDejaVu = scene.create({t:"fontResource",url:fontUrlStart+DejaVu});
var fontDejaVuSerif = scene.create({t:"fontResource",url:fontUrlStart+DejaVuSerif});
var fontDancingScript = scene.create({t:"fontResource",url:fontUrlStart+DancingScript});
var fontDancingScriptBold = scene.create({t:"fontResource",url:fontUrlStart+DancingScriptBold});





var bg = scene.create({t:"object", parent:root, x:100, y:100, w:1000, h:1000, clip:false});
var rect = scene.create({t:"rect", parent:root, x:100, y:100, w:400, h:400, fillColor:0x00000000, lineColor:0xFF0000FF, lineWidth:1, clip:false});
var container = scene.create({t:"object", parent:root, x:100, y:100, w:800, h:600, clip:false});

// Widgets for displaying metrics values 
var height = scene.create({t:"text", parent:root, x:50, y:0, textColor:0xFFDDFFFF, pixelSize:15,clip:false,text:"Height="});
var ascent = scene.create({t:"text", parent:root, x:50, y:20, textColor:0xFFDDFFFF, pixelSize:15,clip:false,text:"Ascent="});
var descent = scene.create({t:"text", parent:root, x:50, y:40, textColor:0xFFDDFFFF, pixelSize:15,clip:false,text:"Descent="});
var naturalLeading = scene.create({t:"text", parent:root, x:50, y:60, textColor:0xFFDDFFFF, pixelSize:15,clip:false,text:"NatLead="});
var baseline  = scene.create({t:"text", parent:root, x:50, y:80, textColor:0xFFDDFFFF, pixelSize:15,clip:false,text:"Baseline="});
var boundsX1 = scene.create({t:"text", parent:root, x:200, y:0, textColor:0xFFDDFFFF, pixelSize:15,clip:false,text:"BoundsX1="});
var boundsY1 = scene.create({t:"text", parent:root, x:200, y:20, textColor:0xFFDDFFFF, pixelSize:15,clip:false,text:"BoundsY1="});
var boundsX2 = scene.create({t:"text", parent:root, x:200, y:40, textColor:0xFFDDFFFF, pixelSize:15,clip:false,text:"BoundsX2="});
var boundsY2 = scene.create({t:"text", parent:root, x:200, y:60, textColor:0xFFDDFFFF, pixelSize:15,clip:false,text:"BoundsY2="});
var charFirstX = scene.create({t:"text", parent:root, x:400, y:0, textColor:0xFFDDFFFF, pixelSize:15,clip:false,text:"charFirstX="});
var charFirstY = scene.create({t:"text", parent:root, x:400, y:20, textColor:0xFFDDFFFF, pixelSize:15,clip:false,text:"charFirstY="});
var charLastX = scene.create({t:"text", parent:root, x:400, y:40, textColor:0xFFDDFFFF, pixelSize:15,clip:false,text:"charLastX="});
var charLastY = scene.create({t:"text", parent:root, x:400, y:60, textColor:0xFFDDFFFF, pixelSize:15,clip:false,text:"charLastY="});
 
// widgets for tracking current property settings
var truncationStatus = scene.create({t:"text", parent:root, x:20, y:container.y+420, textColor:0xFFDDFFFF, pixelSize:20,clip:false,text:"truncation=truncate"});
var wrapStatus = scene.create({t:"text", parent:root, x:20, y:container.y+440, textColor:0xFFDDFFFF, pixelSize:20,clip:false,text:"wordWrap=true"});
var hAlignStatus = scene.create({t:"text", parent:root, x:20, y:container.y+460, textColor:0xFFDDFFFF, pixelSize:20,clip:false,text:"hAlign=left"});
var vAlignStatus = scene.create({t:"text", parent:root, x:20, y:container.y+480, textColor:0xFFDDFFFF, pixelSize:20,clip:false,text:"vAlign=top"});
var ellipsisStatus = scene.create({t:"text", parent:root, x:20, y:container.y+500, textColor:0xFFDDFFFF, pixelSize:20,clip:false,text:"ellipsis=true"});
var pixelSizeStatus = scene.create({t:"text", parent:root, x:20, y:container.y+520, textColor:0xFFDDFFFF, pixelSize:20,clip:false,text:"pixelSize=20"});
var pixelSizeHint = scene.create({t:"text", parent:root, x:140, y:container.y+520, textColor:0xFFDDFFFF, pixelSize:20,clip:false,text:"(use p and P)"});
var textStatus = scene.create({t:"text", parent:root, x:350, y:container.y+420, textColor:0xFFDDFFFF, pixelSize:20,clip:false,text:"text=longest"});
var textHint = scene.create({t:"text", parent:root, x:665, y:container.y+420, textColor:0xFFDDFFFF, pixelSize:20,clip:false,text:"(use small s)"});
var clipStatus = scene.create({t:"text", parent:root, x:350, y:container.y+440, textColor:0xFFDDFFFF, pixelSize:20,clip:false,text:"clip=true"});
var xStartPosStatus = scene.create({t:"text", parent:root, x:350, y:container.y+460, textColor:0xFFDDFFFF, pixelSize:20,clip:false,text:"xStartPos=0"});
var xStopPosStatus = scene.create({t:"text", parent:root, x:350, y:container.y+480, textColor:0xFFDDFFFF, pixelSize:20,clip:false,text:"xStopPos=0"});
var xStopPosHint = scene.create({t:"text", parent:root, x:465, y:container.y+480, textColor:0xFFDDFFFF, pixelSize:20,clip:false,text:"(use small L)"});
var leadingStatus = scene.create({t:"text", parent:root, x:350, y:container.y+500, textColor:0xFFDDFFFF, pixelSize:20,clip:false,text:"leading=0"});
var leadingHint = scene.create({t:"text", parent:root, x:465, y:container.y+500, textColor:0xFFDDFFFF, pixelSize:20,clip:false,text:"(use + -)"});
var fontStatus = scene.create({t:"text", parent:root, x:350, y:container.y+520, textColor:0xFFDDFFFF, pixelSize:20,clip:false,text:"font="+IndieFlower+" (http)"});
var leading = 0;


var text2 = scene.create({t:"textBox", clip:true, parent:container, x:0, y:0, rx:0, ry:0, rz:0});
   text2.h=400;
   text2.w=400;
   text2.textColor=0xFFDDFFFF;
   text2.pixelSize=20;
   text2.leading=0;
   text2.font=fontIndieFlower;
   text2.alignHorizontal=0;
   text2.alignVertical=0;
   text2.xStartPos=0;
   text2.xStopPos=0;
	 text2.wordWrap=true;
   text2.ellipsis=true;
   text2.truncation=1;
  
   text2.text=longText3;

                 
var metrics = null;
var measurements = null;
var showMeasurements = function() {
    var bounds = measurements.bounds;
    var charFirst = measurements.charFirst;
    var charLast = measurements.charLast;
    var w = bounds.x2 - bounds.x1;
    var spacing = metrics.height + text2.leading;
    var x = bounds.x1;//0;
    var y = bounds.y1;//0;
    var green = 0x00FF0077;
    var blue = 0x0000FF77;
    var red = 0xFF000077;
    var yellow = 0xFFFF0077;
    var orange = 0xFF8C0077;
    var pink = 0xFF00FF77;
    do {
        scene.create({t:"rect", parent:bg, fillColor:green, x:x, y:y + metrics.baseline - metrics.ascent, w:w, h:metrics.ascent});
        scene.create({t:"rect", parent:bg, fillColor:blue, x:x, y:y + metrics.baseline, w:w, h:metrics.descent});
        scene.create({t:"rect", fillColor:0x00000000, parent:bg, lineColor:red, lineWidth:1, x:x, y:y, w:w, h:metrics.height});
        y += spacing;
    } while (y < bounds.y2);
    scene.create({t:"rect", fillColor:0x00000000, parent:bg, lineColor:yellow, lineWidth:1, x:bounds.x1, y:bounds.y1, w:w, h:bounds.y2 - bounds.y1});
    scene.create({t:"rect", fillColor:0x00000000, parent:bg, lineColor:pink, lineWidth:1, x:charFirst.x, y:charFirst.y, w:charLast.x - charFirst.x, h:(charLast.y - charFirst.y)==0?1:(charLast.y - charFirst.y)});
}


var textready = function(text) {
	console.log("inside text2.ready");
  console.log("text2.h="+text2.h+" and text2.w="+text2.w);

	metrics = text2.font.getFontMetrics(text2.pixelSize);
	console.log("metrics h="+metrics.height);
	console.log("metrics a="+metrics.ascent);
	console.log("metrics d="+metrics.descent);
  console.log("metrics naturalLeading="+metrics.naturalLeading);
  console.log("metrics baseline="+metrics.baseline);

  measurements = text2.measureText();
  console.log("measurements boundsX1="+measurements.bounds.x1);
  console.log("measurements boundsY1="+measurements.bounds.y1);
  console.log("measurements boundsX2="+measurements.bounds.x2);
  console.log("measurements boundsY2="+measurements.bounds.y2);
  console.log("measurements charFirstX="+measurements.charFirst.x);
  console.log("measurements charFirstY="+measurements.charFirst.y);
  console.log("measurements charLastX="+measurements.charLast.x);
  console.log("measurements charLastY="+measurements.charLast.y);

  height.text="Height="+metrics.height;
  ascent.text="Ascent="+metrics.ascent;
  descent.text="Descent="+metrics.descent;
  naturalLeading.text="NatLead="+metrics.naturalLeading;
  baseline.text="Baseline="+metrics.baseline;
  boundsX1.text="BoundsX1="+measurements.bounds.x1;
  boundsY1.text="BoundsY1="+measurements.bounds.y1;
  boundsX2.text="BoundsX2="+measurements.bounds.x2;
  boundsY2.text="BoundsY2="+measurements.bounds.y2;
  charFirstX.text="charFirstX="+measurements.charFirst.x;
  charFirstY.text="charFirstY="+measurements.charFirst.y;
  charLastX.text="charLastX="+measurements.charLast.x;
  charLastY.text="charLastY="+measurements.charLast.y;

  
  showMeasurements();
}

/** HELPER FUNCTIONS FOR CHANGING TEXT2 PROPERTIES **/
var cycleValues = function(v) {
    console.log("v is "+v);
    if( v >= 2) {
      v = 0;
    } else {
      v++;
    }
    console.log("v is now"+v);
    return v;
}
var setText = function(textValue,hintText) {
     text2.text = textValue; 
     textStatus.text = hintText;
}
var toggleWordWrap = function() {
    text2.wordWrap = !text2.wordWrap;
    if( text2.wordWrap) {
      wrapStatus.text ="wordWrap=true";
    } else {
      wrapStatus.text ="wordWrap=false";
    }
}
var toggleEllipsis = function() {
  text2.ellipsis = !text2.ellipsis;
  if( text2.ellipsis) {
    ellipsisStatus.text ="ellipsis=true";
  } else {
    ellipsisStatus.text ="ellipsis=false";
  }
}

var toggleClip = function() {
    text2.clip  = !text2.clip;
    if( text2.clip) {
      clipStatus.text ="clip=true";
    } else {
      clipStatus.text ="clip=false";
    }  
}
var setFont = function(fontName, hintText) {
    text2.font = fontName;
    fontStatus.text = hintText;
}

var setAlignH = function(ha) {

  text2.alignHorizontal = ha;

  if(ha == 0) {
    hAlignStatus.text="hAlign=left";
  } else if(ha == 1) {
    hAlignStatus.text="hAlign=center";
  } else {
    hAlignStatus.text="hAlign=right";
  }   
}
var setAlignV = function(va){
  text2.alignVertical = va;
  if(va == 0) {
    vAlignStatus.text="vAlign=top";
  } else if(va == 1) {
    vAlignStatus.text="vAlign=center";
  } else {
    vAlignStatus.text="vAlign=bottom";
  }
}
var setTruncation = function(t) {
  text2.truncation = t;
  if(t == 0) {
    truncationStatus.text="truncation=none";
  } else if(t == 1) {
    truncationStatus.text="truncation=truncate";
  } else {
    truncationStatus.text="truncation=truncate at word boundary";
  }
}

var setPixelSize = function(p) {
  text2.pixelSize = p;
  pixelSizeStatus.text="pixelSize="+p;
}
var setLeading = function(l) {
  text2.leading = l;
  leadingStatus.text="leading="+l;
}

var setXStartPos = function(s) {
  text2.xStartPos = s; 
  xStartPosStatus.text="xStartPos="+s;
}

var setXStopPos = function(s) {
  text2.xStopPos = s; 
  xStopPosStatus.text="xStopPos="+s;
}


/**********************************************************************/
/**                                                                   */
/**            pxscene tests go in this section                       */
/**                                                                   */
/**********************************************************************/
var expectedTextDesc = [
  ["bounds", "x1"], 
  ["bounds", "y1"], 
  ["bounds", "x2"], 
  ["bounds", "y2"], 
  ["charFirst", "x"], 
  ["charFirst", "y"], 
  ["charLast", "x"], 
  ["charLast", "y"]
  
];
var expectedValuesMeasure = {
  // bounds.x1, bounds.y1, bounds.x2, bounds.y2, charFirst.x, charFirst.y, charLast.x, charLast.y
  "longestTextNoWrapNoTruncateNoClipNoEllipsisNoHeightNoWidthH0V0":[0,0,2036,29,0,20,2036,20], //longestTextNoWrapNoTruncateNoClipNoEllipsisNoHeightNoWidthH0V0
  "multilinesTextNoWrapNoTruncateNoClipH0V0":[0,0,904,116,0,20,904,107], //multilinesTextNoWrapNoTruncateNoClipH0V0
  "multilinesTextNoWrapNoTruncateNoClipH0V1":[0,142,904,258,0,162,904,249], //multilinesTextNoWrapNoTruncateNoClipH0V1
  "multilinesTextNoWrapNoTruncateNoClipH0V2":[0,284,904,400,0,304,904,391], //multilinesTextNoWrapNoTruncateNoClipH0V2
  
  "multilinesTextNoWrapNoTruncateNoClipH1V0":[-252,0,652,116,0,20,652,107], //multilinesTextNoWrapNoTruncateNoClipH1V0
  "multilinesTextNoWrapNoTruncateNoClipH1V1":[-252,142,652,258,0,162,652,249], //multilinesTextNoWrapNoTruncateNoClipH1V1
  "multilinesTextNoWrapNoTruncateNoClipH1V2":[-252,284,652,400,0,304,652,391], //multilinesTextNoWrapNoTruncateNoClipH1V2
  "multilinesTextNoWrapNoTruncateNoClipH2V0":[-504,0,400,116,0,20,400,107], //multilinesTextNoWrapNoTruncateNoClipH2V0
  "multilinesTextNoWrapNoTruncateNoClipH2V1":[-504,142,400,258,0,162,400,249], //multilinesTextNoWrapNoTruncateNoClipH2V1
  "multilinesTextNoWrapNoTruncateNoClipH2V2":[-504,284,400,400,0,304,400,391], //multilinesTextNoWrapNoTruncateNoClipH2V2
  
  "multilinesTextNoWrapTruncateNoClipNoEllipsisH1V1":[1,142,399,258,3,162,399,249], //multilinesTextNoWrapTruncateNoClipNoEllipsisH1V1
  "multilinesTextNoWrapTruncateNoClipEllipsisH1V1":[0,142,400,258,1.5,162,400,249], //multilinesTextNoWrapTruncateNoClipEllipsisH1V1
  "multilinesTextNoWrapTruncateClipNoEllipsisH1V1":[1,142,399,258,3,162,399,249], //multilinesTextNoWrapTruncateClipNoEllipsisH1V1
  "multilinesTextNoWrapTruncateClipEllipsisH1V1":[0,142,400,258,1.5,162,400,249], //multilinesTextNoWrapTruncateClipEllipsisH1V1

  "newlineslongerTextNoWrapTruncateNoClipNoEllipsisH1V1":[0,156.5,400,243.5,0,176.5,266.5,234.5], //newlineslongerTextNoWrapTruncateNoClipNoEllipsisH1V1
  "newlineslongerTextNoWrapTruncateNoClipEllipsisH1V1":[3.5,156.5,396.5,243.5,3.5,176.5,266.5,234.5], //newlineslongerTextNoWrapTruncateNoClipEllipsisH1V1
  "newlineslongerTextNoWrapNoTruncateNoClipNoEllipsisH1V1":[-12,156.5,412,243.5,-12,176.5,266.5,234.5], //newlineslongerTextNoWrapNoTruncateNoClipNoEllipsisH1V1
  "newlineslongerTextNoWrapNoTruncateClipNoEllipsisH1V1":[0,156.5,400,243.5,0,176.5,266.5,234.5], //newlineslongerTextNoWrapNoTruncateClipNoEllipsisH1V1

  "newlineslongestTextNoWrapTruncateNoClipNoEllipsisH1V1":[0,156.5,400,243.5,133.5,176.5,400,234.5], //newlineslongestTextNoWrapTruncateNoClipNoEllipsisH1V1
  "newlineslongestTextNoWrapTruncateNoClipEllipsisH1V1":[3.5,156.5,396.5,243.5,133.5,176.5,396.5,234.5], //newlineslongestTextNoWrapTruncateNoClipEllipsisH1V1
  "newlineslongestTextNoWrapNoTruncateNoClipNoEllipsisH1V1":[-12,156.5,412,243.5,133.5,176.5,412,234.5], //newlineslongestTextNoWrapNoTruncateNoClipNoEllipsisH1V1
  "newlineslongestTextNoWrapNoTruncateClipNoEllipsisH1V1":[0,156.5,400,243.5,133.5,176.5,400,234.5], //newlineslongestTextNoWrapNoTruncateClipNoEllipsisH1V1

  "longTextWrapTruncateClipEllipsisH1V1XY":[13.5,50.5,406.5,369.5,13.5,70.5,252,360.5], //longTextWrapTruncateClipEllipsisH1V1XY
  "longerTextWrapTruncateClipEllipsisH1V1XY":[12,21.5, 408, 398.5, 17, 41.5, 406.5, 389.5], //longerTextWrapTruncateClipEllipsisH1V1XY
  "longestTextWrapTruncateClipEllipsisH1V1XY":[13.5, 21.5, 406.5, 398.5, 13.5, 41.5, 406.5, 389.5], //longestTextWrapTruncateClipEllipsisH1V1XY
  "shortTextWrapTruncateClipEllipsisH1V1XY":[128,195.5,292,224.5,128,215.5,292,215.5], //shortTextWrapTruncateClipEllipsisH1V1XY
  "mediumTextWrapTruncateClipEllipsisH1V1XY":[15,123,405,297,15,143,401,288], //mediumTextWrapTruncateClipEllipsisH1V1XY
  "newlineTextWrapTruncateClipEllipsisH1V1XY":[142,166.5,278,253.5,168.5,186.5,276.5,244.5], //newlineTextWrapTruncateClipEllipsisH1V1XY
  "newlineslongerTextWrapTruncateClipEllipsisH1V1XY":[20.5,152,399.5,268,20.5,172,276.5,259], //newlineslongerTextWrapTruncateClipEllipsisH1V1XY
  "newlineslongestTextWrapTruncateClipEllipsisH1V1XY":[20.5,152,399.5,268,143.5,172,232.5,259], //newlineslongestTextWrapTruncateClipEllipsisH1V1XY
  "continuousTextWrapTruncateClipEllipsisH1V1XY":[12,181,408,239,12,201,346,230], //continuousTextWrapTruncateClipEllipsisH1V1XY
  "continuousLongTextWrapTruncateClipEllipsisH1V1XY":[10.5,21.5,409.5,398.5,12,41.5,405.5,389.5], //continuousLongTextWrapTruncateClipEllipsisH1V1XY
  "multilinesTextWrapTruncateClipEllipsisH1V1XY":[10,79.5,410,340.5,32.5,99.5,277.5,331.5], //multilinesTextWrapTruncateClipEllipsisH1V1XY
  
  "longestTextWrapTruncateClipH2V0":[7,0,400,377,7,20,400,368], //longestTextWrapTruncateClipH2V0
  "longestTextNoWrapTruncateClipH2V0":[8,0,400,29,8,20,400,20], //longestTextNoWrapTruncateClipH2V0
  "longestTextWrapTruncateAtWordClipH2V0":[7,0,400,377,7,20,400,368], //longestTextWrapTruncateAtWordClipH2V0
  "longestTextNoWrapTruncateAtWordClipH2V0":[98,0,400,29,98,20,400,20], //longestTextNoWrapTruncateAtWordClipH2V0
  "longestTextWrapTruncateClipH1V0":[3.5,0,396.5,377,3.5,20,377,368], //longestTextWrapTruncateClipH1V0
  
  
};

var textMeasurementResults = function(values) {
  var results = [];
  var numResults = values.length;
  for( var i = 0; i < numResults; i++) {

    results[i] = assert(measurements[expectedTextDesc[i][0]][expectedTextDesc[i][1]] === values[i], "measurements "+expectedTextDesc[i][0]+"."+expectedTextDesc[i][1]+" should be "+values[i]+" but is "+measurements[expectedTextDesc[i][0]][expectedTextDesc[i][1]]);
  }
  return results;
}
var cleanup = function () {
  text2.parent=container;
  bg.x=container.x;
  bg.y=container.y;
  text2.h=400;
  text2.w=400;
}
var setParentToRoot = function () {

  text2.parent=root;
  bg.x=root.x;
  bg.y=root.y;
}

var beforeStart = function() {

  return new Promise(function(resolve, reject) {

    // Setup all properties as assumed for start of tests
    // set to short text, wordWrap=false, pixelSize, hAlign=left 
    setFont(fontIndieFlower,"font="+IndieFlower+" (http)");
    if( text2.wordWrap) {
      toggleWordWrap();
    }
    setPixelSize(20);
    setLeading(0);
    setAlignH(0);
    setAlignV(0);
    if( text2.clip) {
      toggleClip();
    }
    setTruncation(0);
    if( text2.ellipsis) {
      toggleEllipsis();
    }
    setXStartPos(0);
    setXStopPos(0);
    resolve("text2tests_more.js beforeStart");
  });
}

var doScreenshotComparison = function(name, resolve, reject) 
{
    var results =  textMeasurementResults(expectedValuesMeasure[name]);

    //shots.takeScreenshot(false).then(function(link){
      shots.validateScreenshot(basePackageUri+"/images/screenshot_results/"+testPlatform+"/text2tests_more_"+name+".png", false).then(function(match){
        console.log("test result is match: "+match);
        results.push(assert(match == true, "screenshot comparison for "+name+" failed"));
        resolve(results);
      //});
    }).catch(function(err) {
        results.push(assert(false, "screenshot comparison for "+name+" failed due to error: "+err));
        resolve(results);
    });
 
}

var tests = {
   longestTextNoWrapNoTruncateNoClipNoEllipsisNoHeightNoWidthH0V0: function() {
     console.log("text2tests_more.js longestTextNoWrapNoTruncateNoClipNoEllipsisNoHeightNoWidthH0V0");
     // set to longest text
     setText( longText3,"text=longest");
     setAlignH(0);
     setAlignV(0);
     setTruncation(0);
     text2.leading=0;
     setParentToRoot();
     text2.clip=false;
     text2.wordWrap=false;
     text2.h=0;
     text2.w=0;
 
     return new Promise(function(resolve, reject) {
       text2.ready.then(function(myText) {
         bg.removeAll();
         textready(myText);
         if( doScreenshot) 
         {
             setTimeout( function() {
               doScreenshotComparison("longestTextNoWrapNoTruncateNoClipNoEllipsisNoHeightNoWidthH0V0", resolve)
             }, timeoutForScreenshot);
         } 
         else {
          resolve(textMeasurementResults(expectedValuesMeasure.longestTextNoWrapNoTruncateNoClipNoEllipsisNoHeightNoWidthH0V0));
         }
         cleanup();
       }, function(o) {
         resolve(assert(false,'longestTextNoWrapNoTruncateNoClipNoEllipsisNoHeightNoWidthH0V0 Promise rejection received'));
       });
     });
   },
   multilinesTextNoWrapNoTruncateNoClipH0V0: function() {
     console.log("text2tests_more.js multilinesTextNoWrapNoTruncateNoClipH0V0");
     // set to longest text
     setText(multilinesText,"text=multilines");
     setAlignH(0);
     setAlignV(0);
     setTruncation(0);
     text2.clip=false;
     text2.wordWrap=false;
 
     return new Promise(function(resolve, reject) {
       text2.ready.then(function(myText) {
        bg.removeAll();
         textready(myText);
         if( doScreenshot) 
         {
             setTimeout( function() {
               doScreenshotComparison("multilinesTextNoWrapNoTruncateNoClipH0V0", resolve)
             }, timeoutForScreenshot);
         } 
         else {
           resolve(textMeasurementResults(expectedValuesMeasure.multilinesTextNoWrapNoTruncateNoClipH0V0));
         }
       }, function(o) {
         resolve(assert(false,'multilinesTextNoWrapNoTruncateNoClipH0V0 Promise rejection received'));
       });
     });
   },
   multilinesTextNoWrapNoTruncateNoClipH0V1: function() {
     console.log("text2tests_more.js multilinesTextNoWrapNoTruncateNoClipH0V1");
     // set to longest text
     setText(multilinesText,"text=multilines");
     setAlignH(0);
     setAlignV(1);
     setTruncation(0);
     text2.clip=false;
     text2.wordWrap=false;
 
     return new Promise(function(resolve, reject) {
       text2.ready.then(function(myText) {
        bg.removeAll();
         textready(myText);
         if( doScreenshot) 
         {
             setTimeout( function() {
               doScreenshotComparison("multilinesTextNoWrapNoTruncateNoClipH0V1", resolve)
             }, timeoutForScreenshot);
         } 
         else {
           resolve(textMeasurementResults(expectedValuesMeasure.multilinesTextNoWrapNoTruncateNoClipH0V1));
         }
       }, function(o) {
         resolve(assert(false,'multilinesTextNoWrapNoTruncateNoClipH0V1 Promise rejection received'));
       });
     });
   },
   multilinesTextNoWrapNoTruncateNoClipH0V2: function() {
     console.log("text2tests_more.js multilinesTextNoWrapNoTruncateNoClipH0V2");
     // set to longest text
     setText(multilinesText,"text=multilines");
     setAlignH(0);
     setAlignV(2);
     setTruncation(0);
     text2.clip=false;
     text2.wordWrap=false;
 
     return new Promise(function(resolve, reject) {
       text2.ready.then(function(myText) {
        bg.removeAll();
         textready(myText);
         if( doScreenshot) 
         {
             setTimeout( function() {
               doScreenshotComparison("multilinesTextNoWrapNoTruncateNoClipH0V2", resolve)
             }, timeoutForScreenshot);
         } 
         else {
           resolve(textMeasurementResults(expectedValuesMeasure.multilinesTextNoWrapNoTruncateNoClipH0V2));
         }
       }, function(o) {
         resolve(assert(false,'multilinesTextNoWrapNoTruncateNoClipH0V2 Promise rejection received'));
       });
     });
   },
   multilinesTextNoWrapNoTruncateNoClipH1V0: function() {
     console.log("text2tests_more.js multilinesTextNoWrapNoTruncateNoClipH1V0");
     // set to longest text
     setText(multilinesText,"text=multilines");
     setAlignH(1);
     setAlignV(0);
     setTruncation(0);
     text2.clip=false;
     text2.wordWrap=false;
 
     return new Promise(function(resolve, reject) {
       text2.ready.then(function(myText) {
        bg.removeAll();
         textready(myText);
         if( doScreenshot) 
         {
             setTimeout( function() {
               doScreenshotComparison("multilinesTextNoWrapNoTruncateNoClipH1V0", resolve)
             }, timeoutForScreenshot);
         } 
         else {
           resolve(textMeasurementResults(expectedValuesMeasure.multilinesTextNoWrapNoTruncateNoClipH1V0));
         }
       }, function(o) {
         resolve(assert(false,'multilinesTextNoWrapNoTruncateNoClipH1V0 Promise rejection received'));
       });
     });
   },
   multilinesTextNoWrapNoTruncateNoClipH1V1: function() {
     console.log("text2tests_more.js multilinesTextNoWrapNoTruncateNoClipH1V1");
     // set to longest text
     setText(multilinesText,"text=multilines");
     setAlignH(1);
     setAlignV(1);
     setTruncation(0);
     text2.clip=false;
     text2.wordWrap=false;
 
     return new Promise(function(resolve, reject) {
       text2.ready.then(function(myText) {
        bg.removeAll();
         textready(myText);
         if( doScreenshot) 
         {
             setTimeout( function() {
               doScreenshotComparison("multilinesTextNoWrapNoTruncateNoClipH1V1", resolve)
             }, timeoutForScreenshot);
         } 
         else {
           resolve(textMeasurementResults(expectedValuesMeasure.multilinesTextNoWrapNoTruncateNoClipH1V1));
         }
       }, function(o) {
         resolve(assert(false,'multilinesTextNoWrapNoTruncateNoClipH1V1 Promise rejection received'));
       });
     });
   },
   multilinesTextNoWrapNoTruncateNoClipH1V2: function() {
     console.log("text2tests_more.js multilinesTextNoWrapNoTruncateNoClipH1V2");
     // set to longest text
     setText(multilinesText,"text=multilines");
     setAlignH(1);
     setAlignV(2);
     setTruncation(0);
     text2.clip=false;
     text2.wordWrap=false;
 
     return new Promise(function(resolve, reject) {
       text2.ready.then(function(myText) {
        bg.removeAll();
         textready(myText);
         if( doScreenshot) 
         {
             setTimeout( function() {
               doScreenshotComparison("multilinesTextNoWrapNoTruncateNoClipH1V2", resolve)
             }, timeoutForScreenshot);
         } 
         else {
           resolve(textMeasurementResults(expectedValuesMeasure.multilinesTextNoWrapNoTruncateNoClipH1V2));
         }
       }, function(o) {
         resolve(assert(false,'multilinesTextNoWrapNoTruncateNoClipH1V2 Promise rejection received'));
       });
     });
   },
   multilinesTextNoWrapNoTruncateNoClipH2V0: function() {
     console.log("text2tests_more.js multilinesTextNoWrapNoTruncateNoClipH2V0");
     // set to longest text
     setText(multilinesText,"text=multilines");
     setAlignH(2);
     setAlignV(0);
     setTruncation(0);
     text2.clip=false;
     text2.wordWrap=false;
 
     return new Promise(function(resolve, reject) {
       text2.ready.then(function(myText) {
        bg.removeAll();
         textready(myText);
         if( doScreenshot) 
         {
             setTimeout( function() {
               doScreenshotComparison("multilinesTextNoWrapNoTruncateNoClipH2V0", resolve)
             }, timeoutForScreenshot);
         } 
         else {
           resolve(textMeasurementResults(expectedValuesMeasure.multilinesTextNoWrapNoTruncateNoClipH2V0));
         }
       }, function(o) {
         resolve(assert(false,'multilinesTextNoWrapNoTruncateNoClipH2V0 Promise rejection received'));
       });
     });
   },
   multilinesTextNoWrapNoTruncateNoClipH2V1: function() {
     console.log("text2tests_more.js multilinesTextNoWrapNoTruncateNoClipH2V1");
     // set to longest text
     setText(multilinesText,"text=multilines");
     setAlignH(2);
     setAlignV(1);
     setTruncation(0);
     text2.clip=false;
     text2.wordWrap=false;
 
     return new Promise(function(resolve, reject) {
       text2.ready.then(function(myText) {
        bg.removeAll();
         textready(myText);
         if( doScreenshot) 
         {
             setTimeout( function() {
               doScreenshotComparison("multilinesTextNoWrapNoTruncateNoClipH2V1", resolve)
             }, timeoutForScreenshot);
         } 
         else {
           resolve(textMeasurementResults(expectedValuesMeasure.multilinesTextNoWrapNoTruncateNoClipH2V1));
         }
       }, function(o) {
         resolve(assert(false,'multilinesTextNoWrapNoTruncateNoClipH2V1 Promise rejection received'));
       });
     });
   },
   multilinesTextNoWrapNoTruncateNoClipH2V2: function() {
     console.log("text2tests_more.js multilinesTextNoWrapNoTruncateNoClipH2V2");
     // set to longest text
     setText(multilinesText,"text=multilines");
     setAlignH(2);
     setAlignV(2);
     setTruncation(0);
     text2.clip=false;
     text2.wordWrap=false;
 
     return new Promise(function(resolve, reject) {
       text2.ready.then(function(myText) {
        bg.removeAll();
         textready(myText);
         if( doScreenshot) 
         {
             setTimeout( function() {
               doScreenshotComparison("multilinesTextNoWrapNoTruncateNoClipH2V2", resolve)
             }, timeoutForScreenshot);
         } 
         else {
           resolve(textMeasurementResults(expectedValuesMeasure.multilinesTextNoWrapNoTruncateNoClipH2V2));
         }
       }, function(o) {
         resolve(assert(false,'multilinesTextNoWrapNoTruncateNoClipH2V2 Promise rejection received'));
       });
     });
   },
   multilinesTextNoWrapTruncateNoClipNoEllipsisH1V1: function() {
     console.log("text2tests_more.js multilinesTextNoWrapTruncateNoClipNoEllipsisH1V1");
     // set to longest text
     setText(multilinesText,"text=multilines");
     setAlignH(1);
     setAlignV(1);
     setTruncation(1);
     text2.clip=false;
     text2.wordWrap=false;
     
     if( text2.ellipsis) {
      toggleEllipsis();
    }
     return new Promise(function(resolve, reject) {
       text2.ready.then(function(myText) {
        bg.removeAll();
         textready(myText);
         if( doScreenshot) 
         {
             setTimeout( function() {
               doScreenshotComparison("multilinesTextNoWrapTruncateNoClipNoEllipsisH1V1", resolve)
             }, timeoutForScreenshot);
         } 
         else {
           resolve(textMeasurementResults(expectedValuesMeasure.multilinesTextNoWrapTruncateNoClipNoEllipsisH1V1));
         }
       }, function(o) {
         resolve(assert(false,'multilinesTextNoWrapTruncateNoClipNoEllipsisH1V1 Promise rejection received'));
       });
     });
   },
   multilinesTextNoWrapTruncateNoClipEllipsisH1V1: function() {
     console.log("text2tests_more.js multilinesTextNoWrapTruncateNoClipEllipsisH1V1");
     // set to longest text
     setText(multilinesText,"text=multilines");
     setAlignH(1);
     setAlignV(1);
     setTruncation(1);
     text2.clip=false;
     text2.wordWrap=false;
     
     if( !text2.ellipsis) {
      toggleEllipsis();
    }
     return new Promise(function(resolve, reject) {
       text2.ready.then(function(myText) {
        bg.removeAll();
         textready(myText);
         if( doScreenshot) 
         {
             setTimeout( function() {
               doScreenshotComparison("multilinesTextNoWrapTruncateNoClipEllipsisH1V1", resolve)
             }, timeoutForScreenshot);
         } 
         else {
           resolve(textMeasurementResults(expectedValuesMeasure.multilinesTextNoWrapTruncateNoClipEllipsisH1V1));
         }
       }, function(o) {
         resolve(assert(false,'multilinesTextNoWrapTruncateNoClipEllipsisH1V1 Promise rejection received'));
       });
     });
   },
   multilinesTextNoWrapTruncateClipEllipsisH1V1: function() {
     console.log("text2tests_more.js multilinesTextNoWrapTruncateClipEllipsisH1V1");
     // set to longest text
     setText(multilinesText,"text=multilines");
     setAlignH(1);
     setAlignV(1);
     setTruncation(1);
     if( !text2.clip) {
       toggleClip();
     }
     if( text2.wordWrap) {
       toggleWordWrap();
     }
     if( !text2.ellipsis) {
      toggleEllipsis();
    }
     return new Promise(function(resolve, reject) {
       text2.ready.then(function(myText) {
        bg.removeAll();
         textready(myText);
         if( doScreenshot) 
         {
             setTimeout( function() {
               doScreenshotComparison("multilinesTextNoWrapTruncateClipEllipsisH1V1", resolve)
             }, timeoutForScreenshot);
         } 
         else {
           resolve(textMeasurementResults(expectedValuesMeasure.multilinesTextNoWrapTruncateClipEllipsisH1V1));
         }
       }, function(o) {
         resolve(assert(false,'multilinesTextNoWrapTruncateClipEllipsisH1V1 Promise rejection received'));
       });
     });
   },
   multilinesTextNoWrapTruncateClipNoEllipsisH1V1: function() {
     console.log("text2tests_more.js multilinesTextNoWrapTruncateClipNoEllipsisH1V1");
     // set to longest text
     setText(multilinesText,"text=multilines");
     setAlignH(1);
     setAlignV(1);
     setTruncation(1);
     if( !text2.clip) {
       toggleClip();
     }
     if( text2.wordWrap) {
       toggleWordWrap();
     }
     if( text2.ellipsis) {
      toggleEllipsis();
    }
     return new Promise(function(resolve, reject) {
       text2.ready.then(function(myText) {
        bg.removeAll();
         textready(myText);
         if( doScreenshot) 
         {
             setTimeout( function() {
               doScreenshotComparison("multilinesTextNoWrapTruncateClipNoEllipsisH1V1", resolve)
             }, timeoutForScreenshot);
         } 
         else {
           resolve(textMeasurementResults(expectedValuesMeasure.multilinesTextNoWrapTruncateClipNoEllipsisH1V1));
         }
       }, function(o) {
         resolve(assert(false,'multilinesTextNoWrapTruncateClipNoEllipsisH1V1 Promise rejection received'));
       });
     });
   },
   newlineslongerTextNoWrapTruncateNoClipNoEllipsisH1V1: function() {
     console.log("text2tests_more.js newlineslongerTextNoWrapTruncateNoClipNoEllipsisH1V1");
     // set to longest text
     setText(newlineLongerText,"text=newlinesLonger");
     setAlignH(1);
     setAlignV(1);
     setTruncation(1);
     if( text2.clip) {
       toggleClip();
     }
     if( text2.wordWrap) {
       toggleWordWrap();
     }
     if( text2.ellipsis) {
      toggleEllipsis();
    }
     return new Promise(function(resolve, reject) {
       text2.ready.then(function(myText) {
        bg.removeAll();
         textready(myText);
         if( doScreenshot) 
         {
             setTimeout( function() {
               doScreenshotComparison("newlineslongerTextNoWrapTruncateNoClipNoEllipsisH1V1", resolve)
             }, timeoutForScreenshot);
         } 
         else {
           resolve(textMeasurementResults(expectedValuesMeasure.newlineslongerTextNoWrapTruncateNoClipNoEllipsisH1V1));
         }
       }, function(o) {
         resolve(assert(false,'newlineslongerTextNoWrapTruncateNoClipNoEllipsisH1V1 Promise rejection received'));
       });
     });
   },
   newlineslongerTextNoWrapTruncateNoClipEllipsisH1V1: function() {
     console.log("text2tests_more.js newlineslongerTextNoWrapTruncateNoClipEllipsisH1V1");
     // set to longest text
     setText(newlineLongerText,"text=newlinesLonger");
     setAlignH(1);
     setAlignV(1);
     setTruncation(1);
     if( text2.clip) {
       toggleClip();
     }
     if( text2.wordWrap) {
       toggleWordWrap();
     }
     if( !text2.ellipsis) {
      toggleEllipsis();
    }
     return new Promise(function(resolve, reject) {
       text2.ready.then(function(myText) {
        bg.removeAll();
         textready(myText);
         if( doScreenshot) 
         {
             setTimeout( function() {
               doScreenshotComparison("newlineslongerTextNoWrapTruncateNoClipEllipsisH1V1", resolve)
             }, timeoutForScreenshot);
         } 
         else {
           resolve(textMeasurementResults(expectedValuesMeasure.newlineslongerTextNoWrapTruncateNoClipEllipsisH1V1));
         }
       }, function(o) {
         resolve(assert(false,'newlineslongerTextNoWrapTruncateNoClipEllipsisH1V1 Promise rejection received'));
       });
     });
   },
   newlineslongerTextNoWrapNoTruncateNoClipNoEllipsisH1V1: function() {
     console.log("text2tests_more.js newlineslongerTextNoWrapNoTruncateNoClipNoEllipsisH1V1");
     // set to longest text
     setText(newlineLongerText,"text=newlinesLonger");
     setAlignH(1);
     setAlignV(1);
     setTruncation(0);
     if( text2.clip) {
       toggleClip();
     }
     if( text2.wordWrap) {
       toggleWordWrap();
     }
     if( text2.ellipsis) {
      toggleEllipsis();
    }
     return new Promise(function(resolve, reject) {
       text2.ready.then(function(myText) {
        bg.removeAll();
         textready(myText);
         if( doScreenshot) 
         {
             setTimeout( function() {
               doScreenshotComparison("newlineslongerTextNoWrapNoTruncateNoClipNoEllipsisH1V1", resolve)
             }, timeoutForScreenshot);
         } 
         else {
           resolve(textMeasurementResults(expectedValuesMeasure.newlineslongerTextNoWrapNoTruncateNoClipNoEllipsisH1V1));
         }
       }, function(o) {
         resolve(assert(false,'newlineslongerTextNoWrapNoTruncateNoClipNoEllipsisH1V1 Promise rejection received'));
       });
     });
   },
   newlineslongerTextNoWrapNoTruncateClipNoEllipsisH1V1: function() {
     console.log("text2tests_more.js newlineslongerTextNoWrapNoTruncateClipNoEllipsisH1V1");
     // set to longest text
     setText(newlineLongerText,"text=newlinesLonger");
     setAlignH(1);
     setAlignV(1);
     setTruncation(0);
     if( !text2.clip) {
       toggleClip();
     }
     if( text2.wordWrap) {
       toggleWordWrap();
     }
     if( text2.ellipsis) {
      toggleEllipsis();
    }
     return new Promise(function(resolve, reject) {
       text2.ready.then(function(myText) {
        bg.removeAll();
         textready(myText);
         if( doScreenshot) 
         {
             setTimeout( function() {
               doScreenshotComparison("newlineslongerTextNoWrapNoTruncateClipNoEllipsisH1V1", resolve)
             }, timeoutForScreenshot);
         } 
         else {
           resolve(textMeasurementResults(expectedValuesMeasure.newlineslongerTextNoWrapNoTruncateClipNoEllipsisH1V1));
         }
       }, function(o) {
         resolve(assert(false,'newlineslongerTextNoWrapNoTruncateClipNoEllipsisH1V1 Promise rejection received'));
       });
     });
   },
   newlineslongestTextNoWrapTruncateNoClipNoEllipsisH1V1: function() {
     console.log("text2tests_more.js newlineslongestTextNoWrapTruncateNoClipNoEllipsisH1V1");
     // set to longest text
     setText(newlineLongestText,"text=newlinesLongest");
     setAlignH(1);
     setAlignV(1);
     setTruncation(1);
     if( text2.clip) {
       toggleClip();
     }
     if( text2.wordWrap) {
       toggleWordWrap();
     }
     if( text2.ellipsis) {
      toggleEllipsis();
    }
     return new Promise(function(resolve, reject) {
       text2.ready.then(function(myText) {
        bg.removeAll();
         textready(myText);
         if( doScreenshot) 
         {
             setTimeout( function() {
               doScreenshotComparison("newlineslongestTextNoWrapTruncateNoClipNoEllipsisH1V1", resolve)
             }, timeoutForScreenshot);
         } 
         else {
           resolve(textMeasurementResults(expectedValuesMeasure.newlineslongestTextNoWrapTruncateNoClipNoEllipsisH1V1));
         }
       }, function(o) {
         resolve(assert(false,'newlineslongestTextNoWrapTruncateNoClipNoEllipsisH1V1 Promise rejection received'));
       });
     });
   },
   newlineslongestTextNoWrapTruncateNoClipEllipsisH1V1: function() {
     console.log("text2tests_more.js newlineslongestTextNoWrapTruncateNoClipEllipsisH1V1");
     // set to longest text
     setText(newlineLongestText,"text=newlinesLongest");
     setAlignH(1);
     setAlignV(1);
     setTruncation(1);
     if( text2.clip) {
       toggleClip();
     }
     if( text2.wordWrap) {
       toggleWordWrap();
     }
     if( !text2.ellipsis) {
      toggleEllipsis();
    }
     return new Promise(function(resolve, reject) {
       text2.ready.then(function(myText) {
        bg.removeAll();
         textready(myText);
         if( doScreenshot) 
         {
             setTimeout( function() {
               doScreenshotComparison("newlineslongestTextNoWrapTruncateNoClipEllipsisH1V1", resolve)
             }, timeoutForScreenshot);
         } 
         else {
           resolve(textMeasurementResults(expectedValuesMeasure.newlineslongestTextNoWrapTruncateNoClipEllipsisH1V1));
         }
       }, function(o) {
         resolve(assert(false,'newlineslongestTextNoWrapTruncateNoClipEllipsisH1V1 Promise rejection received'));
       });
     });
   },
   newlineslongestTextNoWrapNoTruncateNoClipNoEllipsisH1V1: function() {
     console.log("text2tests_more.js newlineslongestTextNoWrapNoTruncateNoClipNoEllipsisH1V1");
     // set to longest text
     setText(newlineLongestText,"text=newlinesLongest");
     setAlignH(1);
     setAlignV(1);
     setTruncation(0);
     if( text2.clip) {
       toggleClip();
     }
     if( text2.wordWrap) {
       toggleWordWrap();
     }
     if( text2.ellipsis) {
      toggleEllipsis();
    }
     return new Promise(function(resolve, reject) {
       text2.ready.then(function(myText) {
        bg.removeAll();
         textready(myText);
         if( doScreenshot) 
         {
             setTimeout( function() {
               doScreenshotComparison("newlineslongestTextNoWrapNoTruncateNoClipNoEllipsisH1V1", resolve)
             }, timeoutForScreenshot);
         } 
         else {
           resolve(textMeasurementResults(expectedValuesMeasure.newlineslongestTextNoWrapNoTruncateNoClipNoEllipsisH1V1));
         }
       }, function(o) {
         resolve(assert(false,'newlineslongestTextNoWrapNoTruncateNoClipNoEllipsisH1V1 Promise rejection received'));
       });
     });
   },
   newlineslongestTextNoWrapNoTruncateClipNoEllipsisH1V1: function() {
     console.log("text2tests_more.js newlineslongestTextNoWrapNoTruncateClipNoEllipsisH1V1");
     // set to longest text
     setText(newlineLongestText,"text=newlinesLongest");
     setAlignH(1);
     setAlignV(1);
     setTruncation(0);
     if( !text2.clip) {
       toggleClip();
     }
     if( text2.wordWrap) {
       toggleWordWrap();
     }
     if( text2.ellipsis) {
      toggleEllipsis();
    }
     return new Promise(function(resolve, reject) {
       text2.ready.then(function(myText) {
        bg.removeAll();
         textready(myText);
         if( doScreenshot) 
         {
             setTimeout( function() {
               doScreenshotComparison("newlineslongestTextNoWrapNoTruncateClipNoEllipsisH1V1", resolve)
             }, timeoutForScreenshot);
         } 
         else {
           resolve(textMeasurementResults(expectedValuesMeasure.newlineslongestTextNoWrapNoTruncateClipNoEllipsisH1V1));
         }
       }, function(o) {
         resolve(assert(false,'newlineslongestTextNoWrapNoTruncateClipNoEllipsisH1V1 Promise rejection received'));
       });
     });
   },
   longTextWrapTruncateClipEllipsisH1V1XY: function() {
     console.log("text2tests_more.js longTextWrapTruncateClipEllipsisH1V1XY");
     // set to longest text
     setText(longText,"text=long");
     setAlignH(1);
     setAlignV(1);
     setTruncation(1);
     text2.x=10;
     text2.y=10;
     if( !text2.clip) {
       toggleClip();
     }
     if( !text2.wordWrap) {
       toggleWordWrap();
     }
     if( !text2.ellipsis) {
      toggleEllipsis();
    }
     return new Promise(function(resolve, reject) {
       text2.ready.then(function(myText) {
        bg.removeAll();
         textready(myText);
         if( doScreenshot) 
         {
             setTimeout( function() {
               doScreenshotComparison("longTextWrapTruncateClipEllipsisH1V1XY", resolve)
             }, timeoutForScreenshot);
         } 
         else {
           resolve(textMeasurementResults(expectedValuesMeasure.longTextWrapTruncateClipEllipsisH1V1XY));
         }
       }, function(o) {
         resolve(assert(false,'longTextWrapTruncateClipEllipsisH1V1XY Promise rejection received'));
       });
     });
   },
   longerTextWrapTruncateClipEllipsisH1V1XY: function() {
     console.log("text2tests_more.js longerTextWrapTruncateClipEllipsisH1V1XY");
     // set to longest text
     setText(longText2,"text=longer");
     text2.x=10;
     text2.y=10;
     setAlignH(1);
     setAlignV(1);
     setTruncation(1);
     if( !text2.clip) {
       toggleClip();
     }
     if( !text2.wordWrap) {
       toggleWordWrap();
     }
     if( !text2.ellipsis) {
      toggleEllipsis();
    }
     return new Promise(function(resolve, reject) {
       text2.ready.then(function(myText) {
        bg.removeAll();
         textready(myText);
         if( doScreenshot) 
         {
             setTimeout( function() {
               doScreenshotComparison("longerTextWrapTruncateClipEllipsisH1V1XY", resolve)
             }, timeoutForScreenshot);
         } 
         else {
           resolve(textMeasurementResults(expectedValuesMeasure.longerTextWrapTruncateClipEllipsisH1V1XY));
         }
       }, function(o) {
         resolve(assert(false,'longerTextWrapTruncateClipEllipsisH1V1XY Promise rejection received'));
       });
     });
   },
   longestTextWrapTruncateClipEllipsisH1V1XY: function() {
     console.log("text2tests_more.js longestTextWrapTruncateClipEllipsisH1V1XY");
     // set to longest text
     setText(longText3,"text=longest");
     text2.x=10;
     text2.y=10;
     setAlignH(1);
     setAlignV(1);
     setTruncation(1);
     if( !text2.clip) {
       toggleClip();
     }
     if( !text2.wordWrap) {
       toggleWordWrap();
     }
     if( !text2.ellipsis) {
      toggleEllipsis();
    }
     return new Promise(function(resolve, reject) {
       text2.ready.then(function(myText) {
        bg.removeAll();
         textready(myText);
         if( doScreenshot) 
         {
             setTimeout( function() {
               doScreenshotComparison("longestTextWrapTruncateClipEllipsisH1V1XY", resolve)
             }, timeoutForScreenshot);
         } 
         else {
           resolve(textMeasurementResults(expectedValuesMeasure.longestTextWrapTruncateClipEllipsisH1V1XY));
         }
       }, function(o) {
         resolve(assert(false,'longestTextWrapTruncateClipEllipsisH1V1XY Promise rejection received'));
       });
     });
   },
   shortTextWrapTruncateClipEllipsisH1V1XY: function() {
     console.log("text2tests_more.js shortTextWrapTruncateClipEllipsisH1V1XY");
     // set to longest text
     setText(shortText,"text=short");
     text2.x=10;
     text2.y=10;
     setAlignH(1);
     setAlignV(1);
     setTruncation(1);
     if( !text2.clip) {
       toggleClip();
     }
     if( !text2.wordWrap) {
       toggleWordWrap();
     }
     if( !text2.ellipsis) {
      toggleEllipsis();
    }
     return new Promise(function(resolve, reject) {
       text2.ready.then(function(myText) {
        bg.removeAll();
         textready(myText);
         if( doScreenshot) 
         {
             setTimeout( function() {
               doScreenshotComparison("shortTextWrapTruncateClipEllipsisH1V1XY", resolve)
             }, timeoutForScreenshot);
         } 
         else {
           resolve(textMeasurementResults(expectedValuesMeasure.shortTextWrapTruncateClipEllipsisH1V1XY));
         }
       }, function(o) {
         resolve(assert(false,'shortTextWrapTruncateClipEllipsisH1V1XY Promise rejection received'));
       });
     });
   },
   mediumTextWrapTruncateClipEllipsisH1V1XY: function() {
     console.log("text2tests_more.js mediumTextWrapTruncateClipEllipsisH1V1XY");
     // set to longest text
     setText(mediumText,"text=medium");
     text2.x=10;
     text2.y=10;
     setAlignH(1);
     setAlignV(1);
     setTruncation(1);
     if( !text2.clip) {
       toggleClip();
     }
     if( !text2.wordWrap) {
       toggleWordWrap();
     }
     if( !text2.ellipsis) {
      toggleEllipsis();
    }
     return new Promise(function(resolve, reject) {
       text2.ready.then(function(myText) {
        bg.removeAll();
         textready(myText);
         if( doScreenshot) 
         {
             setTimeout( function() {
               doScreenshotComparison("mediumTextWrapTruncateClipEllipsisH1V1XY", resolve)
             }, timeoutForScreenshot);
         } 
         else {
           resolve(textMeasurementResults(expectedValuesMeasure.mediumTextWrapTruncateClipEllipsisH1V1XY));
         }
       }, function(o) {
         resolve(assert(false,'mediumTextWrapTruncateClipEllipsisH1V1XY Promise rejection received'));
       });
     });
   },
   newlineTextWrapTruncateClipEllipsisH1V1XY: function() {
     console.log("text2tests_more.js newlineTextWrapTruncateClipEllipsisH1V1XY");
     // set to longest text
     setText(newlineText,"text=newline");
     text2.x=10;
     text2.y=10;
     setAlignH(1);
     setAlignV(1);
     setTruncation(1);
     if( !text2.clip) {
       toggleClip();
     }
     if( !text2.wordWrap) {
       toggleWordWrap();
     }
     if( !text2.ellipsis) {
      toggleEllipsis();
    }
     return new Promise(function(resolve, reject) {
       text2.ready.then(function(myText) {
        bg.removeAll();
         textready(myText);
         if( doScreenshot) 
         {
             setTimeout( function() {
               doScreenshotComparison("newlineTextWrapTruncateClipEllipsisH1V1XY", resolve)
             }, timeoutForScreenshot);
         } 
         else {
           resolve(textMeasurementResults(expectedValuesMeasure.newlineTextWrapTruncateClipEllipsisH1V1XY));
         }
       }, function(o) {
         resolve(assert(false,'newlineTextWrapTruncateClipEllipsisH1V1XY Promise rejection received'));
       });
     });
   },
   newlineslongerTextWrapTruncateClipEllipsisH1V1XY: function() {
     console.log("text2tests_more.js newlineslongerTextWrapTruncateClipEllipsisH1V1XY");
     // set to longest text
     setText(newlineLongerText,"text=newlineLonger");
     text2.x=10;
     text2.y=10;
     setAlignH(1);
     setAlignV(1);
     setTruncation(1);
     if( !text2.clip) {
       toggleClip();
     }
     if( !text2.wordWrap) {
       toggleWordWrap();
     }
     if( !text2.ellipsis) {
      toggleEllipsis();
    }
     return new Promise(function(resolve, reject) {
       text2.ready.then(function(myText) {
        bg.removeAll();
         textready(myText);
         if( doScreenshot) 
         {
             setTimeout( function() {
               doScreenshotComparison("newlineslongerTextWrapTruncateClipEllipsisH1V1XY", resolve)
             }, timeoutForScreenshot);
         } 
         else {
           resolve(textMeasurementResults(expectedValuesMeasure.newlineslongerTextWrapTruncateClipEllipsisH1V1XY));
         }
       }, function(o) {
         resolve(assert(false,'newlineslongerTextWrapTruncateClipEllipsisH1V1XY Promise rejection received'));
       });
     });
   },
   newlineslongestTextWrapTruncateClipEllipsisH1V1XY: function() {
     console.log("text2tests_more.js newlineslongestTextWrapTruncateClipEllipsisH1V1XY");
     // set to longest text
     setText(newlineLongestText,"text=newlineLongest");
     text2.x=10;
     text2.y=10;
     setAlignH(1);
     setAlignV(1);
     setTruncation(1);
     if( !text2.clip) {
       toggleClip();
     }
     if( !text2.wordWrap) {
       toggleWordWrap();
     }
     if( !text2.ellipsis) {
      toggleEllipsis();
    }
     return new Promise(function(resolve, reject) {
       text2.ready.then(function(myText) {
        bg.removeAll();
         textready(myText);
         if( doScreenshot) 
         {
             setTimeout( function() {
               doScreenshotComparison("newlineslongestTextWrapTruncateClipEllipsisH1V1XY", resolve)
             }, timeoutForScreenshot);
         } 
         else {
           resolve(textMeasurementResults(expectedValuesMeasure.newlineslongestTextWrapTruncateClipEllipsisH1V1XY));
         }
       }, function(o) {
         resolve(assert(false,'newlineslongestTextWrapTruncateClipEllipsisH1V1XY Promise rejection received'));
       });
     });
   },
   continuousTextWrapTruncateClipEllipsisH1V1XY: function() {
     console.log("text2tests_more.js continuousTextWrapTruncateClipEllipsisH1V1XY");
     // set to longest text
     setText(continuousText,"text=continuous");
     text2.x=10;
     text2.y=10;
     setAlignH(1);
     setAlignV(1);
     setTruncation(1);
     if( !text2.clip) {
       toggleClip();
     }
     if( !text2.wordWrap) {
       toggleWordWrap();
     }
     if( !text2.ellipsis) {
      toggleEllipsis();
    }
     return new Promise(function(resolve, reject) {
       text2.ready.then(function(myText) {
        bg.removeAll();
         textready(myText);
         if( doScreenshot) 
         {
             setTimeout( function() {
               doScreenshotComparison("continuousTextWrapTruncateClipEllipsisH1V1XY", resolve)
             }, timeoutForScreenshot);
         } 
         else {
           resolve(textMeasurementResults(expectedValuesMeasure.continuousTextWrapTruncateClipEllipsisH1V1XY));
         }
       }, function(o) {
         resolve(assert(false,'continuousTextWrapTruncateClipEllipsisH1V1XY Promise rejection received'));
       });
     });
   },
   continuousLongTextWrapTruncateClipEllipsisH1V1XY: function() {
     console.log("text2tests_more.js continuousLongTextWrapTruncateClipEllipsisH1V1XY");
     // set to longest text
     setText(continuousLongText,"text=continuousLong");
     text2.x=10;
     text2.y=10;
     setAlignH(1);
     setAlignV(1);
     setTruncation(1);
     if( !text2.clip) {
       toggleClip();
     }
     if( !text2.wordWrap) {
       toggleWordWrap();
     }
     if( !text2.ellipsis) {
      toggleEllipsis();
    }
     return new Promise(function(resolve, reject) {
       text2.ready.then(function(myText) {
        bg.removeAll();
         textready(myText);
         if( doScreenshot) 
         {
             setTimeout( function() {
               doScreenshotComparison("continuousLongTextWrapTruncateClipEllipsisH1V1XY", resolve)
             }, timeoutForScreenshot);
         } 
         else {
           resolve(textMeasurementResults(expectedValuesMeasure.continuousLongTextWrapTruncateClipEllipsisH1V1XY));
         }
       }, function(o) {
         resolve(assert(false,'continuousLongTextWrapTruncateClipEllipsisH1V1XY Promise rejection received'));
       });
     });
   },
   multilinesTextWrapTruncateClipEllipsisH1V1XY: function() {
     console.log("text2tests_more.js multilinesTextWrapTruncateClipEllipsisH1V1XY");
     // set to longest text
     setText(multilinesText,"text=multilines");
     text2.x=10;
     text2.y=10;
     setAlignH(1);
     setAlignV(1);
     setTruncation(1);
     if( !text2.clip) {
       toggleClip();
     }
     if( !text2.wordWrap) {
       toggleWordWrap();
     }
     if( !text2.ellipsis) {
      toggleEllipsis();
    }
     return new Promise(function(resolve, reject) {
       text2.ready.then(function(myText) {
        bg.removeAll();
         textready(myText);
         if( doScreenshot) 
         {
             setTimeout( function() {
               doScreenshotComparison("multilinesTextWrapTruncateClipEllipsisH1V1XY", resolve)
             }, timeoutForScreenshot);
         } 
         else {
           resolve(textMeasurementResults(expectedValuesMeasure.multilinesTextWrapTruncateClipEllipsisH1V1XY));
         }
       }, function(o) {
         resolve(assert(false,'multilinesTextWrapTruncateClipEllipsisH1V1XY Promise rejection received'));
       });
     });
   },
   longestTextWrapTruncateClipH2V0: function() {
     console.log("text2tests_more.js longestTextWrapTruncateClipH2V0");
     // set to longest text
     setText( longText3,"text=longest");
     text2.x=0;
     text2.y=0;
     setAlignH(2);
     setAlignV(0);
     
     if( !text2.wordWrap) {
       toggleWordWrap();
     }
      if( !text2.clip) {
       toggleClip();
     }
     if( !text2.ellipsis) {
      toggleEllipsis();
    }
    
     return new Promise(function(resolve, reject) {
 
       text2.ready.then(function() {
         bg.removeAll();
         textready(text2);
         if( doScreenshot) 
         {
             setTimeout( function() {
               doScreenshotComparison("longestTextWrapTruncateClipH2V0", resolve)
             }, timeoutForScreenshot);
         } 
         else 
           resolve(textMeasurementResults(expectedValuesMeasure.longestTextWrapTruncateClipH2V0));
 
       }, function(o) {
         resolve(assert(false,'longestTextWrapTruncateClipH2V0 Promise rejection received'));
       });
     });
   },
   longestTextNoWrapTruncateClipH2V0: function() {
     console.log("text2tests_more.js longestTextNoWrapTruncateClipH2V0");
     // set to longest text
     setText( longText3,"text=longest");
     text2.x=0;
     text2.y=0;
     setAlignH(2);
     setAlignV(0);
     
     if( text2.wordWrap) {
       toggleWordWrap();
     }
     
      if( !text2.clip) {
       toggleClip();
     }
     if( !text2.ellipsis) {
      toggleEllipsis();
    }
     return new Promise(function(resolve, reject) {
 
       text2.ready.then(function() {
         bg.removeAll();
         textready(text2);
         if( doScreenshot) 
         {
             setTimeout( function() {
               doScreenshotComparison("longestTextNoWrapTruncateClipH2V0", resolve)
             }, timeoutForScreenshot);
         } 
         else 
           resolve(textMeasurementResults(expectedValuesMeasure.longestTextNoWrapTruncateClipH2V0));
 
       }, function(o) {
         resolve(assert(false,'longestTextNoWrapTruncateClipH2V0 Promise rejection received'));
       });
     });
   },
   longestTextWrapTruncateAtWordClipH2V0: function() {
     console.log("text2tests_more.js longestTextWrapTruncateAtWordClipH2V0");
     // set to longest text
     setText( longText3,"text=longest");
     text2.x=0;
     text2.y=0;
     setAlignH(2);
     setAlignV(0);
     setTruncation(2);
     
     if( !text2.wordWrap) {
       toggleWordWrap();
     }
      if( !text2.clip) {
       toggleClip();
     }
     if( !text2.ellipsis) {
      toggleEllipsis();
    }
    
     return new Promise(function(resolve, reject) {
 
       text2.ready.then(function() {
         bg.removeAll();
         textready(text2);
         if( doScreenshot) 
         {
             setTimeout( function() {
               doScreenshotComparison("longestTextWrapTruncateAtWordClipH2V0", resolve)
             }, timeoutForScreenshot);
         } 
         else 
           resolve(textMeasurementResults(expectedValuesMeasure.longestTextWrapTruncateAtWordClipH2V0));
 
       }, function(o) {
         resolve(assert(false,'longestTextWrapTruncateAtWordClipH2V0 Promise rejection received'));
       });
     });
   },
   longestTextNoWrapTruncateAtWordClipH2V0: function() {
     console.log("text2tests_more.js longestTextNoWrapTruncateAtWordClipH2V0");
     // set to longest text
     setText( longText3,"text=longest");
     text2.x=0;
     text2.y=0;
     setAlignH(2);
     setAlignV(0);
     setTruncation(2);
     if( text2.wordWrap) {
       toggleWordWrap();
     }
     
      if( !text2.clip) {
       toggleClip();
     }
     if( !text2.ellipsis) {
      toggleEllipsis();
    }
     return new Promise(function(resolve, reject) {
 
       text2.ready.then(function() {
         bg.removeAll();
         textready(text2);
         if( doScreenshot) 
         {
             setTimeout( function() {
               doScreenshotComparison("longestTextNoWrapTruncateAtWordClipH2V0", resolve)
             }, timeoutForScreenshot);
         } 
         else 
           resolve(textMeasurementResults(expectedValuesMeasure.longestTextNoWrapTruncateAtWordClipH2V0));
 
       }, function(o) {
         resolve(assert(false,'longestTextNoWrapTruncateAtWordClipH2V0 Promise rejection received'));
       });
     });
   },
   longestTextWrapTruncateClipH1V0: function() {
     console.log("text2tests_more.js longestTextWrapTruncateClipH1V0");
     // set to longest text
     setText( longText3,"text=longest");
     text2.x=0;
     text2.y=0;
     setAlignH(1);
     setAlignV(0);
     
     if( !text2.wordWrap) {
       toggleWordWrap();
     }
      if( !text2.clip) {
       toggleClip();
     }
     if( !text2.ellipsis) {
      toggleEllipsis();
    }
    
     return new Promise(function(resolve, reject) {
 
       text2.ready.then(function() {
         bg.removeAll();
         textready(text2);
         if( doScreenshot) 
         {
             setTimeout( function() {
               doScreenshotComparison("longestTextWrapTruncateClipH1V0", resolve)
             }, timeoutForScreenshot);
         } 
         else 
           resolve(textMeasurementResults(expectedValuesMeasure.longestTextWrapTruncateClipH1V0));
 
       }, function(o) {
         resolve(assert(false,'longestTextWrapTruncateClipH1V0 Promise rejection received'));
       });
     });
   }

 }

module.exports.beforeStart = beforeStart;
module.exports.tests = tests;


if(manualTest === true) {

  manual.runTestsManually(tests, beforeStart);

}


}).catch( function importFailed(err){
  console.error("Import failed for text2tests_more.js: " + err)
});
