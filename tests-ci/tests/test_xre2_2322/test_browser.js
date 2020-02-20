px.import({scene : 'px:scene.1.js', keys: 'px:tools.keys.js',
}).then( function importsAreReady(imports) {

var scene = imports.scene;
var keys = imports.keys;
var root = scene.root;

var waylandObj,browser,server,browserInput="";
var isLoaded = false;

function displayEvent(e)
{
  console.log("Event " + e.name + " received");
}

function handleOnHTMLDocumentLoadedEvent(e)
{
  if (e.httpStatus == 200)
  {
      isLoaded = true;
  }

  displayEvent(e);
}

function handleOnHTMLLinkClickedEvent(e)
{
  displayEvent(e);
}

function handleOnConsoleLogEvent(e)
{
  displayEvent(e);
}

function handleOnErrorEvent(e)
{
  displayEvent(e);
}

function handleOnJavaScriptBridgeRequestEvent(e)
{
  displayEvent(e);
}

function handleOnJavaScriptServiceManagerRequestEvent(e)
{
  displayEvent(e);
}

function handleOnCookieJarChangedEvent(e)
{
  displayEvent(e);
}

function registerBrowserEvents()
{
  browser.on("onHTMLLinkClicked",handleOnHTMLLinkClickedEvent);
  browser.on("onHTMLDocumentLoaded",handleOnHTMLDocumentLoadedEvent);
  browser.on("onConsoleLog",handleOnConsoleLogEvent);
  browser.on("onError",handleOnErrorEvent);
  browser.on("onJavaScriptBridgeRequest",handleOnJavaScriptBridgeRequestEvent);
  browser.on("onJavaScriptServiceManagerRequest",handleOnJavaScriptServiceManagerRequestEvent);
  browser.on("onCookieJarChanged",handleOnCookieJarChangedEvent);
}

function unRegisterBrowserEvents()
{
  browser.delListener("onHTMLLinkClicked",handleOnHTMLLinkClickedEvent);
  browser.delListener("onHTMLDocumentLoaded",handleOnHTMLDocumentLoadedEvent);
  browser.delListener("onConsoleLog",handleOnConsoleLogEvent);
  browser.delListener("onError",handleOnErrorEvent);
  browser.delListener("onJavaScriptBridgeRequest",handleOnJavaScriptBridgeRequestEvent);
  browser.delListener("onJavaScriptServiceManagerRequest",handleOnJavaScriptServiceManagerRequestEvent);
  browser.delListener("onCookieJarChanged",handleOnCookieJarChangedEvent);
}

function handleWaylandRemoteBrowser(wayland){
  browser = wayland.api;
  registerBrowserEvents();
  setTimeout(handleNoLoad,60000);
}

function handleWaylandError(error){
   console.log("Handle wayland error");
}

setTimeout(function(){
  waylandObj = scene.create( {t:"external", x:0, y:0, w:1280, h:720, parent:root,cmd:"rdkbrowser2", hasApi:true, server:"wl-rdkbrowser2-standalone"} );
  waylandObj.remoteReady.then(handleWaylandRemoteBrowser, 
                      handleWaylandError);
  waylandObj.draw = true;
}, 4000 );

function handleNoLoad()
{
  if (false == isLoaded)
  {
  }
}

function handleClose()
{
  unRegisterBrowserEvents();
  browser = null;
  server = null;
  waylandObj = null;
}

scene.on("onClose", handleClose);

scene.root.on("onKeyDown", function(e)
{
  var code = e.keyCode; var flags = e.flags;
  browser = waylandObj.api;
  if (code == keys.ONE) {
    waylandObj.api.url = "https://www.google.com";
  } else if (code == keys.TWO) {
    waylandObj.api.url = "https://www.yahoo.com";
  } 
  e.stopPropagation();
});


}).catch( function importFailed(err){
  console.error("Import failed for browser.js: " + err)
});

