px.import({ scene: 'px:scene.1.js' }).then( function importsAreReady(imports)
{
  var flp1 = px.getFile('/etc/hosts');
  flp1.then(function(data)
  { 
    console.log(data); 
  }, function() {
    console.log("unable to access file !!");
  });
});
