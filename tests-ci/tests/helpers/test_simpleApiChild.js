px.import("px:scene.1.js").then( function ready(scene) {

var root = scene.root;

var eventHandlers = {};

var text = scene.create({t:'text',text:'My text value',parent:root,w:200,h:200});

var emitEvent = function(name, value) {
  if(eventHandlers.name !== undefined) {
    for( var func of eventHandlers.name)
      func(value);
  }
}
module.exports.myAPI = function(value) {
  console.log("This message is from the test_simpleApiChild!");
  text.text = value;
  emitEvent("onTextChange", value);
}

module.exports.myAPI2 = function() {
  console.log("This message is from the test_simpleApiChild's second api!");
}

module.exports.getText = function() {
  console.log("This message is from the test_simpleApiChild's getText API!");
  return text.text;
}
module.exports.on = function(name,callback) {
  if( eventHandlers.name === undefined) {
    eventHandlers.name = [];
  }
  eventHandlers.name.push(callback);
}

 
  }).catch( function importFailed(err){
  console.error("Import for test_simpleApiChild.js failed: " + err)
});
