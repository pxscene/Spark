px.import({scene:"px:scene.1.js",
keys: 'px:tools.keys',
URL:        'url',
http:       'http',
https:      'https'
}).then( function ready(imports) {
  var scene = imports.scene
  var keys = imports.keys
  var root = scene.root;
  var URL = imports.URL
  var http = imports.http
  var https = imports.https
  var base = px.getPackageBaseFilePath();

  class component_ {
    constructor(props) {
      props.t = 'object'
      this.topleft = scene.create(props)
      this.topleft.ctx = {component: this}      
    }

    get x() { return this.topleft.x }
    set x(v) { console.log('setting compoent x', v); this.topleft.x = v}
    get y() { return this.topleft.y }
    set y(v) { this.topleft.y = v}
    get w() { return this.topleft.w }
    set w(v) { this.topleft.w = v; this.layout()} // only w and h affect layout
    get h() { return this.topleft.h }
    set h(v) { this.topleft.h = v; this.layout()}
    get sx() { return this.topleft.sx }
    set sx(v) { this.topleft.sx = v }
    get sy() { return this.topleft.sy }
    set sy(v) { this.topleft.sy = v }
    get cx() { return this.topleft.cx }
    set cx(v) { this.topleft.cx = v }
    get cy() { return this.topleft.cy }
    set cy(v) { this.topleft.cy = v }
    get r() { return this.topleft.r }
    set r(v) { this.topleft.r = v }    

    layout() {}
  }

  // App + Designer
  class component_Menu extends component_ {
    constructor(props) {
      super(props)
      this.textcontainer = scene.create({t:'object',parent:this.topleft})
      this._highlight = scene.create({t:'rect', parent: this.topleft,h:4})
      if (!props.highlight)
        props.highlight = 'black'
      this.highlight = props.highlight
      //this._items = 'One,Two,Three'
      if (!props.items)
        props.items = 'One,Two,Three'
      this.items = props.items
      if (!props.fontSize)
        props.fontSize = 16
      this.fontSize = props.fontSize
      this.current = 0

      this.topleft.on('onFocus', (e)=>{
        this.textcontainer.a = 1
      })

      this.topleft.on('onBlur', (e)=> {
        this.textcontainer.a = 0.7
      })

      this.topleft.on('onKeyDown', (e)=>{
        let n = this.textcontainer.children.length-1
        if (e.keyCode == keys.LEFT) {
          this.current--
        }
        else if (e.keyCode == keys.RIGHT) {
          this.current++
        }
        this.current = Math.min(n,Math.max(0,this.current))
        if (e.keyCode == keys.ENTER) {
          this.emit({t:'onSelect', i: this.current})
        }
        let c = this.textcontainer.children[this.current]
        this._highlight.animate({x:c.x,w:c.w},0.2,scene.animation.TWEEN_STOP)
      })

      this.listeners = []
      this.makeChildren()
    }
    description() { return 'component_Menu' }  // try this.constructor.name + module url

    get id() {return this._id }
    set id(v) { this._id = v }

    get items() { return this._items }
    set items(v) {  this._items = v; this.makeChildren() }

    get fontSize() { return this._fontSize }
    set fontSize(v) { this._fontSize = v; this.makeChildren() }

    get highlight() { return this._highlight.fillColor }
    set highlight(v) { this._highlight.fillColor = v }

    emit(o) {
      for (let l of this.listeners) {
        l(o)
      }
    }

    on(f) {
      this.listeners.push(f)
    }

    makeChildren() {
      this.textcontainer.removeAll()
      let a = this._items.split(',')
      let promises = []
      for (let t of a) {
        let o = scene.create({t:'text',parent:this.textcontainer, text:t, pixelSize:this._fontSize})
        promises.push(o.ready)
      }
      Promise.all(promises).then(()=>{this.layout()})
    }

    layout() {
      console.log('laying out Menu')    
      this._highlight.visible = false
      let x = 0
      let h = 32
      for (let i = 0; i < this.textcontainer.children.length; i++) {
        let c = this.textcontainer.children[i]
        c.x = x
        x = x + c.w + 32
        h = c.h
        if (this.current == i) {
          this._highlight.x = c.x
          this._highlight.w = c.w
          this._highlight.visible = true
        }
      }
      this._highlight.y = h-4
      this.topleft.w = x
      this.topleft.h = h
    }
  }

  
  class component_Gallery extends component_ {
    constructor(props) {
      super(props)
      this.topleft.clip = true
      let component = this

      console.log('after component constructor')
      this.gallery = scene.create({
        t: "scene", parent: this.topleft,url: px.getPackageBaseFilePath() + "/gallery.js"
      });
      
      console.log('before gallery databind')
      
      this.gallery.ready.then(function (child) {
        console.log('gallery before layout')
        component.layout()
        let galleryApis = child.api;
        console.log('initial gallery ready')
        component.get("https://us.api.iheart.com/api/v2/content/liveStations?countryCode=US&limit=100&marketId=159").then(stats => {
          console.log('received data')
          var hits = stats.hits.filter(item => {
            var hls = item.streams.hls_stream
            return (hls && hls != "")
          })
          console.log('setting model')
          galleryApis.setModel(hits);
        })
        
      })
      
      //if (props.dataSrc)
      //  this.dataSrc = props.dataSrc

      this.gallery.focus = true;

      this.topleft.on('onFocus', e=>{
        //this.gallery.focus = true // why this crash
        console.log('onFocus fired')
        let gallery = this.gallery
        if (e.target == this.topleft)
          gallery.focus = true
      })
      
      this.designmodel = [
        {
            logo: "https://via.placeholder.com/150",
            name: "place holder",
            description: "place holder"
        },
        {
            logo: "https://via.placeholder.com/150",
            name: "place holder2",
            description: "place holder2"
        },
        {
            logo: "https://via.placeholder.com/150",
            name: "place holder",
            description: "place holder"
        },
        {
            logo: "https://via.placeholder.com/150",
            name: "place holder",
            description: "place holder"
        },
        {
          logo: "https://via.placeholder.com/150",
          name: "place holder",
          description: "place holder"
      },
      {
          logo: "https://via.placeholder.com/150",
          name: "place holder2",
          description: "place holder2"
      },
      {
          logo: "https://via.placeholder.com/150",
          name: "place holder",
          description: "place holder"
      },
      {
          logo: "https://via.placeholder.com/150",
          name: "place holder",
          description: "place holder"
      }      
      ]        
    }
    description() { return 'component_Gallery' }  // try this.constructor.name + module url

    get id() {return this._id }
    set id(v) { this._id = v }
    
    get dataSrc() { return this._dataSource }
    set dataSrc(v) {
      console.log('set dataSrc:', v)
      this._dataSource = v
      let component = this
      if (this._dataSource == 'live_iheart') {
        console.log('setting dataSrc to foo')
        this.gallery.ready.then(function (child) {
          console.log('gallery be ready')
          let galleryApis = child.api;
      
          component.get("https://us.api.iheart.com/api/v2/content/liveStations?countryCode=US&limit=100&marketId=159").then(stats => {
            console.log('received data')
            var hits = stats.hits.filter(item => {
              var hls = item.streams.hls_stream
              return (hls && hls != "")
            })
            console.log('set model')
            galleryApis.setModel(hits);
          })
        })
      }
      else if (this._dataSource == 'my_iheart') {
        console.log('setting dataSrc to foo')
        this.gallery.ready.then(function (child) {
          console.log('gallery be ready')
          let galleryApis = child.api;
      
          component.get("https://us.api.iheart.com/api/v2/recs/genre?genreId=&offset=0&limit=100").then(stats => {
            var values = stats.values.filter(item => {
              var hls = item.content.streams.hls_stream
              return (hls && hls != "")
            })
            console.log('set model')
            galleryApis.setModel(values);
          })
        })        
      }
      else {
        this.gallery.ready.then(function (child) {
          let galleryApis = child.api;
          galleryApis.setModel(null)
        })        
      }
    }

    get(url) {
      console.log('gallery get url:', url)
      return new Promise((resolve, reject) => {
        console.log('promise created')
        let _http = url.startsWith('https:')?https:http
        _http.get(
          url,
          res => {
            console.log('res called')
            const { statusCode } = res
            const contentType = res.headers['content-type']
  
            let error
            if (statusCode !== 200) {
              error = new Error('Request Failed.\n' +
                                `Status Code: ${statusCode}`)
            } else if (!/^application\/json/.test(contentType)) {
              error = new Error('Invalid content-type.\n' +
                                `Expected application/json but received ${contentType}`)
            }
            if (error) {
              // consume response data to free up memory
              res.resume()
              console.error(error)
              reject(error)
              return
            }
  
            res.setEncoding('utf8')
            let rawData = ''
            res.on('data', (chunk) => { console.log('data received');rawData += chunk })
            res.on('end', () => {
              console.log('data end')
              try {
                const parsedData = JSON.parse(rawData)
                resolve(parsedData)
              } catch (e) {
                console.error(e)
                reject(e)
              }
            })
          }
        ).on('error', e => reject(e))
      })
    }
  
    layout() {
      console.log('befofe gallery layout')
      this.gallery.w = this.topleft.w
      this.gallery.h = this.topleft.h
      console.log('after gallery layout')
    }
  }



  let core = {
    component_Menu,
    component_Gallery
  }

  // App + Designer... map spark class names to scene object types
  // should contemplate aliasing these with in spark or changing the object descriptions
  // do I need a new desc property?
  let sparkObjects = {
    pxImage:'image',
    pxText:'text',
    pxImage9:'image9',
    pxTextBox:'textBox'
  }

  let create = function(props) {
    let o
    if (props.t.startsWith('component_'))
      o = new core[props.t](props)
    else {
      let t = sparkObjects[props.t]
      if (t)
      {
        let newProps = {}
        for (p in props) {
          newProps[p] = props[p]
        }
        // overwrite t
        newProps.t = t
        o = scene.create(newProps)
      }
    }
    return o
  }

  class MediaPlayer{
    constructor() {

    }

    play(u) {
      
    }
  }

  module.exports.create = create
  module.exports.mediaPlayer = new MediaPlayer
  
  }).catch( function importFailed(err){
    console.error("Import failed for Spark Designer: " + err)
  });
  
  