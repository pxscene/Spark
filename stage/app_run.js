px.import({scene:"px:scene.1.js",
keys: 'px:tools.keys',
URL:        'url',
http:       'http',
https:      'https',
components: 'components.js'
}).then( function ready(imports) {
  var scene = imports.scene
  var keys = imports.keys
  var root = scene.root;
  var URL = imports.URL
  var http = imports.http
  var https = imports.https
  var base = px.getPackageBaseFilePath();
  let create = imports.components.create
  let mediaPlayer = imports.components.mediaPlayer

  function getComponent(id) {
    let o = root.getObjectById(id)
    if (o && o.ctx && o.ctx.component)
      o = o.ctx.component
    return o
  }

  class sparkApp {
    constructor() {
      for (let o of appData) {
        o.parent = root
        create(o)
      }
      this.gallery = getComponent('gallery')
      this.menu = getComponent('menu')

      if (this.menu) {
        this.menu.on(e=>{
          this.menu_onSelect(e.i)
        })
      }
    }

    gallery_onSelect(d) {
      // Insert Your Code Here
      mediaPlayer.play(d.mediaUrl)
    }
    
    menu_onSelect(i) {
      // Insert Your Code Here
      if (i == 0)
        this.gallery.dataSrc = 'my_iheart'
      else if (i == 1)
        this.gallery.dataSrc = 'live_iheart'
    }
  }
  
  let appData = [
    {"t":"pxImage","x":65,"y":35,"w":295,"h":40,"cx":147.5,"cy":20,"sx":1,"sy":1,"r":0,"url":"http://www.sparkui.org/stage/hrimages/logo.png"},
    {"t":"component_Menu","x":981,"y":36,"w":250,"h":37,"cx":125,"cy":18.5,"sx":1,"sy":1,"r":0,"id":"menu",
      "items":"For You, Live Radio","fontSize":"22","highlight":4278190335},
    {"t":"component_Gallery","x":11,"y":264,"w":1225,"h":412,"cx":612.5,"cy":206,"sx":1,"sy":1,"r":0,"id":"gallery","dataSrc":"my_iheart"}
  ]

  let app = new sparkApp()

  let focused = 0

  scene.root.on('onPreKeyDown', (e)=>{
    console.log(keys.UP,',',e.keyCode)
    if (e.keyCode == keys.G && keys.is_CTRL_ALT(e.flags)){
      app.guides.topleft.draw = !app.guides.topleft.draw
    }
    else if (e.keyCode == keys.DOWN || e.keyCode == keys.UP) {
      console.log('lookng for focus')
      let container = root

      if (focused >= 0) {
        if (e.keyCode == keys.DOWN)
          focused++
        else if (e.keyCode == keys.UP)
          focused--
        focused = Math.min(container.children.length-1,Math.max(0,focused))
        container.children[focused].focus = true
      }
      else {
        if (container.children.length > 0) {
          focused = 0
          container.children[focused].focus = true
        }
      }
    }
  })
  
  
  }).catch( function importFailed(err){
    console.error("Import failed for Spark App: " + err)
  });
  
  